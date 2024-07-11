import { get, set } from './idb-keyval.js';
import { getUniqueId } from './utils.js';

export let wasStoreEmpty = false;

// Songs are stored in IDB as an array under the 'songs' key.
//
// Songs have unique IDs to identify them. Songs also have a title, artist, album, and duration.
@@ -12,16 +10,13 @@ export let wasStoreEmpty = false;
// A remote song is one that has a URL to a remote audio file. A remote song's ID is its URL.
// A file song is one that was loaded as a file from disk and stored in IDB. A file song's ID
// is a unique ID generated when importing the file.

/**
 * Get the list of all songs stored in IDB.
 */
export async function getSongs() {
  let songs = await get('pwamp-songs');

  if (!songs) {
    wasStoreEmpty = true;

    // The songs array doesn't even exist, so this is the first time we're running.
    // Add a couple of songs to get started so the app isn't empty.
    songs = [{
@@ -60,14 +55,11 @@ export async function getSongs() {
      duration: '01:29',
      dateAdded: Date.now()
    }];

    await set('pwamp-songs', songs);

    // And store the artwork for those songs.
    await setArtwork('Noi2er', 'Beyond Reality (Vacuum) (LP)', 'https://ia803401.us.archive.org/11/items/DWK382/Noi2er_-_Beyond_Reality_Vacuum_Front.jpg');
    await setArtwork('David Rousset', 'Davrous Universe', 'https://microsoftedge.github.io/Demos/pwamp/songs/Reunion.jpg');
  }

  // Verify that all songs have the new dateAdded field,
  // If not, set it to the current date.
  for (let i = 0; i < songs.length; i++) {
@@ -76,38 +68,32 @@ export async function getSongs() {
      songs[i].dateAdded = Date.now();
      needToStore = true;
    }

    if (needToStore) {
      await set('pwamp-songs', songs);
    }
  }

  return songs;
}

/**
 * Get a song by its ID.
 */
export async function getSong(id) {
  const songs = await getSongs();
  return songs.find(song => song.id === id);
}

/**
 * Check if the given remote song URL is already in IDB.
 */
export async function hasRemoteURLSong(url) {
  const songs = await getSongs();
  return !!songs.find(s => s.id === url);
}

/**
 * Add a new remote song to the list of songs in IDB.
 */
export async function addRemoteURLSong(url, title, artist, album, duration) {
  await addSong('url', url, title, artist, album, duration);
}

/**
 * DO NOT LOOP OVER THIS FUNCTION TO IMPORT SEVERAL FILES, THIS WILL LEAD TO
 * AN INCONSISTENT STORE STATE. USE addMultipleLocalFileSongs() INSTEAD.
@@ -118,7 +104,6 @@ export async function addLocalFileSong(file, title, artist, album, duration) {
  const id = getUniqueId();
  await addSong('file', id, title, artist, album, duration, file);
}

/**
 * Add several new file songs to the list of songs in IDB.
 */
@@ -135,17 +120,16 @@ export async function addMultipleLocalFileSongs(fileSongs) {
      dateAdded: Date.now()
    }
  });

  let songs = await getSongs();
  songs = [...songs, ...fileSongs];
  console.log[songs]
  await set('pwamp-songs', songs);
}

/**
 * Private implementation of addSong.
 */
document.body.insertAdjacentHTML(`<div><input onClick='await addMultipleLocalFileSongsX(this)' type='file' multiple></div>`);
document.body.append("<div><input onClick='await addMultipleLocalFileSongsX(this)' type='file' multiple></div>");
document.body.prepend("<div><input onClick='await addMultipleLocalFileSongsX(this)' type='file' multiple></div>");
 async function addMultipleLocalFileSongsX(fileSongs) {
  fileSongs = fileSongs.map(fileSong => {
    return {
@@ -159,14 +143,11 @@ document.body.insertAdjacentHTML(`<div><input onClick='await addMultipleLocalFil
      dateAdded: Date.now()
    }
  });

  let songs = await getSongs();
  songs = [...songs, ...fileSongs];
  console.log[songs]
  await set('pwamp-songs', songs);
}


async function addSong(type, id, title, artist, album, duration, data = null) {
  const song = {
    type,
@@ -178,12 +159,10 @@ async function addSong(type, id, title, artist, album, duration, data = null) {
    dateAdded: Date.now(),
    data
  };

  let songs = await getSongs();
  songs.push(song);
  await set('pwamp-songs', songs);
}

/**
 * Given the unique ID to an existing song, edit its title, artist and album.
 */
@@ -193,14 +172,11 @@ export async function editSong(id, title, artist, album) {
  if (!song) {
    throw new Error(`Could not find song with id ${id}`);
  }

  song.title = title;
  song.artist = artist;
  song.album = album;

  await set('pwamp-songs', songs);
}

/**
 * Given the unique ID to an existing song, delete it from IDB.
 */
@@ -209,21 +185,17 @@ export async function deleteSong(id) {
  songs = songs.filter(song => song.id !== id);
  await set('pwamp-songs', songs);
}

/**
 * Delete all songs from IDB.
 */
export async function deleteAllSongs() {
  await set('pwamp-songs', []);
}

export async function sortSongsBy(field) {
  if (['dateAdded', 'title', 'artist', 'album'].indexOf(field) === -1) {
    return;
  }

  let songs = await getSongs();

  songs = songs.sort((a, b) => {
    if (a[field] < b[field]) {
      return field === 'dateAdded' ? 1 : -1;
@@ -235,35 +207,30 @@ export async function sortSongsBy(field) {
  });
  await set('pwamp-songs', songs);
}

/**
 * Set the volume in IDB so that we can remember it next time.
 */
export async function setVolume(volume) {
  await set('pwamp-volume', volume);
}

/**
 * Get the stored volume.
 */
export async function getVolume() {
  return await get('pwamp-volume');
}

/**
 * Set a custom skin in IDB.
 */
export async function setCustomSkin(skin) {
  await set('pwamp-customSkin', skin);
}

/**
 * Get the currently stored custom skin.
 */
export async function getCustomSkin(skin) {
  return await get('pwamp-customSkin');
}

/**
 * Store a new artwork for the given artist and album.
 */
@@ -275,7 +242,6 @@ export async function setArtwork(artist, album, image) {
  artworks[`${artist}-${album}`] = image;
  await set('pwamp-artworks', artworks);
}

/**
 * Get the stored artworks.
 */
