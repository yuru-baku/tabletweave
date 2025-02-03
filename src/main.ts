// The main script for the draft designer
import '../sass_style/style.scss'
import { saveAs } from 'file-saver'
import { svg_to_blob, svg_to_img } from './fmt/svg_to_img'
import { TDDDraft, TDDDraftFromString } from './fmt/tdd'
import { TDDSVGView } from './fmt/TDDSVGView'
import { RGBColour } from './fmt/Colour'
import { json_to_tdd } from './fmt/json_to_tdd'
import $ from 'jquery'

let draft = new TDDDraft()
let view = new TDDSVGView()
let repeat = new TDDSVGView()
let fgcol = -1

function control_vals() {
  let accordion = {}
  $('.accordion').each(function () {
    let id = $(this).parent().attr('id')
    let active = $(this).hasClass('active')
    accordion[id] = active
  })

  return {
    addright: isChecked('#addright'),
    lockdraft: isChecked('#lockdraft'),
    fgcol: fgcol,
    scale: getValue('#scalecontrols .readout'),
    rscale: getValue('#rscalecontrols .readout'),
    showtext: isChecked('#showtext'),
    showgrid: isChecked('#showgrid'),
    showovals: isChecked('#showovals'),
    showsquares: isChecked('#showsquares'),
    showtwist: isChecked('#showtwist'),
    showupper: isChecked('#showupper'),
    showlower: isChecked('#showlower'),
    showreversal: isChecked('#showreversal'),
    labelholescw: isChecked('#labelholescw'),
    invertsz: isChecked('#invertsz'),
    grey_saturation: isChecked('#GREYSLIDER'),
    showhruler: isChecked('#showhruler'),
    showvruler: isChecked('#showvruler'),
    hruler: getValue('#hruler .readout'),
    vruler: getValue('#vruler .readout'),
    export_width: getValue('#export_width'),
    showrepeats: isChecked('#showrepeats'),
    repeatstart: getValue('#repeatstart .readout'),
    repeatend: getValue('#repeatend .readout'),
    numrepeats: getValue('#numrepeats .readout'),
    accordion: accordion,
  }
}

/**
 *
 * @param htmlQuery Query for the CheckBox to be queried
 * @returns weather the CheckBox is checked.
 */
function isChecked(htmlQuery: string): boolean {
  const element = document.querySelector(htmlQuery) as HTMLInputElement
  return element.checked
}

/**
 *
 * @param htmlQuery Query for the CheckBox to be queried
 * @returns weather the CheckBox is checked.
 */
function setChecked(htmlQuery: string, isChecked: boolean): void {
  let element = document.querySelector(htmlQuery) as HTMLInputElement
  element.checked = isChecked
}

/**
 *
 * @param htmlQuery Query for the Input to be queried
 * @returns value of the input.
 */
function getValue(htmlQuery: string): any {
  const element = document.querySelector(htmlQuery)
  return (element as HTMLInputElement)?.value
}

function setValue(htmlQuery: string, value: any): void {
  let element = document.querySelector(htmlQuery) as HTMLInputElement
  element.value = value
}

function saveToLocal(): void {
  localStorage.setItem('tdd-controls', JSON.stringify(control_vals()))
  localStorage.setItem('tdd-draft', draft.toString())
}

