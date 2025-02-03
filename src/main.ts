// The main script for the draft designer
import '../sass_style/style.scss'
import { saveAs } from 'file-saver'
import { svg_to_blob, svg_to_img } from './fmt/svg_to_img'
import { TDDDraft, TDDDraftFromString } from './tdd/tdd'
import { TDDSVGView } from './tdd/TDDSVGView'
import { RGBColour } from './fmt/Colour'
import { json_to_tdd } from './fmt/json_to_tdd'
import $ from 'jquery'
import { redraw, redrawControls } from './drawing'
import { getValue, isChecked, setValue } from './util'
import { loadFromLocal, saveToLocal } from './saving'
export {
  draft,
  view,
  repeat,
  fgcol,
  control_vals,
  getFGCol,
  setFGCol,
  getDraft,
  setDraft,
}

let draft = new TDDDraft()
let view = new TDDSVGView()
let repeat = new TDDSVGView()
let fgcol = -1

function setDraft(newDraft: TDDDraft): void {
  draft = newDraft
}

function getDraft(): TDDDraft {
  return draft
}

function getFGCol(): number {
  return fgcol
}
function setFGCol(newValue: number) {
  fgcol = newValue
}

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

function updateDraft(): void {
  let picks = getValue('#mainrowcontrols .readout')
  let holes = getValue('#lowrowcontrols .readout')
  let tablets = getValue('#colcontrols .readout')
  let addright = isChecked('#addright')

  if (picks < draft.getPicks()) {
    draft.removePicks(draft.getPicks() - picks)
  } else if (picks > draft.getPicks()) {
    draft.addPicks(picks - draft.getPicks())
  }

  if (holes < draft.getHoles()) {
    draft.removeHoles(draft.getHoles() - holes)
  } else if (holes > draft.getHoles()) {
    draft.addHoles(holes - draft.getHoles())
  }

  if (addright) {
    if (tablets < draft.getTablets()) {
      draft.removeTabletsRight(draft.getTablets() - tablets)
    } else if (tablets > draft.getTablets()) {
      draft.addTabletsRight(tablets - draft.getTablets())
    }
  } else {
    if (tablets < draft.getTablets()) {
      draft.removeTabletsLeft(draft.getTablets() - tablets)
    } else if (tablets > draft.getTablets()) {
      draft.addTabletsLeft(tablets - draft.getTablets())
    }
  }

  if (<number>getValue('#hruler .readout') > draft.getPicks() + 1) {
    setValue('#hruler .readout', draft.getPicks() + 1)
  } else if (<number>getValue('#hruler .readout') < -draft.getHoles()) {
    setValue('#hruler .readout', -draft.getHoles())
  }

  if (<number>getValue('#vruler .readout') > draft.getTablets() + 1) {
    setValue('#vruler .readout', draft.getTablets() + 1)
  }

  if (<number>getValue('#repeatstart .readout') > draft.getPicks()) {
    setValue('#repeatstart .readout', draft.getPicks())
  }

  if (<number>getValue('#repeatend .readout') > draft.getPicks()) {
    setValue('#repeatend .readout', draft.getPicks())
  }

  saveToLocal()
}

