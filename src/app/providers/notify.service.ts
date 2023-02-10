import { OnInit, Injectable, Output } from '@angular/core';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../components/popover/popover.component';
import { EventsService } from './events.service';
import { LocalNotifications, LocalNotificationSchema, ScheduleOptions, Schedule, ScheduleResult } from '@capacitor/local-notifications';


@Injectable({
  providedIn: 'root',

})
export class NotifyService implements OnInit{


  public isAndroid: boolean = false;

  constructor(private platform: Platform, 
    private alertController: AlertController, private toastController: ToastController,
    private toast: ToastController, private event: EventsService, public popoverController: PopoverController){

      if(this.platform.is('android')){

        this.isAndroid = true;

        platform.ready().then(() => {
          console.log('Platform ready');
          
        // Local Notification is native only
        this.notify()
      })
    }
  }


  async presentAlert(data?:any) {

    const alert = await this.alertController.create({
      header: data ? data.header : 'Alert',
      subHeader: data ? data.subheader : 'Subtitle',
      message: data ? data.text : 'This is an alert message.',
      buttons: ['OK']
    });

    await alert.present();
  }


  async presentPopover(ev: any) {

    const popover = await this.popoverController.create({
    component: PopoverComponent,
    event: ev,
    translucent: true,
    componentProps: {/* Pass Popover content like onClick: () => {
    popover.dismiss();*/}
    });
    popover.onDidDismiss().then((data)=>{
      data.role = 'navPopoverClose';
      this.event.publishData('popoverClose', data);
    });
    popover.present();
    // popoverevents können nur intern von onDidDismiss etc gehandelt werden
    // data kommt aus der popover.dismiss methode
  }

  ionPopoverDidDismiss(){

    console.log('popover event');
  }

   async presentLoginMask() {

      const alert = await this.alertController.create({
        header: 'Login',
        inputs: [
          {
            name: 'user',
            type: 'email',
            placeholder: 'user',
            id: 'user',
          },
          {
            name: 'pass',
            type: 'password',
            id: 'password',
            placeholder: 'pass'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (data) => {
              console.log('Confirm Ok', data);
              this.event.publishData('login', data);
            }
          }
        ]
      });
  
     return await alert.present()
   
  }
  

  async presentToast(text?:any) {

    const toast = await this.toastController.create({
      message: text ? text : 'Your setting has been saved.',
      duration: 2000
    });
    toast.present();
  }
  
  
  async notify(){

      let schedule: Schedule = {at: (new Date(Date.now()+1000))};
      let schema: LocalNotificationSchema = 
        {
        // Schedule delayed notification (Dies ist NICHT heads-up, also nicht in der offenen App sichtbar)
        // see much more info https://github.com/katzer/cordova-plugin-local-notifications 
        id: 99,
        title: 'Attention',
        body: 'Delayed Kris ILocalNotification',
        schedule: schedule,
        sound: 'file://sound.mp3',
        extra: {key: 'Secret message'},
        }
      let options: ScheduleOptions = {
        notifications: [
          schema
        ]
      }

      // this.localNotifications.requestPermission();
      await LocalNotifications
      .checkPermissions()
      .then(()=>{
        LocalNotifications.schedule(
          options
        ).then((result: ScheduleResult)=>console.log('schedule', result))

      LocalNotifications.getPending().then((list)=>console.log('Scheduled'));
    })
  }

  ngOnInit() {
  }

}