function loadFromLocal(): void {
  let local_controls = localStorage.getItem('tdd-controls')
  let local_draft = localStorage.getItem('tdd-draft')

  let controls = local_controls != undefined ? JSON.parse(local_controls) : {}

  fgcol = controls.fgcol != undefined ? controls.fgcol : -1

  setValue(
    '#scalecontrols .readout',
    controls.scale != undefined ? controls.scale : 0
  )
  setValue(
    '#rscalecontrols .readout',
    controls.rscale != undefined ? controls.rscale : 0
  )
  setChecked(
    '#addright',
    controls.addright != undefined ? controls.addright : true
  )
  setChecked(
    '#lockdraft',
    controls.lockdraft != undefined ? controls.lockdraft : false
  )
  setChecked(
    '#showovals',
    controls.showovals != undefined ? controls.showovals : true
  )
  setChecked(
    '#showsquares',
    controls.showsquares != undefined ? controls.showsquares : false
  )
  setChecked(
    '#showtwist',
    controls.showtwist != undefined ? controls.showtwist : true
  )
  setChecked(
    '#showtext',
    controls.showtext != undefined ? controls.showtext : false
  )
  setChecked(
    '#showgrid',
    controls.showgrid != undefined ? controls.showgrid : true
  )
  setChecked(
    '#showupper',
    controls.showupper != undefined ? controls.showupper : true
  )
  setChecked(
    '#showlower',
    controls.showlower != undefined ? controls.showlower : true
  )
  setChecked(
    '#showreversal',
    controls.showreversal != undefined ? controls.showreversal : true
  )
  setValue(
    '#GREYSLIDER',
    controls.grey_saturation != undefined ? controls.grey_saturation : 144
  )
  setChecked(
    '#labelholescw',
    controls.labelholescw != undefined ? controls.labelholescw : true
  )
  setChecked(
    '#invertsz',
    controls.invertsz != undefined ? controls.invertsz : false
  )
  setChecked(
    '#showhruler',
    controls.showhruler != undefined ? controls.showhruler : true
  )
  setChecked(
    '#showvruler',
    controls.showvruler != undefined ? controls.showvruler : true
  )
  setValue(
    '#hruler .readout',
    controls.hruler != undefined ? controls.hruler : 0
  )
  setValue(
    '#vruler .readout',
    controls.vruler != undefined ? controls.vruler : 0
  )
  setValue(
    '#export_width',
    controls.export_width != undefined ? controls.export_width : 1920
  )
  setChecked(
    '#showrepeats',
    controls.showrepeats != undefined ? controls.showrepeats : false
  )
  setValue(
    '#repeatstart .readout',
    controls.repeatstart != undefined ? controls.repeatstart : 1
  )
  setValue(
    '#repeatend .readout',
    controls.repeatend != undefined ? controls.repeatend : 1
  )
  setValue(
    '#numrepeats .readout',
    controls.numrepeats != undefined ? controls.numrepeats : 1
  )

  if (controls.accordion) {
    for (const [key, value] of Object.entries(controls.accordion)) {
      let but = $('#' + key + ' .accordion')
      if (value) {
        but.addClass('active')
      } else {
        but.removeClass('active')
      }
    }
  }

  if (local_draft != undefined) {
    draft = TDDDraftFromString(local_draft)
  }
}

function updateDraft(): void {
  let picks = getValue('#mainrowcontrols .readout')
  let holes = getValue('#lowrowcontrols .readout')
  let tablets = getValue('#colcontrols .readout')
  let addright = isChecked('#addright')

  if (picks < draft.picks()) {
    draft.removePicks(draft.picks() - picks)
  } else if (picks > draft.picks()) {
    draft.addPicks(picks - draft.picks())
  }

  if (holes < draft.holes()) {
    draft.removeHoles(draft.holes() - holes)
  } else if (holes > draft.holes()) {
    draft.addHoles(holes - draft.holes())
  }

  if (addright) {
    if (tablets < draft.tablets()) {
      draft.removeTabletsRight(draft.tablets() - tablets)
    } else if (tablets > draft.tablets()) {
      draft.addTabletsRight(tablets - draft.tablets())
    }
  } else {
    if (tablets < draft.tablets()) {
      draft.removeTabletsLeft(draft.tablets() - tablets)
    } else if (tablets > draft.tablets()) {
      draft.addTabletsLeft(tablets - draft.tablets())
    }
  }

  if (<number>getValue('#hruler .readout') > draft.picks() + 1) {
    setValue('#hruler .readout', draft.picks() + 1)
  } else if (<number>getValue('#hruler .readout') < -draft.holes()) {
    setValue('#hruler .readout', -draft.holes())
  }

  if (<number>getValue('#vruler .readout') > draft.tablets() + 1) {
    setValue('#vruler .readout', draft.tablets() + 1)
  }

  if (<number>getValue('#repeatstart .readout') > draft.picks()) {
    setValue('#repeatstart .readout', draft.picks())
  }

  if (<number>getValue('#repeatend .readout') > draft.picks()) {
    setValue('#repeatend .readout', draft.picks())
  }

  saveToLocal()
}

