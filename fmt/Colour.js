//code.iamkate.com
function Colour() {
  this.getIntegerRGB = function () {
    var a = this.getRGB()
    return {
      r: Math.round(a.r),
      g: Math.round(a.g),
      b: Math.round(a.b),
      a: a.a,
    }
  }
  this.getPercentageRGB = function () {
    var a = this.getRGB()
    return {
      r: (100 * a.r) / 255,
      g: (100 * a.g) / 255,
      b: (100 * a.b) / 255,
      a: a.a,
    }
  }
  this.getCSSHexadecimalRGB = function () {
    var a = this.getIntegerRGB(),
      h = a.r.toString(16),
      k = a.g.toString(16),
      a = a.b.toString(16)
    return (
      '#' +
      (2 == h.length ? h : '0' + h) +
      (2 == k.length ? k : '0' + k) +
      (2 == a.length ? a : '0' + a)
    )
  }
  this.getCSSIntegerRGB = function () {
    var a = this.getIntegerRGB()
    return 'rgb(' + a.r + ',' + a.g + ',' + a.b + ')'
  }
  this.getCSSIntegerRGBA = function () {
    var a = this.getIntegerRGB()
    return 'rgba(' + a.r + ',' + a.g + ',' + a.b + ',' + a.a + ')'
  }
  this.getCSSPercentageRGB = function () {
    var a = this.getPercentageRGB()
    return 'rgb(' + a.r + '%,' + a.g + '%,' + a.b + '%)'
  }
  this.getCSSPercentageRGBA = function () {
    var a = this.getPercentageRGB()
    return 'rgba(' + a.r + '%,' + a.g + '%,' + a.b + '%,' + a.a + ')'
  }
  this.getCSSHSL = function () {
    var a = this.getHSL()
    return 'hsl(' + a.h + ',' + a.s + '%,' + a.l + '%)'
  }
  this.getCSSHSLA = function () {
    var a = this.getHSL()
    return 'hsla(' + a.h + ',' + a.s + '%,' + a.l + '%,' + a.a + ')'
  }
  this.setNodeColour = function (a) {
    a.style.color = this.getCSSHexadecimalRGB()
  }
  this.setNodeBackgroundColour = function (a) {
    a.style.backgroundColor = this.getCSSHexadecimalRGB()
  }
}
RGBColour.prototype = new Colour()
function RGBColour(a, h, k, n) {
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
HSVColour.prototype = new Colour()
function HSVColour(a, h, k, n) {
  var m = void 0 === n ? 1 : Math.max(0, Math.min(1, n)),
    l = ((a % 360) + 360) % 360,
    c = Math.max(0, Math.min(100, h)),
    b = Math.max(0, Math.min(100, k)),
    d = null,
    e = null
  this.getRGB = function () {
    if (null == d) {
      if (0 == c)
        var a = b,
          f = b,
          g = b
      else {
        var e = l / 60 - Math.floor(l / 60),
          h = b * (1 - c / 100),
          k = b * (1 - (c / 100) * e),
          e = b * (1 - (c / 100) * (1 - e))
        switch (Math.floor(l / 60)) {
          case 0:
            a = b
            f = e
            g = h
            break
          case 1:
            a = k
            f = b
            g = h
            break
          case 2:
            a = h
            f = b
            g = e
            break
          case 3:
            a = h
            f = k
            g = b
            break
          case 4:
            a = e
            f = h
            g = b
            break
          case 5:
            ;(a = b), (f = h), (g = k)
        }
      }
      d = { r: 2.55 * a, g: 2.55 * f, b: 2.55 * g }
    }
    return { r: d.r, g: d.g, b: d.b, a: m }
  }
  this.getHSV = function () {
    return { h: l, s: c, v: b, a: m }
  }
  this.getHSL = function () {
    if (null == e) {
      var a = ((2 - c / 100) * b) / 2
      e = { h: l, s: (c * b) / (50 > a ? 2 * a : 200 - 2 * a), l: a }
      isNaN(e.s) && (e.s = 0)
    }
    return { h: e.h, s: e.s, l: e.l, a: m }
  }
}
HSLColour.prototype = new Colour()
function HSLColour(a, h, k, n) {
  var m = void 0 === n ? 1 : Math.max(0, Math.min(1, n)),
    l = ((a % 360) + 360) % 360,
    c = Math.max(0, Math.min(100, h)),
    b = Math.max(0, Math.min(100, k)),
    d = null,
    e = null
  this.getRGB = function () {
    if (null == d)
      if (0 == c) d = { r: 2.55 * b, g: 2.55 * b, b: 2.55 * b }
      else {
        var e = 50 > b ? b * (1 + c / 100) : b + c - (b * c) / 100,
          f = 2 * b - e
        d = {
          r: ((a + 120) / 60) % 6,
          g: a / 60,
          b: ((a + 240) / 60) % 6,
        }
        for (var g in d)
          d.hasOwnProperty(g) &&
            ((d[g] =
              1 > d[g]
                ? f + (e - f) * d[g]
                : 3 > d[g]
                  ? e
                  : 4 > d[g]
                    ? f + (e - f) * (4 - d[g])
                    : f),
            (d[g] *= 2.55))
      }
    return { r: d.r, g: d.g, b: d.b, a: m }
  }
  this.getHSV = function () {
    if (null == e) {
      var a = (c * (50 > b ? b : 100 - b)) / 100
      e = { h: l, s: (200 * a) / (b + a), v: a + b }
      isNaN(e.s) && (e.s = 0)
    }
    return { h: e.h, s: e.s, v: e.v, a: m }
  }
  this.getHSL = function () {
    return { h: l, s: c, l: b, a: m }
  }
}
