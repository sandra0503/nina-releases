import { Injectable } from '@angular/core';
import { Release } from './release';

@Injectable({
  providedIn: 'root',
})
export class NinaService {
  async getRecentlyPlayed(limit: number = 10): Promise<Release[]> {
    const url = 'https://beam.ninaprotocol.com/recentlyPlayed';
    const data = await fetch(`${url}?limit=${limit}`);
    const { releases } = await data.json();
    return releases ?? [];
  }

  async getRelease(id: string): Promise<Release> {
    const url = 'https://services.ninaprotocol.com/v1/releases';
    const data = await fetch(`${url}/${id}`);
    const { release } = await data.json();
    return release;
  }
}
