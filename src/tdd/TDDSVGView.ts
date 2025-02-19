/**
 *  This file contains a class that can represent the SVG-based rendering of a TDDDraft
 */

export { TDDSVGView };
import { RGBColour } from '../fmt/Colour';
import { TDDDraft } from './tdd';
import $ from 'jquery';

const cellwidth = 20;
const cellheight = 20;
const cellborder = 2;
const rulerwidth = 3;
const intertablegap = 25;

const labelpadding = 3;

const hole_labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const emptycellColour = new RGBColour(0xff, 0xff, 0xff);

class TDDSVGView {
  svg: HTMLDivElement[];
  labelWidth: number;
  needsFullRedraw: boolean;
  bg: any;
  // The Twist diagram
  twist: any[];
  // The turning diagram
  turning: any[];
  // The threading diagram
  threading: any[];
  labels: { picks: any[]; tablets: any[]; holes: any[] };

  // Settings
  show_turning: boolean;
  show_threading: boolean;
  showing_turning: boolean;
  showing_threading: boolean;
  showing_twist: boolean;
  show_ovals: boolean;
  show_squares: boolean;
  show_twist: boolean;
  show_reversals: boolean;
  show_grid: boolean;
  labelholescw: boolean;
  labelingholescw: boolean;
  invertsz: boolean;
  invertingsz: boolean;

  hruler_position = undefined;
  vruler_position = undefined;

  forwardcolour: RGBColour;
  backwardcolour: RGBColour;

  start_pick: any;
  end_pick: any;
  repeats: any;

  // Stuctural elements for arranging the svg
  twist_group: any;
  main_group: any;
  tablet_label_group: any;
  overlay: any;
  threading_group: any;
  ruler_group: any;
  threading_main_group: any;
  threading_ruler_group: any;
  hruler: any;
  vruler: { turning: any; threading: any };
  invertingholessz: boolean;

  constructor() {
    let parent = document.createElement('div');
    this.svg = $(parent).get();

    this.labelWidth = 30;

    this.needsFullRedraw = true;

    // Height and width will really be set when we
    // conform to a draft, for now set some defaults
    const fullheight =
      cellborder +
      (cellborder + cellheight) * 1 +
      cellborder +
      cellheight +
      (intertablegap + cellborder + (cellborder + cellheight) * 4);

    const fullwidth =
      this.labelWidth + cellborder + (cellborder + cellwidth) * 1;

    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
      // This is needed in Firefox to make image export work, but breaks image export in other browsers
      //$(this.svg.root()).attr('width', fullwidth)
      //$(this.svg.root()).attr('height', fullheight)
    }

    this.svg[0].setAttribute('viewBox', '0 0 ' + fullwidth + ' ' + fullheight);
    /*
    // Create the background
    this.bg = this.svg[0].rect(0, 0, fullwidth, fullheight, {
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 0,
    })

    let fillpat = this.svg.pattern('fillpat', 0, 0, 4, 4, {
      patternUnits: 'userSpaceOnUse',
    })
    this.svg.rect(fillpat, 0, 0, 2, 2, {
      fill: '#000000',
      stroke: '#000000',
      strokeWidth: 0,
    })
    this.svg.rect(fillpat, 2, 2, 2, 2, {
      fill: '#000000',
      stroke: '#000000',
      strokeWidth: 0,
    })
    */

    // The Twist diagram
    this.twist = [];

    // The turning diagram
    this.turning = [];

    // The threading diagram
    this.threading = [];

    // The labels
    this.labels = {
      picks: [],
      tablets: [],
      holes: [],
    };

    // Settings
    this.show_turning = true;
    this.show_threading = true;
    this.showing_turning = true;
    this.showing_threading = true;
    this.showing_twist = true;
    this.show_ovals = true;
    this.show_squares = true;
    this.show_twist = true;
    this.show_reversals = true;
    this.show_grid = true;
    this.labelholescw = true;
    this.labelingholescw = true;
    this.invertsz = false;
    this.invertingsz = false;
    let grey_saturation = 0x99;
    this.hruler_position = undefined;
    this.vruler_position = undefined;

    this.forwardcolour = new RGBColour(0xff, 0xff, 0xff);
    this.backwardcolour = new RGBColour(
      grey_saturation,
      grey_saturation,
      grey_saturation
    );

