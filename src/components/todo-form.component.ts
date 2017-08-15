import { Component, Output, EventEmitter } from '@angular/core';


@Component({
    moduleId: module.id,
    selector: 'todo-form',
    template: `
        <div class="input-group">
            <input name="label" [(ngModel)]="label" class="form-control" />
            <span class="input-group-btn">
                <button class="btn btn-primary" type="button" (ngClick)="add()">Add</button>
            </span>
        </div>
        `
}) 

export class TodoFormComponent {
  label: string;
  @Output() onAdd = new EventEmitter();
  add() {
    if (!this.label) return;
    this.onAdd.emit({label: this.label});
    this.label = '';
  };
}