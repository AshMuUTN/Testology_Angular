import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { User } from "@entities/user/user.interface";
@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(
    private http: HttpClient
  ) {}

  public postUserRegistration(params: User): Observable<any> {
    const urlUserRegistration = ``;
    return this.http.post(urlUserRegistration, params);
  }
}
