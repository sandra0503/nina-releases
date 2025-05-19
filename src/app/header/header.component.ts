import { Component, inject } from "@angular/core";
import { QueryService } from "../services/query.service";

@Component({
  selector: "app-header",
  imports: [],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  private queryService = inject(QueryService);

  onSearch(event: Event, query: string) {
    event.preventDefault();
    this.queryService.setSearchTerm(query);
  }

  goBack() {
    this.queryService.goBack();
  }

  goForward() {
    this.queryService.goForward();
  }
}
