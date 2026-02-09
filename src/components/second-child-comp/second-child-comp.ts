import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { Reservation } from '../../app/model/reservation-interface-model';
import { Filter } from './filter-modal/filter';
import { signal,computed } from '@angular/core';
import { SharedService } from '../../services/shared-service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-second-child-comp',
  standalone: true,
  imports: [CommonModule, TooltipModule, Filter],
  templateUrl: './second-child-comp.html',
})
export class SecondChildComp {
 sharedService = inject(SharedService);
  receivedData = computed(() => this.sharedService.responseData());
    // recUnits = computed(() => this.receivedData().myLocation[0].available?.availableUnits[0]?.recommendUnits );
    //     recUnits2 = computed(() => this.receivedData()?.otherLocations?.[0]?.available?.availableUnits?.[ 10]?.recommendUnits ?? []);
    // unitclassNo =  computed(() => this.receivedData()?.myLocation?.[0]?.available?.availableUnits ?? []);


  myLocflatUnits() {
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

    othLocflatUnits() {
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


activeType: 'MyLocation' | 'OtherLocation'= 'MyLocation';
   selectedType(section: 'MyLocation' | 'OtherLocation') {
    this.activeType = section;
  }

  selectedMode = signal<'Truck' | 'Tow' | null>(null);
  truckSelected = signal(false);
  towSelected = signal(false);

  


  filteredData: Reservation[] = [];

  onFilteredData(data: Reservation[]) {
    this.filteredData = data;
  }
    isFilterOpen = signal(false);
   toggleFilter(event: MouseEvent) {
    event.stopPropagation();
    this.isFilterOpen.set(!this.isFilterOpen());
  }
   constructor() {
    console.log('Mock Data:', this.receivedData());
    // console.log('Recommended Units:', this.recUnits());
    // console.log('Recommended Units Other Location:', this.recUnits2());
    // console.log('Unit Class:', this.unitclassNo());
    console.log('Flat Units My Location:', this.myLocflatUnits());

      console.log('Flat Units other Location:', this.othLocflatUnits());
    
  }
  
}
