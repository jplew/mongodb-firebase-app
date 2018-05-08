
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnLayoutComponent } from './column-layout.component';

describe('ColumnLayoutComponent', () => {
  let component: ColumnLayoutComponent;
  let fixture: ComponentFixture<ColumnLayoutComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
