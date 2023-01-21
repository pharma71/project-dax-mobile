import { OnInit, Injectable, Output } from '@angular/core';
import { LocalNotificationsService } from '../providers/local-notifications.service'
import { Platform, AlertController, ToastController, Events } from '@ionic/angular';
import { Toast } from '@capacitor/toast';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../components/popover/popover.component';
import { Capacitor } from '@capacitor/core';


@Injectable({
  providedIn: 'root',

})
export class NotifyService implements OnInit{


  public isAndroid: boolean = false;

  constructor(private platform: Platform, 
    private alertController: AlertController, private toastController: ToastController, notifications: LocalNotificationsService
    private toast: Toast, private event: Events, public popoverController: PopoverController){

      if(this.platform.is('android')){

        this.isAndroid = true;

        platform.ready().then(() => {
          console.log('Platform ready');
      
        notifications
        .showLocalNotification('My Test Notification', 'Test Body', Date.now(), Math.random()*100)
      
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
      this.event.publish('navPopoverClose', data);
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
              this.event.publish('login', data);
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
  
  
  notify(){

      let options: ILocalNotification = 
        {
        // Schedule delayed notification (Dies ist NICHT heads-up, also nicht in der offenen App sichtbar)
        // see much more info https://github.com/katzer/cordova-plugin-local-notifications 
        id: 99,
        title: 'Attention',
        text: 'Delayed Kris ILocalNotification',
        trigger: {at: new Date(new Date().getTime() + 10000)},
        led: 'FF0000',
        sound: 'file://sound.mp3',
        foreground: true, // Notify even if my app is in foreground
        vibrate: true, // For heads up
        priority: 2, // For heads up
        data: {key: 'Secret message'},

    // trigger: { in: 10, unit: ELocalNotificationTriggerUnit.SECOND} // standard way
        }

        // this.localNotifications.requestPermission();
        this.localNotifications
        .hasPermission()
        .then(()=>{
          this.localNotifications.schedule(
            options
          )
          console.log( this.localNotifications.isScheduled(99), 'Scheduled', 
          this.localNotifications.getScheduled(99), this.localNotifications.getDefaults())

        })

  }

  ngOnInit() {
  }

}
