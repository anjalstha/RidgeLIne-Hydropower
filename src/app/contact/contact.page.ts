import { CommonService } from './../services/common.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild, AfterViewChecked,
} from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild(IonContent, { static: false }) content!: IonContent;
  stickytoolbar = true;
  collapse = false;
  showDropdown = false;
  iconsVisible = false;
  private subscriptions: Subscription[] = [];
  constructor(
    public commonService: CommonService,
    private router: Router,
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {}

  currentSlide = 0;
  slides = [
    'assets/images/1.jpeg',
    'assets/images/2.jpeg',
    'assets/images/3.jpeg',
    'assets/images/4.jpeg',
  ];

  get slidesPerView() {
    if (window.innerWidth >= 769) return 3;
    if (window.innerWidth >= 577) return 2;
    return 1;
  }

  get totalSlides() {
    return this.slides.length;
  }

  ngOnInit() {
    this.subscriptions.push(
      this.commonService.collapse$.subscribe((isCollapsed) => {
        this.collapse = isCollapsed;
        if (!isCollapsed) {
          this.commonService.closeDropdown();
        }
      }),

      this.commonService.dropdown$.subscribe((isDropdownVisible) => {
        this.showDropdown = isDropdownVisible;
      }),

      this.commonService.iconsVisible$.subscribe((isVisible) => {
        this.iconsVisible = isVisible;
      }),

      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.commonService.closeDropdown();
        }
      })
    );
  }

  ngAfterViewInit() {
    this.content.getScrollElement().then((scrollElement) => {
      scrollElement.addEventListener('scroll', this.onScroll);
    });

    const images =
      this.elementRef.nativeElement.querySelectorAll('.slide-down');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(entry.target, 'active');
          }
        });
      },
      { threshold: 0.5 }
    );

    images.forEach((image: Element) => {
      observer.observe(image);
    });


  }

  ngAfterViewChecked(){
    this.emailPointerEvent();

  }


  emailPointerEvent() {
setTimeout(async() => {
  let emailInput = document.getElementById("ion-input-0");
  emailInput!.style.cursor = "pointer";
}, 5);
  }

  onScroll = (event: any) => {
    const scrollPosition = event.target.scrollTop;
    console.log('Scroll position during scroll:', scrollPosition);
    if (scrollPosition > 50) {
      this.stickytoolbar = false;
    } else {
      this.stickytoolbar = true;
    }
  };

  scrollToTop() {
    this.content.scrollToTop(500); // Scroll to top with 500ms animation
  }

  nextSlide() {
    if (this.currentSlide + this.slidesPerView < this.totalSlides) {
      this.currentSlide += this.slidesPerView;
    }
  }

  prevSlide() {
    if (this.currentSlide >= this.slidesPerView) {
      this.currentSlide -= this.slidesPerView;
    }
  }

  get visibleSlides() {
    return this.slides.slice(
      this.currentSlide,
      this.currentSlide + this.slidesPerView
    );
  }

  @HostListener('window:resize')
  onResize() {}

  toggleDropdown() {
    this.commonService.toggleDropdown();
  }

  readmore() {}
}
