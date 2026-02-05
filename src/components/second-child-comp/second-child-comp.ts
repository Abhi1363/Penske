import { Component, inject, Signal } from '@angular/core';
import { signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared-service';
import { Reservation } from '../../app/model/reservation-interface-model';
import { HostListener, ViewChild, ElementRef } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-second-child-comp',
  standalone: true,
  imports: [CommonModule, FormsModule, TooltipModule, DatePickerModule],
  templateUrl: './second-child-comp.html',
  styleUrls: ['./second-child-comp.scss'],
})
export class SecondChildComp {

  // Dependencies
  sharedService = inject(SharedService);
  router = inject(Router);


  // Data
  data = this.sharedService.reservationData();
  displayData: Reservation[] = [];

  // Status Filters

  tempStatusFilters = {
    checkedLS: false,
    checkedHH: false,
    checkedPR: false,
  };

  appliedStatusFilters = signal({
    checkedLS: false,
    checkedHH: false,
    checkedPR: false,
  });

  // Status-based getters
  get lease() {
    return this.data.filter((res: Reservation) => res.reservationStatus === 'lease');
  }

  get confirmed() {
    return this.data.filter((res: Reservation) => res.reservationStatus === 'confirmed');
  }

  get waitlist() {
    return this.data.filter((res: Reservation) => res.reservationStatus === 'waitlist');
  }

  get onewayReservations() {
    return this.data.filter((res: Reservation) => res.tripType === 'oneway');
  }

  get roundtripReservations() {
    return this.data.filter((res: Reservation) => res.tripType === 'roundtrip');
  }

  // Combined Filtering Logic
  filteredData = computed(() => {
    const result = this.data
      .filter((item: Reservation) => this.filterByStatus(item))
      .filter((item: Reservation) => this.filterByTrip(item))
      .filter((item: Reservation) => this.filterById(item))
      .filter((item: Reservation) => this.filterByDate(item?.pickUp?.pickUpDate));

    if (this.appliedCustomerName()) {
      return [...result].sort(this.sortByName);
    }
    if (this.appliedPickUpDate()) {
      return [...result].sort(this.sortbyDate);
    }
    return result;
  });


  filterByStatus(item: Reservation) {
    const status = this.appliedStatusFilters();
    if (status.checkedLS && item.reservationStatus === 'lease') {
      return true;

    }

    if (status.checkedHH && item.reservationStatus === 'confirmed') {
      return true;
    }

    if (status.checkedPR && item.reservationStatus === 'waitlist') {
      return true;
    }

    if (!status.checkedLS &&
      !status.checkedHH &&
      !status.checkedPR
    ) {
      return true;
    }

    return false;
  }

  // Trip Filters

  temptripFilters = {
    checkedOneWay: false,
    checkedRoundTrip: false,
  };

  appliedtripFilters = signal({
    checkedOneWay: false,
    checkedRoundTrip: false,
  });

  filterByTrip(item: Reservation) {
    const trip = this.appliedtripFilters();
    if (trip.checkedOneWay && item.tripType === 'oneway') {
      return true;
    }
    if (trip.checkedRoundTrip && item.tripType === 'roundtrip') {
      return true;
    }
    if (
      !trip.checkedOneWay &&
      !trip.checkedRoundTrip
    ) {
      return true;
    }
    return false;
  }

  //  filteredByIdData() {
  //   const filtered = this.filteredData(); // status + trip applied
  //   const id = this.reservationIdInput().trim();

  //   console.log('--- Debug filteredByIdData ---');
  //   console.log('Reservation ID input:', id);
  //   console.log('Filtered by status & trip:', filtered);
  //   if (!id){ 
  //        console.log('No ID entered, returning filtered array as is');
  //     return  filtered;} // no ID → return array
  //   const item = filtered.find((item: Reservation) => item.reservationId === id);
  //   console.log('Item found by ID:', item); 

  //   return item ? [item] : []; // return array with single item or empty array
  // }

  tempReservationIdInput = signal<string>('');

  appliedReservationIdInput = signal<string>('');

  // Reservation ID Input
  reservationIdInput = signal<string>('');

  filterById(item: Reservation): boolean {
    const id = this.appliedReservationIdInput().trim();

    // No ID entered → allow all items
    if (!id) return true;

    return item.reservationId === id;

  }
  // Date filters
  tempSelectedDate = signal<Date | null>(null);
  selectedDate = signal<Date | null>(null);

  onDateChange(date: Date | null) {
    this.tempSelectedDate.set(date);
  }

  filterByDate(itemDate: string | Date): boolean {
    const selected = this.selectedDate();
    if (!selected) return true;

    const item = new Date(itemDate);

    return (
      item.getFullYear() === selected.getFullYear() &&
      item.getMonth() === selected.getMonth() &&
      item.getDate() === selected.getDate()
    );
  }

  // Sort by Customer Name

  tempCustomerName = signal(false);
  appliedCustomerName = signal(false);

  sortByName(a: Reservation, b: Reservation): number {
    const nameA = a.consumerCustomer?.firstName?.toLowerCase() || '';
    const nameB = b.consumerCustomer?.firstName?.toLowerCase() || '';
    return nameA.localeCompare(nameB);
  }

