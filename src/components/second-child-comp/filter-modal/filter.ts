import { Component, inject, Signal, OnInit, effect } from '@angular/core';
import { signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../../services/shared-service';
import { Reservation } from '../../../app/model/reservation-interface-model';
import { HostListener, ViewChild, ElementRef } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { DatePickerModule } from 'primeng/datepicker';
import { Output, EventEmitter } from '@angular/core';
import { FilterService } from '../../../services/filter-service/filter-service';


@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePickerModule],
  templateUrl: './filter.html',
})

export class Filter implements OnInit {
  @Output() filtered = new EventEmitter<Reservation[]>();

  ngOnInit() {
    this.displayData = this.filteredData();
    this.filtered.emit(this.filteredData());
  }

  // Dependencies
  sharedService = inject(SharedService);
  router = inject(Router);
  filterService = inject(FilterService);

  // Data
  data = this.sharedService.reservationData();
  displayData: Reservation[] = [];

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
    let result = this.data
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

  tempReservationIdInput = signal<string>('');

  appliedReservationIdInput = signal<string>('');

  // Reservation ID Input
  reservationIdInput = signal<string>('');

  filterById(item: Reservation): boolean {
    const id = this.appliedReservationIdInput().trim();

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
    this.filtered.emit(this.data);
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

  applyFilters() {
    this.applyStatusFilters();
    this.applyTripFilters();
    this.applyIdFilter();
    this.applyDateFilter();
    this.applySortByName();
    this.applyPickUpDate();
    this.closeFilter();

    this.displayData = this.filteredData();
    this.filtered.emit(this.filteredData());
    
  }

  defaultDate = signal<Date>(new Date());

  defaultfilterByDate(itemDate: string | Date): boolean {
    return this.filterService.defaultFilterByDate(itemDate, this.defaultDate());
  }

  activeDate(): Date {
    return this.selectedDate() ?? this.defaultDate();
  }

  nextDate() {
    const currentDate = this.activeDate();
    const nextDay = this.filterService.nextDate(currentDate);
    this.selectedDate.set(nextDay);
    this.filtered.emit(this.filteredData());
  }

  prevDate() {
    const currentDate = this.activeDate();
    const prevDay = this.filterService.prevDate(currentDate);
    this.selectedDate.set(prevDay);
    this.filtered.emit(this.filteredData());
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

    this.filtered.emit(this.filteredData());

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

    this.filtered.emit(this.filteredData());
  }

  clearId() {
    this.tempReservationIdInput.set('');
    this.appliedReservationIdInput.set('');
    this.filtered.emit(this.filteredData());

  }

  clearDate() {
    this.tempSelectedDate.set(null);
    this.selectedDate.set(null);
    this.filtered.emit(this.filteredData());

  }

  clearSortByName() {
    this.tempCustomerName.set(false);
    this.appliedCustomerName.set(false);
    this.filtered.emit(this.filteredData());
  }
  clearPickUpDate() {
    this.tempPickUpDate.set(false);
    this.appliedPickUpDate.set(false);

    this.filtered.emit(this.filteredData());
  }


  clearFilters() {
    this.clearStatus('LS');
    this.clearStatus('HH');
    this.clearStatus('PR');

    this.clearTrip('OneWay');
    this.clearTrip('RoundTrip');

    this.clearId();

    this.tempSelectedDate.set(null);
    this.selectedDate.set(null);

    this.clearSortByName();

    this.clearPickUpDate();

    this.closeFilter();

    // Emit filtered data
    this.displayData = this.filteredData();
    this.filtered.emit(this.filteredData());
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
    this.filtered.emit(this.filteredData());
    console.log('Received Data in Second Child Component:', this.filteredData());
    console.log('Lease Reservations:', this.lease);
    console.log('Confirmed Reservations:', this.confirmed);
    console.log('Waitlist Reservations:', this.waitlist);
    console.log('date selected:', this.selectedDate());
    console.log('sort selected:', this.activeSection === 'sort');

  }


}

