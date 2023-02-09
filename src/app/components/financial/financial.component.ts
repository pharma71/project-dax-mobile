import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/providers/data.service';
import { ModalComponent } from '../modal/modal.component';
import { IonModal, ModalController } from '@ionic/angular';
import { NotifyService } from 'src/app/providers/notify.service';
import { Storage } from '@ionic/storage';
import { EventsService } from 'src/app/providers/events.service';
import { HttpResponse } from '@angular/common/http';


@Component({
  selector: 'financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.scss'],
})

export class FinancialComponent implements OnInit {

    @Input() modus!: string;
    @Input() item!: StockData;
    @Output() updateWatchlist = new EventEmitter<boolean>();
    

    public path:string = "/AJAX/git_repos/projektdax/projektdax/cakephp/ajax/csv?symbol=";
  

   constructor(private httpService: DataService, private modalCtrl: ModalController, 
    private storage: Storage, private notify: NotifyService, private event: EventsService) {
   }

    ngOnInit() {

        console.log('arguments', this.modus, this.item)
    }


    // Push  chart data to market page
    async showDetails(data:any, symbol:string, mode:any){

        const modal:any = await this.modalCtrl.create({
            component: ModalComponent,
            componentProps: {
                'data': {data: data, symbol: symbol, mode: mode}
            }
        })
        console.log('Modal Daten', data, modal);

        modal.present()
    }

    getHistory(symbol:string){

        this.httpService.getHistory(symbol)
        .subscribe((data)=>{
            this.showDetails(data, symbol, 'history');
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
                    var tmp = this.csvJSON(csv, name, symbol);
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
    
    csvJSON(csv:any, name:string, symbol:string) {
        var v = csv;
        v = v.substring(1, v.length - 3); // Erase "" chars 
        var lines = v.split('\\n');
        var result = [];
        var volume = 0;
        var high = 0;
        var low = 9999;
        var counter = 0;
        for (var i = 0; i < lines.length; i++) {
            var myResult = { date: '', close: '', high: '', low: '', open: '', volume: '' };
            var row = lines[i].split(',');
            if (i == 0) {
                var timestamp = (row[0]);
                var open = row[4];
            }
            var last = row[1];
            myResult.close = row[1];
            myResult.high = row[2];
            myResult.low = row[3];
            myResult.open = row[4];
            myResult.volume = row[5];
            volume += parseInt(myResult.volume);
            high = Number(myResult.high) > high ? Number(myResult.high) : high;
            low = Number(myResult.low) < low ? Number(myResult.low) : low;
            counter = i;
            var add = (Number(row[0]) * 60);
            result.push(myResult); // take this for intraday chart
        }

        // Extra code für einen aktuellen Preis mit einer Line
        // Convert result array to object?
        var time = new Date(Number(timestamp + '000'));
       // if (i > 1)  ist das benötigt???
       //     time.setSeconds(time.getSeconds() + add);
        var change = Number(last) - Number(open);
        var myReturn = { name: name, symbol: symbol, date: time, close: Number(result[counter].close), high: high, low: low, open: Number(result[0].open), volume: volume, change: change };
        //return result; //JavaScript object
        return myReturn; //JSON
    }


    getChart(item:any){

        this.showDetails(item,item.symbol,'chart');
    }

    addToWatchlist(symbol:string, name:string) {

        let userData: UserData

        this.storage.get('user')
        .then((val) => {
            userData = JSON.parse(val); // Todo change to ionic local storage for promise
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
            userData = JSON.parse(val); // Todo change to ionic local storage for promise
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
