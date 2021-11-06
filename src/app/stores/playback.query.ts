import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { PlaybackStore, PlaybackState } from './playback.store';
import {Observable} from "rxjs";

@Injectable({ providedIn: 'root' })
export class PlaybackQuery extends Query<PlaybackState> {

  getIsPlaying$: Observable<boolean> = this.select(state => state.isPlaying);

  constructor(protected store: PlaybackStore) {
    super(store);
  }

}
