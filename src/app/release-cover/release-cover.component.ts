import { Component, Input } from "@angular/core";
import { ReleaseMetadata } from "../release";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-release-cover",
  imports: [CommonModule],
  templateUrl: "./release-cover.component.html",
  styleUrl: "./release-cover.component.scss",
})
export class ReleaseCoverComponent {
  @Input() release!: ReleaseMetadata;
  @Input() publisher!: string;
  @Input() isActive!: boolean;
}
