import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  isMobileDevice = false;

  private collapseSubject = new BehaviorSubject<boolean>(
    this.checkWindowWidth()
  );
  collapse$ = this.collapseSubject.asObservable();

  private iconsVisibleSubject = new BehaviorSubject<boolean>(
    this.checkWindowWidthForIcons()
  );
  iconsVisible$ = this.iconsVisibleSubject.asObservable();

  private dropdownSubject = new BehaviorSubject<boolean>(false);
  dropdown$ = this.dropdownSubject.asObservable();

  constructor() {
    // Monitor for window resize and update both observables
    fromEvent(window, 'resize')
      .pipe(
        map(() => {
          const isCollapsed = this.checkWindowWidth();
          const iconsVisible = this.checkWindowWidthForIcons();
          return { isCollapsed, iconsVisible };
        })
      )
      .subscribe(({ isCollapsed, iconsVisible }) => {
        this.collapseSubject.next(isCollapsed);
        this.iconsVisibleSubject.next(iconsVisible);
      });
  }

  private checkWindowWidth(): boolean {
    return window.innerWidth <= 900;
  }

  private checkWindowWidthForIcons(): boolean {
    return window.innerWidth <= 768; // Adjust this width as per your requirement
  }

  toggleDropdown() {
    this.dropdownSubject.next(!this.dropdownSubject.value);
  }

  closeDropdown() {
    this.dropdownSubject.next(false);
  }

    // Check if the device is mobile based on user-agent string
    checkMobileDevice(): boolean {
      return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
  }

