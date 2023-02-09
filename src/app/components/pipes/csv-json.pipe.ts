import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'csvJSON'
})
export class CsvJSONPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {

    var v = value;
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
        myResult.date = String(Number(row[0]) * 60)
        myResult.close = row[1];
        myResult.high = row[2];
        myResult.low = row[3];
        myResult.open = row[4];
        myResult.volume = row[5];
        volume += parseInt(myResult.volume);
        high = Number(myResult.high) > high ? Number(myResult.high) : high;
        low = Number(myResult.low) < low ? Number(myResult.low) : low;
        counter = i;
        result.push(myResult); // take this for intraday chart
    }

    return result;
  }
}
