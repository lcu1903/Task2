import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetWithTokenComponent } from './reset-with-token.component';

describe('ResetWithTokenComponent', () => {
  let component: ResetWithTokenComponent;
  let fixture: ComponentFixture<ResetWithTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetWithTokenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResetWithTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