function draftClick(clickEvent: MouseEvent): void {
  if (!isChecked('#lockdraft')) {
    const pt = this.createSVGPoint()
    pt.x = clickEvent.clientX
    pt.y = clickEvent.clientY
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
  const color = draft.getColor(fgcol).getIntegerRGB()
  draft.setColor(fgcol, new RGBColour(red, color.g, color.b))
  saveToLocal()
}

function updateGreen(green: number): void {
  const color = draft.getColor(fgcol).getIntegerRGB()
  draft.setColor(fgcol, new RGBColour(color.r, green, color.b))
  saveToLocal()
}

function updateBlue(blue: number): void {
  const color = draft.getColor(fgcol).getIntegerRGB()
  draft.setColor(fgcol, new RGBColour(color.r, color.g, blue))
  saveToLocal()
}

function updateGrey(grey: number): void {
  if (grey > 0xff) {
    grey = 0xff
  }
  if (grey < 0) {
    grey = 0
  }
  view.greySaturation(0x100 - grey)
  setValue('#GREYSLIDER', grey)
  setValue('#GREYVAL', grey)
  saveToLocal()
}

function setControlsFromDraft(): void {
  console.log('enter setControlsFromDraft')

  setValue('#mainrowcontrols .readout', draft.getPicks())
  setValue('#lowrowcontrols .readout', draft.getHoles())
  setValue('#colcontrols .readout', draft.getTablets())
  setValue('#draftname', draft.name)

  if (<number>getValue('#hruler .readout') > draft.getPicks() + 1) {
    setValue('#hruler .readout', draft.getPicks() + 1)
  } else if (<number>getValue('#hruler .readout') < -draft.getHoles()) {
    setValue('#hruler .readout', -draft.getHoles())
  }
  view.hRuler(
    isChecked('#showhruler') ? getValue('#hruler .readout') : undefined
  )

  if (<number>getValue('#vruler .readout') > draft.getTablets() + 1) {
    setValue('#vruler .readout', draft.getTablets() + 1)
  }
  view.vRuler(
    isChecked('#showvruler') ? getValue('#vruler .readout') : undefined
  )

  if (<number>getValue('#repeatstart .readout') > draft.getPicks()) {
    setValue('#repeatstart .readout', draft.getPicks())
    repeat.startPick(draft.getPicks())
  }

  if (<number>getValue('#repeatend .readout') > draft.getPicks()) {
    setValue('#repeatend .readout', draft.getPicks())
    repeat.endPick(draft.getPicks())
  }
  console.log('enter setControlsFromDraft')
}

function loadFile() {
  let files = ($('#fileio #load')[0] as HTMLInputElement).files
  if (files.length > 0) {
    let reader = new FileReader()

    reader.onload = (function (is_tdd) {
      return function (event) {
        try {
          let data = event.target.result

          if (!is_tdd && (<string>data).substring(0, 5) === '# tdd') {
            is_tdd = true
          }

          if (is_tdd) {
            draft = TDDDraftFromString(<string>data)
          } else {
            draft = json_to_tdd(JSON.parse(<string>data))
          }
        } catch (err) {
          alert('File is corrupted and could not be loaded.')
          return
        }

        saveToLocal()
        setControlsFromDraft()
        redrawControls()

        redraw()
      }
    })(/^.*\.tdd(\.txt)?$/.test(files[0].name))

    reader.readAsText(files[0])
  }
}

function saveFile() {
  try {
    let filename = ''
    if (draft.name != '') {
      filename = draft.name + '.tdd'
    } else {
      filename = 'draft.tdd'
    }
    let blob = new Blob([draft.toString()], {
      type: 'text/plain;charset=utf-8',
    })
    saveAs(blob, filename)
  } catch (err) {
    alert('Could not save file, something went wrong')
    return
  }
}

function reset() {
  draft = new TDDDraft()

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
  for (let i = 0; i < draft.getTablets(); i++) {
    desc +=
      '\n * ' +
      draft.describeTablet(i, invertsz) +
      ' (' +
      String.fromCharCode(isChecked('#labelholescw') ? 0x21bb : 0x21ba) +
      ')'
    for (let j = 0; j < draft.getHoles(); j++) {
      let char = String.fromCharCode('A'.charCodeAt(0) + j)
      desc += '\n    ' + char + ': '
      if (isChecked('#labelholescw')) {
        desc += draft.describeHole(i, j)
      } else {
        desc += draft.describeHole(i, draft.getHoles() - j - 1)
      }
    }
  }
  desc += '\n\nTurning:'
  for (let i = 0; i < draft.getPicks(); i++) {
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
  document.querySelectorAll('.accordion').forEach((accordion) => {
    const nextElement = accordion.nextElementSibling

    if (nextElement instanceof HTMLElement) {
      const isActive = accordion.classList.contains('active')
      nextElement.style.display = isActive ? 'block' : 'none'
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
      return -draft.getHoles()
    },
    function () {
      return draft.getPicks() + 1
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
      return draft.getTablets() + 1
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
    ;(function (i) {
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
      return draft.getPicks()
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
