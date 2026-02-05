import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-third-child-comp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './third-child-comp.html',
  styleUrls: ['./third-child-comp.scss'],
})
export class ThirdChildComp {
  sharedService = inject(SharedService);
  router = inject(Router);
  
  receivedData = computed(() => this.sharedService.responseData());
   searchTerm = '';

  get flatUnits() {
    const data = this.receivedData();
    if (!data?.otherLocations) return [];

    return data.otherLocations.flatMap((loc: any) => [
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
    return this.filteredUnits.filter((unit: any) => unit.cdlCategory === 'CDL');
  }
  get ncdlUnits() {
    return this.filteredUnits.filter((unit: any) => unit.cdlCategory === 'NCDL');
  }
  get nullUnits() {
    return this.filteredUnits.filter((unit: any) => unit.cdlCategory === null);
  }

  constructor() {
    console.log('Received Data in Third Child Component:', this.receivedData());
    console.log('Flat Units in Third Child Component:', this.flatUnits);
    console.log('CDL Units:', this.cdlUnits);
    console.log('NCDL Units:', this.ncdlUnits);
    console.log('NULL Category Units:', this.nullUnits);
    console.log('Filtered Units based on search term:', this.filteredUnits);
  }

  backToFirst() {
    this.router.navigate(['component-1']);
  }
}

