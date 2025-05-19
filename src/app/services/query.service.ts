import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export const STEP = 9;

@Injectable({ providedIn: "root" })
export class QueryService {
  private query = new BehaviorSubject<{ searchTerm: string; offset: number }>({
    searchTerm: "",
    offset: 0,
  });
  query$ = this.query.asObservable();

  setSearchTerm(searchTerm: string) {
    const current = this.query.value;
    this.query.next({ ...current, searchTerm, offset: 0 });
  }

  goBack() {
    const current = this.query.value;
    const newOffset = Math.max(current.offset - STEP, 0);
    this.query.next({ ...current, offset: newOffset });
  }

  goForward() {
    const current = this.query.value;
    const newOffset = current.offset + STEP;
    this.query.next({ ...current, offset: newOffset });
  }
}
