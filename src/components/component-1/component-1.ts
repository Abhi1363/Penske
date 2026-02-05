import { Component, effect, inject, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared-service';
import { mockdata } from '../../mockdata/mockdata';
import { Router } from '@angular/router';
import { recommendedUnitsInterface } from '../../app/model/interface-model';

@Component({
  selector: 'app-component-1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './component-1.html',
  styleUrls: ['./component-1.scss'],
})
export class Component1 {
  data: Signal<any> = signal(mockdata);
  private sharedService = inject(SharedService);
  private router = inject(Router);

  constructor() {

    console.log('Data in Component 1:', this.data());
    effect(() => {
      this.sharedService.setResponseData(this.data());
    })

  }

  showChild() {
    this.router.navigate(['child-comp']);
  }
  showSecondChild() {
    this.router.navigate(['child-second']);
  }
  showThirdChild() {
    this.router.navigate(['child-third']);
  }
  showFourthChild() {
    this.router.navigate(['child-fourth']);
  }
}