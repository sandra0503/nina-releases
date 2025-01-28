import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseCoverComponent } from './release-cover.component';

describe('ReleaseCoverComponent', () => {
  let component: ReleaseCoverComponent;
  let fixture: ComponentFixture<ReleaseCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseCoverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleaseCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
