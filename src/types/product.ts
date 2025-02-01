export interface SeatInventory {
    date: string;
    price: number;
    currencyCode: string;
    reservedSeats: number;
    totalSeats: number;
  }
  
  export interface ProductRequest {
    title: string;
    location: string;
    runningTime: string;
    ticketingLimit: number;
    ticketingOpenDate: string;
    ticketingCloseDate: string;
    performStartDate: string;
    performEndDate: string;
    seatInventories: SeatInventory[];
  }