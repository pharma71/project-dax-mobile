import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // host adress, google finance string
  // local proxy Sbenötigt
  public host = {
    android: {
      host: '',
      google: ''
    },
    webapp: {
      host: '',
      google: ''
    },
    dev: {
      host: '',
      google: ''
    },
  };  

  constructor(private platform: Platform, private httpClient: HttpClient) { }

  getHost() {
  
      if (this.platform.is('android') && !this.platform.is('mobileweb')) {
          console.log(this.platform.is('android'));
          return this.host.android;
      }
      else {
        return this.host.dev;
      } 
  }

  getChart(symbol:string) {

    return this.httpClient.get(`/AJAX/csv?symbol=${symbol}`);
  }

  getHistory(symbol:string) {

    return this.httpClient.get(`/AJAX/getHistory/${symbol}`);
  }

  getWatchlist(user_id:string, member_id:string, name:string) {
   
    return this.httpClient.get(`/AJAX/getWatchlist/${user_id}/${member_id}/${name}`);
  }

  getRecomandation(symbol:string){

    return this.httpClient.get(`/AJAX/getRecomandation/${symbol}`);
  }

  setWatchlistItem(id:string, member:string, symbol:string, name:string) {
     
    return this.httpClient.get(`/AJAX/addWatchlistItem/${id}/${member}/${symbol}/${name}`);
  }

  removeWatchlistItem(id:string, user:string, member:string) {
  
    return this.httpClient.get(`/AJAX/removeWatchlistItem/${id}/${user}/${member}`);
  }

  login(data:{user:string,pass:string}) {
  
    return this.httpClient.get(`/AJAX/login/${data.user}/${data.pass}`);
  }

  getMarket(market:string) {

    return this.httpClient.get(`/AJAX/market/${market}`);
  }

  getMembers(market:any) {
    
    return this.httpClient.get(encodeURI(this.getHost().host + "ajax/getMembers/" + market))
  }

  searchSymbols(unternehmen:any) {

    return this.httpClient.get(`/AJAX/search/${unternehmen}`);
  }

  getPrice(symbol:string) {

    return this.httpClient.get(encodeURI(this.getHost().host + `/api/getQuote/${symbol}`));
  }
}
