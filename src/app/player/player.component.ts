import { Component, effect, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NinaService } from "../services/nina.service";
import { PlaybackService } from "../services/playback.service";
import { Release } from "../release";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-player",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"],
})
export class PlayerComponent {
  private ninaService = inject(NinaService);
  private playbackService = inject(PlaybackService);

  private current$ = toSignal(this.playbackService.current$, {
    initialValue: { release: null, isPlaying: false },
  });

  isPlaying = signal(false);
  activeRelease = signal<Release | null>(null);

  constructor() {
    effect(() => {
      const { release, isPlaying } = this.current$();
      this.isPlaying.set(isPlaying);
      this.activeRelease.set(release);
    });
  }

  get releaseUrl(): string | null {
    const slug = this.activeRelease()?.slug ?? "";
    return slug ? this.ninaService.getReleaseUrlBySlug(slug) : null;
  }

  pausePlayback(): void {
    this.playbackService.playOrPause();
  }
}
