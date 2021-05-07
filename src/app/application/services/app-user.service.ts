import { Injectable } from "@angular/core";
import { RegistrationResponse } from "@entities/user/registration-response";
import { User } from "@entities/user/user.interface";
import { Observable, Subject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { UserRepositoryService } from "src/app/domain/repository/user-repository.service";

@Injectable({
  providedIn: "root",
})
export class AppUserService {
  constructor(private userRepository: UserRepositoryService) {}

  /**
   * @description calls user repository method registerUser and saves response in store
   * @returns observable of type RegistrationResponse, the value returned by the backend
   */
  registerUser(params : User): Observable<RegistrationResponse> {
    return this.userRepository.registerUser(params).pipe(
      map((response) => response)
    );
  }
}
