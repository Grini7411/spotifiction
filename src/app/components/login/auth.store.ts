import { Injectable } from '@angular/core';
import {  Store, StoreConfig } from '@datorama/akita';


export interface AuthState {
  accessToken: string;
}

export function createInitialState(): AuthState {
  return {
    accessToken: ''
  };
}


@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'auth-store' })
export class AuthStore extends Store<AuthState> {

  constructor() {
    super(createInitialState());
  }

}
