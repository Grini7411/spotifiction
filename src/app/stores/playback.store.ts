import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface PlaybackState {
  deviceId : string | null;
  isPlaying: boolean
}

export function createInitialState(): PlaybackState {
  return {
    deviceId : null,
    isPlaying: false
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'playback' })
export class PlaybackStore extends Store<PlaybackState> {

  constructor() {
    super(createInitialState());
  }

}
