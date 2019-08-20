import { Injectable } from '@angular/core';
import RRule, { ByWeekday } from 'rrule';
import { Recurrence, EventResponse, Event } from 'src/app/model/events';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

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

  allDatesFromRecurrence(eventList: Event[], after: Date, before: Date): Event[] {
    let events: Event[] = [];
    eventList.forEach((event: Event) => {
      if (event.recurrence) {
        const rrule = RRule.fromString(event.recurrence);
        const dates: Date[] = rrule.between(after, before);
        if (dates.length === 0) {
          events.push(event);
        } else {
          dates.forEach(date => {
            let ev = new Event();
            ev.start = date.toISOString();
            ev.end = date.toISOString();
            ev.title = event.title;
            ev.familyMembers = event.familyMembers;
            events.push(ev);
          });
        }
      } else {
        events.push(event);
      }
    });
    return events;
  }

  rruleToRecurrence(rrule: RRule): Recurrence {
    let recurrence: Recurrence = new Recurrence();
    recurrence.dtstart = rrule.options.dtstart;
    recurrence.endingWhen = rrule.options.until || rrule.options.count ? 'On' : 'Never';
    recurrence.recurrenceEndingDate = rrule.options.until ? new NgbDate(rrule.options.until.getFullYear(), rrule.options.until.getMonth() + 1, rrule.options.until.getDate()) : null;
    recurrence.custom = false;
    if (this.isDaily(rrule)) {
      return this.dailyToRecurrence(rrule, recurrence);
    } else if (this.isWeeklyondayOfWeek(rrule)) {
      this.WeeklyondayOfWeekToRecurrence(rrule, recurrence);
    } else if (this.isMonthlyonthefirst(rrule)) {
      this.MonthlyonthefirstToRecurrence(rrule, recurrence);
    } else if (this.isMonthlyonthe(rrule)) {
      this.MonthlyontheToRecurrence(rrule, recurrence);
    } else if (this.isAnnuallyonthe(rrule)) {
      this.AnnuallyontheToRecurrence(rrule, recurrence);
    } else if (this.isEveryweekdayMondaytoFriday(rrule)) {
      this.EveryweekdayMondaytoFridayToRecurrence(rrule, recurrence);
    } else {
      this.CustomToRecurrence(rrule, recurrence);
    }
    return recurrence;
  }

  private isDaily(rrule: RRule): boolean {
    return rrule.options.freq === 3 && !rrule.options.byweekday;
  }

  private dailyToRecurrence(rrule: RRule, recurrence: Recurrence): Recurrence {
    recurrence.recurrence = 'Daily';
    recurrence.occuring = rrule.options.count;
    return recurrence;
  }

  private isWeeklyondayOfWeek(rrule: RRule): boolean {
    if (rrule.options.freq === 2) {
      return rrule.options.byweekday && !rrule.options.byweekday.length;
    }
    return false;
  }

  private WeeklyondayOfWeekToRecurrence(rrule: RRule, recurrence: Recurrence): Recurrence {
    recurrence.recurrence = 'WeeklyondayOfWeek';
    recurrence.occuring = rrule.options.count;
    recurrence.weekDay = rrule.options.byweekday;
    return recurrence;
  }

  private isMonthlyonthefirst(rrule: RRule): boolean {
    if (rrule.options.freq === 1) {
      return rrule.options.byweekday && !rrule.options.byweekday.length;
    }
    return false;
  }

  private MonthlyonthefirstToRecurrence(rrule: RRule, recurrence: Recurrence): Recurrence {
    recurrence.recurrence = 'Monthlyonthefirst';
    recurrence.occuring = rrule.options.count;
    recurrence.weekDay = rrule.options.byweekday;
    return recurrence;
  }

  private isMonthlyonthe(rrule: RRule): boolean {
    return rrule.options.freq === 1 && !rrule.options.byweekday;
  }

  private MonthlyontheToRecurrence(rrule: RRule, recurrence: Recurrence): Recurrence {
    recurrence.recurrence = 'Monthlyonthefirst';
    recurrence.occuring = rrule.options.count;
    return recurrence;
  }

  private isAnnuallyonthe(rrule: RRule): boolean {
    return rrule.options.freq === 0 && !rrule.options.byweekday;
  }

  private AnnuallyontheToRecurrence(rrule: RRule, recurrence: Recurrence): Recurrence {
    recurrence.recurrence = 'Annuallyonthe';
    recurrence.occuring = rrule.options.count;
    return recurrence;
  }

  private isEveryweekdayMondaytoFriday(rrule: RRule): boolean {
    if (rrule.options.freq === 1) {
      if (rrule.options.byweekday && rrule.options.byweekday.length && rrule.options.byweekday.length === 5) {
        const weekDays: ByWeekday[] = rrule.options.byweekday.filter((day) => day.valueOf() !== 5 && day.valueOf() !== 6);
        return (weekDays && weekDays.length && weekDays.length === 5);
      }
    }
    return false;
  }

  private EveryweekdayMondaytoFridayToRecurrence(rrule: RRule, recurrence: Recurrence): Recurrence {
    recurrence.recurrence = 'EveryweekdayMondaytoFriday';
    recurrence.weekDay = rrule.options.byweekday;
    recurrence.occuring = rrule.options.count;
    return recurrence;
  }

  private CustomToRecurrence(rrule: RRule, recurrence: Recurrence): Recurrence {
    recurrence.recurrence = 'Custom';
    recurrence.custom = true;
    recurrence.customFrecuence = rrule.options.freq.valueOf();
    recurrence.customOccuring = rrule.options.count;
    if (rrule.options.byweekday) {
      let array = [false, false, false, false, false, false, false];
      rrule.options.byweekday.forEach((day) => {
        array[day.valueOf()] = true;
      });
      recurrence.activeDay = array;
    }
    return recurrence;
  }

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

  private untilToDate() {
    this.until = this.endingWhen !== 'Never' && this.recurrenceEndingDate ? 
      new Date(
        this.recurrenceEndingDate.year,
        this.recurrenceEndingDate.month,
        this.recurrenceEndingDate.day) :
      null;
  }
  
  private dailyToRrule(): RRule {
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

  private weeklyondayOfWeekToRrule(): RRule {
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

  private monthlyonthefirst(): RRule {
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

  private monthlyonthe(): RRule {
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

  private annuallyonthe(): RRule {
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

  private everyweekdayMondaytoFriday(): RRule {
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

  private custom(): RRule {
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
      case "1": freq = RRule.WEEKLY; break;
      case "2": freq = RRule.MONTHLY; break;
      case "3": freq = RRule.YEARLY; break;
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
