import { Directive, Input, HostListener, Renderer2, ElementRef } from '@angular/core';


@Directive({ selector: '[hoverClass]' })
export class HoverClassDirective {
  @Input()
  hoverClass: string;

  constructor(
    public elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  @HostListener('mouseover') mouseover() {
    this.hoverClass.split(' ').forEach(cls => {
      this.renderer.addClass(this.elementRef.nativeElement, cls);
    });
  }

  @HostListener('mouseout') mouseout() {
    this.hoverClass.split(' ').forEach(cls => {
      this.renderer.removeClass(this.elementRef.nativeElement, cls);
    });
  }
}
