import { Injectable, EventEmitter } from "@angular/core";
import { of, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoaderService {
  public isLoading = new BehaviorSubject(false);
}