    this.start_pick = undefined;
    this.end_pick = undefined;
    this.repeats = undefined;

    // Stuctural elements for arranging the svg
    /*
    this.twist_group = this.svg.group()
    this.main_group = this.svg.group()
    this.tablet_label_group = this.svg.group()
    this.overlay = this.svg.group()
    this.threading_group = this.svg.group()
    this.ruler_group = this.svg.group()
    this.threading_main_group = this.svg.group(this.threading_group)
    this.threading_ruler_group = this.svg.group(this.threading_group)
    
    this.hruler = this.svg.line(
      this.ruler_group,
      this.labelWidth - cellborder,
      0,
      this.labelWidth + cellborder + (cellborder + cellwidth),
      0,
      { stroke: '#000000', strokeWidth: cellborder * 4 }
    )
    const threading_start_y = cellborder + cellheight + intertablegap

    this.vruler = {
      turning: this.svg.line(
        this.ruler_group,
        this.labelWidth,
        0,
        this.labelWidth,
        cellheight + cellborder + cellborder,
        { stroke: '#000000', strokeWidth: cellborder * 4 }
      ),
      threading: this.svg.line(
        this.threading_ruler_group,
        this.labelWidth,
        threading_start_y,
        this.labelWidth,
        threading_start_y + (cellheight + cellborder) * 4 + cellborder,
        { stroke: '#000000', strokeWidth: cellborder * 4 }
      ),
    }
      
    */
  }

  showThreading(val) {
    this.show_threading = val;
  }

  showTurning(val) {
    this.show_turning = val;
  }

  showOvals(val) {
    this.show_ovals = val;
  }

  showSquares(val) {
    this.show_squares = val;
  }

  showTwist(val) {
    this.show_twist = val;
  }

  showReversals(val) {
    this.show_reversals = val;
  }

  showGrid(val) {
    if (this.show_grid != val) {
      this.needsFullRedraw = true;
    }
    this.show_grid = val;
  }

  labelHolesCW(val) {
    this.labelholescw = val;
  }

  invertSZ(val) {
    this.invertsz = val;
  }

  greySaturation(val) {
    this.backwardcolour = new RGBColour(val, val, val);
  }

  hRuler(y) {
    this.hruler_position = y;
  }

  vRuler(x) {
    this.vruler_position = x;
  }

  startPick(y) {
    this.start_pick = y;
  }

  endPick(y) {
    this.end_pick = y;
  }

  setRepeats(n) {
    this.repeats = n;
  }

  root() {
    return this.svg[0];
  }

  conform(draft: TDDDraft): void {
    console.log('Enter Conform');
    return;
    const num_picks =
      this.repeats == undefined
        ? draft.getPicks()
        : (this.end_pick - this.start_pick + 1) * this.repeats;
    const labelwidth =
      (this.show_turning ? ('' + num_picks).length * 10 : 10) +
      labelpadding * 2;
    if (this.labelWidth != labelwidth) {
      this.labelWidth = labelwidth;
      while (this.labels.picks.length > 0) {
        $(this.labels.picks.pop()).remove();
      }
      while (this.labels.holes.length > 0) {
        $(this.labels.holes.pop()).remove();
      }
      while (this.labels.tablets.length > 0) {
        $(this.labels.tablets.pop()).remove();
      }
      while (this.turning.length > 0) {
        let row = this.turning.pop();
        while (row.length > 0) {
          this.remove_cell(row.pop());
        }
      }
      while (this.threading.length > 0) {
        let tablet = this.threading.pop();
        $(tablet.direction).remove();
        while (tablet.holes.length > 0) {
          this.remove_cell(tablet.holes.pop());
        }
      }
    }

    if (
      this.needsFullRedraw ||
      (this.repeats != undefined &&
        this.turning.length !=
          (this.end_pick - this.start_pick + 1) * this.repeats) ||
      (this.repeats == undefined && this.turning.length != draft.getPicks()) ||
      this.threading.length != draft.getTablets() ||
      (this.threading.length > 0 &&
        this.threading[0].holes.length != draft.getHoles()) ||
      this.show_threading != this.showing_threading ||
      this.show_turning != this.showing_turning ||
      this.show_twist != this.showing_twist ||
      this.labelholescw != this.labelingholescw ||
      this.invertsz != this.invertingholessz
    ) {
      this.conform_size(draft);
    }

    this.conform_twist(draft);
    this.conform_threading(draft);
    this.conform_turning(draft);
    this.conform_rulers(draft);

    this.needsFullRedraw = false;
    console.log('EXIT Conform');
  }

  conform_size(draft) {
    console.log('enter conform_size');

    const num_picks =
      this.repeats == undefined
        ? draft.picks()
        : (this.end_pick - this.start_pick + 1) * this.repeats;

    // First calculate the sizes
    const turning_start_y = this.show_twist ? cellborder + cellheight : 0;
    const threading_start_y =
      turning_start_y +
      (this.show_turning
        ? (cellborder + cellheight) * num_picks + intertablegap
        : intertablegap);

    const fullheight =
      (this.show_twist ? cellborder + cellheight + cellborder : 0) +
      (this.show_turning
        ? cellborder +
          (cellborder + cellheight) * num_picks +
          cellborder +
          cellheight
        : intertablegap) +
      (this.show_threading
        ? intertablegap + cellborder + (cellborder + cellheight) * draft.holes()
        : 0);

    const fullwidth =
      this.labelWidth + cellborder + (cellborder + cellwidth) * draft.tablets();

    /*
  $(this.svg.root()).width(fullwidth)
  $(this.svg.root()).height(fullheight)

  this.svg
    .root()
    .setAttribute('viewBox', '0 0 ' + fullwidth + ' ' + fullheight)
  */
    // Resize background
    $(this.bg).attr('width', fullwidth);
    $(this.bg).attr('height', fullheight);

    // Conform the labels -- picks first
    while (this.labels.picks.length > num_picks) {
      $(this.labels.picks.pop()).remove();
    }
    for (let y = 0; y < this.labels.picks.length; y++) {
      $(this.labels.picks[y]).attr('x', this.labelWidth - labelpadding);
      $(this.labels.picks[y]).attr(
        'y',
        turning_start_y + (cellborder + cellheight) * (num_picks - y) - 5
      );
      if (this.repeats != undefined) {
        $(this.labels.picks[y]).text(
          '' + ((y % (this.end_pick - this.start_pick + 1)) + this.start_pick)
        );
      }
    }
    while (this.labels.picks.length < num_picks) {
      let y = this.labels.picks.length;
      let label = '' + (y + 1);
      if (this.repeats != undefined) {
        label =
          '' + ((y % (this.end_pick - this.start_pick + 1)) + this.start_pick);
      }

      this.labels.picks
        .push
        /*
        this.svg.text(
          this.main_group,
          this.labelWidth - labelpadding,
          turning_start_y + (cellborder + cellheight) * (num_picks - y) - 5,
          label,
          {
            stroke: '#000000',
            style: 'font: 15px Arial; text-anchor: end;',
          }
        )
        */
        ();
    }

    // Next the holes
    while (this.labels.holes.length > draft.holes()) {
      $(this.labels.holes.pop()).remove();
    }
    for (let y = 0; y < this.labels.holes.length; y++) {
      const hole_label = this.labelholescw
        ? hole_labels[y]
        : hole_labels[draft.holes() - y - 1];
      $(this.labels.holes[y]).attr('x', this.labelWidth - labelpadding);
      $(this.labels.holes[y]).attr(
        'y',
        threading_start_y + (cellborder + cellheight) * (y + 1) - 5
      );
      $(this.labels.holes[y]).text(hole_label);
    }
    while (this.labels.holes.length < draft.holes()) {
      let y = this.labels.holes.length;
      const hole_label = this.labelholescw
        ? hole_labels[y]
        : hole_labels[draft.holes() - y - 1];
      /*
    this.labels.holes.push(
      this.svg.text(
        this.threading_main_group,
        this.labelWidth - labelpadding,
        threading_start_y + (cellborder + cellheight) * (y + 1) - 5,
        hole_label,
        {
          stroke: '#000000',
          style: 'font: 15px Arial; text-anchor: end;',
        }
      )
    )
    */
    }
    this.labelingholescw = this.labelholescw;

    // Finally the tablets
    while (this.labels.tablets.length > draft.tablets()) {
      $(this.labels.tablets.pop()).remove();
    }
    for (let x = 0; x < this.labels.tablets.length; x++) {
      $(this.labels.tablets[x]).attr(
        'x',
        this.labelWidth +
          cellborder +
          (cellborder + cellwidth) * x +
          cellwidth / 2
      );
      $(this.labels.tablets[x]).attr('y', threading_start_y - cellborder - 2);
    }
    while (this.labels.tablets.length < draft.tablets()) {
      let x = this.labels.tablets.length;
      /*
      this.labels.tablets.push(
        this.svg.text(
          this.tablet_label_group,
          this.labelWidth +
          cellborder +
          (cellborder + cellwidth) * x +
          cellwidth / 2,
          threading_start_y - cellborder - 2,
          '' + (x + 1),
          {
            stroke: '#000000',
            style: 'font: 15px Arial; text-anchor: middle;',
          }
        )
      )
        */
    }

    // Now we conform the labels of the twist diagram
    while (draft.tablets() < this.twist.length) {
      $(this.twist.pop()).remove();
    }
    for (let x = 0; x < this.twist.length; x++) {
      $(this.twist[x]).attr(
        'x',
        this.labelWidth +
          cellborder +
          (cellborder + cellwidth) * x +
          cellwidth / 2
      );
      $(this.twist[x]).attr('y', turning_start_y - cellborder - 2);

      while (this.twist.length < draft.tablets()) {
        /*
        x = this.twist.length
        this.twist.push(
          this.svg.text(
            this.twist_group,
            this.labelWidth +
            cellborder +
            (cellborder + cellwidth) * x +
            cellwidth / 2,
            turning_start_y - cellborder - 2,
            '✅',
            {
              stroke: '#000000',
              style: 'font: 10px Arial; text-anchor: middle;',
            }
          )
        )
          */
      }

      // Now we conform the cells of the turning diagram
      for (let y = 0; y < num_picks; y++) {
        if (y >= this.turning.length) {
          this.turning.push([]);
        }
        for (x = 0; x < draft.tablets(); x++) {
          if (x >= this.turning[y].length) {
            this.turning[y].push(this.create_cell(x, y, turning_start_y));
          }
          this.move_cell(this.turning[y][x], x, y, turning_start_y);
          // Conform cell
        }
        while (draft.tablets() < this.turning[y].length) {
          this.remove_cell(this.turning[y].pop());
        }
      }
    }
    while (num_picks < this.turning.length) {
      let row = this.turning.pop();
      while (row.length > 0) {
        this.remove_cell(row.pop());
      }
    }

    // And the threading diagram
    for (let x = 0; x < draft.tablets(); x++) {
      if (x >= this.threading.length) {
        /*
        this.threading.push({
          direction: this.svg.text(
            this.threading_main_group,
            this.labelWidth +
            cellborder +
            (cellborder + cellwidth) * x +
            cellwidth / 2,
            threading_start_y + (cellborder + cellheight) * draft.holes() + 15,
            'S',
            {
              stroke: '#000000',
              style: 'font: 15px Arial; text-anchor: middle;',
            }
          ),
          holes: [],
        })*/
      }
      $(this.threading[x].direction).attr(
        'x',
        this.labelWidth +
          cellborder +
          (cellborder + cellwidth) * x +
          cellwidth / 2
      );
      $(this.threading[x].direction).attr(
        'y',
        threading_start_y + (cellborder + cellheight) * draft.holes() + 15
      );
      for (let y = 0; y < draft.holes(); y++) {
        if (y >= this.threading[x].holes.length) {
          this.threading[x].holes.push(
            this.create_cell(
              x,
              y,
              threading_start_y,
              this.threading_main_group,
              false
            )
          );
        }
        this.move_cell(this.threading[x].holes[y], x, y, threading_start_y);
        // Conform cell
      }
      while (this.threading[x].holes.length > draft.holes()) {
        this.remove_cell(this.threading[x].holes.pop());
      }
    }
    while (this.threading.length > draft.tablets()) {
      let tablet = this.threading.pop();
      $(tablet.direction).remove();
      while (tablet.holes.length > 0) {
        this.remove_cell(tablet.holes.pop());
      }
    }
    console.log('exit conform_size');
  }

  conform_twist(draft: TDDDraft): void {
    console.log('enter conform_twist');
    if (this.show_twist) {
      $(this.root()).append(this.twist_group);
      $(this.twist_group).attr('visibility', 'visible');

      for (let x = 0; x < draft.getTablets(); x++) {
        let twist = 0;
        for (let y = 0; y < draft.getPicks(); y++) {
          if (draft.turning[y][x] == '/') {
            twist++;
          } else if (draft.turning[y][x] == '\\') {
            twist--;
          }
        }

        if (twist < 0) {
          $(this.twist[x]).text('' + -twist + 'B');
        } else if (twist == 0) {
          $(this.twist[x]).text('✅');
        } else {
          $(this.twist[x]).text('' + twist + 'F');
        }
      }
      this.showing_twist = true;
    } else {
      $(this.twist_group).detach();
      this.showing_twist = false;
    }
    console.log('exit this.conform_twist');
  }

  conform_threading(draft: TDDDraft): void {
    console.log('enter conform_threading');
    if (this.show_threading) {
      $(this.root()).append(this.threading_group);
      $(this.threading_group).attr('visibility', 'visible');

      for (let x = 0; x < draft.getTablets(); x++) {
        $(this.threading[x].direction).text(
          (draft.threading[x] == 'S') != this.invertsz ? 'S' : 'Z'
        );

        for (let y = 0; y < draft.getHoles(); y++) {
          if (draft.threading[x] == 'S')
            this.set_cell_direction(this.threading[x].holes[y], '/');
          else this.set_cell_direction(this.threading[x].holes[y], '\\');

          if (this.show_ovals)
            this.set_cell_colour(
              this.threading[x].holes[y],
              draft.threadColour(x, y)
            );
          else this.set_cell_colour(this.threading[x].holes[y], undefined);
        }
      }
      this.invertingsz = this.invertsz;
      this.showing_threading = true;
    } else {
      $(this.threading_group).detach();
      this.showing_threading = false;
    }
    console.log('exit conform_threading');
  }

  conform_turning(draft: TDDDraft): void {
    console.log('enter conform_turning');
    if (this.show_turning) {
      $(this.root()).append(this.main_group);
      $(this.root()).append(this.overlay);
      $(this.main_group).attr('visibility', 'visible');

      let tablet_position = [];
      for (let x = 0; x < draft.getTablets(); x++) {
        tablet_position[x] = draft.getHoles() - 1;

        if (this.repeats != undefined) {
          for (
            let y = draft.getPicks() - 1;
            y > draft.getPicks() - this.start_pick;
            y--
          ) {
            if ((draft.threading[x] == 'S') == (draft.turning[y][x] == '/')) {
              tablet_position[x] =
                (tablet_position[x] + draft.getHoles() - 1) % draft.getHoles();
            } else {
              tablet_position[x] = (tablet_position[x] + 1) % draft.getHoles();
            }
          }
          const ppr = this.end_pick - this.start_pick + 1;
          let cell = this.turning.length - 1;

          while (cell >= 0) {
            for (
              let y = draft.getPicks() - this.start_pick;
              y >= draft.getPicks() - this.end_pick;
              y--
            ) {
              //alert("y: " + y + " cell: " + cell);

              for (let x = 0; x < draft.getTablets(); x++) {
                let fg;

                this.set_cell_direction(
                  this.turning[cell][x],
                  draft.turning[y][x]
                );
                this.set_cell_background(
                  this.turning[cell][x],
                  this.forwardcolour
                );
                if (
                  (draft.threading[x] == 'S') ==
                  (draft.turning[y][x] == '/')
                ) {
                  fg = draft.threadColour(x, tablet_position[x]);
                  this.turning[cell][x].b = false;
                  tablet_position[x] =
                    (tablet_position[x] + draft.getHoles() - 1) %
                    draft.getHoles();
                } else {
                  fg = draft.threadColour(
                    x,
                    (tablet_position[x] + 1) % draft.getHoles()
                  );
                  this.turning[cell][x].b = true;
                  tablet_position[x] =
                    (tablet_position[x] + 1) % draft.getHoles();
                }
                this.set_cell_colour(this.turning[cell][x], fg);
                this.set_cell_reverse_marker(this.turning[cell][x], false);
              }

              cell--;
            }
          }
        } else {
          for (let y = draft.getPicks() - 1; y >= 0; y--) {
            for (let x = 0; x < draft.getTablets(); x++) {
              let fg;
              this.set_cell_direction(this.turning[y][x], draft.turning[y][x]);
              if ((draft.threading[x] == 'S') == (draft.turning[y][x] == '/')) {
                fg = draft.threadColour(x, tablet_position[x]);
                if (this.show_squares) {
                  this.set_cell_background(this.turning[y][x], fg);
                } else {
                  this.set_cell_background(
                    this.turning[y][x],
                    this.forwardcolour
                  );
                }
                this.turning[y][x].b = false;
                tablet_position[x] =
                  (tablet_position[x] + draft.getHoles() - 1) %
                  draft.getHoles();
              } else {
                fg = draft.threadColour(
                  x,
                  (tablet_position[x] + 1) % draft.getHoles()
                );
                if (this.show_squares) {
                  this.set_cell_background(this.turning[y][x], fg);
                } else {
                  this.set_cell_background(
                    this.turning[y][x],
                    this.backwardcolour
                  );
                }
                this.turning[y][x].b = true;
                tablet_position[x] =
                  (tablet_position[x] + 1) % draft.getHoles();
              }
              if (!this.show_squares && this.show_ovals) {
                this.set_cell_colour(this.turning[y][x], fg);
              } else {
                this.set_cell_colour(this.turning[y][x], undefined);
              }
              this.set_cell_reverse_marker(
                this.turning[y][x],
                y != draft.getPicks() - 1 &&
                  this.turning[y][x].b != this.turning[y + 1][x].b &&
                  this.show_reversals
              );
            }
          }
        }
      }
      this.showing_turning = true;
    } else {
      $(this.main_group).detach();
      $(this.overlay).detach();
      this.showing_turning = false;
    }
    console.log('exit conform_turning');
  }

  conform_rulers(draft: TDDDraft): void {
    console.log('enter conform_rulers');
    const num_picks =
      this.repeats == undefined
        ? draft.getPicks()
        : (this.end_pick - this.start_pick + 1) * this.repeats;

    const turning_start_y = this.show_twist ? cellborder + cellheight : 0;
    const threading_start_y =
      turning_start_y +
      (this.show_turning
        ? (cellborder + cellheight) * num_picks + intertablegap
        : intertablegap);

    if (
      this.hruler_position == undefined ||
      (!this.showing_turning && this.hruler_position > 0) ||
      (!this.show_threading && this.hruler_position <= 0)
    ) {
      $(this.hruler).attr('visibility', 'hidden');
      $(this.hruler).attr('x1', this.labelWidth - cellborder);
      $(this.hruler).attr(
        'x2',
        this.labelWidth +
          cellborder +
          (cellborder + cellwidth) * draft.getTablets()
      );
      $(this.hruler).attr('y1', threading_start_y);
      $(this.hruler).attr('y2', threading_start_y);
    } else {
      $(this.hruler).attr('x1', this.labelWidth - cellborder);
      $(this.hruler).attr(
        'x2',
        this.labelWidth +
          cellborder +
          (cellborder + cellwidth) * draft.getTablets()
      );

      if (this.hruler_position > 0) {
        $(this.hruler).attr('visibility', 'visible');
        $(this.hruler).attr(
          'y1',
          turning_start_y +
            (cellborder + cellheight) *
              (draft.getPicks() - this.hruler_position + 1)
        );
        $(this.hruler).attr(
          'y2',
          turning_start_y +
            (cellborder + cellheight) *
              (draft.getPicks() - this.hruler_position + 1)
        );
        this.ruler_group.append(this.hruler);
      } else {
        $(this.hruler).attr('visibility', 'visible');
        $(this.hruler).attr(
          'y1',
          threading_start_y - (cellborder + cellheight) * this.hruler_position
        );
        $(this.hruler).attr(
          'y2',
          threading_start_y - (cellborder + cellheight) * this.hruler_position
        );
        this.threading_ruler_group.append(this.hruler);
      }
    }

    if (this.vruler_position == undefined) {
      $(this.vruler.turning).attr('visibility', 'hidden');
      $(this.vruler.turning).attr('x1', this.labelWidth);
      $(this.vruler.turning).attr('y1', turning_start_y);
      $(this.vruler.turning).attr('x2', this.labelWidth);
      $(this.vruler.turning).attr('y2', turning_start_y);

      $(this.vruler.threading).attr('visibility', 'hidden');
      $(this.vruler.threading).attr('x1', this.labelWidth);
      $(this.vruler.threading).attr('y1', threading_start_y);
      $(this.vruler.threading).attr('x2', this.labelWidth);
      $(this.vruler.threading).attr('y2', threading_start_y);
    } else {
      if (this.show_turning) {
        $(this.vruler.turning).attr('visibility', 'visible');
        $(this.vruler.turning).attr(
          'x1',
          this.labelWidth +
            (cellwidth + cellborder) * (this.vruler_position - 1)
        );
        $(this.vruler.turning).attr('y1', turning_start_y);
        $(this.vruler.turning).attr(
          'x2',
          this.labelWidth +
            (cellwidth + cellborder) * (this.vruler_position - 1)
        );
        $(this.vruler.turning).attr(
          'y2',
          turning_start_y +
            (cellheight + cellborder) * draft.getPicks() +
            cellborder
        );
      } else {
        $(this.vruler.turning).attr('visibility', 'hidden');
        $(this.vruler.turning).attr('x1', this.labelWidth);
        $(this.vruler.turning).attr('y1', turning_start_y);
        $(this.vruler.turning).attr('x2', this.labelWidth);
        $(this.vruler.turning).attr('y2', turning_start_y);
      }

      if (this.show_threading) {
        $(this.vruler.threading).attr('visibility', 'visible');

        $(this.vruler.threading).attr(
          'x1',
          this.labelWidth +
            (cellwidth + cellborder) * (this.vruler_position - 1)
        );
        $(this.vruler.threading).attr('y1', threading_start_y);
        $(this.vruler.threading).attr(
          'x2',
          this.labelWidth +
            (cellwidth + cellborder) * (this.vruler_position - 1)
        );
        $(this.vruler.threading).attr(
          'y2',
          threading_start_y +
            (cellheight + cellborder) * draft.getHoles() +
            cellborder
        );
      } else {
        $(this.vruler.threading).attr('visibility', 'hidden');
        $(this.vruler.threading).attr('x1', this.labelWidth);
        $(this.vruler.threading).attr('y1', threading_start_y);
        $(this.vruler.threading).attr('x2', this.labelWidth);
        $(this.vruler.threading).attr('y2', threading_start_y);
      }
    }
    $(this.root()).append(this.ruler_group);
    $(this.root()).append(this.threading_ruler_group);
    console.log('exit conform_rulers');
  }

  create_cell(
    x: number,
    y: number,
    offset = 0,
    group = this.main_group,
    overlay = this.overlay
  ): void {
    console.log('enter create_cell');
    /*
    let rect = this.svg.rect(
      group,
      this.labelWidth + (cellborder + cellwidth) * x,
      offset + (cellborder + cellheight) * y,
      cellwidth + cellborder,
      cellheight + cellborder,
      {
        fill: this.forwardcolour.getCSSHexadecimalRGB(),
        strokeWidth: this.show_grid ? cellborder : 0,
        stroke: '#000000',
      }
    )
*/
    let revline = undefined;
    if (overlay) {
      /*
      revline = this.svg.line(
        overlay,
        this.labelWidth + (cellborder + cellwidth) * x,
        offset + (cellborder + cellheight) * y + cellheight + cellborder,
        this.labelWidth + (cellborder + cellwidth) * x + cellwidth + cellborder,
        offset + (cellborder + cellheight) * y + cellheight + cellborder,
        {
          strokeWidth: cellborder,
          stroke: '#FF0000',
          visibility: 'hidden',
        }
      )
        */
    }

    const X_coord =
      this.labelWidth +
      cellborder +
      (cellborder + cellwidth) * x +
      cellwidth / 2;
    const Y_coord =
      offset + cellborder + (cellborder + cellheight) * y + cellheight / 2;

    /*
  let g = this.svg.group(group, {
    transform: 'translate(' + X_coord + ',' + Y_coord + ') ' + 'rotate(45)',
  })

  let ell = this.svg.ellipse(g, 0, 0, cellheight / 2, cellheight / 4, {
    fill: '#000000',
    stroke: '#000000',
    strokeWidth: 1,
  })

    return {
      rect: rect,
      g: g,
      ell: ell,
      x: X_coord,
      y: Y_coord,
      b: false,
      revline: revline,
    }*/
    console.log('exit create_cell');
  }

  remove_cell(cell): void {
    console.log('enter remove_cell');
    $(cell.rect).remove();
    $(cell.ell).remove();
    $(cell.g).remove();
    $(cell.revline).remove();
    console.log('enter remove_cell');
  }

  move_cell(cell, x: number, y: number, offset = 0): void {
    console.log('enter move_cell');

    $(cell.rect).attr('x', this.labelWidth + (cellborder + cellwidth) * x);
    $(cell.rect).attr('y', offset + (cellborder + cellheight) * y);
    $(cell.rect).css('strokeWidth', this.show_grid ? cellborder : 0);
    $(cell.revline).attr('x1', this.labelWidth + (cellborder + cellwidth) * x);
    $(cell.revline).attr('y1', offset + (cellborder + cellheight) * (y + 1));
    $(cell.revline).attr(
      'x2',
      this.labelWidth + (cellborder + cellwidth) * (x + 1)
    );
    $(cell.revline).attr('y2', offset + (cellborder + cellheight) * (y + 1));

    cell.x =
      this.labelWidth +
      cellborder +
      (cellborder + cellwidth) * x +
      cellwidth / 2;
    cell.y =
      offset + cellborder + (cellborder + cellheight) * y + cellheight / 2;

    $(cell.g).attr(
      'transform',
      'translate(' + cell.x + ',' + cell.y + ') ' + 'rotate(45)'
    );
    console.log('enter move_cell');
  }

  set_cell_direction(cell, dir): void {
    console.log('enter set_cell_direction');
    $(cell.g).attr(
      'transform',
      'translate(' +
        cell.x +
        ',' +
        cell.y +
        ') ' +
        'rotate(' +
        (dir == '\\' ? '45' : '-45') +
        ')'
    );

    console.log('enter set_cell_direction');
  }

  set_cell_colour(cell, colour) {
    console.log('enter set_cell_colour');
    if (colour == undefined) {
      $(cell.ell).attr('visibility', 'hidden');
    } else {
      $(cell.ell).removeAttr('visibility');
      $(cell.ell).attr('fill', colour.getCSSHexadecimalRGB());
    }
    console.log('enter set_cell_colour');
  }

  set_cell_background(cell, colour) {
    if (colour == undefined) {
      $(cell.rect).attr('fill', 'url(#fillpat)');
    } else {
      $(cell.rect).attr('fill', colour.getCSSHexadecimalRGB());
    }
  }

  set_cell_reverse_marker(cell, val) {
    if (val) {
      $(cell.revline).attr('visibility', 'visible');
    } else {
      $(cell.revline).attr('visibility', 'hidden');
    }
  }

  svg_coord_to_tablet(x: number, view: TDDSVGView, draft: TDDDraft) {
    const num_picks =
      view.repeats == undefined
        ? draft.getPicks()
        : (view.end_pick - view.start_pick + 1) * view.repeats;
    const labelwidth =
      (this.show_turning ? ('' + num_picks).length * 10 : 10) +
      2 * labelpadding;

    if (x < labelwidth + cellborder / 2) {
      return -1;
    } else {
      return (x - labelwidth) / (cellborder + cellwidth);
    }
  }

  svg_coord_to_pick(y: number, draft: TDDDraft) {
    const turning_start_y = this.show_twist ? cellborder + cellheight : 0;
    if (
      !this.show_turning ||
      y >= turning_start_y + (cellborder + cellheight) * draft.getPicks()
    ) {
      return -1;
    } else {
      return (
        draft.getPicks() - (y - turning_start_y) / (cellborder + cellheight) - 1
      );
    }
  }

  svg_coord_to_hole(y, draft) {
    const turning_start_y = this.show_twist ? cellborder + cellheight : 0;
    const threading_start_y =
      turning_start_y +
      (this.show_turning
        ? (cellborder + cellheight) * draft.picks() + intertablegap
        : 0);

    const threading_end_y =
      threading_start_y + (cellborder + cellheight) * draft.holes();

    if (y < threading_start_y) {
      return -1;
    } else if (y < threading_end_y) {
      return (y - threading_start_y) / (cellborder + cellheight);
    } else {
      return -1;
    }
  }
}
