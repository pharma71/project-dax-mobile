import {AfterContentChecked, AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import SwiperCore, { Autoplay, Keyboard, Pagination, Navigation, Scrollbar, Zoom, SwiperOptions } from 'swiper';
//SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom, Navigation]);
import { IonSlides } from '@ionic/angular';

SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom]);

// https://masteringionic.com/blog/building-a-slideshow-with-ionic-slides-api

@Component({
  selector: 'app-swiper',
  templateUrl: 'swiper.component.html',
  styleUrls: ['swiper.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SwiperComponent implements AfterViewInit,AfterContentChecked {

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

  click(){
    console.log('swiper button clicked')
  }
}