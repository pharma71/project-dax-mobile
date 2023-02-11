import { AfterViewInit, Component } from '@angular/core';
import { StorageService } from './providers/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewInit{
  constructor(private storage: StorageService) {}

  async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
  }

  ngAfterViewInit(): void {}
}
