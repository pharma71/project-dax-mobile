import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'half'
})
export class HalfPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    console.log('Pipe args', args);

    if(typeof value == 'string'){
      return value.toLowerCase(); 
    }
        if(typeof value == 'number'){
          let x = value / 2; 
      return x;
    }
    
  }

}
