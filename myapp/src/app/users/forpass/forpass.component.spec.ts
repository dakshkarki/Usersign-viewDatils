import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForpassComponent } from './forpass.component';

describe('ForpassComponent', () => {
  let component: ForpassComponent;
  let fixture: ComponentFixture<ForpassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForpassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForpassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
