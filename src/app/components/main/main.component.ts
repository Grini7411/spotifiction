import { Component, OnInit} from '@angular/core';
import { SpotifyService} from "../../services/spotify.service";
import { RouteConfigLoadEnd, Router} from "@angular/router";
import { FormControl, FormGroup, Validators} from "@angular/forms";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {Track} from "../../models/types";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public showSearchBar: boolean = false;

  tracks: Track[] = [];

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

    this.searchTerm.valueChanges.pipe(
      debounceTime(700),
      distinctUntilChanged(),
      switchMap((term: string) => this.spotifyServ.searchOnSpotify(term))
    ).subscribe((result) => {
      this.tracks = result;
    })
  }



  searchSpotify(event: Event) {
    this.spotifyServ.searchOnSpotify(this.searchTerm.value).subscribe(result => {
      this.tracks = result;
    });
  }
}
