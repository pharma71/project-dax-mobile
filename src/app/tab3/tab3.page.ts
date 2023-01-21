import { Component } from '@angular/core';
import { DataService } from '../providers/data.service';
import { NotifyService } from '../providers/notify.service';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  providers: [DataService]
})
export class Tab3Page {


  // Search Page

  public navCtrl:any;
  public testdata = [1, 2, 3];;
  public search:string = ''; // gibt sonst ein undefined im Suchfeld
  public userData:UserData = {user_id:'',member_id:'',name:''};
  public watchlistData = [];
  public myError:any;
  public myService:any;
  public myQuote:any;
  public mySymbols = null;


  constructor(private httpService:DataService, private notify: NotifyService, private storage: Storage) {
 
    this.storage.get('user')
    .then((val:any) => {
        this.userData = JSON.parse(val); // Todo change to ionic local storage for promise
    })
    .catch() // No catch provided
}

  addToWatchlist(symbol:string, name:string) {
     
      let result = this.httpService
          .setWatchlistItem(this.userData.user_id, this.userData.member_id, symbol, name);
          result.subscribe(
            (data:any)=> {this.notify.presentToast('Watchlist item was succesfully saved'); console.log(data, 'Data')},
            (error:any) => {this.notify.presentAlert({text: 'Watchlist item was not saved', header: 'Database Alert', subheader: 'Server error'}); 
                console.log('HTTP Error', error)} // error path
            );
  }

  searchSymbol(unternehmen:string) {

      this.mySymbols = this.httpService.searchSymbols(unternehmen)
  }

  getQuote(symbol:string) {

     console.log('Hole aktuellen Kurs für' + symbol); // Reach here if fails
  }

  ngOnInit() {}

}

