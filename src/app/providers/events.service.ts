import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

type Events = {
  title: string,
  subject: Subject<any>
}

@Injectable({
    providedIn: 'root'
})
export class EventsService {
    private events:Events[] = []

    constructor(){
      this.events.push({'title': 'fooSubject', subject: new Subject<any>()});
      this.events.push({'title': 'popoverClose', subject: new Subject<any>()});
      this.events.push({'title': 'login', subject: new Subject<any>()});
      this.events.push({'title': 'updateWatchlist', subject: new Subject<any>()});
    }

    publishData(topic: string, data: any) {
        this.events.forEach((value, index)=>{
          if(value.title===topic){
            this.events[index].subject.next(data);
          }   
        })
    }

    subscribeData(topic:string): Subject<any>|null {

      let item:any = this.events.find((value)=>{
          return value.title===topic
      })
      return item.subject;
    }
}
