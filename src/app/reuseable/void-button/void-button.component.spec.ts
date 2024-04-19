import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidButtonComponent } from './void-button.component';

describe('VoidButtonComponent', () => {
  let component: VoidButtonComponent;
  let fixture: ComponentFixture<VoidButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoidButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VoidButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
