import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import { environment } from "../../environments/environment";
import { map} from "rxjs/operators";

const CLIENT_ID = environment.spotify.clientId;

const TOKEN = 'token'

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(private http: HttpClient) { }

  private BASE_URL = "https://api.spotify.com/v1/search";
  private requestUri = environment.spotify.requestUri;

  private accessToken: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private downloadUrl: string = environment.spotify.downloadURL;

  setToken(token: string) {
    this.accessToken.next(token);
  }

  getAccessToken(): void {

    let accessCodeUrl: URL = new URL("https://accounts.spotify.com/authorize");

    accessCodeUrl.searchParams.append("client_id", CLIENT_ID);
    accessCodeUrl.searchParams.append("response_type", TOKEN);
    accessCodeUrl.searchParams.append("redirect_uri", this.requestUri);
    accessCodeUrl.searchParams.append("show_dialog", 'true');


    window.location.href = accessCodeUrl.toString();
  }

  searchOnSpotify(term: string, type: string = 'track'): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken.getValue()}`);
    const params: HttpParams = new HttpParams().set('q', term).set('type', type).set('limit', 20);

    return this.http.get(this.BASE_URL, {params, headers}).pipe(
      map((results:any) => {return results.tracks.items})
    );

  }

  downloadFromSpotify() {
    this.http.get(this.downloadUrl);
  }


}
