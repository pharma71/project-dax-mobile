import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

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

  public csvPath  = "/AJAX/git_repos/projektdax/projektdax/cakephp/ajax/csv?symbol=";

  // endpoints: search, removeWatchlistItem, addWatchlistItem, getRecommandation
  // getMarketnumbers, market, getHistory, login, chart, csv, getWatchlist
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

    return this.httpClient.get(`/ajax/csv?symbol=${symbol}`);
  }

  getHistory(symbol:string) {

    return this.httpClient.get(`/ajax/getHistory/${symbol}`);
  }

  getWatchlist(user_id:string, member_id:string, name:string) {
   
    return this.httpClient.get(`/ajax/getWatchlist/${user_id}/${member_id}/${name}`)
           
  }

  getRecomandation(symbol:string):Observable<any>{

    return this.httpClient.get(`/ajax/getRecomandation/${symbol}`);
  }

  setWatchlistItem(id:string, member:string, symbol:string, name:string) {
     
    return this.httpClient.get(`/ajax/addWatchlistItem/${id}/${member}/${symbol}/${name}`);
  }

  removeWatchlistItem(id:string, user:string, member:string) {
  
    return this.httpClient.get(`/ajax/removeWatchlistItem/${id}/${user}/${member}`);
  }

  login(data:{user:string,pass:string}) {
  
    return this.httpClient.get(`/ajax/login/${data.user}/${data.pass}`);
  }

  getMarket(market:string) {

    return this.httpClient.get(`/ajax/market/${market}`);
  }

  searchSymbols(unternehmen:any) {

    return this.httpClient.get(`/ajax/search/${unternehmen}`);
  }

  // Not supported by API
  getPrice(symbol:string) {

    return this.httpClient.get(encodeURI(this.getHost().host + `/api/getQuote/${symbol}`));
  }

  // Not supported by API
  getMembers(market:any) {
    
    return this.httpClient.get(encodeURI(this.getHost().host + "ajax/getMembers/" + market))
  }
}
