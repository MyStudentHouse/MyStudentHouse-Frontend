import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RegisterStudenthouseComponent } from './register-studenthouse.component';

describe('RegisterStudenthouseComponent', () => {
  let component: RegisterStudenthouseComponent;
  let fixture: ComponentFixture<RegisterStudenthouseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterStudenthouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterStudenthouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
