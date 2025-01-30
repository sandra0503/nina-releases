import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from "@angular/core";
import { NinaService } from "../nina.service";
import { ReleaseCoverComponent } from "../release-cover/release-cover.component";
import { Release } from "../release";
import { CommonModule } from "@angular/common";
import WaveSurfer from "wavesurfer.js";

@Component({
  selector: "app-home",
  imports: [CommonModule, ReleaseCoverComponent],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent implements OnInit {
  ninaService: NinaService = inject(NinaService);
  wave: WaveSurfer | null = null;

  releases: WritableSignal<Release[]> = signal([]);
  playingSlug = signal("");
  selectedSlug = signal("");

  offset = 0;
  limit = 6;

  get releaseUrl(): string {
    const slug = this.playingSlug();
    return slug ? `https://www.ninaprotocol.com/releases/${slug}` : "";
  }

  async ngOnInit(): Promise<void> {
    this.getReleases(0);
  }

  async getReleases(offset: number) {
    this.offset = offset;
    const releases = await this.ninaService.searchByTag(
      this.limit,
      "techno",
      this.offset
    );
    this.releases.set(releases);
  }

  playOrPause(release: Release) {
    if (this.playingSlug() === release.slug) {
      this.stopPlayback();
      return;
    }
    this.wave?.destroy();
    this.wave = this.createWave();

    const firstTrackUrl = release.metadata.properties.files[0].uri;
    this.playingSlug.set(release.slug);
    this.selectedSlug.set(release.slug);

    this.wave?.load(firstTrackUrl);
    this.wave?.playPause();
  }

  createWave(): WaveSurfer {
    return WaveSurfer.create({
      container: "#waveform",
      waveColor: "#999999",
      progressColor: "#eb4034",
      barHeight: 0.3,
      height: 100,
    });
  }

  stopPlayback() {
    this.playingSlug.set("");
    this.wave?.pause();
  }

  handleClickNext() {
    this.getReleases(this.offset + this.limit);
  }
}
