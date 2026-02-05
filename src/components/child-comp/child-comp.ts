import { Component, computed, inject, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-child-comp',
  imports: [CommonModule, FormsModule],
  templateUrl: './child-comp.html',
  styleUrl: './child-comp.scss',
})
export class ChildComp implements OnInit {
  sharedService = inject(SharedService);
  router = inject(Router);

  receivedData = computed(() => {
    return this.sharedService.responseData();
  })
 
  searchTerm = '';
  


flatUnits: any[] = [];

ngOnInit() {
  this.flatUnits = this.buildFlatUnits();
}

private buildFlatUnits() {
  const data = this.receivedData();
  if (!data?.myLocation) return [];

  return data.myLocation.flatMap((loc: any) => [
    ...(loc.available?.availableUnits ?? []).flatMap((u: any) =>
      (u.recommendUnits ?? []).map((r: any) => ({ ...r, bucket: 'AVAILABLE' }))
    ),
    ...(loc.contractDueIn?.contractDueInUnits ?? []).flatMap((u: any) =>
      (u.recommendUnits ?? []).map((r: any) => ({ ...r, bucket: 'CONTRACT_DUE_IN' }))
    ),
    ...(loc.deadLine?.deadLineUnits ?? []).flatMap((u: any) =>
      (u.recommendUnits ?? []).map((r: any) => ({ ...r, bucket: 'DEADLINE' }))
    ),
    ...(loc.hold?.holdUnits ?? []).flatMap((u: any) =>
      (u.recommendUnits ?? []).map((r: any) => ({ ...r, bucket: 'HOLD' }))
    ),
    ...(loc.nonRev?.nonRevUnits ?? []).flatMap((u: any) =>
      (u.recommendUnits ?? []).map((r: any) => ({ ...r, bucket: 'NON_REV' }))
    ),
    ...(loc.onYard?.onYardUnitsList ?? []).flatMap((u: any) =>
      (u.recommendedUnits ?? []).map((r: any) => ({ ...r, bucket: 'ON_YARD' }))
    ),
    ...(loc.subs?.subsUnits ?? []).flatMap((u: any) =>
      (u.recommendUnits ?? []).map((r: any) => ({ ...r, bucket: 'SUBS' }))
    ),
  ]);
}

  get filteredUnits() {
    if (!this.searchTerm) {
      return this.flatUnits;
    }
   
    return this.flatUnits.filter((unit:any)=>{
      return unit.unitNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
             (unit.unitDescription && unit.unitDescription.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
             (unit.roNumber && unit.roNumber.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
             (unit.unitClassCode && unit.unitClassCode.toLowerCase().includes(this.searchTerm.toLowerCase()));
    })

  }

selectedType: 'CDL' | 'NCDL' | null = 'CDL'; 

  get cdlUnits() {
    return this.filteredUnits.filter((unit: any) => unit.cdlCategory === 'CDL' );
   
  }
  get ncdlUnits() {
    return this.filteredUnits.filter((unit: any) => unit.cdlCategory === 'NCDL');
  }
  get nullUnits() {
    return this.filteredUnits.filter((unit: any) => unit.cdlCategory === null);
  }

  constructor() {
    console.log('Received Data in Child Component(Whole data):', this.receivedData());
    console.log('Flattened Units in Child Component:', this.flatUnits);
    // console.log('CDL Category:', this.data);
    console.log('CDL Units:', this.cdlUnits);
    console.log('NCDL Units:', this.ncdlUnits);
    console.log('NULL Category Units:', this.nullUnits);
    console.log('Filtered Units based on search term:', this.filteredUnits);

  }
  backToFirst() {
    this.router.navigate(['component-1']);
  }
}
