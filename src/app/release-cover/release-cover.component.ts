import { Component, Input } from '@angular/core';
import { ReleaseMetadata } from '../release';

@Component({
  selector: 'app-release-cover',
  imports: [],
  templateUrl: './release-cover.component.html',
  styleUrl: './release-cover.component.scss',
})
export class ReleaseCoverComponent {
  @Input() release!: ReleaseMetadata;
  @Input() publisher!: string;
}
