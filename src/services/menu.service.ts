import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { DatePipe } from '@angular/common';


@Injectable()
export class MealMenuService {
	private subject = new BehaviorSubject({year: 2017, week: 1});

	constructor(
		private router: Router,
		private datePipe: DatePipe
		) {
		const data = this.getCurrentyearMonth();
	    this.setYearWeek(data.year, data.week);
	}

	getCurrentyearMonth() {
		const date = new Date();
	    const currentYear = date.getFullYear();
		let currentWeek = this.getWeekNumber(date);
	    if (date.getDay() >= 5) {
	    	currentWeek++;
	    }
		return {
			year: currentYear,
			week: currentWeek
		};
	}

	getCurrentMenuDays() {
		const data = this.getCurrentyearMonth();
		return {
			friday: this.getDateOfISOWeekFriday(data.week, data.year),
			tuesday: this.getDateOfISOWeek(data.week, data.year)
		};
	}

	getYearWeek(): Observable<any> {
	    return this.subject.asObservable();
	}

	setYearWeek(year, week) {
		if (!week) {
			const tuesday = this.getDateOfISOWeekString(1, year);
			week = tuesday ? 1 : 2;
		}
	    this.subject.next({ year: year, week : week});
	}

	getWeekNumber = function(date) {
	  const onejan = new Date(date.getFullYear(), 0, 1);
	  const oneJonDay = onejan.getDay();
	  const oneJonTime = onejan.getTime();
	  return Math.ceil((((date.getTime() - oneJonTime) / 86400000) + oneJonDay + 1) / 7);
	}

	getDateOfISOWeek(w, y) {
		const simple = new Date(y, 0, 1 + (w - 1) * 7);
		const dow = simple.getDay();
		const ISOweekStart = simple;
		if (dow <= 4) {
		    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 2);
		} else {
			ISOweekStart.setDate(simple.getDate() + 7 - simple.getDay() + 2);
		}
		return ISOweekStart;
	}

	getDateOfISOWeekFriday(w, y) {
		const simple = new Date(y, 0, 1 + (w - 2) * 7);
		const dow = simple.getDay();
		const ISOweekStart = simple;
		if (dow <= 4) {
		    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 5);
		} else {
			ISOweekStart.setDate(simple.getDate() + 7 - simple.getDay() + 5);
		}
		return ISOweekStart;
	}

	getDateOfISOWeekString(w, y) {
		const simple = new Date(y, 0, 1 + (w - 1) * 7);
		const dow = simple.getDay();
		const ISOweekStart = simple;
		if (dow <= 4) {
		    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 2);
		} else {
			ISOweekStart.setDate(simple.getDate() + 7 - simple.getDay() + 2);
		}
		if (ISOweekStart.getFullYear() !== y) {
		  return false;
		}
		return this.datePipe.transform(ISOweekStart, 'MMM d');
	}

	getDateOfISOWeekStringFull(w, y, format?) {
		const simple = new Date(y, 0, 1 + (w - 1) * 7);
		const dow = simple.getDay();
		const ISOweekStart = simple;
		if (dow <= 4) {
		    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 2);
		} else {
			ISOweekStart.setDate(simple.getDate() + 7 - simple.getDay() + 2);
		}
		if (ISOweekStart.getFullYear() !== y) {
		  return false;
		}
		if (!format) {
			format = 'longDate';
		}
		return this.datePipe.transform(ISOweekStart, format);
	}
} 