import { getColorName, initColors, ORIGINAL_COLORS } from 'ntc-ts'
import { draft, getDraft, getFGCol, repeat, view } from './main'
import { getValue, isChecked, setValue } from './util'
import $ from 'jquery'

export { redraw, redrawControls }

function redraw(): void {
  console.log('enter REDRAW')
  let scale = Math.pow(2, getValue('#scalecontrols .readout') / 10)
  let rscale = Math.pow(2, getValue('#rscalecontrols .readout') / 10)

  view.conform(draft)
  if (isChecked('#showrepeats')) {
    repeat.conform(draft)
  }

  let svgElement = document.querySelector('#draftcanvas svg')
  let mainSection = document.querySelector('#mainsection')
  // Berechnung der Bounding Box erneut, nach Skalierung
  let bbox = svgElement.getBoundingClientRect()

  // Setze neue Breite und Höhe des SVGs
  svgElement.setAttribute('width', (bbox.width * scale).toString())
  svgElement.setAttribute('height', (bbox.height * scale).toString())

  // Position des `mainsection` Elements relativ zum Dokument
  let mainSectionBbox = mainSection.getBoundingClientRect()
  let mainSectionTop = mainSectionBbox.top + window.scrollY
  let mainSectionLeft = mainSectionBbox.left + window.scrollX

  // Berechnung der neuen Position
  let bot = mainSectionTop + bbox.height * scale
  let right = mainSectionLeft + bbox.width * scale

  console.log('Bot:', bot, 'Right:', right)

  for (let i = 0; i <= 12; i++) {
    $('#NUM' + i).text(getDraft().threadCount(i - 1))
  }

  if (isChecked('#showrepeats')) {
    $('#repeatsection').show()
    $('#repeatsection').css('left', right + 10)
  } else {
    $('#repeatsection').hide()
  }

  $('#threadinginstructions').text('')

  if (isChecked('#showtext')) {
    let invertsz = isChecked('#invertsz')
    for (let i = 0; i < getDraft().getTablets(); i++) {
      $('#threadinginstructions').append(
        '<li class="instruction">' +
          getDraft().describeTablet(i, invertsz) +
          ' (' +
          (isChecked('#labelholescw') ? '&#x21BB;' : '&#x21BA;') +
          ')</li>'
      )
      $('#threadinginstructions li').last().append('<ol type="A"></ol>')
      let ol = $('#threadinginstructions li').last().children().last()
      for (let j = 0; j < getDraft().getHoles(); j++) {
        if (isChecked('#labelholescw')) {
          if (
            getValue('#showhruler') &&
            getValue('#hruler .readout') == -j - 1
          ) {
            ol.append(
              '<li><b>' + getDraft().describeHole(i, j) + ' (selected)</b></li>'
            )
          } else {
            ol.append('<li>' + getDraft().describeHole(i, j) + '</li>')
          }
        } else {
          if (
            getValue('#showhruler') &&
            getValue('#hruler .readout') == j - getDraft().getHoles()
          ) {
            ol.append(
              '<li><b>' +
                getDraft().describeHole(i, getDraft().getHoles() - j - 1) +
                ' (selected)</b></li>'
            )
          } else {
            ol.append(
              '<li>' +
                getDraft().describeHole(i, getDraft().getHoles() - j - 1) +
                '</li>'
            )
          }
        }
      }
    }

    $('#turninginstructions').text('')
    for (let i = 0; i < getDraft().getPicks(); i++) {
      if (getValue('#showhruler') && getValue('#hruler .readout') == i + 1) {
        $('#turninginstructions').append(
          '<li class="instruction"><b>' +
            getDraft().describePick(i) +
            ' (selected)</b></li>'
        )
      } else {
        $('#turninginstructions').append(
          '<li class="instruction">' + getDraft().describePick(i) + '</li>'
        )
      }
    }

    $('#textinstructions').show()
    $('#textinstructions').css('top', bot + 10)
    $('#textinstructions').css('min-width', bbox.width - 10)

    bot =
      $('#textinstructions').position().top +
      $('#textinstructions').height() +
      10
  } else {
    $('#textinstructions').hide()
  }

  if (isChecked('#showrepeats')) {
    bbox = $('#repeatcanvas svg')[0].getBoundingClientRect()

    $('#repeatcanvas svg').width(bbox.width * rscale)
    $('#repeatcanvas svg').height(bbox.height * rscale)

    if ($('#repeatsection').position().top + bbox.height * rscale > bot) {
      bot = $('#repeatsection').position().top + bbox.height * rscale
    }
  }

  $('#copyright').css('position', 'absolute')
  $('#copyright').css('top', bot + 10)
  $('#copyright').css('botton', undefined)
  console.log('EXIT REDRAW')
}

function redrawControls(): void {
  const fgcol = getFGCol()
  if (fgcol == -1) {
    $('#EMPTYBOX').addClass('selected')
  } else {
    $('#EMPTYBOX').removeClass('selected')
  }

  for (let i = 0; i < 12; i++) {
    $('#BOX' + (i + 1)).css(
      'background-color',
      getDraft().getColor(i).getCSSHexadecimalRGB()
    )
    if (fgcol != i) {
      $('#BOX' + (i + 1)).removeClass('selected')
    } else {
      $('#BOX' + (i + 1)).addClass('selected')
    }
  }

  if (getFGCol() != -1) {
    initColors(ORIGINAL_COLORS)
    let color = getDraft().getColor(fgcol).getIntegerRGB()
    setValue('#REDVAL', color.r)
    setValue('#REDSLIDE', color.r)
    setValue('#GREENVAL', color.g)
    setValue('#GREENSLIDE', color.g)
    setValue('#BLUEVAL', color.b)
    setValue('#BLUESLIDE', color.b)

    $('#REDVAL').prop('disabled', false)
    $('#GREENVAL').prop('disabled', false)
    $('#BLUEVAL').prop('disabled', false)
    $('#REDSLIDE').prop('disabled', false)
    $('#GREENSLIDE').prop('disabled', false)
    $('#BLUESLIDE').prop('disabled', false)
    $('#colourname').text(
      getColorName(getDraft().getColor(fgcol).getCSSHexadecimalRGB()).name
    )
  } else {
    setValue('#REDVAL', 0)
    setValue('#REDSLIDE', 0)
    setValue('#GREENVAL', 0)
    setValue('#GREENSLIDE', 0)
    setValue('#BLUEVAL', 0)
    setValue('#BLUESLIDE', 0)

    $('#REDVAL').prop('disabled', true)
    $('#GREENVAL').prop('disabled', true)
    $('#BLUEVAL').prop('disabled', true)
    $('#REDSLIDE').prop('disabled', true)
    $('#GREENSLIDE').prop('disabled', true)
    $('#BLUESLIDE').prop('disabled', true)

    $('#colourname').text('')
  }
}
