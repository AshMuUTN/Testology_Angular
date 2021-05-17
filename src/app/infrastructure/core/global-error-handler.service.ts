import { Injectable, ErrorHandler } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: Error) {
    console.log('ERROR HERE', error)
    throw error;
  }
}
