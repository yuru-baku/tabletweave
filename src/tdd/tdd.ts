/**
 * This file provides a class for representing a tdd file in memory
 */

import * as Colour from '../fmt/Colour'
import { getColorName, initColors, ORIGINAL_COLORS } from 'ntc-ts'
export { TDDDraft, TDDDraftFromString }

type PaletteKey = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
type Palette = Record<PaletteKey, Colour.RGBColour>

class TDDDraft {
  name: string
  palette: Palette
  threadingColours: string[][]
  threading: string[]
  turning: string[][]

  constructor() {
    initColors(ORIGINAL_COLORS)
    this.name = 'untitled draft'
    this.resetPalette()
    this.threadingColours = [['1'], ['1'], ['1'], ['1']]
    this.threading = ['Z']
    this.turning = [['\\']]
  }

  resetPalette() {
    this.palette = {
      0: new Colour.RGBColour(255, 255, 255),
      1: new Colour.RGBColour(0, 0, 0),
      2: new Colour.RGBColour(255, 0, 0),
      3: new Colour.RGBColour(0, 153, 0),
      4: new Colour.RGBColour(0, 0, 255),
      5: new Colour.RGBColour(221, 221, 221),
      6: new Colour.RGBColour(153, 153, 153),
      7: new Colour.RGBColour(255, 255, 0),
      8: new Colour.RGBColour(0, 255, 255),
      9: new Colour.RGBColour(153, 0, 153),
      10: new Colour.RGBColour(255, 136, 0),
      11: new Colour.RGBColour(255, 136, 136),
    }
  }

  getPicks(): number {
    return this.turning.length
  }
  getTablets(): number {
    return this.turning[0].length
  }
  getHoles(): number {
    return this.threadingColours.length
  }

  addPicks(num: number): void {
    for (let i = 0; i < num; i++) {
      let arr = this.turning[0].slice()
      this.turning.unshift(arr)
    }
  }

  removePicks(num: number): void {
    this.turning = this.turning.slice(num, this.getPicks())
  }

  addHoles(num: number): void {
    let n = Math.min(num, 8 - this.getHoles())
    for (let i = 0; i < n; i++) {
      let arr = this.threadingColours[this.getHoles() - 1].slice()
      this.threadingColours.push(arr)
    }
  }

  removeHoles(num: number): void {
    this.threadingColours = this.threadingColours.slice(
      0,
      Math.max(this.getHoles() - num, 1)
    )
  }

  addTabletsRight(num: number): void {
    for (let i = 0; i < this.getPicks(); i++) {
      for (let j = 0; j < num; j++) {
        this.turning[i].push(this.turning[i][this.turning[i].length - 1])
      }
    }

    for (let j = 0; j < num; j++) {
      this.threading.push(this.threading[this.threading.length - 1])

      for (let i = 0; i < this.threadingColours.length; i++) {
        let elem = this.threadingColours[i][this.threadingColours[i].length - 1]
        this.threadingColours[i].push(elem)
      }
    }
  }

  removeTabletsRight(num: number): void {
    for (let i = 0; i < this.getPicks(); i++) {
      this.turning[i] = this.turning[i].slice(
        0,
        Math.max(this.turning[i].length - num, 1)
      )
    }
    for (let i = 0; i < this.getHoles(); i++) {
      this.threadingColours[i] = this.threadingColours[i].slice(
        0,
        Math.max(this.threadingColours[i].length - num, 1)
      )
    }
    this.threading = this.threading.slice(
      0,
      Math.max(this.threading.length - num, 1)
    )
  }

  addTabletsLeft(num: number): void {
    for (let i = 0; i < this.getPicks(); i++) {
      for (let j = 0; j < num; j++) {
        this.turning[i].unshift(this.turning[i][0])
      }
    }

    for (let j = 0; j < num; j++) {
      this.threading.unshift(this.threading[0])

      for (let i = 0; i < this.threadingColours.length; i++) {
        this.threadingColours[i].unshift(this.threadingColours[i][0])
      }
    }
  }

  removeTabletsLeft(num: number): void {
    for (let i = 0; i < this.getPicks(); i++) {
      this.turning[i] = this.turning[i].slice(
        Math.min(num, this.turning[i].length - 1),
        this.turning[i].length
      )
    }
    for (let i = 0; i < this.getHoles(); i++) {
      this.threadingColours[i] = this.threadingColours[i].slice(
        Math.min(num, this.threadingColours[i].length - 1),
        this.threadingColours[i].length
      )
    }
    this.threading = this.threading.slice(
      Math.min(num, this.threading.length - 1),
      this.threading.length
    )
  }

  getColor(colorIndex: number): Colour.Colour {
    if (!(colorIndex in this.palette)) {
      throw new Error('invalid index: ${colorIndex}')
    }
    return this.palette[colorIndex]
  }

  setColor(colorIndex: number, color: Colour.Colour): void {
    if (!(colorIndex in this.palette)) {
      throw new Error('invalid index: ${colorIndex}')
    }
    this.palette[colorIndex] = color
  }

  reverse(tablet: number, pick: number): void {
    for (let i = 0; i < this.getPicks() - pick; i++) {
      let a = this.turning[i][tablet]
      if (a == '\\') {
        this.turning[i][tablet] = '/'
      } else if (a == '/') {
        this.turning[i][tablet] = '\\'
      }
    }
  }

