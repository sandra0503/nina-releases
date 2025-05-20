import { TestBed } from "@angular/core/testing";
import { PlaybackService } from "./playback.service";
import WaveSurfer from "wavesurfer.js";
import { Release } from "../release";

describe("PlaybackService", () => {
  let service: PlaybackService;
  let waveMock: jasmine.SpyObj<WaveSurfer>;

  const mockRelease: Release = {
    slug: "slug-1",
    metadata: {
      properties: {
        files: [{ uri: "http://track.mp3" }],
      },
    },
    publisherAccount: { displayName: "Artist" },
  } as any;

  beforeEach(() => {
    waveMock = jasmine.createSpyObj("WaveSurfer", [
      "load",
      "playPause",
      "pause",
      "destroy",
    ]);

    TestBed.configureTestingModule({
      providers: [PlaybackService],
    });

    service = TestBed.inject(PlaybackService);
    spyOn(WaveSurfer, "create").and.returnValue(waveMock);
  });

  it("should play new release", () => {
    service.playRelease(mockRelease);

    expect(service.current.value.release).toBe(mockRelease);
    expect(service.current.value.isPlaying).toBeTrue();
    expect(waveMock.load).toHaveBeenCalledWith("http://track.mp3");
    expect(waveMock.playPause).toHaveBeenCalled();
  });

  it("should toggle play/pause", () => {
    service.wave = waveMock;
    service.current.next({ release: mockRelease, isPlaying: false });

    service.playOrPause();

    expect(service.current.value.isPlaying).toBeTrue();
    expect(waveMock.playPause).toHaveBeenCalled();
  });

  it("should pause if already playing", () => {
    service.wave = waveMock;
    service.current.next({ release: mockRelease, isPlaying: true });

    service.playOrPause();

    expect(service.current.value.isPlaying).toBeFalse();
    expect(waveMock.pause).toHaveBeenCalled();
  });

  it("should destroy previous wave and create new on release change", () => {
    service.wave = waveMock;

    const newRelease = { ...mockRelease, slug: "new-slug" };
    service.playRelease(newRelease as Release);

    expect(waveMock.destroy).toHaveBeenCalled();
    expect(WaveSurfer.create).toHaveBeenCalled();
  });
});
