import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared-service';
import { Router } from '@angular/router';
import { recommendedUnitsInterface, OwningLocation } from '../../app/model/interface-model';



@Component({
  selector: 'app-fourth-child-comp',
  imports: [CommonModule],
  templateUrl: './fourth-child-comp.html',
  styleUrl: './fourth-child-comp.scss',
})
export class FourthChildComp implements OnInit {

  sharedService = inject(SharedService);
  router = inject(Router);
  recUnits: recommendedUnitsInterface | null = null;
  ownLoc: OwningLocation | null = null;
  UnitNumberInfo = false;
  recievedData = computed(() => this.sharedService.responseData());

  ngOnInit(): void {
    const data = this.recievedData();

    if (!data || !data.myLocation?.length) {
      return;
    }

    this.recUnits = data.myLocation[0].available?.availableUnits?.[0].recommendUnits?.[0];

    this.UnitNumberInfo = this.recUnits?.unitNumber === '99804278';

    this.ownLoc = this.recUnits?.owningLocation || null;
    console.log('Unit:', this.recUnits);
    console.log('Unit Number Match:', this.UnitNumberInfo);
  }

  backToFirst() {
    this.router.navigate(['component-1']);
  }
}