  setThreadColour(tablet: number, hole: number, colorIndex: number): void {
    if (colorIndex >= 0 && colorIndex < 10) {
      this.threadingColours[hole][tablet] = '' + colorIndex
    } else if (colorIndex == 10) {
      this.threadingColours[hole][tablet] = 'a'
    } else if (colorIndex == 11) {
      this.threadingColours[hole][tablet] = 'b'
    } else {
      this.threadingColours[hole][tablet] = ' '
    }
  }

  threadColour(tablet: number, hole: number): Colour.Colour | undefined {
    let c = this.threadingColours[hole][tablet]
    if (c != ' ') return this.palette[c]
    else return undefined
  }

  flip(tablet: number): void {
    if (this.threading[tablet] == 'S') {
      this.threading[tablet] = 'Z'
    } else {
      this.threading[tablet] = 'S'
    }

    this.reverse(tablet, 0)
  }

  threadCount(c: number): number {
    const counter = (filterValue: string) => {
      return this.threadingColours.reduce(
        (count, colours) =>
          count + colours.filter((x) => x == filterValue).length,
        0
      )
    }
    if (0 <= c && c < 10) {
      return counter('' + c)
    } else if (c == 10) {
      return counter('a')
    } else if (c == 11) {
      return counter('b')
    } else {
      return counter(' ')
    }
  }

  clearTurning(): void {
    for (let i = 0; i < this.getTablets(); i++) {
      let val = '\\'
      if (this.threading[i] == 'S') {
        val = '/'
      }
      for (let j = 0; j < this.getPicks(); j++) {
        this.turning[j][i] = val
      }
    }
  }

  describePick(num: number): string {
    let description = ''
    let direction = 'F'
    let n = 0

    for (let i = 0; i < this.getTablets(); i++) {
      let newDirection: string
      if (
        (this.turning[this.getPicks() - 1 - num][i] == '\\') ==
        (this.threading[i] == 'Z')
      ) {
        newDirection = 'F'
      } else {
        newDirection = 'B'
      }

      if (newDirection == direction) {
        n += 1
      } else {
        if (n >= 1) {
          description += '' + n + direction + ' '
        }
        direction = newDirection
        n = 1
      }
    }

    if (n >= 1) {
      description += '' + n + direction
    }

    return description
  }

  describeTablet(x: number, invertsz: boolean): string {
    return (
      ((this.threading[x] == 'S') != invertsz ? 'S' : 'Z') + ' threaded tablet'
    )
  }

  describeHole(x: number, y: number): string {
    const color = this.threadColour(x, y)
    if (color == undefined) {
      return 'Empty'
    } else {
      const name = getColorName(color.getCSSHexadecimalRGB).name
      return name + ' (' + color.getCSSHexadecimalRGB() + ')'
    }
  }

  fromString(raw: string): void {
    let lines = raw.split(/\r?\n/)

    // Read the header
    let match = lines.shift().match(/^#\s*tdd\s+v(\d+)\.(\d+)\s*$/)
    if (!match) throw 'Not a valid tdd file'

    if (
      parseInt(match[1]) > 1 ||
      (parseInt(match[1]) == 1 && parseInt(match[2]) > 0)
    ) {
      console.log(
        'WARNING: Processing tdd file from future version of tdd. This may not work.'
      )
    }

    match = lines.shift().match(/^#\s*(.+)\s*$/)
    if (match) {
      this.name = match[1]
    }

    // Discard empty lines
    let line = lines.shift()
    while (line.match(/^(#.*)?\s*$/)) {
      line = lines.shift()
    }

    // Read the turning diagram
    this.turning = []
    while (!line.match(/^\s*$/)) {
      let row = []
      for (let c of line) {
        if (c == '\\') {
          row.push('\\')
        } else {
          row.push('/')
        }
      }
      this.turning.push(row)
      line = lines.shift()
    }

    // Discard empty lines
    line = lines.shift()
    while (line.match(/^(#.*)?$/)) {
      line = lines.shift()
    }

    // Read the threading diagram
    this.threadingColours = []
    while (!line.match(/^$/)) {
      if (line.match(/^[SZ]+$/)) {
        this.threading = []
        for (let c of line) {
          this.threading.push(c)
        }
      } else {
        let row = []
        for (let c of line) {
          row.push(c)
        }
        this.threadingColours.push(row)
      }

      line = lines.shift()
    }

    // Discard empty lines
    line = lines.shift()
    while (line.match(/^(#.*)?\s*$/)) {
      line = lines.shift()
    }

    // Read the palette
    while (true) {
      let match = line.match(
        /^\s*(\w)\s*-\s*#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})\s*$/
      )
      if (!match) {
        break
      }

      this.palette[match[1]] = new Colour.RGBColour(
        parseInt(match[2], 16),
        parseInt(match[3], 16),
        parseInt(match[4], 16)
      )

      line = lines.shift()
    }
  }

  toString(): string {
    let rawString = '# tdd v1.0\n'
    rawString += '# ' + this.name + '\n'
    rawString += '\n'

    this.turning.forEach((row) => {
      row.forEach((col) => {
        rawString += col
      })
      rawString += '\n'
    })
    rawString += '\n'

    this.threadingColours.forEach((row) => {
      row.forEach((col) => {
        rawString += col
      })
      rawString += '\n'
    })

    this.threading.forEach((col) => {
      rawString += col
    })
    rawString += '\n\n'

    Object.entries(this.palette).forEach(([key, value]) => {
      rawString += key + ' - '
      rawString += value.getCSSHexadecimalRGB()
      rawString += '\n'
    })

    return rawString
  }
}

function TDDDraftFromString(raw: string): TDDDraft {
  let draft = new TDDDraft()
  draft.fromString(raw)
  return draft
}
