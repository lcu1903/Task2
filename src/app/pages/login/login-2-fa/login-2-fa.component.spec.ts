import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login2FaComponent } from './login-2-fa.component';

describe('Login2FaComponent', () => {
  let component: Login2FaComponent;
  let fixture: ComponentFixture<Login2FaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login2FaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Login2FaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
