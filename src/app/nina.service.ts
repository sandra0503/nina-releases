import { Injectable } from "@angular/core";
import { Release } from "./release";

@Injectable({
  providedIn: "root",
})
export class NinaService {
  url = "https://services.ninaprotocol.com/v1";

  async getRecentlyPlayed(limit: number = 10): Promise<Release[]> {
    const data = await fetch(
      `https://beam.ninaprotocol.com/recentlyPlayed?limit=${limit}`
    );
    const { releases } = await data.json();
    return releases ?? [];
  }

  async searchByTag(
    limit: number,
    tag: string,
    offset: number
  ): Promise<Release[]> {
    const data = await fetch(
      `${this.url}/tags/${tag}?limit=${limit}&offset=${offset}&sort=desc&column=datetime&query=${tag}`
    );
    const { releases } = await data.json();
    return releases ?? [];
  }

  async getRelease(id: string): Promise<Release> {
    const data = await fetch(`${this.url}/releases/${id}`);
    const { release } = await data.json();
    return release;
  }
}
