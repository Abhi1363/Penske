import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdChildComp } from './third-child-comp';

describe('ThirdChildComp', () => {
  let component: ThirdChildComp;
  let fixture: ComponentFixture<ThirdChildComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdChildComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThirdChildComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
