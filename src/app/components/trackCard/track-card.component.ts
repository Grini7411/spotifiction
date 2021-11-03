import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Track} from "../../models/types";
import {TrackState, TrackStore} from "../main/stores/track.store";
import {MatDialog} from "@angular/material/dialog";
import {TrackInfoComponent} from "../track-info/track-info.component";

@Component({
  selector: 'app-track-card',
  templateUrl: './track-card.component.html',
  styleUrls: ['./track-card.component.scss']
})
export class TrackCardComponent implements OnInit {

  @Input() track: Track | undefined;
  @Output() downloadSong: EventEmitter<void> = new EventEmitter<void>();

  constructor(private trackStore: TrackStore, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onInfoClick() {
    this.trackStore.update((trackState: TrackState) => {
      return {...trackState, chosenTrack: this.track};
    });
    this.dialog.open(TrackInfoComponent,
      {
        panelClass: ['animate__animated','animate__slideInLeft'],
        data: {
          track: this.track
        },
        width: '600px'
      });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });


    }
}
