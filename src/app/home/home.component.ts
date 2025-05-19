import { Component, inject, OnInit, signal } from "@angular/core";
import { NinaService } from "../services/nina.service";
import { ReleaseCoverComponent } from "../release-cover/release-cover.component";
import { Release } from "../release";
import { CommonModule } from "@angular/common";
import { QueryService } from "../services/query.service";
import WaveSurfer from "wavesurfer.js";
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  startWith,
  switchMap,
} from "rxjs";
import { LoaderComponent } from "../loader/loader.component";

const DEFAULT_QUERY = "rnb";

@Component({
  selector: "app-home",
  imports: [CommonModule, ReleaseCoverComponent, LoaderComponent],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent implements OnInit {
  ninaService: NinaService = inject(NinaService);
  wave: WaveSurfer | null = null;
  data$: Observable<{ loading: boolean; releases: Release[] }>;

  playingSlug = signal("");
  selectedSlug = signal("");
  offset = 0;
  limit = 9;

  get releaseUrl(): string | null {
    return this.ninaService.getReleaseUrlBySlug(this.selectedSlug());
  }

  constructor(private queryService: QueryService) {
    this.data$ = this.queryService.searchQuery$.pipe(
      distinctUntilChanged(),
      filter((query) => query?.length > 0),
      switchMap((query) =>
        this.ninaService.searchByTag(this.limit, query, 0).pipe(
          map((releases) => ({ loading: false, releases })),
          catchError(() => {
            return of({
              loading: false,
              releases: [],
            });
          }),
          startWith({ loading: true, releases: [] })
        )
      )
    );
  }

  async ngOnInit(): Promise<void> {
    this.queryService.setSearchQuery(DEFAULT_QUERY);
  }

  getReleases(offset: number, query: string): Observable<Release[]> {
    this.offset = offset;
    return this.ninaService.searchByTag(this.limit, query, this.offset);
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
      waveColor: "#e3e3e3",
      progressColor: "#ff5757",
      barHeight: 0.7,
      height: 50,
    });
  }

  stopPlayback() {
    this.playingSlug.set("");
    this.wave?.pause();
  }

  handleClickNext() {
    this.getReleases(this.offset + this.limit, "");
  }
}
