import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'todo-list',
  template: `
  <ul class="list-group">
    <li class="list-group-item" *ngFor="let todo of todos">
        <div>
            <span>{{ todo.label }}</span>
            <button
            type="button push-right"
            (click)="onRemove.emit({ todo: item });">Delete</button>
        </div>
    </li>
  </ul>
  `
})
export class TodoListComponent {
  @Input()  todos;
  @Output() onComplete = new EventEmitter();
  @Output() onDelete = new EventEmitter();
}
