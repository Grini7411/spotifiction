import {Inject, Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, zip} from "rxjs";
import { environment } from "../../environments/environment";
import { map, switchMap} from "rxjs/operators";
import {AuthState, AuthStore} from "../components/login/auth.store";
import {AuthQuery} from "../components/login/auth.query";
import {SpotifyPlayReqApi, Track} from "../models/types";
import {TrackQuery} from "../components/main/stores/track.query";
import {PlayerService} from "./player.service";
import {PlaybackQuery} from "../stores/playback.query";
import {PlaybackState, PlaybackStore} from "../stores/playback.store";

const CLIENT_ID = environment.spotify.clientId;

const TOKEN = 'token'

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(private http: HttpClient, private authStore: AuthStore, private authQuery: AuthQuery, @Inject('Window') public window: Window,
              private trackQuery: TrackQuery, private playerServ: PlayerService, private playbackQuery: PlaybackQuery,
              private playbackStore: PlaybackStore) { }

  private BASE_URL = "https://api.spotify.com/v1/search";
  private requestUri = environment.spotify.requestUri;

  setToken(token: string) {
    this.authStore.update((authState: AuthState) => {
      return {...authState, accessToken: token};
    })
  }

  getAccessToken(): void {

    let accessCodeUrl: URL = new URL("https://accounts.spotify.com/authorize");

    accessCodeUrl.searchParams.append("client_id", CLIENT_ID);
    accessCodeUrl.searchParams.append("response_type", TOKEN);
    accessCodeUrl.searchParams.append("redirect_uri", this.requestUri);
    accessCodeUrl.searchParams.append("show_dialog", 'true');
    accessCodeUrl.searchParams.append("scope", "user-read-playback-state user-read-playback-position user-read-recently-played user-modify-playback-state " +
      "user-read-currently-playing streaming app-remote-control")


    window.location.href = accessCodeUrl.toString();
  }

  getCurrentUser(): Observable<any> {
    const url = 'https://api.spotify.com/v1/me';
    return this.authQuery.getAccessToken$
      .pipe(
        switchMap(accessToken => {
          const headers: HttpHeaders = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
          return this.http.get(url, {headers})
        })
      )
  }

  searchOnSpotify(term: string, type: string = 'track'): Observable<Track[]> {
    return this.authQuery.getAccessToken$
      .pipe(
        switchMap(accessToken => {
          const headers: HttpHeaders = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
          const params : HttpParams  = new HttpParams().set('q', term).set('type', type).set('limit', 20);
          return this.http.get(this.BASE_URL, {params, headers}).pipe(
            map((results:any) => {return results.tracks.items})
          )
        })
      )
  }

  //region Player SKD
  async spotifySDKInit(token: string, volume: number) {
    const { Player } = await this.waitForSpotifyWebPlaybackSDKToLoad();
    const player = new Player({
      name: 'Spotifiction player',
      getOAuthToken: (cb: (token:string) => void) => {
        cb(token);
      },
      volume
    });

    player.addListener('initialization_error', ({ message }: {message: string}) => {
      console.error(message);
    });

    player.addListener('authentication_error', ({ message }: {message: string}) => {
      console.error(message);
    });

    player.addListener('account_error', ({ message }: {message: string}) => {
      alert(`You account has to have Spotify Premium for playing music ${message}`);
    });

    player.addListener('playback_error', ({ message }: {message: string}) => {
      console.error(message);
    });

    // player.addListener('player_state_changed', async (state: Spotify.PlaybackState) => {
      // console.log(state);
      // if (!state) {
      //   console.info('[Angular Spotify] No player info!');
      //   return;
      // }
      // this.setAppTitle(state);
      // this.playbackStore.patchState({
      //   data: state,
      //   volume: await player.getVolume()
      // });
      // const currentTrackId = state.track_window?.current_track?.id;
      // if (!state.paused && currentTrackId) {
      //   this.playbackStore.loadTracksAnalytics({
      //     trackId: currentTrackId
      //   });
      // }
    // });

    player.addListener('ready', ({ device_id }: {device_id: string}) => {
      console.log('player is ready with device: ', device_id)
      this.playbackStore.update((playbackState: PlaybackState) => {
        return {...playbackState, deviceId: device_id};
      })
    });

    player.addListener('not_ready', ({ device_id }: {device_id: string}) => {
      console.log('[Angular Spotify] Device ID has gone offline', device_id);
    });

    await player.connect();
  }

  private waitForSpotifyWebPlaybackSDKToLoad(): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    // @ts-ignore
    this.window.onSpotifyWebPlaybackSDKReady = () => {};

    return new Promise((resolve) => {
      // @ts-ignore
      if (this.window.Spotify) {
        // @ts-ignore
        resolve(this.window.Spotify);
      } else {

        // @ts-ignore
        this.window.onSpotifyWebPlaybackSDKReady = () => {
          // @ts-ignore
          resolve(this.window.Spotify);
        };
      }
    });
  }


  togglePlayChosenTrack() {
    zip(this.playbackQuery.getIsPlaying$, this.trackQuery.getChosenTrack$)
      .pipe(
        switchMap(([isPlaying, track]) => {
          const request: SpotifyPlayReqApi = {
            context_uri: track?.uri
          }
          return this.playerServ.togglePlay(isPlaying, request)
        })
      )
    this.playbackStore.update(((playbackState: PlaybackState) => {
      const newIsPlaying = !playbackState.isPlaying;
      return {...playbackState, isPlaying: newIsPlaying};
    }))

  }

    //endregion

}
