import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { DatePipe } from '@angular/common';


@Injectable()
export class MealMenuService {
	private subject = new BehaviorSubject({year:2017,week:1});

	constructor(
		private router: Router,
		private datePipe : DatePipe
		) {
	    let date = new Date();
	    let currentYear = date.getFullYear();
		let currentWeek = this.getWeekNumber(date);
		currentWeek++;
	    if(date.getDay() >= 5) {
	    	currentWeek++;
	    }
	    this.setYearWeek(currentYear, currentWeek);
	}

	getYearWeek(): Observable<any> {
	    return this.subject.asObservable();
	}

	setYearWeek(year, week) {
		if(!week) {
			let tuesday = this.getDateOfISOWeekString(1, year);
			week = tuesday?1:2;
		}
	    this.subject.next({ year: year, week : week});
	}

	getWeekNumber = function(date) {
	  let onejan = new Date(date.getFullYear(), 0, 1);
	  let oneJonDay = onejan.getDay();
	  let oneJonTime = onejan.getTime();
	  return Math.ceil((((date.getTime() - oneJonTime) / 86400000) + oneJonDay + 1) / 7);
	}

	getDateOfISOWeek(w, y) {
		var simple = new Date(y, 0, 1 + (w - 1) * 7);
		var dow = simple.getDay();
		var ISOweekStart = simple;
		if (dow <= 4)
		    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 2);
		else
		    ISOweekStart.setDate(simple.getDate() + 7 - simple.getDay() + 2);
		return ISOweekStart;
	}

	getDateOfISOWeekFriday(w, y) {
		var simple = new Date(y, 0, 1 + (w - 2) * 7);
		var dow = simple.getDay();
		var ISOweekStart = simple;
		if (dow <= 4)
		    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 5);
		else
		    ISOweekStart.setDate(simple.getDate() + 7 - simple.getDay() + 5);
		return ISOweekStart;
	}

	getDateOfISOWeekString(w, y) {
		var simple = new Date(y, 0, 1 + (w - 1) * 7);
		var dow = simple.getDay();
		var ISOweekStart = simple;
		if (dow <= 4)
		    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 2);
		else
		    ISOweekStart.setDate(simple.getDate() + 7 - simple.getDay() + 2);
		if(ISOweekStart.getFullYear() != y) {
		  return false;
		}
		return this.datePipe.transform(ISOweekStart, "MMM d");
	}

	getDateOfISOWeekStringFull(w, y, format?) {
		var simple = new Date(y, 0, 1 + (w - 1) * 7);
		var dow = simple.getDay();
		var ISOweekStart = simple;
		if (dow <= 4)
		    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 2);
		else
		    ISOweekStart.setDate(simple.getDate() + 7 - simple.getDay() + 2);
		if(ISOweekStart.getFullYear() != y) {
		  return false;
		}
		if(!format) {
			format = "longDate";
		}
		return this.datePipe.transform(ISOweekStart, format);
	}
} 