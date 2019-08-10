import { Injectable } from '@angular/core';
import RRule from 'rrule';

@Injectable({
  providedIn: 'root'
})
export class EventRecurrenceService {

  dtstart: Date;
  occuring: number;
  until: Date;
  endingWhen: string;
  recurrenceEndingDate: any;
  activeDay: boolean[];
  customFrecuence: string;
  customOccuring: number;

  constructor() { }


  recurrenceToRrule(
    recurrence: string,
    endsForm: string,
    recurrenceEndDateForm: any,
    recurrenceOcurrencesForm: number,
    dtstart: Date,
    activeDay: boolean[],
    customFrecuence: string,
    customOccuring: number
  ): RRule {
    this.dtstart = dtstart;
    this.endingWhen = endsForm;
    this.recurrenceEndingDate = recurrenceEndDateForm;
    this.occuring = recurrenceOcurrencesForm;
    this.activeDay = activeDay;
    this.customFrecuence = customFrecuence;
    this.customOccuring = customOccuring;
    this.untilToDate()
    switch(recurrence) {
      case 'Doesnotrepeat': return null;
      case 'Daily': return this.dailyToRrule();
      case 'WeeklyondayOfWeek': return this.weeklyondayOfWeekToRrule();
      case 'Monthlyonthefirst': return this.monthlyonthefirst();
      case 'Monthlyonthe': return this.monthlyonthe();
      case 'Annuallyonthe': return this.annuallyonthe();
      case 'EveryweekdayMondaytoFriday': return this.everyweekdayMondaytoFriday();
      case 'Custom': return this.custom();
    }
  }

  untilToDate() {
    this.until = this.endingWhen !== 'Never' && this.recurrenceEndingDate ? 
      new Date(
        this.recurrenceEndingDate.year,
        this.recurrenceEndingDate.month,
        this.recurrenceEndingDate.day) :
      null;
  }
  
  dailyToRrule(): RRule {
    let rule;
    if (!this.until && !this.occuring) {
      rule = new RRule({
        freq: RRule.DAILY,
        dtstart: this.dtstart
      });
    } else if (this.until && !this.occuring) {
      rule = new RRule({
        freq: RRule.DAILY,
        dtstart: this.dtstart,
        until: this.until
      });
    } else if (!this.until && this.occuring) {
      rule = new RRule({
        freq: RRule.DAILY,
        dtstart: this.dtstart,
        count: this.occuring
      });
    } else if (this.until && this.occuring) {
      rule = new RRule({
        freq: RRule.DAILY,
        dtstart: this.dtstart,
        until: this.until,
        count: this.occuring
      });
    }

    return rule;
  }

  weeklyondayOfWeekToRrule(): RRule {
    let rule;
    if (!this.until && !this.occuring) {
      rule = new RRule({
        freq: RRule.WEEKLY,
        byweekday: this.dtstart.getDay() -1,
        dtstart: this.dtstart,
      });
    } else if (this.until && !this.occuring) {
      rule = new RRule({
        freq: RRule.WEEKLY,
        byweekday: this.dtstart.getDay() -1,
        dtstart: this.dtstart,
        until: this.until
      });
    } else if (!this.until && this.occuring) {
      rule = new RRule({
        freq: RRule.WEEKLY,
        byweekday: this.dtstart.getDay() -1,
        dtstart: this.dtstart,
        count: this.occuring
      });
    } else if (this.until && this.occuring) {
      rule = new RRule({
        freq: RRule.WEEKLY,
        byweekday: this.dtstart.getDay() -1,
        dtstart: this.dtstart,
        until: this.until,
        count: this.occuring
      });
    }
    return rule;
  }

  monthlyonthefirst(): RRule {
    let rule;
    if (!this.until && !this.occuring) {
      rule = new RRule({
        freq: RRule.MONTHLY,
        byweekday: this.dtstart.getDay() -1,
        bysetpos: 1,
        dtstart: this.dtstart,
      });
    } else if (this.until && !this.occuring) {
      rule = new RRule({
        freq: RRule.MONTHLY,
        byweekday: this.dtstart.getDay() -1,
        bysetpos: 1,
        dtstart: this.dtstart,
        until: this.until
      });
    } else if (!this.until && this.occuring) {
      rule = new RRule({
        freq: RRule.MONTHLY,
        byweekday: this.dtstart.getDay() -1,
        bysetpos: 1,
        dtstart: this.dtstart,
        count: this.occuring
      });
    } else if (this.until && this.occuring) {
      rule = new RRule({
        freq: RRule.MONTHLY,
        byweekday: this.dtstart.getDay() -1,
        bysetpos: 1,
        dtstart: this.dtstart,
        until: this.until,
        count: this.occuring
      });
    }
    return rule;
  }

