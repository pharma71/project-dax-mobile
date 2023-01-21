import { Component } from '@angular/core';
import { DataService } from '../providers/data.service';
import { Storage } from '@ionic/storage';
import { FinancialComponent } from '../components/financial/financial.component';
import { Observable } from 'rxjs';
import { ModalComponent } from '../components/modal/modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  providers: [FinancialComponent]
})
export class Tab2Page {

  // Watchlist Page

  public watchlistData:Observable<Object>|null = null;
  public watchlistQuotes:any = null;
  public hideBackButton:boolean = false;
  public userData:UserData = {user_id:'',member_id:'',name:''};

  constructor(private httpService: DataService, private storage: Storage, private financial: FinancialComponent,
            private modalCtrl: ModalController) {
 
    this.storage.set('user', JSON.stringify({user_id: 29, member_id: 2, name: 'Kristian Knorr'}))
    .then(() => {
        this.storage.get('user').then((val:any) => {
            this.userData = JSON.parse(val); // Todo change to ionic local storage for promise
            console.log('User Data', this.userData);
        })
    });
}

  ionViewWillEnter(){
    this.storage.get('user')
        .then((val:any) => {
        this.userData = JSON.parse(val);
        this.getWatchlist(this.userData.user_id, this.userData.member_id, this.userData.name) ;
    });
  }

  // Push chart data to market page
  async showDetail(data:any){
    var modal:HTMLIonModalElement = await this.modalCtrl.create({
      component: ModalComponent,
      componentProps: {
         'data': data, 
        'modal': HTMLIonModalElement
      }
    })
    console.log('Modal Daten', data, modal);

    modal.present()
  }

  getTicker = function (symbol:any) {
      if (symbol.indexOf('DE') > -1) {
          var result = symbol.split('.');
          result = "FRA:" + result[0];
          return result;
      }
      return symbol;
  }

  getWatchlist(user_id:string, member_id:string, name:string) {
     
    this.watchlistData = this.httpService.getWatchlist(user_id, member_id, name);
  }


  ngOnInit() {}

  updateWatchlist(){

    this.getWatchlist(this.userData.user_id, this.userData.member_id, this.userData.name) ;
  }

}

