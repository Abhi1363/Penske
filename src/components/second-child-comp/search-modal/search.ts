import { Component, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { Filter } from '../filter-modal/filter';
import { FilterService } from '../../../services/filter-service/filter-service';
import { inject } from '@angular/core';
import { SharedService } from '../../../services/shared-service';
import { Reservation } from '../../../app/model/reservation-interface-model';
@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [CommonModule, DatePickerModule, FormsModule, Filter],
  templateUrl: './search.html',
})

export class SearchModal implements OnInit {
  sharedService = inject(SharedService);
  data = this.sharedService.reservationData;

  @Output() isSearchOpen = new EventEmitter<boolean>();
  @Output() SearchedData = new EventEmitter<Reservation[]>();


  filterService = inject(FilterService);

  searchOpen = signal(false);

  toggleSearch() {
    this.searchOpen.set(!this.searchOpen());
    this.isSearchOpen.emit(this.searchOpen());
  }

  closeSearch() {
    this.searchOpen.set(false);
    this.isSearchOpen.emit(this.searchOpen());
  }


  dateWithin = signal<string>('daily');
  rangeDate = signal<Date[]>([]);
  customDateData = signal<Reservation[]>([]);

  currentDate: Date | null = new Date();


  onDateWithinChange() {
    // Only set up date state when the mode changes. Do not perform filtering here.
    const mode = this.dateWithin();
    if (mode === 'daily') {
      this.currentDate = new Date();
      this.rangeDate.set([]);
    } else if (mode === 'weekly') {
      this.currentDate = null;
      this.setWeeklyRange();
    } else if (mode === 'custom') {
      this.customDateData.set([]);
      this.setCustomDateRange([]);

      this.currentDate = null;
      this.rangeDate.set([]);
    }
  }


  filterbydaily() {
    const data = this.data()?.filter((item: Reservation) =>
      this.filterService.defaultFilterByDate(item?.pickUp?.pickUpDate, this.currentDate ?? undefined)
    );
    return data ?? [];
  }


  filterByWeekly(itemDate: string | Date): boolean {

    const range = this.rangeDate();

    if (!Array.isArray(range) || range.length !== 2) return true;

    const item = new Date(itemDate).setHours(0, 0, 0, 0);
    const start = new Date(range[0]).setHours(0, 0, 0, 0);
    const end = new Date(range[1]).setHours(0, 0, 0, 0);


    return item >= start && item <= end;

  }

  sortbyDate(a: Reservation, b: Reservation): number {
    const dateA = new Date(a.pickUp?.pickUpDate || '');
    const dateB = new Date(b.pickUp?.pickUpDate || '');
    return dateA.getTime() - dateB.getTime();
  }


  setWeeklyRange() {
    const today = new Date();

    const weekAhead = new Date();
    weekAhead.setDate(today.getDate() + 7);

    this.rangeDate.set([today, weekAhead]);


  }
  weeklyData() {
    const data = this.data()?.filter((item: Reservation) =>
      this.filterByWeekly(item?.pickUp?.pickUpDate)) ?? [];
    return data.sort(this.sortbyDate);
  }

  setCustomDateRange(dates: Date[]) {
    this.rangeDate.set(dates);

  }

  filterByCustomDate(itemDate: string | Date): boolean {
    const range = this.rangeDate(); // [startDate, endDate]

    if (!Array.isArray(range) || range.length !== 2) return false;

    const item = new Date(itemDate).setHours(0, 0, 0, 0);
    const start = new Date(range[0]).setHours(0, 0, 0, 0);
    const end = new Date(range[1]).setHours(0, 0, 0, 0);

    return item >= start && item <= end;
  }

  applyDaily() {
    const data = this.filterbydaily();
    this.SearchedData.emit(data);
  }


  applyWeekly() {
    this.weeklyData();
    this.SearchedData.emit(this.weeklyData());
  }

