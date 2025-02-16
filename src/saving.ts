import { control_vals, draft, setDraft, setFGCol } from './logic';
import { TDDDraftFromString } from './tdd/tdd';
import { setChecked, setValue } from './util';
export { saveToLocal, loadFromLocal };
import $ from 'jquery';

function saveToLocal(): void {
  localStorage.setItem('tdd-controls', JSON.stringify(control_vals()));
  localStorage.setItem('tdd-draft', draft.toString());
}

function loadFromLocal(): void {
  let local_controls = localStorage.getItem('tdd-controls');
  let local_draft = localStorage.getItem('tdd-draft');

  let controls = local_controls != undefined ? JSON.parse(local_controls) : {};

  setFGCol(controls.fgcol != undefined ? controls.fgcol : -1);

  setValue(
    '#scalecontrols .readout',
    controls.scale != undefined ? controls.scale : 0
  );
  setValue(
    '#rscalecontrols .readout',
    controls.rscale != undefined ? controls.rscale : 0
  );
  setChecked(
    '#addright',
    controls.addright != undefined ? controls.addright : true
  );
  setChecked(
    '#lockdraft',
    controls.lockdraft != undefined ? controls.lockdraft : false
  );
  setChecked(
    '#showovals',
    controls.showovals != undefined ? controls.showovals : true
  );
  setChecked(
    '#showsquares',
    controls.showsquares != undefined ? controls.showsquares : false
  );
  setChecked(
    '#showtwist',
    controls.showtwist != undefined ? controls.showtwist : true
  );
  setChecked(
    '#showtext',
    controls.showtext != undefined ? controls.showtext : false
  );
  setChecked(
    '#showgrid',
    controls.showgrid != undefined ? controls.showgrid : true
  );
  setChecked(
    '#showupper',
    controls.showupper != undefined ? controls.showupper : true
  );
  setChecked(
    '#showlower',
    controls.showlower != undefined ? controls.showlower : true
  );
  setChecked(
    '#showreversal',
    controls.showreversal != undefined ? controls.showreversal : true
  );
  setValue(
    '#GREYSLIDER',
    controls.grey_saturation != undefined ? controls.grey_saturation : 144
  );
  setChecked(
    '#labelholescw',
    controls.labelholescw != undefined ? controls.labelholescw : true
  );
  setChecked(
    '#invertsz',
    controls.invertsz != undefined ? controls.invertsz : false
  );
  setChecked(
    '#showhruler',
    controls.showhruler != undefined ? controls.showhruler : true
  );
  setChecked(
    '#showvruler',
    controls.showvruler != undefined ? controls.showvruler : true
  );
  setValue(
    '#hruler .readout',
    controls.hruler != undefined ? controls.hruler : 0
  );
  setValue(
    '#vruler .readout',
    controls.vruler != undefined ? controls.vruler : 0
  );
  setValue(
    '#export_width',
    controls.export_width != undefined ? controls.export_width : 1920
  );
  setChecked(
    '#showrepeats',
    controls.showrepeats != undefined ? controls.showrepeats : false
  );
  setValue(
    '#repeatstart .readout',
    controls.repeatstart != undefined ? controls.repeatstart : 1
  );
  setValue(
    '#repeatend .readout',
    controls.repeatend != undefined ? controls.repeatend : 1
  );
  setValue(
    '#numrepeats .readout',
    controls.numrepeats != undefined ? controls.numrepeats : 1
  );

  if (controls.accordion) {
    for (const [key, value] of Object.entries(controls.accordion)) {
      let but = $('#' + key + ' .accordion');
      if (value) {
        but.addClass('active');
      } else {
        but.removeClass('active');
      }
    }
  }

  if (local_draft != undefined) {
    setDraft(TDDDraftFromString(local_draft));
  }
}
