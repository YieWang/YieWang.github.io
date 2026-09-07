import importedMusic from './music-import.json';

export interface MusicTrack {
  id?: string;
  source?: 'apple-music' | 'netease';
  discNo?: number;
  trackNo: number;
  title: string;
  duration: string;
  artistName?: string;
  isFavorite?: boolean;
  note?: string; // 针对单曲的心情随笔 / 听歌时刻 / 歌词摘录
}

export interface MusicAlbum {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  artistDisplayName: string; // 严格原名
  year: number | string;
  source?: 'apple-music' | 'netease';
  metadataIncomplete?: boolean;
  genre?: string;
  label?: string;
  catalogNo?: string;
  format?: 'Vinyl' | 'CD' | 'Digital' | 'Cassette' | 'Live';
  coverUrl: string;
  tracks: MusicTrack[];
  rating?: string;
  listenedDate?: string;
  summary?: string;
}

export interface MusicArtist {
  avatarUrl: string;
  id: string;
  name: string;
  displayName: string; // 严格原名呈现
  country?: string;
  yearsActive?: string;
  coverUrl?: string;
  albumIds: string[];
}

export const musicArtists = importedMusic.artists as MusicArtist[];
export const musicAlbums = importedMusic.albums as MusicAlbum[];
