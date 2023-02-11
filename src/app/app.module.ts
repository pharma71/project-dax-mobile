import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ComponentsModule } from './components/components.module';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CsvJSONPipe } from './components/pipes/csv-json.pipe';
import { IonicStorageModule } from '@ionic/storage-angular';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  declarations: [AppComponent, CsvJSONPipe],
  imports: [BrowserModule, IonicModule.forRoot(), IonicStorageModule.forRoot(), 
            AppRoutingModule, ComponentsModule, HttpClientModule, SwiperModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
