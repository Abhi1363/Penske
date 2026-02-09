import { Injectable, signal } from '@angular/core';
import { RESERVATIONS } from '../mockdata/reservationData';
import { mockdata } from '../mockdata/mockdata';
// import { ReservationData } from '../app/model/reservation-interface-model';
@Injectable({
  providedIn: 'root',
  
})
export class SharedService {

  private _responseData = signal<any>(mockdata);
  private _reservationData = signal<any>(RESERVATIONS);

  readonly reservationData = this._reservationData.asReadonly();

  readonly responseData = this._responseData.asReadonly();

  setResponseData(data: any) {
    this._responseData.set(data);
  }
}