  applyWithinDate() {
    if (this.dateWithin() === 'daily') {
      this.applyDaily();
    }
    else if (this.dateWithin() === 'weekly') {
      this.applyWeekly();
    }
    else if (this.dateWithin() === 'custom') {
      this.applyCustomDate();
    }
  }

  applyCustomDate() {
    const data = this.data().filter((item: Reservation) =>
      this.filterByCustomDate(item.pickUp?.pickUpDate));

    data.sort(this.sortbyDate);

    this.customDateData.set(data);
    this.SearchedData.emit(this.customDateData());
  }


  clearDateWithin() {
    this.dateWithin.set('daily');
    this.currentDate = new Date();
    this.rangeDate.set([]);
    this.customDateData.set([]);
    this.applyDaily();
    this.SearchedData.emit(this.filterbydaily());

  }

  LocType = signal<string>('');

  LocCode = signal<string>('');

  CustomerName = signal<string>('');

  phoneNumber = signal<number>(0);

  rentAgreement = signal<string>('');
  /**
   * Combine date filter + location type + location code + customer name
   * into a single filtered result set.
   */
  combinedFilteredResults(): Reservation[] {
    let base: Reservation[] = this.data() ?? [];
    const mode = this.dateWithin();

    if (mode === 'daily') {
      base = this.filterbydaily();
    } else if (mode === 'weekly') {
      base = this.weeklyData();
    } else if (mode === 'custom') {
      const custom = this.customDateData();
      if (custom && custom.length) {
        base = custom;
      } else {
        base = (this.data() ?? []).filter((item: Reservation) => this.filterByCustomDate(item.pickUp?.pickUpDate));
      }
    }

    const loc = this.LocType();
    if (loc) {
      base = base.filter((item: Reservation) => item?.pickUp?.pickUpLocation?.locationType === loc);
    }

    const code = (this.LocCode() ?? '').toLowerCase().trim();
    if (code) {
      base = base.filter((item: Reservation) =>
        (item?.dropOff?.dropOffLocation?.locationCode ?? '').toLowerCase().includes(code)
      );
    }

    const name = (this.CustomerName() ?? '').toLowerCase().trim();
    if (name) {
      base = base.filter((item: Reservation) =>
        (item?.consumerCustomer?.firstName ?? '').toLowerCase().includes(name)
      );
    }

    const phone = this.phoneNumber();
    if (phone) {
      base = base.filter((item: Reservation) =>
        item?.consumerCustomer?.phoneNumber === phone
      );
    }

    const rentAggr = this.rentAgreement();
    if (rentAggr) {
      base = base.filter(((item: Reservation) =>
        item?.reservationId === rentAggr
      ));
    }

    return base.sort(this.sortbyDate);
  }

  clearCombinedFilters() {
    this.clearDateWithin();
    this.LocType.set('');
    this.LocCode.set('');
    this.CustomerName.set('');
    this.phoneNumber.set(0);
    this.rentAgreement.set('');
    this.applyDaily();
    this.SearchedData.emit(this.filterbydaily());
  }

  clearAll() {
    this.clearCombinedFilters();
    this.closeSearch();
  }

  onSearch() {
    const results = this.combinedFilteredResults();
    this.SearchedData.emit(results);
    this.closeSearch();
  }

  nextDate() {
    if (this.currentDate) {
      this.currentDate = this.filterService.nextDate(this.currentDate);
      this.applyDaily();
      this.SearchedData.emit(this.filterbydaily());
    }
  }

  prevDate() {
    if (this.currentDate) {
      this.currentDate = this.filterService.prevDate(this.currentDate);
      this.applyDaily();
      this.SearchedData.emit(this.filterbydaily());
    }
  }

  ngOnInit() {
    console.log('SearchModal initialized with data:', this.data());
    console.log('Range Date:', this.rangeDate());
    console.log('filterbydaily result:', this.filterbydaily());
    console.log('filterByWeekly result:', this.weeklyData());

    // Initialize date state and emit today's data by default after bindings are ready
    this.onDateWithinChange();
    this.SearchedData.emit(this.filterbydaily());

  }
} 