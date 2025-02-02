//code.iamkate.com
export { Colour, HSL, HSV, RGB, RGBColour, HSLColour, HSVColour }

//
// Static Descriptions of different colour spaces
//
type HSL = {
  h: number
  s: number
  l: number
  a: number
}

type HSV = {
  h: number
  s: number
  v: number
  a: number
}

type RGB = {
  r: number
  g: number
  b: number
  a: number
}

//
// Dynamic Handeling & Converting between Color Spaces
//

class Colour {
  getHSL: () => HSL
  getRGB: () => RGB
  getHSV: () => HSV

  getIntegerRGB() {
    let a = this.getRGB()
    return {
      r: Math.round(a.r),
      g: Math.round(a.g),
      b: Math.round(a.b),
      a: a.a,
    }
  }
  getPercentageRGB() {
    let a = this.getRGB()
    return {
      r: (100 * a.r) / 255,
      g: (100 * a.g) / 255,
      b: (100 * a.b) / 255,
      a: a.a,
    }
  }

  getCSSHexadecimalRGB() {
    let a = this.getIntegerRGB()
    let r = a.r.toString(16)
    let g = a.g.toString(16)
    let b = a.b.toString(16)
    return (
      '#' +
      (2 == r.length ? r : '0' + r) +
      (2 == g.length ? g : '0' + g) +
      (2 == b.length ? b : '0' + b)
    )
  }

  getCSSIntegerRGB() {
    let a = this.getIntegerRGB()
    return 'rgb(' + a.r + ',' + a.g + ',' + a.b + ')'
  }
  getCSSIntegerRGBA() {
    let a = this.getIntegerRGB()
    return 'rgba(' + a.r + ',' + a.g + ',' + a.b + ',' + a.a + ')'
  }
  getCSSPercentageRGB() {
    let a = this.getPercentageRGB()
    return 'rgb(' + a.r + '%,' + a.g + '%,' + a.b + '%)'
  }
  getCSSPercentageRGBA() {
    let a = this.getPercentageRGB()
    return 'rgba(' + a.r + '%,' + a.g + '%,' + a.b + '%,' + a.a + ')'
  }
  getCSSHSL() {
    let a = this.getHSL()
    return 'hsl(' + a.h + ',' + a.s + '%,' + a.l + '%)'
  }
  getCSSHSLA() {
    let a = this.getHSL()
    return 'hsla(' + a.h + ',' + a.s + '%,' + a.l + '%,' + a.a + ')'
  }
  setNodeColour(a) {
    a.style.color = this.getCSSHexadecimalRGB()
  }
  setNodeBackgroundColour(a) {
    a.style.backgroundColor = this.getCSSHexadecimalRGB()
  }
}

class RGBColour extends Colour {
  constructor(a: number, h: number, k: number, n?: number) {
    super()
    function m(a: number, b: number): number {
      let d: number
      if (0 == b) {
        d = 0
      } else
        switch (a) {
          case color.r:
            d = ((color.g - color.b) / b) * 60
            0 > d && (d += 360)
            break
          case color.g:
            d = ((color.b - color.r) / b) * 60 + 120
            break
          case color.b:
            d = ((color.r - color.g) / b) * 60 + 240
        }
      return d
    }
    let l = void 0 === n ? 1 : Math.max(0, Math.min(1, n))
    let color = {
      r: Math.max(0, Math.min(255, a)),
      g: Math.max(0, Math.min(255, h)),
      b: Math.max(0, Math.min(255, k)),
    }
    let b = null
    let d = null

    this.getRGB = function (): RGB {
      return { r: color.r, g: color.g, b: color.b, a: l }
    }
    this.getHSV = function (): HSV {
      if (null == b) {
        let a = Math.max(color.r, color.g, color.b),
          d = a - Math.min(color.r, color.g, color.b)
        b = { h: m(a, d), s: 0 == a ? 0 : (100 * d) / a, v: a / 2.55 }
      }
      return { h: b.h, s: b.s, v: b.v, a: l }
    }
    this.getHSL = function (): HSL {
      if (null == d) {
        let a = Math.max(color.r, color.g, color.b),
          b = a - Math.min(color.r, color.g, color.b),
          f = a / 255 - b / 510
        d = {
          h: m(a, b),
          s: 0 == b ? 0 : b / 2.55 / (0.5 > f ? 2 * f : 2 - 2 * f),
          l: 100 * f,
        }
      }
      return { h: d.h, s: d.s, l: d.l, a: l }
    }
  }
}

