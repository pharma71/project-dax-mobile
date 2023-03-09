import { Component, ViewChild, AfterViewInit, ElementRef, EventEmitter } from '@angular/core';
import { Platform, LoadingController, MenuController, IonContent, IonHeader, IonFooter } from '@ionic/angular';
import { NotifyService } from '../providers/notify.service';
import { DataService } from '../providers/data.service';
import { StorageService } from '../providers/storage.service';
import { share } from 'rxjs/operators';
import { EventsService } from '../providers/events.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  providers:[DataService, Storage]
})
export class Tab1Page implements AfterViewInit{

@ViewChild(IonHeader, {read: ElementRef}) header!: ElementRef
@ViewChild(IonContent) content!: IonContent
@ViewChild(IonFooter, {read: ElementRef}) footer!: ElementRef

// Home Page

  public marketData:Observable<StockData[]>|Promise<any>; // Observable
  public resolve:boolean = true;
  public message:string = '';
  public market:string = '';
  public userData:UserData|null = null;
  public members:Array<number> = [];
  public recomand$:Observable<Recommandation[]>;
  public click = new EventEmitter<boolean>();
  private defaultData = {market: 'World', member: '2', recommandation: '100119'}
  public $markets = {1: 'World', 2: {1: 'Dax', 2: 'MDax', 3: 'TecDax', 4: 'SDax'}, 3: {1: 'Currency'}};
  public segment = 1;  
  public device: string;


  constructor(private httpService: DataService, private loadCtrl: LoadingController, private notify: NotifyService, 
    private platform: Platform, private storage: StorageService, private event: EventsService,
    private menu: MenuController) {
  
    // Subscribe to popoverClose
    this.event.subscribeData('popoverClose')?.subscribe((data:any)=>{console.log('popoverClose', data)})

    // Subscribe to login, data sind nur die login Daten email + passwort
    this.event.subscribeData('login')?.subscribe((data:any)=>{console.log('login', data), this.handleLogin(data)})
    this.event.subscribeData('logout')?.subscribe((data)=>console.log('user has logged out'))
    // Load default recommandation <dev>
    this.recomand$ = this.httpService.getRecomandation(this.defaultData.recommandation) 
    this.storage.get('user').then((data) => this.userData = data)

    this.platform.ready()
    .then(()=>{
        
        // Load default stock market <dev>
        if(this.platform.is('mobile')){
            this.device = this.platform.isPortrait() ? 'portrait' : 'landscape'
        }
        this.loadMarket(this.defaultData.market);
    })
  }

  segmentChanged(ev: Event) {  

    console.log('segment has changed', ev, this.segment);  

    if(this.segment == 1){
      console.log('loading world market')
      this.loadMarket('World');
    }
    if(this.segment == 2){
      console.log('loading dax market')
      this.loadMarket(this.$markets[2][1]);
    } 
    if(this.segment == 3){
      console.log('loading dax market')
      this.loadMarket(this.$markets[3][1]);
    } 
  }  

  showFinancial(item:any){

    let quoteType = ["EQUITY", "INDEX", "CURRENCY", "FUTURE"];

    return quoteType.includes(item.quoteType)
  }

  async showLoadingSpinner(){

      const loadingElement = await this.loadCtrl.create({
        message: 'Please wait...',
        spinner: 'crescent',
        duration: 1000,
      });
      return await loadingElement.present();
  }

  presentLoginForm(){
    this.notify.presentLoginMask()
  }

  presentPopover($event:Event){
    this.notify.presentPopover($event)
  }
  

  handleLogin(data: {user: any, pass: any}){

    //let passCrypt = this.httpService.md5(data.pass);

    // crypt override <dev>, password in plaintext over SSL
    this.httpService.login({user: data.user, pass: data.pass})
      .subscribe((data:any) => {

      if(data){
        if(data.vorname !== undefined && data.nachname !== undefined){

          this.userData = {user_id: data.id, member_id: '2', name: data.vorname + ' ' + data.nachname}
          this.footer.nativeElement.innerText = `UserId = ${data.id} UserName = ${data.nachname}`
          this.storage.set('user', JSON.stringify({user_id: data.id, member_id: 2, name: data.vorname + ' ' + data.nachname}))

          .then((data:any) => {      
            // do something  
          })
        }} else{
        this.notify.presentAlert({header: 'Login Failure', text: 'Wrong login data provided.'});
      }
    })
  }

  handleLogout(){

    this.storage.remove('user');
    this.userData = null;
    this.footer.nativeElement.innerText = 'Footer'
    this.event.publishData('logout', '');
  }


  loadMarket(market:string) {

    this.market = market;
    if (market === void 0) { market = 'Dax'; }
            
    this.showLoadingSpinner();

      // Load Market Data from Local Storage, valid 1 hour 
      this.storage.keys()
      .then((keys:string[]|undefined)=>{

        if( keys && keys.includes('market_' + market)){

            this.storage.get('market_' + market)
            .then((data:any)=>{

            // Check timestamp         
            var splitData = data.split('***');
            var data_tstamp = parseInt(splitData[0]); // Stored Timestamp
            var tstamp = new Date().getTime(); // Current Timestamp 
    
            // Timestamp ok
            if (data_tstamp > tstamp) {
                this.marketData = new Promise((resolve,reject)=>{setTimeout(()=>resolve(JSON.parse(splitData[1])), 0)})
            }
            else {
                // console.log('Stored data too old', data, tstamp);
                this.marketData = this.httpService.getMarket(market).pipe(share());
                this.marketData.subscribe((data:any)=>this.storeData(market, data));
            }
            }) // End get      
            .catch((err:any)=>{}) 
            // No catch provided 
        }else{
            console.log('No stored data for market_' + market);
            this.marketData = this.httpService.getMarket(market).pipe(share());
            this.marketData.subscribe((data:any)=>this.storeData(market, data));
        }
      
    }) // End keys
  }

  storeData(market: string, jsonData:any) {

      var x = new Date();
      x.setHours(x.getHours() + 1);
      var tstamp = x.getTime();

      this.storage.set('market_' + market, tstamp + '***' + JSON.stringify(jsonData))
      .then(()=>{
          this.notify.presentToast();
      })
      .catch() // No catch provided
  }

  getMembers(symbol:string) {

      if (symbol === void 0) { symbol = this.defaultData.market.toUpperCase(); }

      return new Promise( (resolve) => {
          this.httpService.getMembers(symbol)
              .subscribe( (data:any) => {
              var x = JSON.parse(data);
              this.members = x;
              resolve(x);
          });
      });
  }

  openSideMenu() {

    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

  ngOnInit() {
 
  }

  ngAfterViewInit(){ // Children are set

    console.log('Header', this.header.nativeElement);
    console.log('Content', this.content);
    console.log('footer', this.footer);
    this.content.ionScrollStart.subscribe((data: any)=>{console.log(data)})
  }

  ionViewWillEnter() {}

  ionViewDidLoad() {}
}

