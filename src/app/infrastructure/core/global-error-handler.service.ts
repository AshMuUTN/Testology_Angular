import { Injectable, ErrorHandler } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: Error) {
    // TODO: Define how to manage errors.
    // Documentation: https://www.tektutorialshub.com/angular/error-handling-in-angular-applications/
    // TODO: Review if we have to rethrow the error.
    throw error;
  }
}
