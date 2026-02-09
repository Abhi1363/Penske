
export interface Reservation {
  id: string;
  reservationId: string;
  paymentType: string;
  plannerStatus: string;
  reservationStatus: string;
  tripType: 'oneway' | 'roundtrip' | string;
  leaseType: string;
  colorIndicator: string;
   assignedUnit?: {
    unitNumber?: string;
    unitStatus?: string;
  };

  assignedTowUnit?: {
    unitNumber?: string;
  };

  cashDeposit?: boolean;
  
  pickUp: {pickUpDate: string;};
   consumerCustomer: {
    firstName: string;
    lastName: string;
  };
  rentalType: string;
  tripTypeToolTip?: string;
  rentalTypeToolTip?: string;
  optionalEquipmentToolTip?: string;
  optionalEquipment?: string;
}
export interface ReservationData {
  listReservation: Reservation[];
}

