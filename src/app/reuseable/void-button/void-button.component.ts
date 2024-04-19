import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-void-button',
  imports: [],
  standalone: true,
  templateUrl: './void-button.component.html',
  styleUrls: ['./void-button.component.scss'],
})
export class VoidButtonComponent {
  @Input() text: string = '';
  @Input() btnClass: string = '';
  @Output() onClick = new EventEmitter<void>();
  constructor() {}
  ngOnInit(): void {}
  emitEvent() {
    
    this.onClick.emit();
  }
}
