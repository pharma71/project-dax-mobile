import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SERVER_URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  // endpoints: search, removeWatchlistItem, addWatchlistItem, getRecommandation
  // getMarketnumbers, market, getHistory, login, chart, csv, getWatchlist
  constructor(private platform: Platform, private httpClient: HttpClient) { }

  getHost() {
  
      if (this.platform.is('android') && !this.platform.is('mobileweb')) {
          console.log(this.platform.is('android'));
          return SERVER_URL;
      }
      else {
        return SERVER_URL;
      } 
  }

  getChart(symbol:string):Observable<any> {

    return this.httpClient.get(`/ajax/csv?symbol=${symbol}`);
  }

  getHistory(symbol:string):Observable<any> {
    return this.httpClient.get(`/ajax/csv?symbol=${symbol}`);
  }

  getWatchlist(user_id:string, member_id:string, name:string):Observable<WatchlistData[]> {
   
    return this.httpClient.get<WatchlistData[]>(encodeURI(`/ajax/getWatchlist/${user_id}/${member_id}/`))
  }

  getRecomandation(symbol:string):Observable<Recommandation[]>{

    return this.httpClient.get<Recommandation[]>(`/ajax/getRecomandation/${symbol}`);
  }

  setWatchlistItem(id:string, member:string, symbol:string, name:string):Observable<any> {
     
    return this.httpClient.get(`/ajax/addWatchlistItem/${id}/${member}/${symbol}/${name}`);
  }

  removeWatchlistItem(id:string, user:string, member:string):Observable<any> {
  
    return this.httpClient.get(`/ajax/removeWatchlistItem/${id}/${user}/${member}`);
  }

  login(data:{user:string,pass:string}):Observable<UserData> {
  
    return this.httpClient.get<UserData>(`/ajax/login/${data.user}/${data.pass}`);
  }

  getMarket(market:string):Observable<StockData[]> {

    return this.httpClient.get<StockData[]>(`/ajax/market/${market}`);
  }

  searchSymbols(unternehmen:any):Observable<SearchData[]> {

    return this.httpClient.get<SearchData[]>(`/ajax/search/${unternehmen}`);
  }

  // Not supported by API
  getPrice(symbol:string) {

    return this.httpClient.get(encodeURI(`/ajax/getQuote/${symbol}`));
  }

  // Not supported by API
  getMembers(market:any) {
    
    return this.httpClient.get(encodeURI(this.getHost() + "ajax/getMembers/" + market))
  }
}
