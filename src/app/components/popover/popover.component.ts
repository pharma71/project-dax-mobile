import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  public items: any

  constructor(private popoverCtrl: PopoverController) { 

    this.items = [
      {item: 'Register for newsletter'},
      {item: 'Want to be notified'},
      {item: 'See our hotstocks'},
      {item: 'Top performer'},
    ]
  }

  clickHandler(item: any){

    this.popoverCtrl.dismiss(item);
  }

  ngOnInit() {}

}
