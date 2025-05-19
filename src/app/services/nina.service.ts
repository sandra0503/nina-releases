import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map, catchError, of } from "rxjs";
import { Release } from "../release";

const URL = "https://www.ninaprotocol.com";
const URL_V1 = "https://services.ninaprotocol.com/v1";

@Injectable({ providedIn: "root" })
export class NinaService {
  private http = inject(HttpClient);

  constructor() {}

  getReleaseUrlBySlug(slug: string): string | null {
    if (slug.length === 0) {
      return null;
    }
    return `${URL}/releases/${slug}`;
  }

  searchByTag(
    limit: number,
    tag: string,
    offset: number
  ): Observable<Release[]> {
    return this.http
      .get<{ releases: Release[] }>(
        `${URL_V1}/tags/${tag}?limit=${limit}&offset=${offset}&sort=desc&column=datetime&query=${tag}`
      )
      .pipe(
        map((res) => res.releases ?? []),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      );
  }

  getRelease(id: string): Observable<Release> {
    return this.http.get<{ release: Release }>(`${URL_V1}/releases/${id}`).pipe(
      map((res) => res.release),
      catchError((err) => {
        console.error(err);
        return of(null as any);
      })
    );
  }
}
