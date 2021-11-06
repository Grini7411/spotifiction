import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {SpotifyPlayReqApi} from "../models/types";



@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  playerUrl: string = environment.spotify.playerUrl

  constructor(private http: HttpClient) { }

  play(request: SpotifyPlayReqApi): Observable<any> {
    return this.http.put(`${this.playerUrl}/play`, request);
  }

  togglePlay(isPlaying: boolean, request: SpotifyPlayReqApi) {
    if (isPlaying) {
      return this.pause();
    }
    return this.play(request);
  }

  pause() {
    return this.http.put(`${this.playerUrl}/pause`, {});
  }

  resume() {

  }

  nextTrack() {

  }

  previousTrack() {

  }

  getVolume() {

  }

  setVolume() {

  }
}
