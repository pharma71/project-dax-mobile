import { Component, ViewChild, AfterViewInit, ElementRef, EventEmitter } from '@angular/core';
import { Platform, LoadingController, MenuController, IonContent, IonHeader, IonFooter } from '@ionic/angular';
import { NotifyService } from '../providers/notify.service';
import { DataService } from '../providers/data.service';
import { Storage } from '@ionic/storage';
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

  public marketData:any; // Observable
  public resolve:boolean = true;
  public historyData:Record<string,any> = [];
  public message:string = '';
  public market:string = '';
  public userData:UserData|null = null;
  public members:Array<number> = [];
  public recomand$:Observable<Recommandation>;
  public click = new EventEmitter<boolean>();
  private defaultData = {market: 'Dax', member: '2', recommandation: '100119'}


  constructor(private httpService: DataService, private loadCtrl: LoadingController, private notify: NotifyService, 
    private platform: Platform, private storage: Storage, private event: EventsService,
    private menu: MenuController) {
  
    // Subscribe to popoverClose
    this.event.subscribeData('popoverClose')?.subscribe((data:any)=>{console.log('popoverClose', data)})

    // Subscribe to login, data sind nur die login Daten email + passwort
    this.event.subscribeData('login')?.subscribe((data:any)=>{console.log('login', data), this.handleLogin(data)})

    this.platform.ready()
    .then(()=>{
        
        // Load default stock market <dev>
        this.loadMarket(this.defaultData.market);
    })

    // Load default recommandation <dev>
    this.recomand$ = this.httpService.getRecomandation(this.defaultData.recommandation) 

    this.storage.create().then(()=>this.storage.clear() )
    // Clear history storage
     
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
  }


  loadMarket(market:string) {

    this.market = market;
    if (market === void 0) { market = 'Dax'; }
            
    this.showLoadingSpinner();

      // Load Market Data from Local Storage, valid 1 hour 
      this.storage.keys()
      .then((keys:any)=>{

        if(keys.includes('market_' + market)){

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

