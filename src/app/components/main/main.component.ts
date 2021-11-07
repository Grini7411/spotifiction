import {Component, OnInit, ViewChild} from '@angular/core';
import {SpotifyService} from "../../services/spotify.service";
import {RouteConfigLoadEnd, Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import { debounceTime, distinctUntilChanged, mapTo, retryWhen, switchMap} from "rxjs/operators";
import {Track} from "../../models/types";
import {EMPTY, Observable, of} from "rxjs";
import {
  MatAutocompleteOrigin,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from "@angular/material/autocomplete";
import { AuthStore} from "../login/auth.store";
import {TrackState, TrackStore} from "./stores/track.store";
import {User} from "../../models/user";
import {AuthQuery} from "../login/auth.query";
import {TrackQuery} from "./stores/track.query";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  @ViewChild('#searchAuto', {read: MatAutocompleteOrigin}) autoCompleteElem?: MatAutocompleteOrigin;
  @ViewChild(MatAutocompleteTrigger, {read: MatAutocompleteTrigger}) trigger?: MatAutocompleteTrigger;


  public showSearchBar: boolean = false;

  tracks$?: Observable<Track[]>;
  searchResults$?: Observable<Track[]>;
  user$?: Observable<User>;

  searchTerm: FormControl = new FormControl();

  constructor(private spotifyServ: SpotifyService, private router: Router, private authStore: AuthStore,
              private authQuery: AuthQuery, private trackStore: TrackStore, private trackQuery: TrackQuery) { }

  ngOnInit(): void {
    this.router.events.subscribe((value) => {
      if(value instanceof RouteConfigLoadEnd) {
        const urlParams: URLSearchParams = new URLSearchParams(window.location.hash.replace("#","?"));
        const accessCode: string | null = urlParams.get('access_token');

        if (accessCode !== undefined && accessCode != null) {
          this.showSearchBar = true;
          this.spotifyServ.setToken(accessCode);
        }
      }
    })

    this.searchResults$ = this.searchTerm.valueChanges.pipe(
      debounceTime(700),
      distinctUntilChanged(),
      switchMap((term: string) => this.spotifyServ.searchOnSpotify(term)),
      retryWhen(err => {
        console.log(err);
        return err.pipe(
            mapTo((value: Track[]) => {
              return EMPTY;
            })
          )
      })

    )

    this.user$ = this.spotifyServ.getCurrentUser();


    this.authQuery.getAccessToken$.subscribe(token => {
      this.spotifyServ.spotifySDKInit(token, 0.5);
    })

  }

  getRecentTracks(evt: Event) {
    evt.stopPropagation();
    this.trigger?.openPanel();
    if(!this.searchTerm.dirty) {
      this.searchResults$ = this.trackQuery.getLastTrackPicks$;
    }
  }



  searchSpotify() {
    this.tracks$ = this.spotifyServ.searchOnSpotify(this.searchTerm.value);
  }

  // downloadTrack() {
  //   this.spotifyServ.downloadFromSpotify();
  // }


  onTrackSelect(event: MatAutocompleteSelectedEvent) {
    this.tracks$ = of([event.option.value]) as Observable<Track[]>;
    const trackName = event.option.value.name;
    this.searchTerm.setValue(trackName);

    this.trackStore.update((trackState: TrackState) => {
      const newTracksCache = [...trackState.trackCache];
      if (newTracksCache.length === 20) {
        newTracksCache.shift();
      }
      newTracksCache.push(event.option.value);
      return {...trackState, chosenTrack: event.option.value, trackCache: newTracksCache};
    })
  }


}
