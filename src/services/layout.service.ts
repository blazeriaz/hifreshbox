import { Injectable, Inject } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SimpleStore } from 'lib/simple.store';
import { WINDOW } from './window.services';
import { Observable } from 'rxjs/observable';

@Injectable()
export class LayoutService {
  private layoutStore$: SimpleStore<any>;
  private breakpoints = [];

  constructor(
    private eventManager: EventManager,
    @Inject(WINDOW) private window: Window,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.layoutStore$ = new SimpleStore({
      currentBP: 'xs'
    });

    this.eventManager.addGlobalEventListener('window', 'resize', this.onResize.bind(this));
  }

  public layoutInit() {
    const bpSizes = [0, 576, 768, 992, 1200];
    ['xs', 'sm', 'md', 'lg', 'xl'].forEach((bpKey, index) => {
      this.breakpoints.push({
        key: bpKey,
        size: bpSizes[index]
      });
    });
    this.layoutStore$.setState({currentBP: this.getCurrentBreakPoint()});
  }

  private onResize() {
    this.layoutStore$.setState({currentBP: this.getCurrentBreakPoint()});
  }

  getCurrentBreakPoint() {
    return [...this.breakpoints].reverse().find(x => {
      if (x.size <= this.window.innerWidth) {
        return true;
      }
    }).key;
  }

  getBelowBreakPoints(bp) {
    const currentBPIndex = this.breakpoints.findIndex(x => x.key === bp);
    return this.breakpoints.slice(0, currentBPIndex).map(x => x.key);
  }

  getAboveBreakPoints(bp) {
    const BPlength = this.breakpoints.length;
    const currentBPIndex = this.breakpoints.findIndex(x => x.key === bp);
    return this.breakpoints.slice(currentBPIndex, BPlength - currentBPIndex).map(x => x.key);
  }

  getCurrentBreakPointState(): Observable<any> {
    return this.layoutStore$.select('currentBP');
  }
}
