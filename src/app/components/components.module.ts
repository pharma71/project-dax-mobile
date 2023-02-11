import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialComponent } from './financial/financial.component';
import { IonicModule } from '@ionic/angular';
import { ModalComponent } from './modal/modal.component';
import { PopoverComponent } from '../components/popover/popover.component';
import { SwiperComponent } from './swiper/swiper.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { DataService } from '../providers/data.service';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  entryComponents: [ModalComponent, PopoverComponent], // for modal page
  declarations: [FinancialComponent, ModalComponent, PopoverComponent, TruncatePipe, SwiperComponent],
  imports: [
    CommonModule,
    IonicModule.forRoot() ,
    SwiperModule
     // Damit FinancialComponent die IonicComponents kennt, z.B. <ion-icon>
  ],
  exports: [FinancialComponent, ModalComponent, PopoverComponent, IonicModule, SwiperComponent],
  providers: [DataService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ComponentsModule { }
