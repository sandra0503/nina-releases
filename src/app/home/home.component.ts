import { Component, inject, OnInit } from '@angular/core';
import { NinaService } from '../nina.service';
import { ReleaseCoverComponent } from '../release-cover/release-cover.component';
import { Release } from '../release';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReleaseCoverComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  ninaService: NinaService = inject(NinaService);
  releases: Release[] = [];

  async ngOnInit(): Promise<void> {
    this.releases = await this.ninaService.getRecentlyPlayed();
  }
}
