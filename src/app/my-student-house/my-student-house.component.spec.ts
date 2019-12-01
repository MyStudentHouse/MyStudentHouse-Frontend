import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyStudentHouseComponent } from './my-student-house.component';

describe('MyStudentHouseComponent', () => {
  let component: MyStudentHouseComponent;
  let fixture: ComponentFixture<MyStudentHouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyStudentHouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyStudentHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
