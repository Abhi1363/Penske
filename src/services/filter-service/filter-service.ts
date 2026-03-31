import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FilterService {
  
  defaultFilterByDate(itemDate: string | Date | undefined | null, defaultDate?: Date): boolean {
    const selected = defaultDate ?? new Date();
    if (!selected) return true;

    if (!itemDate) return false;
    const item = new Date(itemDate);
    if (isNaN(item.getTime())) return false;

    return (
      item.getFullYear() === selected.getFullYear() &&
      item.getMonth() === selected.getMonth() &&
      item.getDate() === selected.getDate()
    );
  }

 
  nextDate(currentDate: Date): Date {
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    return nextDay;
  }

  prevDate(currentDate: Date): Date {
    const prevDay = new Date(currentDate);
    prevDay.setDate(currentDate.getDate() - 1);
    return prevDay;
  }
}