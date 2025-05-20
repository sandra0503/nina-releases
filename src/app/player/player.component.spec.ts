import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PlayerComponent } from "./player.component";
import { CommonModule } from "@angular/common";
import { BehaviorSubject } from "rxjs";
import { NinaService } from "../services/nina.service";
import { PlaybackService } from "../services/playback.service";
import { Release } from "../release";
import { By } from "@angular/platform-browser";
import { HttpClient, HttpHandler } from "@angular/common/http";

describe("PlayerComponent", () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;

  let mockPlaybackService: jasmine.SpyObj<PlaybackService>;
  let mockNinaService: jasmine.SpyObj<NinaService>;

  const mockRelease: Release = {
    slug: "mock-release",
  } as Release;
  const currentRelease = new BehaviorSubject({
    release: mockRelease,
    isPlaying: false,
  });

  beforeEach(async () => {
    mockPlaybackService = jasmine.createSpyObj(
      "PlaybackService",
      ["playOrPause"],
      {
        current: currentRelease,
        current$: currentRelease.asObservable(),
      }
    );

    mockNinaService = jasmine.createSpyObj("NinaService", [
      "getReleaseUrlBySlug",
    ]);
    mockNinaService.getReleaseUrlBySlug.and.returnValue(
      "https://www.ninaprotocol.com/releases/mock-release"
    );

    await TestBed.configureTestingModule({
      imports: [CommonModule, PlayerComponent],
      providers: [
        HttpClient,
        HttpHandler,
        { provide: PlaybackService, useValue: mockPlaybackService },
        { provide: NinaService, useValue: mockNinaService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call playbackService.playOrPause() when playOrPause is triggered", () => {
    component.playOrPause();
    expect(mockPlaybackService.playOrPause).toHaveBeenCalledTimes(1);
  });

  it('should show "Play" when not playing', () => {
    mockPlaybackService.current.next({
      release: mockRelease,
      isPlaying: false,
    });
    fixture.detectChanges();
    const playLink = fixture.debugElement.query(By.css(".actions a"));
    expect(playLink.attributes["data-name"]).toBe("PlayAction");
  });

  it('should show "Pause" when playing', () => {
    mockPlaybackService.current.next({
      release: mockRelease,
      isPlaying: true,
    });
    fixture.detectChanges();
    const pauseLink = fixture.debugElement.query(By.css(".actions a"));
    expect(pauseLink.attributes["data-name"]).toBe("PauseAction");
  });

  it("should generate releaseUrl from NinaService", () => {
    expect(component.releaseUrl).toContain(
      "https://www.ninaprotocol.com/releases/mock-release"
    );
  });
});
