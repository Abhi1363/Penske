import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondChildComp } from './second-child-comp';

describe('SecondChildComp', () => {
  let component: SecondChildComp;
  let fixture: ComponentFixture<SecondChildComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondChildComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondChildComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
