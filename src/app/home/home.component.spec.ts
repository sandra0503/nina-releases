import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { HomeComponent } from "./home.component";
import { of, BehaviorSubject } from "rxjs";
import { NinaService } from "../services/nina.service";
import { PlaybackService } from "../services/playback.service";
import { QueryService } from "../services/query.service";
import { Release } from "../release";
import { By } from "@angular/platform-browser";
import { HttpClient, HttpHandler } from "@angular/common/http";

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;

  let mockPlaybackService: jasmine.SpyObj<PlaybackService>;
  let mockNinaService: jasmine.SpyObj<NinaService>;
  let mockQueryService: Partial<QueryService>;

  const mockRelease: Release = {
    slug: "release-1",
    publisherAccount: {},
  } as any;

  const currentRelease = new BehaviorSubject({
    release: mockRelease,
    isPlaying: true,
  });

  const query$ = new BehaviorSubject({
    searchTerm: "rnb",
    offset: 0,
  });

  beforeEach(async () => {
    mockPlaybackService = jasmine.createSpyObj(
      "PlaybackService",
      ["playRelease"],
      {
        current: currentRelease,
        current$: currentRelease.asObservable(),
      }
    );

    mockNinaService = jasmine.createSpyObj("NinaService", [
      "searchByTag",
      "getReleaseUrlBySlug",
    ]);
    mockNinaService.searchByTag.and.returnValue(of([mockRelease]));
    mockNinaService.getReleaseUrlBySlug.and.returnValue(
      "https://www.ninaprotocol.com/releases/mock-release"
    );

    mockQueryService = {
      query$: query$,
      setSearchTerm: jasmine.createSpy("setSearchTerm"),
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        HttpClient,
        HttpHandler,
        { provide: PlaybackService, useValue: mockPlaybackService },
        { provide: NinaService, useValue: mockNinaService },
        { provide: QueryService, useValue: mockQueryService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should render release covers when data is available", fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const covers = fixture.debugElement.queryAll(
      By.css("[data-name=ReleaseCover]")
    );
    expect(covers.length).toBeGreaterThan(0);
  }));

  it("should render pause button instead of play when release is active and playing", fakeAsync(() => {
    tick();
    fixture.detectChanges();

    const playButton = fixture.debugElement.query(
      By.css("[data-name=InlinePlayButton]")
    );
    expect(playButton.nativeElement.classList).toContain("pause");
  }));

  it("should call playRelease when play button is clicked", fakeAsync(() => {
    tick();
    fixture.detectChanges();

    const playButton = fixture.debugElement.query(
      By.css("[data-name=InlinePlayButton]")
    );
    playButton.triggerEventHandler("click", null);
    fixture.detectChanges();

    expect(mockPlaybackService.playRelease).toHaveBeenCalledWith(mockRelease);
  }));
});
