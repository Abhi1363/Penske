import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component1 } from './component-1';

describe('Component1', () => {
  let component: Component1;
  let fixture: ComponentFixture<Component1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Component1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Component1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
