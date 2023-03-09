import { Component } from '@angular/core';
import { DataService } from '../providers/data.service';
import { NotifyService } from '../providers/notify.service';
import { StorageService } from '../providers/storage.service';
import { EventsService } from '../providers/events.service';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from '../components/modal/modal.component';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  providers: [DataService, Storage]
})
export class Tab3Page{


  // Search Page

  public search:string = ''; // gibt sonst ein undefined im Suchfeld
  public userData:UserData
  public watchlistData:StockData;
  public searchSymbols:Observable<SearchData[]>;
  public shouldShowCancel = true;


  constructor(private httpService:DataService, private notify: NotifyService, private storage: StorageService,
              private eventService: EventsService, private modal: ModalController) {
  
    this.storage.get('user')
    .then((val:UserData) => {
        this.userData = val 
    })
    .catch((e:any)=>{
      this.notify.presentAlert({text: 'User was not loaded', header: 'Storage Alert', subheader: e.toString()}); 
    })
  }

  addToWatchlist(symbol:string, name:string):void {
     
    this.httpService
      .setWatchlistItem(this.userData.user_id, this.userData.member_id, symbol, name)
      .subscribe({
        next: (data:any) => {
          this.notify.presentToast('Watchlist item was succesfully saved'); 
          this.eventService.publishData('updateWatchlist', '')},
        error: (error:any) => {
          this.notify.presentAlert({text: 'Watchlist item was not saved', header: 'Database Alert', subheader: 'Server error'}); 
            console.log('HTTP Error', error)} // error path
      });
  }

  searchSymbol(unternehmen:string):void {
  
    this.searchSymbols = this.httpService.searchSymbols(unternehmen)
  }

  // does not fetch data temp
  getQuote(symbol:string):void {

    console.log('Hole aktuellen Kurs für' + symbol); // Reach here if fails
  }

  async showDetails(symbol: string){

    this.httpService.getPrice(symbol)
    .subscribe({
      next: async (item:any) => {

        const modal:any = await this.modal.create({
          component: ModalComponent,
          componentProps: {
              'data': {data: item, symbol: item.symbol, mode: 'chart', name: item.name}
          }
        })

        modal.present()
      },
      error: (err:any) => {
        console.log("Error fetching stock data", err);
}
    })
  }


  ngOnInit() {}

}