class HSVColour extends Colour {
  m: number
  l: number
  c: number
  b: number
  d: number
  e: number

  constructor(a: number, h: number, k: number, n?: number) {
    super()
    this.m = void 0 === n ? 1 : Math.max(0, Math.min(1, n))
    this.l = ((a % 360) + 360) % 360
    this.c = Math.max(0, Math.min(100, h))
    this.b = Math.max(0, Math.min(100, k))
    this.d = null
    this.e = null
  }

  getRGB = function (): RGB {
    if (null == this.d) {
      let a: number, f: number, g: number, e: number, h: number, k: number
      if (0 == this.c) {
        a = this.b
        f = this.b
        g = this.b
      } else {
        e = this.l / 60 - Math.floor(this.l / 60)
        h = this.b * (1 - this.c / 100)
        k = this.b * (1 - (this.c / 100) * e)
        e = this.b * (1 - (this.c / 100) * (1 - e))

        switch (Math.floor(this.l / 60)) {
          case 0:
            a = this.b
            f = e
            g = h
            break
          case 1:
            a = k
            f = this.b
            g = h
            break
          case 2:
            a = h
            f = this.b
            g = e
            break
          case 3:
            a = h
            f = k
            g = this.b
            break
          case 4:
            a = e
            f = h
            g = this.b
            break
          case 5:
            ;(a = this.b), (f = h), (g = k)
        }
      }
      this.d = { r: 2.55 * a, g: 2.55 * f, b: 2.55 * g }
    }
    return { r: this.d.r, g: this.d.g, b: this.d.b, a: this.m }
  }
  getHSV = function (): HSV {
    return { h: this.l, s: this.c, v: this.b, a: this.m }
  }

  getHSL = function (): HSL {
    if (null == this.e) {
      let a = ((2 - this.c / 100) * this.b) / 2
      this.e = {
        h: this.l,
        s: (this.c * this.b) / (50 > a ? 2 * a : 200 - 2 * a),
        l: a,
      }
      isNaN(this.e.s) && (this.e.s = 0)
    }
    return { h: this.e.h, s: this.e.s, l: this.e.l, a: this.m }
  }
}

class HSLColour extends Colour {
  m: any
  l: any
  c: any
  b: any
  d: any
  e: any

  constructor(a: any, h: any, k: any, n: any) {
    super()
    this.m = void 0 === n ? 1 : Math.max(0, Math.min(1, n))
    this.l = ((a % 360) + 360) % 360
    this.c = Math.max(0, Math.min(100, h))
    this.b = Math.max(0, Math.min(100, k))
    this.d = null
    this.e = null
  }

  getRGB = function (): RGB {
    if (this.d == null)
      if (0 == this.c) {
        this.d = { r: 2.55 * this.b, g: 2.55 * this.b, b: 2.55 * this.b }
      } else {
        let e =
          50 > this.b
            ? this.b * (1 + this.c / 100)
            : this.b + this.c - (this.b * this.c) / 100
        let f = 2 * this.b - e
        this.d = {
          r: ((this.a + 120) / 60) % 6,
          g: this.a / 60,
          b: ((this.a + 240) / 60) % 6,
        }
        for (let g in this.d)
          this.d.hasOwnProperty(g) &&
            ((this.d[g] =
              1 > this.d[g]
                ? f + (e - f) * this.d[g]
                : 3 > this.d[g]
                  ? e
                  : 4 > this.d[g]
                    ? f + (e - f) * (4 - this.d[g])
                    : f),
            (this.d[g] *= 2.55))
      }
    return { r: this.d.r, g: this.d.g, b: this.d.b, a: this.m }
  }

  getHSV = function (): HSV {
    if (this.e == null) {
      let a = (this.c * (50 > this.b ? this.b : 100 - this.b)) / 100
      this.e = { h: this.l, s: (200 * a) / (this.b + a), v: a + this.b }
      isNaN(this.e.s) && (this.e.s = 0)
    }
    return { h: this.e.h, s: this.e.s, v: this.e.v, a: this.m }
  }

  getHSL = function (): HSL {
    return { h: this.l, s: this.c, l: this.b, a: this.m }
  }
}
