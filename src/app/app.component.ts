import { Component } from "@angular/core";
import { HeaderComponent } from "./header/header.component";

import { HomeComponent } from "./home/home.component";

@Component({
  selector: "app-root",
  imports: [HeaderComponent, HomeComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "Nina releases";
}
