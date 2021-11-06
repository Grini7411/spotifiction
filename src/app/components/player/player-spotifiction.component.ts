import {Component, OnInit} from '@angular/core';
import {SpotifyService} from "../../services/spotify.service";
import {Track} from "../../models/types";
import {TrackQuery} from "../main/stores/track.query";

@Component({
  selector: 'app-player',
  templateUrl: './player-spotifiction.component.html',
  styleUrls: ['./player-spotifiction.component.scss']
})
export class PlayerSpotifictionComponent implements OnInit {
  track: Track | any = {};
  bgImage: string = '';
  constructor(private spotifyServ: SpotifyService, private trackQuery: TrackQuery) {
  }

  ngOnInit(): void {
    this.trackQuery.getChosenTrack$.subscribe((track: Track | any) => {
      this.track = track;
      this.bgImage = track?.album.images[0].url;
    })
  }

  playTrack() {
    this.spotifyServ.togglePlayChosenTrack();
  }

}
