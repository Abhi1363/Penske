export interface recommendedUnitsInterface {
    unitNumber: string;
    unitStatus: string;
    unitClassCode: string;
    unitType?: string | null;
    unitDescription: string;
    pmDueInDays?: string;
    hasNotes: boolean;
    distanceInMiles?: string;
    
    owningLocation: OwningLocation;
    assignedReservations?: AssignedReservation[] | null;
}


//Sub interfaces

export interface OwningLocation {
    corp: string;
    loc_cd: string;
    loc_type?: string | null;
    location_type?: string | null;
    loc_name?: string | null;
    locationAddress?: string | null;
    outbound_code?: string | null;
    region?: string | null;
    utc_offset?: string | null;
    daylight?: string | null;
    region_name?: string | null;
    area?: string | null;
    area_name?: string | null;
    controlling_district?: string | null;
    controlling_district_name?: string | null;
    branch?: string | null;
    branch_name?: string | null;
    phoneNumber?: string | null;
}

export interface AssignedReservation {
  reservationId: string;
  dropOff: DropOff;
}

export interface DropOff {
  actualDropOffDate?: string | null;
  actualDropOffTime?: string | null;
  actualDropOffUTCTimestamp?: string | null;
  expectedDropOffDate?: string | null;
  expectedDropOffTime?: string | null;
  expectedDropOffUTCTimestamp?: string | null;
}





