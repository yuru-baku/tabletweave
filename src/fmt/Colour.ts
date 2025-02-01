//code.iamkate.com
export { Colour, RGBColour, HSLColour, HSVColour }

class Colour {
  getHSL: any
  getRGB: any
  getHSV: any

  getIntegerRGB() {
    var a = this.getRGB()
    return {
      r: Math.round(a.r),
      g: Math.round(a.g),
      b: Math.round(a.b),
      a: a.a,
    }
  }
  getPercentageRGB() {
    var a = this.getRGB()
    return {
      r: (100 * a.r) / 255,
      g: (100 * a.g) / 255,
      b: (100 * a.b) / 255,
      a: a.a,
    }
  }

  getCSSHexadecimalRGB() {
    var a = this.getIntegerRGB()
    var r = a.r.toString(16)
    var g = a.g.toString(16)
    var b = a.b.toString(16)
    return (
      '#' +
      (2 == r.length ? r : '0' + r) +
      (2 == g.length ? g : '0' + g) +
      (2 == b.length ? b : '0' + b)
    )
  }

  getCSSIntegerRGB() {
    var a = this.getIntegerRGB()
    return 'rgb(' + a.r + ',' + a.g + ',' + a.b + ')'
  }
  getCSSIntegerRGBA() {
    var a = this.getIntegerRGB()
    return 'rgba(' + a.r + ',' + a.g + ',' + a.b + ',' + a.a + ')'
  }
  getCSSPercentageRGB() {
    var a = this.getPercentageRGB()
    return 'rgb(' + a.r + '%,' + a.g + '%,' + a.b + '%)'
  }
  getCSSPercentageRGBA() {
    var a = this.getPercentageRGB()
    return 'rgba(' + a.r + '%,' + a.g + '%,' + a.b + '%,' + a.a + ')'
  }
  getCSSHSL() {
    var a = this.getHSL()
    return 'hsl(' + a.h + ',' + a.s + '%,' + a.l + '%)'
  }
  getCSSHSLA() {
    var a = this.getHSL()
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
    function m(a, b) {
      if (0 == b) var d = 0
      else
        switch (a) {
          case c.r:
            d = ((c.g - c.b) / b) * 60
            0 > d && (d += 360)
            break
          case c.g:
            d = ((c.b - c.r) / b) * 60 + 120
            break
          case c.b:
            d = ((c.r - c.g) / b) * 60 + 240
        }
      return d
    }
    var l = void 0 === n ? 1 : Math.max(0, Math.min(1, n)),
      c = {
        r: Math.max(0, Math.min(255, a)),
        g: Math.max(0, Math.min(255, h)),
        b: Math.max(0, Math.min(255, k)),
      },
      b = null,
      d = null
    this.getRGB = function () {
      return { r: c.r, g: c.g, b: c.b, a: l }
    }
    this.getHSV = function () {
      if (null == b) {
        var a = Math.max(c.r, c.g, c.b),
          d = a - Math.min(c.r, c.g, c.b)
        b = { h: m(a, d), s: 0 == a ? 0 : (100 * d) / a, v: a / 2.55 }
      }
      return { h: b.h, s: b.s, v: b.v, a: l }
    }
    this.getHSL = function () {
      if (null == d) {
        var a = Math.max(c.r, c.g, c.b),
          b = a - Math.min(c.r, c.g, c.b),
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

  getRGB = function () {
    if (null == this.d) {
      if (0 == this.c) {
        var a = this.b
        var f = this.b
        var g = this.b
      } else {
        var e = this.l / 60 - Math.floor(this.l / 60)
        var h = this.b * (1 - this.c / 100)
        var k = this.b * (1 - (this.c / 100) * e)
        var e = this.b * (1 - (this.c / 100) * (1 - e))

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
  getHSV = function () {
    return { h: this.l, s: this.c, v: this.b, a: this.m }
  }

  getHSL = function () {
    if (null == this.e) {
      var a = ((2 - this.c / 100) * this.b) / 2
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

  getRGB = function () {
    if (this.d == null)
      if (0 == this.c) {
        this.d = { r: 2.55 * this.b, g: 2.55 * this.b, b: 2.55 * this.b }
      } else {
        var e =
          50 > this.b
            ? this.b * (1 + this.c / 100)
            : this.b + this.c - (this.b * this.c) / 100
        var f = 2 * this.b - e
        this.d = {
          r: ((this.a + 120) / 60) % 6,
          g: this.a / 60,
          b: ((this.a + 240) / 60) % 6,
        }
        for (var g in this.d)
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

  getHSV = function () {
    if (this.e == null) {
      var a = (this.c * (50 > this.b ? this.b : 100 - this.b)) / 100
      this.e = { h: this.l, s: (200 * a) / (this.b + a), v: a + this.b }
      isNaN(this.e.s) && (this.e.s = 0)
    }
    return { h: this.e.h, s: this.e.s, v: this.e.v, a: this.m }
  }

  getHSL = function () {
    return { h: this.l, s: this.c, l: this.b, a: this.m }
  }
}
