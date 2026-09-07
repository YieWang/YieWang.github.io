"""Apply the owner's explicit exclusions and display groups after importing exports.

Run from the workspace with: python3 scripts/curate-media.py
Apple exports remain unchanged; source artist credits stay in album and track details.
"""
import hashlib
import json
import unicodedata
from pathlib import Path

root = Path(__file__).resolve().parents[1]
prep = root / 'Homepage-Assets/media'
read = lambda p: json.loads(p.read_text())
write = lambda p, data: p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
norm = lambda s: ''.join(c for c in unicodedata.normalize('NFKC', s).casefold() if c.isalnum())
rules = read(root / 'src/data/media-curation.json')

cinema_path = root / 'src/data/cinema-import.json'
cinema = [x for x in read(cinema_path) if x['id'] not in rules['excludedCinemaIds']]
for item in cinema:
 item.update({k: v for k, v in rules.get('cinemaMetadata', {}).get(item['id'], {}).items() if k != 'sources'})
write(cinema_path, cinema)

music_path = root / 'src/data/music-import.json'
music = read(music_path)
excluded = {x['id'] for x in rules['excludedTracks']}
groups = {(x['title'], x['albumArtist']): x['group'] for x in rules['musicGroups']}
cover_overrides = {(x['title'], x['albumArtist']): x['coverUrl'] for x in rules.get('musicCovers', [])}
artists = {x['id']: dict(x, albumIds=[]) for x in music['artists']}
by_name = {norm(x['name']): x for x in artists.values()}
# Local Apple cache supplies official display names and artwork for newly separated artists.
catalog = read(prep / 'apple-catalog-artists.json') if (prep / 'apple-catalog-artists.json').exists() else []
manifest = read(prep / 'upload-manifest.json') if (prep / 'upload-manifest.json').exists() else []
avatars = {x['appleArtistId']: x['key'] for x in manifest if x['category'] == 'artist'}
for x in catalog:
 name = x['attributes']['name']
 if norm(name) not in by_name:
  by_name[norm(name)] = {'id': 'apple-' + x['id'], 'name': name, 'displayName': name,
    'avatarUrl': 'https://homepage-assets.mathtranslations.org/' + avatars[x['id']] if x['id'] in avatars else '', 'albumIds': []}
source_songs = read(prep / 'apple-library-songs.json') if (prep / 'apple-library-songs.json').exists() else []
track_artists = {x['id']: x['attributes']['artistName'] for x in source_songs}
albums = []
for album in music['albums']:
 album['coverUrl'] = cover_overrides.get((album['title'], album['artistName']), album['coverUrl'])
 album['tracks'] = [t for t in album['tracks'] if t['id'] not in excluded]
 if not album['tracks']:
  continue
 for track in album['tracks']:
  if track['id'] in track_artists:
   track['artistName'] = track_artists[track['id']]
 name = groups.get((album['title'], album['artistName']))
 if name:
  artist = by_name.get(norm(name))
  if artist is None:
   artist = {'id': 'group-' + hashlib.sha256(norm(name).encode()).hexdigest()[:16],
     'name': name, 'displayName': name, 'avatarUrl': '', 'albumIds': []}
   by_name[norm(name)] = artist
  artists.setdefault(artist['id'], artist)
  album['artistId'] = artist['id']
 artists[album['artistId']]['albumIds'].append(album['id'])
 albums.append(album)
music = {'artists': [x for x in artists.values() if x['albumIds']], 'albums': albums}
ids = [t['id'] for a in albums for t in a['tracks']]
assert len(ids) == len(set(ids)) and not excluded.intersection(ids)
assert all(a['tracks'] and a['id'] in artists[a['artistId']]['albumIds'] for a in albums)
write(music_path, music)
if (prep / 'music-import-review.json').exists():
 report = read(prep / 'music-import-review.json')
 report['missingCovers'] = [{'id': a['id'], 'title': a['title'], 'artist': a['artistName']} for a in albums if not a['coverUrl']]
 report['missingArtistAvatars'] = [{'id': a['id'], 'name': a['name']} for a in music['artists'] if not a['avatarUrl'] and a['name'] not in ('Soundtracks', 'Compilations')]
 write(prep / 'music-import-review.json', report)
print(f'Curated {len(cinema)} cinema works; {len(albums)} albums / {len(ids)} tracks / {len(music["artists"])} navigation groups')
