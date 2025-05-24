import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appParallax]'
})
export class ParallaxDirective {
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    const scrolled = window.scrollY;
    this.renderer.setStyle(this.elementRef.nativeElement, 'transform', `translateY(${scrolled * 0.4}px)`);
  }
}
