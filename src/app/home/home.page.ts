import { CommonService } from './../services/common.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  encapsulation: ViewEncapsulation.None, // Disables style encapsulation

})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild('animatedImage') animatedImage!: ElementRef;

  stickytoolbar = true;
  collapse = false;
  showDropdown = false;
  iconsVisible = false;
  private subscriptions: Subscription[] = [];
  startTranslate: number = 0; // Starting translate value during drag
  currentTranslate: number = 0; // Current translate value
  prevTranslate: number = 0; // Previous translate value
  isDragging: boolean = false; // Flag to check if dragging is active
  startX: number = 0; // Initial X position on drag start
  currentIndex: number = 0; // Current slide index
  deviceType: string = '';
  intervalId: any; // For storing the interval reference

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    public commonService: CommonService,
    private router: Router
  ) {}

  images = [
    {
      src: 'assets/images/HomeCoverImage.jpg',
      alt: 'Image 1',
      link: '/contact',
      name: 'Contant us',
    },
    {
      src: 'assets/images/NewsImage1.jpg',
      alt: 'Image 2',
      link: '/about-us',
      name: 'About us',
    },
    {
      src: 'assets/images/ProjectImage1.jpg',
      alt: 'Image 3',
      link: '/contact',
      name: 'Contant us',
    },
  ];

  ngOnInit() {
    this.startAutoSlide();
    this.detectDevice();
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

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 10000);
  }

  detectDevice(): void {
    const userAgent = navigator.userAgent.toLowerCase();

    if (
      userAgent.includes('android') ||
      userAgent.includes('iphone') ||
      userAgent.includes('ipad')
    ) {
      this.deviceType = 'mobile';
    } else if (userAgent.includes('tablet')) {
      this.deviceType = 'tablet';
    } else {
      this.deviceType = 'desktop';
    }

    console.log('Device Type:', this.deviceType);
  }

  toggleDropdown() {
    this.commonService.toggleDropdown();
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

  onScroll = (event: any) => {
    const scrollPosition = event.target.scrollTop;
    if (scrollPosition > 50) {
      this.stickytoolbar = false;
    } else {
      this.stickytoolbar = true;
    }
  };

  navigateTo(link: string) {
    this.router.navigateByUrl(link);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length; // Loop to the first slide if it's the last one
    this.setSlidePosition();
  }

  prevSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length; // Loop to the last slide if it's the first one
    this.setSlidePosition();
  }

  onTouchStart(event: TouchEvent | MouseEvent) {
    this.isDragging = true;
    this.startX = this.getPositionX(event); // Capture the initial touch/mouse position
    this.startTranslate = this.currentTranslate; // Record the starting translate value
    const sliderWrapper =
      this.elementRef.nativeElement.querySelector('.slider-wrapper');
    this.renderer.setStyle(sliderWrapper, 'transition', 'none'); // Disable transition while dragging
  }

  onTouchMove(event: TouchEvent | MouseEvent) {
    if (!this.isDragging) return;

    const currentX = this.getPositionX(event); // Get current touch/mouse position
    const movementX = currentX - this.startX; // Calculate movement from start
    this.currentTranslate = this.startTranslate + movementX; // Adjust translate value based on movement

    const sliderWrapper =
      this.elementRef.nativeElement.querySelector('.slider-wrapper');
    this.renderer.setStyle(
      sliderWrapper,
      'transform',
      `translateX(${this.currentTranslate}px)`
    ); // Apply dragging effect
    // this.onTouchEnd()
  }

  onTouchEnd() {
    this.isDragging = false;

    const movedBy = this.currentTranslate - this.startTranslate; // Total movement from the start position

    if (movedBy < -50 && this.currentIndex < this.images.length - 1) {
      // Dragged left enough, go to next slide
      this.nextSlide();
    } else if (movedBy > 50 && this.currentIndex > 0) {
      // Dragged right enough, go to previous slide
      this.prevSlide();
    } else {
      // Reset to the current slide position
      this.setSlidePosition();
    }
  }

  setSlidePosition() {
    const sliderWrapper =
      this.elementRef.nativeElement.querySelector('.slider-wrapper');

    // Ensure the currentIndex stays within bounds
    if (this.deviceType === 'desktop') {
      this.currentTranslate = this.currentIndex * (-window.innerWidth + 17); // Adjust based on window width
    } else {
      this.currentTranslate = this.currentIndex * -window.innerWidth;
    }

    this.prevTranslate = this.currentTranslate;

    // Add smooth transition for infinite sliding
    this.renderer.setStyle(
      sliderWrapper,
      'transition',
      'transform 1s ease-in-out'
    );
    this.renderer.setStyle(
      sliderWrapper,
      'transform',
      `translateX(${this.currentTranslate}px)`
    );
  }

  private getPositionX(event: TouchEvent | MouseEvent): number {
    return event instanceof TouchEvent
      ? event.touches[0].clientX
      : (event as MouseEvent).clientX;
  }

  @HostListener('window:resize')
  onResize() {}

  goToTeamPage() {
    this.router.navigate(['team']);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  scrollToTop() {
    this.content.scrollToTop(500);
  }

  goToAboutUsPage(){
    this.router.navigate(['about-us']);
    }

    goToProject(project:any){
      this.router.navigate(['projects', project]);
    }

    goToNewsPage(){

    }
}
