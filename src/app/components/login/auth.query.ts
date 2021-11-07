import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { AuthStore, AuthState } from './auth.store';
import {Observable} from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthQuery extends Query<AuthState> {

  isLoggedIn$: Observable<boolean> = this.select(state => state.accessToken.length > 0);

  getAccessToken$: Observable<string> = this.select(state => state.accessToken);


  constructor(protected store: AuthStore) {
    super(store);
  }

}