function redraw(): void {
  let scale = Math.pow(2, getValue('#scalecontrols .readout') / 10)
  let rscale = Math.pow(2, getValue('#rscalecontrols .readout') / 10)

  view.conform(draft)
  if (isChecked('#showrepeats')) {
    repeat.conform(draft)
  }

  let bbox = $('#draftcanvas svg')[0].getBoundingClientRect()
  $('#draftcanvas svg').width(bbox.width * scale)
  $('#draftcanvas svg').height(bbox.height * scale)

  let bot = $('#mainsection').position().top + bbox.height * scale
  let right = $('#mainsection').position().left + bbox.width * scale

  for (let i = 0; i <= 12; i++) {
    $('#NUM' + i).text(draft.threadCount(i - 1))
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
    for (let i = 0; i < draft.tablets(); i++) {
      $('#threadinginstructions').append(
        '<li class="instruction">' +
        draft.describeTablet(i, invertsz) +
        ' (' +
        (isChecked('#labelholescw') ? '&#x21BB;' : '&#x21BA;') +
        ')</li>'
      )
      $('#threadinginstructions li').last().append('<ol type="A"></ol>')
      let ol = $('#threadinginstructions li').last().children().last()
      for (let j = 0; j < draft.holes(); j++) {
        if (isChecked('#labelholescw')) {
          if (
            getValue('#showhruler') &&
            getValue('#hruler .readout') == -j - 1
          ) {
            ol.append(
              '<li><b>' + draft.describeHole(i, j) + ' (selected)</b></li>'
            )
          } else {
            ol.append('<li>' + draft.describeHole(i, j) + '</li>')
          }
        } else {
          if (
            getValue('#showhruler') &&
            getValue('#hruler .readout') == j - draft.holes()
          ) {
            ol.append(
              '<li><b>' +
              draft.describeHole(i, draft.holes() - j - 1) +
              ' (selected)</b></li>'
            )
          } else {
            ol.append(
              '<li>' + draft.describeHole(i, draft.holes() - j - 1) + '</li>'
            )
          }
        }
      }
    }

    $('#turninginstructions').text('')
    for (let i = 0; i < draft.picks(); i++) {
      if (getValue('#showhruler') && getValue('#hruler .readout') == i + 1) {
        $('#turninginstructions').append(
          '<li class="instruction"><b>' +
          draft.describePick(i) +
          ' (selected)</b></li>'
        )
      } else {
        $('#turninginstructions').append(
          '<li class="instruction">' + draft.describePick(i) + '</li>'
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
}

function redrawControls(): void {
  if (fgcol == -1) {
    $('#EMPTYBOX').addClass('selected')
  } else {
    $('#EMPTYBOX').removeClass('selected')
  }

  for (let i = 0; i < 12; i++) {
    $('#BOX' + (i + 1)).css(
      'background-color',
      draft.colour(i).getCSSHexadecimalRGB()
    )
    if (fgcol != i) {
      $('#BOX' + (i + 1)).removeClass('selected')
    } else {
      $('#BOX' + (i + 1)).addClass('selected')
    }
  }

  if (fgcol != -1) {
    let c = draft.colour(fgcol).getIntegerRGB()
    setValue('#REDVAL', c.r)
    setValue('#REDSLIDE', c.r)
    setValue('#GREENVAL', c.g)
    setValue('#GREENSLIDE', c.g)
    setValue('#BLUEVAL', c.b)
    setValue('#BLUESLIDE', c.b)

    $('#REDVAL').prop('disabled', false)
    $('#GREENVAL').prop('disabled', false)
    $('#BLUEVAL').prop('disabled', false)
    $('#REDSLIDE').prop('disabled', false)
    $('#GREENSLIDE').prop('disabled', false)
    $('#BLUESLIDE').prop('disabled', false)
    $('#colourname').text('BLURP')
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

function draftClick(e: MouseEvent): void {
  if (!isChecked('#lockdraft')) {
    const pt = this.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const svgP = pt.matrixTransform(this.getScreenCTM().inverse())
    let tablet = view.svg_coord_to_tablet(svgP.x, view, draft)
    let pick = view.svg_coord_to_pick(svgP.y, draft)
    let hole = view.svg_coord_to_hole(svgP.y, draft)

    if (tablet >= 0) {
      if (pick >= 0) {
        draft.reverse(tablet, pick)
      } else if (hole >= 0) {
        draft.setThreadColour(tablet, hole, fgcol)
      } else {
        draft.flip(tablet)
      }

      saveToLocal()
      redraw()
    }
  }
}

function setupNumberInput(
  id,
  min_val,
  max_val,
  callback,
  increment = 1,
  wrap = false
): void {
  let validate = function (new_val, min_val, max_val, inc = false) {
    if (typeof min_val == 'function') {
      min_val = min_val()
    }
    if (typeof max_val == 'function') {
      max_val = max_val()
    }
    if (!wrap) {
      if (min_val != undefined && new_val < min_val) {
        new_val = min_val
      } else if (max_val != undefined && new_val > max_val) {
        new_val = max_val
      }
    } else if (inc) {
      if (new_val > max_val) {
        new_val = 1
      }
    } else {
      let mod = max_val + 1 - min_val
      new_val = min_val + ((((new_val - min_val) % mod) + mod) % mod)
    }
    return new_val
  }
  document
    .getElementById('#' + id + ' .readout')
    ?.addEventListener('change', function () {
      let new_val = validate(
        Math.round(<number>getValue('#' + id + ' .readout') / increment) *
        increment,
        min_val,
        max_val
      )
      setValue('#' + id + ' .readout', new_val)
      callback()
    })
  document
    .getElementById('#' + id + ' .minus')
    ?.addEventListener('click', function () {
      let new_val = validate(
        (Math.round(<number>getValue('#' + id + ' .readout') / increment) - 1) *
        increment,
        min_val,
        max_val
      )
      setValue('#' + id + ' .readout', new_val)
      callback()
    })
  document
    .getElementById('#' + id + ' .plus')
    ?.addEventListener('click', function () {
      let new_val = validate(
        (Math.round(<number>getValue('#' + id + ' .readout') / increment) + 1) *
        increment,
        min_val,
        max_val,
        true
      )
      setValue('#' + id + ' .readout', new_val)
      callback()
    })

  setValue(
    '#' + id + ' .readout',
    validate(
      Math.round(<number>getValue('#' + id + ' .readout') / increment) *
      increment,
      min_val,
      max_val
    )
  )
}

function updateRed(red: number): void {
  const color = draft.colour(fgcol).getIntegerRGB()
  draft.setColour(fgcol, new RGBColour(red, color.g, color.b))
  saveToLocal()
}

function updateGreen(green: number): void {
  const color = draft.colour(fgcol).getIntegerRGB()
  draft.setColour(fgcol, new RGBColour(color.r, green, color.b))
  saveToLocal()
}

function updateBlue(blue: number): void {
  const color = draft.colour(fgcol).getIntegerRGB()
  draft.setColour(fgcol, new RGBColour(color.r, color.g, blue))
  saveToLocal()
}

function updateGrey(grey: number): void {
  if (grey > 0xff) { grey = 0xff; }
  if (grey < 0) { grey = 0; }
  view.greySaturation(0x100 - grey);
  setValue('#GREYSLIDER', grey);
  setValue('#GREYVAL', grey);
  saveToLocal();
}

function setControlsFromDraft(): void {
  setValue('#mainrowcontrols .readout', draft.picks())
  setValue('#lowrowcontrols .readout', draft.holes())
  setValue('#colcontrols .readout', draft.tablets())
  setValue('#draftname .readout', draft.name)

  if (<number>getValue('#hruler .readout') > (draft.picks() + 1)) {
    setValue('#hruler .readout', draft.picks() + 1);
  } else if (<number>getValue('#hruler .readout') < -draft.holes()) {
    setValue('#hruler .readout', -draft.holes());
  }
  view.hRuler(
    isChecked('#showhruler') ? getValue('#hruler .readout') : undefined
  );

  if (<number>getValue('#vruler .readout') > draft.tablets() + 1) {
    setValue('#vruler .readout', draft.tablets() + 1);
  }
  view.vRuler(
    isChecked('#showvruler') ? getValue('#vruler .readout') : undefined
  );

  if (<number>getValue('#repeatstart .readout') > draft.picks()) {
    setValue('#repeatstart .readout', draft.picks());
    repeat.startPick(draft.picks());
  }

  if (<number>getValue('#repeatend .readout') > draft.picks()) {
    setValue('#repeatend .readout', draft.picks());
    repeat.endPick(draft.picks());
  }
}

function loadFile() {
  let files = ($('#fileio #load')[0] as HTMLInputElement).files;
  if (files.length > 0) {
    let reader = new FileReader();

    reader.onload = (function (is_tdd) {
      return function (event) {
        try {
          let data = event.target.result;

          if (!is_tdd && (<string>data).substring(0, 5) === '# tdd') {
            is_tdd = true;
          }

          if (is_tdd) {
            draft = TDDDraftFromString(<string>data);
          } else {
            draft = json_to_tdd(JSON.parse(<string>data));
          }
        } catch (err) {
          alert('File is corrupted and could not be loaded.');
          return;
        }

        saveToLocal();
        setControlsFromDraft();
        redrawControls();
        redraw();
      }
    })(/^.*\.tdd(\.txt)?$/.test(files[0].name));

    reader.readAsText(files[0]);
  }
}

function saveFile() {
  try {
    let filename = '';
    if (draft.name != '') {
      filename = draft.name + '.tdd';
    } else {
      filename = 'draft.tdd';
    }
    let blob = new Blob([draft.toString()], {
      type: 'text/plain;charset=utf-8',
    });
    saveAs(blob, filename);
  } catch (err) {
    alert('Could not save file, something went wrong');
    return;
  }
}

function reset() {
  draft = new TDDDraft();

  setValue('#scalecontrols .readout', 0)
  $('#lockdraft').prop('checked', false)
  $('#showovals').prop('checked', true)
  $('#showsquares').prop('checked', false)
  $('#showtwist').prop('checked', true)
  $('#showupper').prop('checked', true)
  $('#showlower').prop('checked', true)
  $('#showreversal').prop('checked', true)
  $('#showtext').prop('checked', false)
  $('#showgrid').prop('checked', true)
  setValue('#GREYSLIDER', 144)
  $('#addright').prop('checked', true)
  $('#labelholescw').prop('checked', true)
  $('#invertsz').prop('checked', false)

  $('#showhruler').prop('checked', false)
  $('#showvruler').prop('checked', false)

  setValue('#export_width', 1920)

  $('#showrepeats').prop('checked', false)
  setValue('#repeatstart .readout', 1)
  setValue('#repeatend .readout', 1)
  setValue('#numrepeats .readout', 1)

  saveToLocal()
  setControlsFromDraft()
  redraw()
  redrawControls()
}

function textDescriptionString() {
  let desc = ' ' + draft.name
  desc += '\n' + '='.repeat(draft.name.length + 2)

  desc += '\n\nThreading:'
  let invertsz = isChecked('#invertsz')
  for (let i = 0; i < draft.tablets(); i++) {
    desc +=
      '\n * ' +
      draft.describeTablet(i, invertsz) +
      ' (' +
      String.fromCharCode(isChecked('#labelholescw') ? 0x21bb : 0x21ba) +
      ')'
    for (let j = 0; j < draft.holes(); j++) {
      let char = String.fromCharCode('A'.charCodeAt(0) + j)
      desc += '\n    ' + char + ': '
      if (isChecked('#labelholescw')) {
        desc += draft.describeHole(i, j)
      } else {
        desc += draft.describeHole(i, draft.holes() - j - 1)
      }
    }
  }
  desc += '\n\nTurning:'
  for (let i = 0; i < draft.picks(); i++) {
    desc += '\n ' + (i + 1) + '. ' + draft.describePick(i)
  }
  desc += '\n'
  return desc
}

function exportTextDescription() {
  let filename: string
  if (draft.name != '') {
    filename = draft.name + '.txt'
  } else {
    filename = 'draft.txt'
  }
  saveAs(new Blob([textDescriptionString()], { type: 'text/plain' }), filename)
}

function exportDraft(mimetype, root) {
  const width = <number>getValue('#export_width')

  let process_blob = function (blob) {
    let extension
    let filename

    if (mimetype == 'image/jpeg') {
      extension = '.jpg'
    } else if (mimetype == 'image/png') {
      extension = '.png'
    } else if (mimetype == 'image/svg+xml') {
      extension = '.svg'
    } else {
      extension = ''
    }
    if (draft.name != '') {
      filename = draft.name + extension
    } else {
      filename = 'draft' + extension
    }
    saveAs(blob, filename)
  }

  if (mimetype == 'image/svg+xml') {
    process_blob(svg_to_blob(root))
  } else {
    svg_to_img(root, mimetype, width, process_blob)
  }
}

function applyAccordian() {
  $('.accordion').each(function () {
    if ($(this).hasClass('active')) {
      $(this).next().show()
    } else {
      $(this).next().hide()
    }
  })
}

$(function () {
  document
    .getElementById('#draftname .readout')
    ?.addEventListener('change', function () {
      draft.name = <string>getValue('#draftname .readout')
      saveToLocal()
    })

  setupNumberInput('scalecontrols', -100, 100, function () {
    saveToLocal()
    redraw()
  })
  setupNumberInput('rscalecontrols', -100, 100, function () {
    saveToLocal()
    redraw()
  })
  setupNumberInput('mainrowcontrols', 1, undefined, function () {
    updateDraft()
    redraw()
  })
  setupNumberInput('lowrowcontrols', 1, 8, function () {
    updateDraft()
    redraw()
  })
  setupNumberInput('colcontrols', 1, undefined, function () {
    updateDraft()
    redraw()
  })
  document.getElementById('#addright')?.addEventListener('change', function () {
    saveToLocal()
  })
  document
    .getElementById('#lockdraft')
    ?.addEventListener('change', function () {
      saveToLocal()
    })

  setupNumberInput(
    'hruler',
    function () {
      return -draft.holes()
    },
    function () {
      return draft.picks() + 1
    },
    function () {
      view.hRuler(
        isChecked('#showhruler') ? getValue('#hruler .readout') : undefined
      )
      saveToLocal()
      redraw()
    },
    1,
    true
  )
  setupNumberInput(
    'vruler',
    1,
    function () {
      return draft.tablets() + 1
    },
    function () {
      view.vRuler(
        isChecked('#showvruler') ? getValue('#vruler .readout') : undefined
      )
      saveToLocal()
      redraw()
    },
    1,
    true
  )
  document
    .getElementById('#showhruler')
    ?.addEventListener('change', function () {
      view.hRuler(
        isChecked('#showhruler') ? getValue('#hruler .readout') : undefined
      )
      saveToLocal()
      redraw()
    })
  document
    .getElementById('#showvruler')
    ?.addEventListener('change', function () {
      view.vRuler(
        isChecked('#showvruler') ? getValue('#vruler .readout') : undefined
      )
      saveToLocal()
      redraw()
    })

  document
    .getElementById('#showovals')
    ?.addEventListener('change', function () {
      view.showOvals(isChecked('#showovals'))
      saveToLocal()
      redraw()
    })
  document
    .getElementById('#showsquares')
    ?.addEventListener('change', function () {
      view.showSquares(isChecked('#showsquares'))
      saveToLocal()
      redraw()
    })
  document
    .getElementById('#showtwist')
    ?.addEventListener('change', function () {
      view.showTwist(isChecked('#showtwist'))
      saveToLocal()
      redraw()
    })
  document
    .getElementById('#showupper')
    ?.addEventListener('change', function () {
      view.showTurning(isChecked('#showupper'))
      saveToLocal()
      redraw()
    })
  document
    .getElementById('#showlower')
    ?.addEventListener('change', function () {
      view.showThreading(isChecked('#showlower'))
      saveToLocal()
      redraw()
    })
  document
    .getElementById('#showreversal')
    ?.addEventListener('change', function () {
      view.showReversals(isChecked('#showreversal'))
      saveToLocal()
      redraw()
    })
  document.getElementById('#showtext')?.addEventListener('change', function () {
    saveToLocal()
    redraw()
  })
  document.getElementById('#showgrid')?.addEventListener('change', function () {
    view.showGrid(isChecked('#showgrid'))
    repeat.showGrid(isChecked('#showgrid'))
    saveToLocal()
    redraw()
  })
  document
    .getElementById('#labelholescw')
    ?.addEventListener('change', function () {
      view.labelHolesCW(isChecked('#labelholescw'))
      saveToLocal()
      redraw()
    })
  document.getElementById('#invertsz')?.addEventListener('change', function () {
    view.invertSZ(isChecked('#invertsz'))
    saveToLocal()
    redraw()
  })

  document.getElementById('#EMPTYBOX')?.addEventListener('click', function () {
    fgcol = -1
    saveToLocal()
    redrawControls()
  })
  let i
  for (i = 0; i < 12; i++) {
    ; (function (i) {
      $('#BOX' + (i + 1)).click(function () {
        fgcol = i
        saveToLocal()
        redrawControls()
      })
    })(i)
  }

  document
    .getElementById('#showrepeats')
    ?.addEventListener('change', function () {
      saveToLocal()
      redraw()
    })
  setupNumberInput(
    'repeatstart',
    1,
    function () {
      return getValue('#repeatend .readout')
    },
    function () {
      repeat.startPick(<number>getValue('#repeatstart .readout'))
      saveToLocal()
      redraw()
    }
  )
  setupNumberInput(
    'repeatend',
    function () {
      return getValue('#repeatstart .readout')
    },
    function () {
      return draft.picks()
    },
    function () {
      repeat.endPick(<number>getValue('#repeatend .readout'))
      saveToLocal()
      redraw()
    }
  )
  setupNumberInput('numrepeats', 1, undefined, function () {
    repeat.setRepeats(<number>getValue('#numrepeats .readout'))
    saveToLocal()
    redraw()
  })

  document.getElementById('#REDVAL')?.addEventListener('change', function () {
    updateRed(getValue('#REDVAL'))
    redraw()
    redrawControls()
  })
  document.getElementById('#REDSLIDE')?.addEventListener('change', function () {
    updateRed(getValue('#REDSLIDE'))
    redraw()
    redrawControls()
  })
  document.getElementById('#GREENVAL')?.addEventListener('change', function () {
    updateGreen(getValue('#GREENVAL'))
    redraw()
    redrawControls()
  })
  document
    .getElementById('#GREENSLIDE')
    ?.addEventListener('change', function () {
      updateGreen(getValue('#GREENSLIDE'))
      redraw()
      redrawControls()
    })
  document.getElementById('#BLUEVAL')?.addEventListener('change', function () {
    updateBlue(getValue('#BLUEVAL'))
    redraw()
    redrawControls()
  })
  document
    .getElementById('#BLUESLIDE')
    ?.addEventListener('change', function () {
      updateBlue(getValue('#BLUESLIDE'))
      redraw()
      redrawControls()
    })

  document.getElementById('#GREYVAL')?.addEventListener('change', function () {
    updateGrey(getValue('#GREYVAL'))
    redraw()
  })
  document
    .getElementById('#GREYSLIDER')
    ?.addEventListener('change', function () {
      updateGrey(getValue('#GREYSLIDER'))
      redraw()
    })

  document
    .getElementById('#fileio #load')
    ?.addEventListener('change', function () {
      loadFile()
      saveToLocal()
    })
  document
    .getElementById('#fileio #save')
    ?.addEventListener('click', function () {
      saveFile()
    })

  document.getElementById('#clear')?.addEventListener('click', function () {
    draft.clearTurning()
    setControlsFromDraft()
    saveToLocal()
    redraw()
    redrawControls()
  })
  document.getElementById('#reset')?.addEventListener('click', function () {
    reset()
  })
  document
    .getElementById('#resetpallette')
    ?.addEventListener('click', function () {
      draft.resetPalette()
      setControlsFromDraft()
      saveToLocal
      redraw()
      redrawControls()
    })

  document
    .getElementById('#draftexport #svg')
    ?.addEventListener('click', function () {
      exportDraft('image/svg+xml', view.root())
    })
  document
    .getElementById('#draftexport #jpeg')
    ?.addEventListener('click', function () {
      exportDraft('image/jpeg', view.root())
    })
  document
    .getElementById('#draftexport #png')
    ?.addEventListener('click', function () {
      exportDraft('image/png', view.root())
    })
  document
    .getElementById('#draftexport #txt')
    ?.addEventListener('click', function () {
      exportTextDescription()
    })

  document
    .getElementById('#repeatexport #svg')
    ?.addEventListener('click', function () {
      exportDraft('image/svg+xml', repeat.root())
    })
  document
    .getElementById('#repeatexport #jpeg')
    ?.addEventListener('click', function () {
      exportDraft('image/jpeg', repeat.root())
    })
  document
    .getElementById('#repeatexport #png')
    ?.addEventListener('click', function () {
      exportDraft('image/png', repeat.root())
    })

  document
    .getElementById('#export_width')
    ?.addEventListener('change', function () {
      saveToLocal()
    })

  document.getElementById('.accordion')?.addEventListener('click', function () {
    $(this).toggleClass('active')
    applyAccordian()
    saveToLocal()
  })

  loadFromLocal()

  view.showGrid(isChecked('#showgrid'))
  view.showOvals(isChecked('#showovals'))
  view.showSquares(isChecked('#showsquares'))
  view.showTwist(isChecked('#showtwist'))
  view.showTurning(isChecked('#showupper'))
  view.showThreading(isChecked('#showlower'))
  view.showReversals(isChecked('#showreversal'))
  view.greySaturation(0x100 - <number>getValue('#GREYSLIDER'))
  view.labelHolesCW(isChecked('#labelholescw'))
  view.invertSZ(isChecked('#invertsz'))
  view.hRuler(
    isChecked('#showhruler') ? getValue('#hruler .readout') : undefined
  )
  view.vRuler(
    isChecked('#showvruler') ? getValue('#vruler .readout') : undefined
  )

  repeat.showGrid(isChecked('#showgrid'))
  repeat.showOvals(true)
  repeat.showThreading(false)
  repeat.showReversals(false)
  repeat.showTwist(false)
  repeat.greySaturation(0xff)
  repeat.hRuler(undefined)
  repeat.vRuler(undefined)

  repeat.startPick(<number>getValue('#repeatstart .readout'))
  repeat.endPick(<number>getValue('#repeatend .readout'))
  repeat.setRepeats(<number>getValue('#numrepeats .readout'))

  applyAccordian()

  setControlsFromDraft()

  $('#draftcanvas').append(view.root())
  document
    .getElementById('#draftcanvas svg')
    ?.addEventListener('click', draftClick)

  $('#repeatcanvas').append(repeat.root())

  redraw()
  redrawControls()
})