  // Sort by PickUp Date
  tempPickUpDate = signal(false);
  appliedPickUpDate = signal(false);
  sortbyDate(a: Reservation, b: Reservation): number {
    const dateA = new Date(a.pickUp?.pickUpDate || '');
    const dateB = new Date(b.pickUp?.pickUpDate || '');
    return dateA.getTime() - dateB.getTime();
  }



  // Apply Filters
  applyStatusFilters() {
    this.appliedStatusFilters.set({ ...this.tempStatusFilters });
  }

  applyTripFilters() {
    this.appliedtripFilters.set({ ...this.temptripFilters });
  }

  applyIdFilter() {
    this.appliedReservationIdInput.set(this.tempReservationIdInput());
  }

  applyDateFilter() {
    this.selectedDate.set(this.tempSelectedDate());
  }
  applySortByName() {
    this.appliedCustomerName.set(this.tempCustomerName());

  }

  applyPickUpDate() {
    this.appliedPickUpDate.set(this.tempPickUpDate());

  }
  // No applySortType; gates are appliedCustomerName/appliedPickUpDate


  applyFilters() {
    this.applyStatusFilters();
    this.applyTripFilters();
    this.applyIdFilter();
    this.applyDateFilter();
    this.applySortByName();
    this.applyPickUpDate();
    this.closeFilter();

    this.displayData = this.filteredData();

  }

  isFilterOpen = signal(false);

  @ViewChild('filterPanel') filterPanel!: ElementRef;

  closeFilter() {
    this.isFilterOpen.set(false);
    this.selectSection('status');
  }
  toggleFilter(event: MouseEvent) {
    event.stopPropagation();
    this.isFilterOpen.set(!this.isFilterOpen());
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.isFilterOpen() && this.filterPanel &&
      !this.filterPanel.nativeElement.contains(event.target)) {
      this.closeFilter();
    }
  }

  clearFilters() {
    // Clear status filters
    this.clearStatus('LS');
    this.clearStatus('HH');
    this.clearStatus('PR');

    // Clear trip filters
    this.clearTrip('OneWay');
    this.clearTrip('RoundTrip');

    // Clear ID filter
    this.clearId();

    // Clear date filter
    this.clearDate();

    // Clear sort options
    this.clearSortByName();

    //clear sort by date
    this.clearPickUpDate();

    // close 
    this.closeFilter();
  }

  //for making html template easy for looping

  appliedStatusLabel = computed(() => {
    const s = this.appliedStatusFilters();
    return [
      s.checkedLS && 'LS',
      s.checkedHH && 'HH',
      s.checkedPR && 'PR'
    ].filter(Boolean).join(', ');
  });


  isStatusApplied = computed(() => {
    const s = this.appliedStatusFilters();
    return s.checkedLS || s.checkedHH || s.checkedPR;

  });

  clearStatus(type: 'LS' | 'HH' | 'PR') {
    this.tempStatusFilters = {
      ...this.tempStatusFilters,
      [`checked${type}`]: false,
    };

    this.appliedStatusFilters.update(s => ({
      ...s,
      [`checked${type}`]: false,
    }));
  }

  clearTrip(type?: 'OneWay' | 'RoundTrip') {
    this.temptripFilters = {
      ...this.temptripFilters,
      [`checked${type}`]: false,
    };

    this.appliedtripFilters.update(s => ({
      ...s,
      [`checked${type}`]: false,
    }));
  }

  clearId() {
    this.tempReservationIdInput.set('');
    this.appliedReservationIdInput.set('');

  }

  clearDate() {
    this.tempSelectedDate.set(null);
    this.selectedDate.set(null);
  }
  clearSortByName() {
    this.tempCustomerName.set(false);
    this.appliedCustomerName.set(false);
  }
  clearPickUpDate() {
    this.tempPickUpDate.set(false);
    this.appliedPickUpDate.set(false);
  }


  hasActiveFilters = computed(() =>
    this.appliedStatusFilters().checkedLS ||
    this.appliedStatusFilters().checkedHH ||
    this.appliedStatusFilters().checkedPR ||
    this.appliedtripFilters().checkedOneWay ||
    this.appliedtripFilters().checkedRoundTrip ||
    !!this.appliedReservationIdInput() ||
    !!this.selectedDate() ||
    this.appliedCustomerName() ||
    this.appliedPickUpDate()
  );


  activeSection: 'status' | 'trip' | 'id' | 'date' | 'sort' = 'status';

  selectSection(section: 'status' | 'trip' | 'id' | 'date' | 'sort') {
    this.activeSection = section;
  }


  backToFirst() {
    this.router.navigate(['component-1']);
  }

  constructor() {
    this.displayData = this.filteredData();
    console.log('Received Data in Second Child Component:', this.filteredData());
    console.log('Lease Reservations:', this.lease);
    console.log('Confirmed Reservations:', this.confirmed);
    console.log('Waitlist Reservations:', this.waitlist);
    console.log('date selected:', this.selectedDate());
    console.log('sort selected:', this.activeSection === 'sort');



  }
}
