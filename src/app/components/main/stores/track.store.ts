import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import {Track} from '../../../models/types'

export interface TrackState {
   chosenTrack: Track | null;
   trackCache : Track[];
}

export function createInitialState(): TrackState {
  return {
    chosenTrack: null,
    trackCache : []
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'track' })
export class TrackStore extends Store<TrackState> {

  constructor() {
    super(createInitialState());
  }

}
