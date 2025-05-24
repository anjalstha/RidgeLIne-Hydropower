import { ComponentFixture, TestBed } from '@angular/core/testing';
import { teamPage } from './team.page';

describe('teamPage', () => {
  let component: teamPage;
  let fixture: ComponentFixture<teamPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(teamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
