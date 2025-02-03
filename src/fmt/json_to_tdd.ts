/*
  This script provides a function that transforms the old json format into the new .tdd format
  */
import { RGBColour } from './Colour';
import { TDDDraft } from '../tdd/tdd';
export { json_to_tdd };

const colorIDs = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
];

function json_to_tdd(json: JSON) {
  let r = new TDDDraft();

  if (json['lower_cells'].length < 1) {
    /* This is a fall back for impossible values */
    r.threading = ['Z'];
    r.threadingColours = [['0']];
  } else {
    /* This decodes the old json threading diagram to make the new one */
    r.threading = [];
    for (let x of json['lower_cells'][0]) {
      if (x['direction'] == 'left') {
        r.threading.push('Z');
      } else {
        r.threading.push('S');
      }
    }

    r.threadingColours = [];
    for (let y of json['lower_cells']) {
      let row = [];
      for (let x of y) {
        if (x['colorid'] >= 0 && x['colorid'] < 16) {
          row.push(colorIDs[x['colorid']]);
        } else if (x['colorid'] == -1) {
          row.push(' ');
        } else {
          row.push('?');
        }
      }
      r.threadingColours.push(row);
    }
  }

  /* This fills out the palette */
  for (let n = 0; n < json['palette'].length; n++) {
    const regex = /rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\)/;
    let found = json['palette'][n].match(regex);
    if (found) {
      r.palette[colorIDs[n]] = new RGBColour(found[1], found[2], found[3]);
    }
  }

  /* The turning diagram can now be decoded (since it needed the threading diagram first) */
  r.turning = [];
  for (let y = 0; y < json['main_cells'].length; y++) {
    r.turning[y] = [];
    for (let x = 0; x < json['main_cells'][y].length; x++) {
      r.turning[y][x] = '\\';
    }
  }

  for (let x = 0; x < r.turning[0].length; x++) {
    let dir = r.threading[x] == 'Z' ? '\\' : '/';
    for (let y = r.turning.length - 1; y >= 0; y--) {
      if (json['main_cells'][y][x]) {
        dir = dir == '\\' ? '/' : '\\';
      }
      r.turning[y][x] = dir;
    }
  }

  return r;
}
