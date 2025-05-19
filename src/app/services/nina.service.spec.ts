import { TestBed } from "@angular/core/testing";
import { NinaService } from "./nina.service";
import { HttpClient, HttpHandler } from "@angular/common/http";

describe("NinaService", () => {
  let service: NinaService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [HttpClient, HttpHandler] });
    service = TestBed.inject(NinaService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
