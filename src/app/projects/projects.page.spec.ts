import { ComponentFixture, TestBed } from '@angular/core/testing';
import { projectsPage } from './projects.page';

describe('projectsPage', () => {
  let component: projectsPage;
  let fixture: ComponentFixture<projectsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(projectsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
