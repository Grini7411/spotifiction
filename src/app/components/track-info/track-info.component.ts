import {Component, Inject, OnInit} from '@angular/core';
import {Track} from "../../models/types";
import {MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-track-info',
  templateUrl: './track-info.component.html',
  styleUrls: ['./track-info.component.scss']
})
export class TrackInfoComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {track: Track}) { }

  track: Track = this.data.track;
  ngOnInit(): void {
    debugger;
  }

}
