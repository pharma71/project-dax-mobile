import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialComponent } from './financial/financial.component';
import { IonicModule } from '@ionic/angular';
import { ModalComponent } from './modal/modal.component';
import { PopoverComponent } from '../components/popover/popover.component';
import { TruncatePipe } from './pipes/truncate.pipe';


@NgModule({
  entryComponents: [ModalComponent, PopoverComponent], // for modal page
  declarations: [FinancialComponent, ModalComponent, PopoverComponent, TruncatePipe],
  imports: [
    CommonModule,
    IonicModule.forRoot()  // Damit FinancialComponent die IonicComponents kennt, z.B. <ion-icon>
  ],
  exports: [FinancialComponent, ModalComponent, PopoverComponent]
})

export class ComponentsModule { }