  monthlyonthe(): RRule {
    let rule;
    if (!this.until && !this.occuring) {
      rule = new RRule({
        freq: RRule.MONTHLY,
        bysetpos: 1,
        dtstart: this.dtstart,
      });
    } else if (this.until && !this.occuring) {
      rule = new RRule({
        freq: RRule.MONTHLY,
        bysetpos: 1,
        dtstart: this.dtstart,
        until: this.until
      });
    } else if (!this.until && this.occuring) {
      rule = new RRule({
        freq: RRule.MONTHLY,
        bysetpos: 1,
        dtstart: this.dtstart,
        count: this.occuring
      });
    } else if (this.until && this.occuring) {
      rule = new RRule({
        freq: RRule.MONTHLY,
        bysetpos: 1,
        dtstart: this.dtstart,
        until: this.until,
        count: this.occuring
      });
    }
    return rule;
  }

  annuallyonthe(): RRule {
    let rule;
    if (!this.until && !this.occuring) {
      rule = new RRule({
        freq: RRule.YEARLY,
        bysetpos: 1,
        dtstart: this.dtstart,
      });
    } else if (this.until && !this.occuring) {
      rule = new RRule({
        freq: RRule.YEARLY,
        bysetpos: 1,
        dtstart: this.dtstart,
        until: this.until
      });
    } else if (!this.until && this.occuring) {
      rule = new RRule({
        freq: RRule.YEARLY,
        bysetpos: 1,
        dtstart: this.dtstart,
        count: this.occuring
      });
    } else if (this.until && this.occuring) {
      rule = new RRule({
        freq: RRule.YEARLY,
        bysetpos: 1,
        dtstart: this.dtstart,
        until: this.until,
        count: this.occuring
      });
    }
    return rule;
  }

  everyweekdayMondaytoFriday(): RRule {
    let rule;
    if (!this.until && !this.occuring) {
      rule = new RRule({
        freq: RRule.MONTHLY,
        byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
        dtstart: this.dtstart,
      });
    } else if (this.until && !this.occuring) {
      rule = new RRule({
        freq: RRule.MONTHLY,
        byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
        dtstart: this.dtstart,
        until: this.until
      });
    } else if (!this.until && this.occuring) {
      rule = new RRule({
        freq: RRule.MONTHLY,
        byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
        dtstart: this.dtstart,
        count: this.occuring
      });
    } else if (this.until && this.occuring) {
      rule = new RRule({
        freq: RRule.MONTHLY,
        byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
        dtstart: this.dtstart,
        until: this.until,
        count: this.occuring
      });
    }
    return rule;
  }

  custom(): RRule {
    let byweekday = [];
    if (this.activeDay[0]) { byweekday.push(RRule.MO) }
    if (this.activeDay[1]) { byweekday.push(RRule.TU) }
    if (this.activeDay[2]) { byweekday.push(RRule.WE) }
    if (this.activeDay[3]) { byweekday.push(RRule.TH) }
    if (this.activeDay[4]) { byweekday.push(RRule.FR) }
    if (this.activeDay[5]) { byweekday.push(RRule.SA) }
    if (this.activeDay[6]) { byweekday.push(RRule.SU) }
    let freq;
    switch(this.customFrecuence) {
      case "0": freq = RRule.DAILY; break;
      case "0": freq = RRule.WEEKLY; break;
      case "0": freq = RRule.MONTHLY; break;
      case "0": freq = RRule.YEARLY; break;
      default: freq = null;
    }
    let count = this.customOccuring;
    if (byweekday.length > 0) {
      return new RRule({
        freq: freq,
        byweekday: byweekday,
        dtstart: this.dtstart,
        count: count
      })
    } else {
      return new RRule({
        freq: freq,
        dtstart: this.dtstart,
        count: count
      })
    }  
  }
}
