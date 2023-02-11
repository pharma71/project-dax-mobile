import {AfterContentChecked, AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import SwiperCore, { Autoplay, Keyboard, Pagination, Navigation, Scrollbar, Zoom, SwiperOptions } from 'swiper';
//SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom, Navigation]);
import { IonSlides } from '@ionic/angular';

SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom]);

// https://masteringionic.com/blog/building-a-slideshow-with-ionic-slides-api

@Component({
  selector: 'app-swiper',
  template: `
  <ion-content [scrollY]=false style="max-height: 250px;width: 100%">
    <ion-slides pager="true" [options]="config">
      <ion-slide>
      <img src="../../assets/150.png">
      </ion-slide>
      <ion-slide>
      <img src="../../assets/1100x600.png">
      </ion-slide>
      <ion-slide>
      <img src="../../assets/oil.jpg">
      </ion-slide>
      <ion-slide>
      <img src="../../assets/gold.jpg">
      </ion-slide>
      <ion-slide>
      <img src="../../assets/autobau.jpg">
      </ion-slide>
      <ion-slide>Slide 3</ion-slide>
      <ion-slide>Slide 4</ion-slide>
      <ion-slide>Slide 5</ion-slide>
      <ion-slide>Slide 6</ion-slide>
    </ion-slides>

    <ion-grid>
    <ion-row>
      <ion-col size="2">

        <!-- Previous slide button -->
        <ion-button 
          fill="clear" 
          (click)="click()"
          [class.disabled]="false">
          <ion-icon slot="icon-only" name="chevron-back-outline"></ion-icon>
        </ion-button>
      </ion-col>


      <!-- Autoplay / stop play -->
      <ion-col size="8">
        <ion-button 
          fill="clear" 
          (click)="click()">
          <ion-icon slot="icon-only" name="play-outline"></ion-icon>
        </ion-button>

        <ion-button 
          fill="clear" 
          (click)="click()">
          <ion-icon slot="icon-only" name="stop-outline"></ion-icon>
        </ion-button>
      </ion-col>


      <!-- Next slide button -->
      <ion-col size="2">
        <ion-button
          fill="clear" 
          (click)="click()"
          [class.disabled]="false">
          <ion-icon slot="icon-only" name="chevron-forward-outline"></ion-icon>
        </ion-button>
      </ion-col>
    </ion-row>
  </ion-grid>
  <ion-content>

`,
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
    autoplay: true
  }

  ngAfterViewInit(): void {
    SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom]);
  }

  ngAfterContentChecked(): void {}

  click(){
    console.log('swiper button clicked')
  }
}