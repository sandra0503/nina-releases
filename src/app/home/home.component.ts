import { Component, inject, signal, effect, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Release } from "../release";
import { NinaService } from "../services/nina.service";
import { PlaybackService } from "../services/playback.service";
import { QueryService, STEP } from "../services/query.service";
import { ReleaseCoverComponent } from "../release-cover/release-cover.component";
import { LoaderComponent } from "../loader/loader.component";
import { PlayerComponent } from "../player/player.component";
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  of,
  startWith,
  switchMap,
} from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";

const DEFAULT_QUERY = "rnb";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    ReleaseCoverComponent,
    LoaderComponent,
  ],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  private ninaService = inject(NinaService);
  private playbackService = inject(PlaybackService);
  private queryService = inject(QueryService);

  isPlaying = signal(false);
  activeReleaseSlug = signal("");

  private current$ = toSignal(this.playbackService.current$, {
    initialValue: { release: null, isPlaying: false },
  });

  data$ = this.queryService.query$.pipe(
    distinctUntilChanged(),
    filter(({ searchTerm }) => !!searchTerm),
    switchMap(({ searchTerm, offset }) =>
      this.ninaService.searchByTag(STEP, searchTerm, offset).pipe(
        map((releases) => ({ loading: false, releases })),
        catchError(() => of({ loading: false, releases: [] })),
        startWith({ loading: true, releases: [] })
      )
    )
  );

  constructor() {
    effect(() => {
      const { release, isPlaying } = this.current$();
      this.isPlaying.set(isPlaying);
      this.activeReleaseSlug.set(release?.slug ?? "");
    });
  }

  ngOnInit(): void {
    this.queryService.setSearchTerm(DEFAULT_QUERY);
  }

  playOrPause(release: Release): void {
    this.playbackService.playRelease(release);
  }
}
