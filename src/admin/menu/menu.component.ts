import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
import { FormBuilder, Validators, FormArray } from "@angular/forms";
import { RestService, AlertService, MealMenuService } from 'services';

@Component({
  // tslint:disable-next-line
  selector: 'menu-list',
  templateUrl: 'menu.component.html'
})
export class MenuComponent implements OnInit {
  startYear;
  endYear;
  currentYear;
  selectedYear;
  displayYears;
  currentWeek;
  selectedWeek;
  displayWeeks;
  yearMonthSubs;
  disablePreviousWeek;
  disableNextWeek;

  menuForm;
  menuItem;
  submitted;

  constructor(
    private router: Router,
    private _fb: FormBuilder,
    private alert: AlertService,
    private rest: RestService, 
    private mealMenuService: MealMenuService) {
    this.displayYears=[];
    this.selectedYear = [];
    this.displayWeeks = [];
    this.selectedWeek = [];
  }

  ngOnInit() {
    let date = new Date();
    this.currentYear = date.getFullYear();  
    this.startYear = 2017;
    this.endYear = this.currentYear + 10;      
    for(let i=this.startYear;i<=(this.endYear);i++) {
      this.displayYears.push({id:i, text: ""+i+""});
    }    
    this.displayListWeeks(this.currentYear);

    this.yearMonthSubs = this.mealMenuService.getYearWeek().subscribe(data => {
      let tuesday = this.mealMenuService.getDateOfISOWeekString(data.week, data.year);
      this.selectedYear = [{id: data.year, text: data.year}];
      this.selectedWeek = [{id: data.week, text: "Week " + data.week + " - " + tuesday, year: data.year}];
      
      this.disablePreviousWeek = false;      
      let prevTuesday = this.mealMenuService.getDateOfISOWeekString(data.week - 1, data.year);
      if(data.year == this.startYear && !prevTuesday) {
        this.disablePreviousWeek = true;
      }

      this.disableNextWeek = false;
      let nextTuesday = this.mealMenuService.getDateOfISOWeekString(data.week + 1, data.year);
      if(data.year == this.endYear && !nextTuesday) {
        this.disableNextWeek = true;
      }
    });

    this.menuForm = this._fb.group({
        name : ['', [Validators.required]],
        price: ['', [Validators.required]],  
    });

    this.rest.getItem('', 'products/freshbox-subscription').subscribe(data => {
        this.menuItem = data;
        this.menuForm.patchValue({name: data.name, price: data.price});
    });
  }

  ngOnDestroy() {
    this.yearMonthSubs.unsubscribe();
  }

  saveMealMenu() {
      this.alert.clear();
      this.submitted = true;
      if (this.menuForm.dirty && this.menuForm.valid) {
        
        let sendData = this.menuForm.value;

        this.rest.saveItem('freshbox-subscription', {product : sendData}, 'products/freshbox-subscription').subscribe(
          data => {
              this.alert.success("The menu details are updated successfully!", true);                  
          }
        )
      } else {
          this.alert.error("Please check the form to enter all required details");
      }
  }

  setInputErrorClass(input) {
    let invalid = this.menuForm.get(input).invalid && this.submitted;
    if(invalid) return 'form-control-danger';
  }

  setContainerErrorClass(input) {
    let invalid = this.menuForm.get(input).invalid && this.submitted;
    if(invalid) return 'has-danger';
  }

  displayListWeeks = function(year){
    this.displayWeeks = [];
    let onejan = new Date(year,0,1);
    for(let i=1;i<=53;i++) {
      let tuesday = this.mealMenuService.getDateOfISOWeekString(i, year);
      if(tuesday) {
        let tmp = {id:i, text: "Week " + i + " - " + tuesday};
        if((i == 1 || i == 2 || i == this.currentWeek) && this.selectedWeek.length == 0) {
          this.selectedWeek = [tmp];
        }
        this.displayWeeks.push(tmp);
      }
    }
  }

  refreshYearValue(year) {
    this.selectedWeek = [];
    this.displayListWeeks(year.id);
    this.mealMenuService.setYearWeek(year.id, false);
  }

  refreshWeekValue(week) {
    this.mealMenuService.setYearWeek(this.selectedYear[0].id, week.id);
  }

  gotToPrevWeek() {
    let prevTuesday = this.mealMenuService.getDateOfISOWeek(this.selectedWeek[0].id - 1, this.selectedYear[0].id);
    if(!prevTuesday) {
      return;
    }
    let prevWeek = this.mealMenuService.getWeekNumber(prevTuesday);
    this.mealMenuService.setYearWeek(prevTuesday.getFullYear(), prevWeek);
  }

  gotToNextWeek() {
    let nextTuesday = this.mealMenuService.getDateOfISOWeek(this.selectedWeek[0].id + 1, this.selectedYear[0].id);
    if(!nextTuesday) {
      return;
    }
    let nextWeek = this.mealMenuService.getWeekNumber(nextTuesday);
    this.mealMenuService.setYearWeek(nextTuesday.getFullYear(), nextWeek);
  }
}
