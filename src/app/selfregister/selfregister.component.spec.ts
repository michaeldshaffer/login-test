import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfregisterComponent } from './selfregister.component';

describe('SelfregisterComponent', () => {
  let component: SelfregisterComponent;
  let fixture: ComponentFixture<SelfregisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfregisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
