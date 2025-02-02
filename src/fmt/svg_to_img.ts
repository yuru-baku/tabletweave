/* This script contains a function that can convert a tdd structure to a data URL */
export {
  svg_to_blob,
  svg_to_url,
  svg_to_img,
  svg_to_img_blob,
  draw_svg_to_canvas,
}

function svg_to_blob(svg): Blob {
  let data = new XMLSerializer().serializeToString(svg)
  if (navigator.userAgent.indexOf('AppleWebKit') != -1) {
    return new Blob([data], { type: 'image/svg+xml' })
  } else {
    return new Blob([data], { type: 'image/svg+xml;charset=utf-8' })
  }
}

function svg_to_url(svg): string {
  return URL.createObjectURL(svg_to_blob(svg))
}

function draw_svg_to_canvas(
  svg,
  canvas: HTMLCanvasElement,
  onload = function () {}
): void {
  let context = canvas.getContext('2d')
  context.clearRect(0, 0, canvas.width, canvas.height)

  let img = new Image()
  img.onload = function () {
    const height = svg.clientHeight * (canvas.width / svg.clientWidth)
    canvas.height = height
    context.drawImage(img, 0, 0, canvas.width, height)
    onload()
  }
  img.src = svg_to_url(svg)
}

function svg_to_img(
  svg,
  mimetype,
  width = 1920,
  onload = function (url: string) {}
): void {
  let canvas = document.createElement('canvas')
  canvas.width = width
  draw_svg_to_canvas(svg, canvas, function () {
    let url = canvas.toDataURL(mimetype, 1.0)
    onload(url)
  })
}

function svg_to_img_blob(
  svg,
  mimetype,
  width = 1920,
  onload = function (blob: Blob) {}
): void {
  let canvas = document.createElement('canvas')
  canvas.width = width
  draw_svg_to_canvas(svg, canvas, function () {
    canvas.toBlob(onload, mimetype, 1.0)
  })
}
