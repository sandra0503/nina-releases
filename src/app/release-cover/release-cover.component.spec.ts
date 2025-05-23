import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ReleaseCoverComponent } from "./release-cover.component";
import { HttpClient, HttpHandler } from "@angular/common/http";

describe("ReleaseCoverComponent", () => {
  let component: ReleaseCoverComponent;
  let fixture: ComponentFixture<ReleaseCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseCoverComponent],
      providers: [HttpClient, HttpHandler],
    }).compileComponents();

    fixture = TestBed.createComponent(ReleaseCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
