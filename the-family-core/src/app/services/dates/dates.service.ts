import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatesService {

  constructor() { }

  formatDayOfWeek(day: number) {
    switch(day) {
      case 0: return 'Sunday';
      case 1: return 'Monday';
      case 2: return 'Tuesday';
      case 3: return 'Wednesday';
      case 4: return 'Thursday';
      case 5: return 'Friday';
      case 6: return 'Saturday';
    }
  }

  formatMonth(month: number) {
    switch(month) {
      case 1: return 'January';
      case 2: return 'February';
      case 3: return 'March';
      case 4: return 'April';
      case 5: return 'May';
      case 6: return 'June';
      case 7: return 'July';
      case 8: return 'August';
      case 9: return 'September';
      case 10: return 'October';
      case 11: return 'November';
      case 12: return 'December';
    }
  }

  getGetOrdinal(n: number) {
    var s=["th","st","nd","rd"],
        v=n%100;
    return n+(s[(v-20)%10]||s[v]||s[0]);
  }

  manageTimeZone(isoDate: string, char: string): string {
    isoDate = this.setCharAt(isoDate, 11, char);
    isoDate = this.setCharAt(isoDate, 12, char);
    return isoDate;
  }

  manageTimeZoneAfter(date: Date, offset: number): string {
    if (offset < 0) {
      offset = 24 - offset;
      date = new Date(date.setDate(date.getDate()-1));
    }
    let isoDate = date.toISOString();
    const offsetString = offset.toString();
    isoDate = this.setCharAt(isoDate, 11, offsetString.length === 2 ? offsetString[0] : '0');
    isoDate = this.setCharAt(isoDate, 12, offsetString.length === 2 ? offsetString[1] : offsetString[0]);
    return isoDate;
  }

  manageTimeZoneBefore(date: Date, offset: number): string {
    const time = '23:59:59';
    if (offset < 0) {
      offset = 24 - offset;
    }
    if (offset > 0) {
      date = new Date(date.setDate(date.getDate()+1));
    }
    let isoDate = date.toISOString();
    for (let i = 0; i < 8; i ++) {
      isoDate = this.setCharAt(isoDate, i+11, time[i]);
    }
    const offsetString = (offset - 1).toString();
    isoDate = this.setCharAt(isoDate, 11, offsetString.length === 2 ? offsetString[0] : '0');
    isoDate = this.setCharAt(isoDate, 12, offsetString.length === 2 ? offsetString[1] : offsetString[0]);
    
    return isoDate;
  }

  private setCharAt(str, index, chr): string {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
  }
}
