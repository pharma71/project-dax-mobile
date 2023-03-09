import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/providers/data.service';
import { ModalComponent } from '../modal/modal.component';
import { ModalController, Platform } from '@ionic/angular';
import { NotifyService } from 'src/app/providers/notify.service';
import { StorageService } from '../../providers/storage.service';
import { EventsService } from 'src/app/providers/events.service';
import { CSV_PATH } from 'src/environments/environment';


@Component({
  selector: 'financial',
  templateUrl: 'financial.component.html',
  styleUrls: ['financial.component.scss'],
})

export class FinancialComponent implements OnInit {

    @Input() modus!: string;
    @Input() item!: StockData;
    
    public path:string
    public device:string
  

   constructor(private httpService: DataService, private modalCtrl: ModalController, 
    private storage: StorageService, private notify: NotifyService, private event: EventsService,
    private platform: Platform) {

        this.platform.ready().then(()=>{
            this.device = 'landscape';
            if(this.platform.is('mobile') && this.platform.isPortrait()){
                this.device = 'portrait'
            }
        })
   }

    ngOnInit() {}

    date(date:number|string){

        if(typeof date === 'number' && date.toString().length === 10){
            date = Number(date.toString() + '000');
        }
  
        return new Date(date).toLocaleString();
    }

    getChipColor(change: number){

        let color:string = '';

        switch(Math.sign(change)){
        
            case 1:
                color = 'success' 
                break;
            case 0: 
                color = 'medium'
                break;
            case -1:
                color = 'danger'
                break;
            default:
                throw new Error('Color assignment failed')
        }

        return color;
    }

    async showDetails(data:FinancialData, symbol:string, mode:string, name?: string){

        const modal:any = await this.modalCtrl.create({
            component: ModalComponent,
            componentProps: {
                'data': {data: data, symbol: symbol, mode: mode, name: name}
            }
        })

        modal.present()
    }

    getHistory(symbol:string, name: string){

        fetch(CSV_PATH+`${symbol}`)
        .then(response => response.text())
        .then(text => {
     
            this.showDetails(this.csvJSON(text), symbol, 'history', name);
        });
    }

    getStyle(change:number) {

        return change > 0 ? 'red' : 'green';
    }

    getPrice(members:any, market:string):Promise<HistoryData[]> {

        const array = <any>[];
        let symbol: string

        return new Promise((resolve)=> {
     
            const stop = Object.keys(members).length;
            Object.keys(members).forEach((value, index)=> {
                if (market === "watchlist") {
                    symbol = members[value].ticker;
                    const name = members[value].name;
                }
                else {
                    symbol = members[value].symbol;
                    const name = members[value].name;
                }
                symbol = symbol.replace(':', '_');
                this.httpService.getPrice(symbol)
                    .subscribe({
                        next:(data: any) => {
                            const txt = data.text();
                            let csv = this.csvJSON(txt);
                            array.push(csv);
                            if (index == stop - 1) {
                                resolve(array);
                            }
                        },
                        error: (err:any) => {
                            console.log("Error fetching stock data", err);
                    }}); // Ende subscribe
            }); // Ende foreach
        }); // Ende Promise
    }
    
    csvJSON(csv: string):HistoryData[]{
      
        const v = csv;
        const lines = v.split('\n');
        const result = [];
        
        for (let i = 1; i < lines.length; i++) {
            let myResult = { date: '', close: '', high: '', low: '', open: '', volume: '' };
            let row = lines[i].split(',');
            
            let last = row[1];
            myResult.date = row[0];
            myResult.close = row[1];
            myResult.high = row[2];
            myResult.low = row[3];
            myResult.open = row[4];
            myResult.volume = row[5];
            result.push(myResult); 
        }

        return result;
    }

    getChart(item:StockData){

        this.showDetails(item,item.symbol,'chart',item.name);
    }

    addToWatchlist(symbol:string, name:string) {

        let userData: UserData

        this.storage.get('user')
        .then((val) => {
            userData = val;

            this.httpService
            .setWatchlistItem(userData.user_id, userData.member_id, symbol, name)
            .subscribe({
                next: (data)=> {
                    this.notify.presentToast('Watchlist item was succesfully saved');
                    this.event.publishData('updateWatchlist', '')},
                error: (error) => {
                    this.notify.presentAlert({text: 'Watchlist item was not saved', header: 'Database Alert', subheader: 'Server error'})
                }
            });
        })
        .catch((error)=>console.log('Set Watchlist Item Error', error))
    } 

    removeWatchlistItem(symbol:string) {

        let userData: UserData;

        this.storage.get('user')
        .then((val) => {
            userData = val;

            this.httpService
                .removeWatchlistItem(userData.user_id, userData.member_id, symbol)
                .subscribe((data:any) =>  {
                this.notify.presentToast('Watchlist item was succesfully removed');
                this.event.publishData('updateWatchlist', true)
            });
         });
    }
}
