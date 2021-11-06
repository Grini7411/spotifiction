
export interface ExternalUrls {
    spotify: string;
  }
  export interface Artist {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
  }
  export interface Image {
    height: number;
    url: string;
    width: number;
  }
  export interface Album {
    album_type: string;
    artists: Artist[];
    available_markets: string[];
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Image[];
    name: string;
    release_date: string;
    release_date_precision: string;
    total_tracks: number;
    type: string;
    uri: string;
  }


export interface Track {

  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  explicit: boolean;
  //external_ids: ExternalIds;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url?: any;
  //track_number: number;
  type: string;
  uri: string;
  duration_ms: number;
}

export interface SpotifyPlayReqApi {
  context_uri?: string;
  uris?: string[];
  offset?: { position: number };
}


