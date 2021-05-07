import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";
import { Observable, Subject } from "rxjs";
import { UserService } from "@infrastructure/services/user.service";
import { RegistrationResponse } from "@entities/user/registration-response";
import { User } from "@entities/user/user.interface";

@Injectable({
  providedIn: "root",
})
export class UserRepositoryService {
  constructor(
    private userService: UserService,
  ) {}

  /**
   * @description calls user service method postUserRegistration
   * TODO:: handle login (interceptor or here???)
   * @returns observable of type RegistrationResponse, the value returned by the backend
   */

  public registerUser(params: User): Observable<RegistrationResponse> {
    return this.userService
      .postUserRegistration(params)
      .pipe(map((response) => response));
  }

}
