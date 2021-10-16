import { Component, OnInit} from '@angular/core';
import { SpotifyService} from "../../services/spotify.service";
import { NavigationEnd, Router} from "@angular/router";
import { FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public showSearchBar: boolean = false;
  public accessCode   : string  = '';
  public searchForm: FormGroup = new FormGroup({
    searchTerm: new FormControl('', [Validators.required])
  });

  constructor(private spotifyServ: SpotifyService, private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe((value) => {
      if(value instanceof NavigationEnd) {
        const urlParams: URLSearchParams = new URLSearchParams(window.location.hash.replace("#","?"));
        const accessCode: string | null = urlParams.get('access_token');

        if (accessCode !== undefined && accessCode != null) {
          this.showSearchBar = true;
          this.spotifyServ.setToken(accessCode);
        }
      }
    })
  }

  getToken() {
    this.spotifyServ.getAccessToken();
  }

  searchSpotify(searchTerm: any) {
    console.log(searchTerm);
    this.spotifyServ.searchOnSpotify(searchTerm).subscribe(result => {
      console.log(result);
    });
  }
}
