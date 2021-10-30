import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Track} from "../../models/types";

@Component({
  selector: 'app-track-card',
  templateUrl: './track-card.component.html',
  styleUrls: ['./track-card.component.scss']
})
export class TrackCardComponent implements OnInit {

  @Input() track: Track | undefined;
  @Output() downloadSong: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

}
