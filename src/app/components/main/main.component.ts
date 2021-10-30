import { Component, OnInit} from '@angular/core';
import { SpotifyService} from "../../services/spotify.service";
import { RouteConfigLoadEnd, Router} from "@angular/router";
import { FormControl} from "@angular/forms";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {Track} from "../../models/types";
import {Observable, of} from "rxjs";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public showSearchBar: boolean = false;

  tracks$?: Observable<Track[]>;
  searchResults$?: Observable<Track[]>;

  searchTerm: FormControl = new FormControl();

  constructor(private spotifyServ: SpotifyService, private router: Router) { }

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
      switchMap((term: string) => this.spotifyServ.searchOnSpotify(term))
    )
  }



  searchSpotify() {
    this.tracks$ = this.spotifyServ.searchOnSpotify(this.searchTerm.value);
  }

  downloadTrack($event: MouseEvent) {
    this.spotifyServ.downloadFromSpotify("");
  }


  onTrackSelect(event: MatAutocompleteSelectedEvent) {
    this.tracks$ = of([event.option.value]) as Observable<Track[]>;
    const trackName = event.option.value.name;
    this.searchTerm.setValue(trackName);
  }
}
