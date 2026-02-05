import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildComp } from './child-comp';

describe('ChildComp', () => {
  let component: ChildComp;
  let fixture: ComponentFixture<ChildComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
