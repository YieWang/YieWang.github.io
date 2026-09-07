import photoData from './photography.json';

export interface Photo {
  hidden?: boolean;
  cityId?: string;
  id: string;
  title: string;
  subtitle?: string;
  location: string;
  locationEn: string;
  year: number;
  date: string;
  imageUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  camera?: string;
  lens?: string;
  film?: string;
  exif?: { focalLength: string; aperture: string; shutter: string; iso: string };
  story?: string;
}

export interface CityAlbum {
  hidden?: boolean;
  id: string;
  year: number;
  location: string;
  locationEn: string;
  country: string;
  photos: Photo[];
}

export interface YearGroup { year: number; cities: CityAlbum[] }

export const photoOptics = (photo: Photo): string => photo.exif
  ? [photo.exif.aperture, photo.exif.shutter, photo.exif.iso && `ISO ${photo.exif.iso}`].filter(Boolean).join(' · ')
  : '';

export const photoLocation = (photo: Photo): string =>
  `${photo.year}・ ${photo.locationEn.toUpperCase()} （${photo.location}）${photo.subtitle ? `・${photo.subtitle}` : ''}`;

// Albums follow the supplied folders; dates and optics come from original EXIF.
export const photographyYearGroups: YearGroup[] = photoData;


export const allCityAlbums: CityAlbum[] = photographyYearGroups.flatMap(group =>
  group.cities.filter(album => !album.hidden).map(album => ({
    ...album,
    photos: album.photos.filter(photo => !photo.hidden).map(photo => ({ ...photo, cityId: album.id }))
  }))
);
export const allPhotos: Photo[] = allCityAlbums.flatMap(album => album.photos);
