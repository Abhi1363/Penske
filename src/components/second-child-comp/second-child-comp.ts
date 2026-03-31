import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { Reservation } from '../../app/model/reservation-interface-model';
import { Filter } from './filter-modal/filter';
import { signal, computed } from '@angular/core';
import { SharedService } from '../../services/shared-service';
import { inject } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { SearchModal } from './search-modal/search';
import { Router } from '@angular/router';

@Component({
  selector: 'app-second-child-comp',
  standalone: true,
  imports: [CommonModule, TooltipModule, Filter, DatePickerModule, FormsModule, SearchModal],
  templateUrl: './second-child-comp.html',
})
export class SecondChildComp {
  sharedService = inject(SharedService);
  receivedData = computed(() => this.sharedService.responseData());

  router = inject(Router);

  activeRight = signal(false);

  RightSectionData() {
    this.activeRight.set(true);

  }

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

  activeType: 'MyLocation' | 'OtherLocation' = 'MyLocation';
  selectedType(section: 'MyLocation' | 'OtherLocation') {
    this.activeType = section;
  }

  selectedMode = signal<'Truck' | 'Tow' | null>(null);
  truckSelected = signal(false);
  towSelected = signal(false);

  filteredDatabySearch: Reservation[] = [];
  filteredDatabyfilter: Reservation[] = [];

  @ViewChild(Filter) filterComp!: Filter;
  @ViewChild('searchModal') searchModal!: any;


  isFilterOpen = signal(false);
  toggleFilter(event: MouseEvent) {
    event.stopPropagation();
    this.isFilterOpen.set(!this.isFilterOpen());
  }


  onFilteredData(data: Reservation[]) {
    this.filteredDatabyfilter = data ?? [];
  }

  onSearchData(data: Reservation[]) {
    this.filteredDatabySearch = data ?? [];
  }


  get finalData(): Reservation[] {
    const original = this.sharedService.reservationData() ?? [];
    const hasFilterApplied = this.filterComp?.hasActiveFilters() ?? false;
    const searchMode = this.searchModal?.dateWithin() ?? 'daily';
    const hasSearchApplied = searchMode === 'weekly' || searchMode === 'custom';
    const hasDailySearchResults = !!(this.filteredDatabySearch && this.filteredDatabySearch.length);
    // Weekly or custom search handling
    if (hasSearchApplied && hasFilterApplied) {
      return this.filteredDatabySearch.filter(item =>
        this.filteredDatabyfilter.some(f => f.reservationId === item.reservationId)
      );
    }

    if (hasSearchApplied) {
      return this.filteredDatabySearch;
    }

    // Daily search + filters -> intersect; Daily search only -> return daily search
    if (searchMode === 'daily') {
      if (hasDailySearchResults && hasFilterApplied) {
        return this.filteredDatabySearch.filter(item =>
          this.filteredDatabyfilter.some(f => f.reservationId === item.reservationId)
        );
      }

      if (hasDailySearchResults) {
        return this.filteredDatabySearch;
      }
    }

    if (hasFilterApplied) {
      return this.filteredDatabyfilter;
    }

    return [];
  }


  uniquePickUpDates(): string[] {
    return [...new Set(
      this.finalData
        .map(item => item?.pickUp?.pickUpDate)
        .filter(Boolean)
    )].sort((a, b) =>
      new Date(a!).getTime() - new Date(b!).getTime()
    );
  }

    backToFirst() {
    this.router.navigate(['component-1']);
  }
  
  constructor() {
    console.log('Mock Data:', this.receivedData());
    console.log('Flat Units My Location:', this.myLocflatUnits());
    console.log('Flat Units other Location:', this.othLocflatUnits());


  }

}

