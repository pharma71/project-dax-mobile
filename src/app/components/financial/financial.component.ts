import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/providers/data.service';
import { ModalComponent } from '../modal/modal.component';
import { ModalController, Platform } from '@ionic/angular';
import { NotifyService } from 'src/app/providers/notify.service';
import { StorageService } from '../../providers/storage.service';
import { EventsService } from 'src/app/providers/events.service';
import { of } from 'rxjs';


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

        this.path = httpService.csvPath;

        this.platform.ready().then(()=>{
            this.device = 'landscape';
            if(this.platform.is('mobile') && this.platform.isPortrait()){
                this.device = 'portrait'
            }
        })
   }

    ngOnInit() {

        console.log('arguments', this.modus, this.item)
    }

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


    // Push  chart data to market page
    async showDetails(data:any, symbol:string, mode:any, name?: string){

        const modal:any = await this.modalCtrl.create({
            component: ModalComponent,
            componentProps: {
                'data': {data: data, symbol: symbol, mode: mode, name: name}
            }
        })
        console.log('Modal Daten', data, modal);

        modal.present()
    }

    getHistory(symbol:string, name: string){

        fetch(`/ajax/csv?symbol=${symbol}`)
        .then(response => response.text())
        .then(text => {
     
            console.log('financial history', text, this.csvJSON(text));
            this.showDetails(this.csvJSON(text), symbol, 'history', name);
        });
    }

    getStyle(change:number) {

        return change > 0 ? 'red' : 'green';
    }

    // returns a promise
    getPrice(members:any, market:string):Promise<historyData[]> {

        const array = <any>[];

        return new Promise((resolve, reject)=> {
            var counter = 1;
            var stop = Object.keys(members).length;
            Object.keys(members).forEach((value, index)=> {
                if (market == "watchlist") {
                    var symbol = members[value].ticker;
                    var name = members[value].name;
                }
                else {
                    var symbol = members[value].symbol;
                    var name = members[value].name;
                }
                symbol = symbol.replace(':', '_');
                this.httpService.getPrice(symbol)
                    .subscribe((data: any)=> {
                    var csv = data.text();
                    var tmp = this.csvJSON(csv);
                    array.push(tmp);
                    if (index == stop - 1) {
                        console.log('Ausgabe', array);
                        resolve(array);
                    }
                    console.log("Index", index, "Stop", stop);
                }, function (err) {
                    console.log("Error fetching stock data", err);
                }); // Ende subscribe
            }); // Ende foreach
        }); // Ende Promise
    }
    
    csvJSON(csv: string){
        var v = csv;
        var lines = v.split('\n');
        var result = [];
        
        for (var i = 1; i < lines.length; i++) {
            var myResult = { date: '', close: '', high: '', low: '', open: '', volume: '' };
            var row = lines[i].split(',');
            
            var last = row[1];
            myResult.date = row[0];
            myResult.close = row[1];
            myResult.high = row[2];
            myResult.low = row[3];
            myResult.open = row[4];
            myResult.volume = row[5];
            result.push(myResult); 
        }

        return result; //JavaScript object
    }


    getChart(item:any){

        this.showDetails(item,item.symbol,'chart');
    }

    addToWatchlist(symbol:string, name:string) {

        let userData: UserData

        this.storage.get('user')
        .then((val) => {
            userData = val; // Todo change to ionic local storage for promise
            console.log('User Data für Android ', userData);

            let result = this.httpService
            .setWatchlistItem(userData.user_id, userData.member_id, symbol, name)
            .subscribe(
              (data)=> {this.notify.presentToast('Watchlist item was succesfully saved'); console.log(data, 'Data')},
              (error) => {this.notify.presentAlert({text: 'Watchlist item was not saved', header: 'Database Alert', subheader: 'Server error'}); 
                  console.log('HTTP Error', error)} // error path
              );
     
        console.log('Add to Watchlist getriggert', result);
        })
        .catch() // No catch provided

    } 

    removeWatchlistItem(symbol:string) {

        let userData: UserData;

        this.storage.get('user')
        .then((val) => {
            userData = val;
            console.log('User Data für Android ', userData);

            this.httpService
                .removeWatchlistItem(userData.user_id, userData.member_id, symbol)
                .subscribe((data:any) =>  {
                console.log('Watchlist item entfernt', data);
                this.event.publishData('updateWatchlist', true)
            });
         });
    }

}
