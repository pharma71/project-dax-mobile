import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/providers/data.service';
import { ModalComponent } from '../modal/modal.component';
import { ModalController } from '@ionic/angular';
import { NotifyService } from 'src/app/providers/notify.service';
import { Storage } from '@ionic/storage';


declare var techan;
declare var d3;


@Component({
  selector: 'financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.scss'],
})

export class FinancialComponent implements OnInit {

    @Input() modus: any;
    @Input() item: StockData;
    @Output() updateWatchlist = new EventEmitter<boolean>();
    

    public path:string = "/AJAX/git_repos/projektdax/projektdax/cakephp/ajax/csv?symbol=";
  

   constructor(private httpService: DataService, private modalCtrl: ModalController, private storage: Storage, private notify: NotifyService) {
 
   }


    ngOnInit() {

        console.log('arguments', this.modus, this.item)
    }


    // Push  chart data to market page
    async showDetails(data, symbol, mode){

        var modal = await this.modalCtrl.create({
            component: ModalComponent,
            componentProps: {
                'data': {data: data, symbol: symbol, mode: mode}, 
                'modal': modal
            }
        })
        console.log('Modal Daten', data, modal);

        modal.present()
    }

    getHistory(symbol){

        this.httpService.getHistory(symbol)
        .subscribe((data)=>{
            this.showDetails(data, symbol, 'history');
        });
    }

    getStyle(change) {
        var color = '';
        if (change > 0) {
            color = 'green';
        }
        else {
            color = 'red';
        }
        return color;
    }

    // returns a promise
    getPrice(members, market) {
        var that = this;
        var array = [];
        return new Promise(function (resolve, reject) {
            var counter = 1;
            var stop = Object.keys(members).length;
            Object.keys(members).forEach(function (value, index) {
                if (market == "watchlist") {
                    var symbol = members[value].ticker;
                    var name = members[value].name;
                }
                else {
                    var symbol = members[value].symbol;
                    var name = members[value].name;
                }
                symbol = symbol.replace(':', '_');
                console.log('Verarbeite ', value, symbol);
                that.httpService.getPrice(symbol)
                    .subscribe(function (data) {
                    var csv = data.text();
                    var tmp = that.csvJSON(csv, name, symbol);
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
    
    csvJSON = function (csv, name, symbol) {
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
        var time = new Date(Number(timestamp + '000'));
        if (i > 1)
            time.setSeconds(time.getSeconds() + add);
        var change = Number(last) - Number(open);
        var myReturn = { name: name, symbol: symbol, date: time, close: Number(result[counter].close), high: high, low: low, open: Number(result[0].open), volume: volume, change: change };
        //return result; //JavaScript object
        return myReturn; //JSON
    }


    getChart(item:any){

        this.showDetails(item,item.symbol,'chart');
    }

    addToWatchlist(symbol, name) {

        var userData: UserData = null;
        console.log('Add to Watchlist getriggert', symbol, name);

        this.storage.get('user')
        .then((val) => {
            userData = JSON.parse(val); // Todo change to ionic local storage for promise
            console.log('User Data für Android ', userData);

            let result = this.httpService
            .setWatchlistItem(userData.user_id, userData.member_id, symbol, name);
            result.subscribe(
              (data)=> {this.notify.presentToast('Watchlist item was succesfully saved'); console.log(data, 'Data')},
              (error) => {this.notify.presentAlert({text: 'Watchlist item was not saved', header: 'Database Alert', subheader: 'Server error'}); 
                  console.log('HTTP Error', error)} // error path
              );
     
        console.log('Add to Watchlist getriggert', result);
        })
        .catch() // No catch provided

    } 

    removeWatchlistItem(id) {

        var userData: UserData = null;

        this.storage.get('user')
        .then((val) => {
            userData = JSON.parse(val); // Todo change to ionic local storage for promise
            console.log('User Data für Android ', userData);

            this.httpService
                .removeWatchlistItem(userData.user_id, userData.member_id, id)
                .subscribe((data:string) =>  {
                console.log('Watchlist item entfernt', data);
                this.updateWatchlist.emit(true);
            });
         });
    }

}
