import { Component } from '@angular/core';
import { DataService } from '../providers/data.service';
import { StorageService } from '../providers/storage.service';
import { EventsService } from '../providers/events.service';
import { share } from 'rxjs/operators';
import { ModalComponent } from '../components/modal/modal.component';
import { ModalController } from '@ionic/angular';
import { NotifyService } from '../providers/notify.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  providers: [Storage]
})
export class Tab2Page {

  // Watchlist Page

  public watchlistData!:any;
  public watchlistQuotes:any = null;
  public hideBackButton:boolean = false;
  public userData:UserData

  constructor(private httpService: DataService, private storage: StorageService,
            private modalCtrl: ModalController, private event: EventsService,
            private notify: NotifyService) {
 
    this.storage.get('user')
    .then((val:UserData) => {
      this.userData = val
      this.getWatchlist(this.userData.user_id, this.userData.member_id, this.userData.name) ;
    })
    .catch((e:any)=>{
      this.notify.presentAlert({text: 'User was not loaded', header: 'Storage Alert', subheader: e.toString()}); 
    })

    this.event.subscribeData('updateWatchlist')?.subscribe(()=>this.updateWatchlist())
  }

  // Push chart data to market page
  async showDetail(data:any){

    const modal:HTMLIonModalElement = await this.modalCtrl.create({
      component: ModalComponent,
      componentProps: {
        'data': data, 
        'modal': HTMLIonModalElement
      }
    })

    modal.present()
  }

  getWatchlist(user_id:string, member_id:string, name:string) {
     
    this.watchlistData = this.httpService.getWatchlist(user_id, member_id, name).pipe(share());
    console.log(this.watchlistData)
  }

  updateWatchlist(){

    this.getWatchlist(this.userData.user_id, this.userData.member_id, this.userData.name) ;
  }

  ionViewWillEnter(){}
  ngOnInit() {}
}

