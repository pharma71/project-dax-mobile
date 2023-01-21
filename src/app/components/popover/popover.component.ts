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
      {item: 'Do something 1'},
      {item: 'Do something 2'},
      {item: 'Do something 3'},
      {item: 'Do something 4'},
    ]
  }

  clickHandler(item: any){

    this.popoverCtrl.dismiss(item);
  }

  ngOnInit() {}

}
