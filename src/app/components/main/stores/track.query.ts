import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { TrackStore, TrackState } from './track.store';
import {Observable} from "rxjs";
import {Track} from "../../../models/types";

@Injectable({ providedIn: 'root' })
export class TrackQuery extends Query<TrackState> {

  getLastTrackPicks$: Observable<Track[]> = this.select(state => state.trackCache);



  constructor(protected store: TrackStore) {
    super(store);
  }

}
