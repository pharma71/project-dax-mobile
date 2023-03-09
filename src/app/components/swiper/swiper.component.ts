import {AfterContentChecked, AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from '../modal/modal.component';
import SwiperCore, { Autoplay, Keyboard, Pagination, Navigation, Scrollbar, Zoom, SwiperOptions } from 'swiper';


// https://masteringionic.com/blog/building-a-slideshow-with-ionic-slides-api

@Component({
  selector: 'app-swiper',
  templateUrl: 'swiper.component.html',
  styleUrls: ['swiper.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SwiperComponent implements AfterViewInit,AfterContentChecked {

  constructor(private modal: ModalController){}

  public config: SwiperOptions = {
    initialSlide: 0,
    slidesPerView: 1,
    loop: true,
    grabCursor: true,
    allowSlideNext: true,
    allowSlidePrev: true,
    allowTouchMove: true,
    direction: 'horizontal',
    speed: 750,
    scrollbar: true,
    createElements: true,
    autoplay: true,
    parallax: true
  }

  ngAfterViewInit(): void {
    SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom]);
  }

  ngAfterContentChecked(): void {}

  async click(id:number){

    if(id > 0){
      const modal:any = await this.modal.create({
        component: ModalComponent,
        componentProps: {
            'data': {mode: 'swiper', name: `slide ${id}`}
      }})

      modal.present()
    }
    console.log('swiper button clicked')
  }
}