import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourthChildComp } from './fourth-child-comp';

describe('FourthChildComp', () => {
  let component: FourthChildComp;
  let fixture: ComponentFixture<FourthChildComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FourthChildComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FourthChildComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
