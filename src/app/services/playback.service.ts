import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Release } from "../release";
import WaveSurfer from "wavesurfer.js";

export const STEP = 9;
const WAVEFORM_CONFIG = {
  container: "#waveform",
  waveColor: "#e3e3e3",
  progressColor: "#ff5757",
  barHeight: 0.7,
  height: 50,
};

@Injectable({ providedIn: "root" })
export class PlaybackService {
  public current = new BehaviorSubject<{
    release: Release | null;
    isPlaying: boolean;
  }>({
    release: null,
    isPlaying: false,
  });
  wave: WaveSurfer | null = null;
  current$ = this.current.asObservable();

  playRelease(release: Release) {
    if (this.current.value.release?.slug === release.slug) {
      this.playOrPause();
    } else {
      this.wave?.destroy();
      this.wave = this.createWave();
      this.playFirstTrackOfRelease(release);
    }
  }

  playFirstTrackOfRelease(release: Release) {
    const firstTrackUrl = release.metadata.properties.files[0].uri;
    this.current.next({ release, isPlaying: true });
    this.wave?.load(firstTrackUrl);
    this.wave?.playPause();
  }

  playOrPause(): void {
    const current = this.current.value;
    if (this.current.value.isPlaying) {
      this.current.next({ ...current, isPlaying: false });
      this.wave?.pause();
    } else {
      this.current.next({ ...current, isPlaying: true });
      this.wave?.playPause();
    }
  }

  createWave(): WaveSurfer {
    return WaveSurfer.create(WAVEFORM_CONFIG);
  }
}
