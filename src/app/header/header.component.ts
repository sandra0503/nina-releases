import { Component } from "@angular/core";
import { QueryService } from "../services/query.service";

@Component({
  selector: "app-header",
  imports: [],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  constructor(private queryService: QueryService) {}

  onSearch(event: Event, query: string) {
    event.preventDefault();
    this.queryService.setSearchQuery(query);
  }
}
