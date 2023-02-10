import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init()
    .then(()=>this.set('user', {user_id: '29', member_id: '2', name: 'Kristian Knorr'}))

  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
    return Promise.resolve();
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    return Promise.resolve(this._storage?.set(key, value));
  }

  public get(key: string) {
    return Promise.resolve(this._storage?.get(key));
  }

  public remove(key: string){
    return Promise.resolve(this._storage?.remove(key))
  }

  public keys(){
    return Promise.resolve(this._storage?.keys())
  }
}
