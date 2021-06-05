import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageResponse } from '@entities/message-response';
import { Group } from '@entities/score/group';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  constructor(
    private http: HttpClient
  ) {}

  public postGroup(params: Group): Observable<Group> {
    const urlPostGroup = `${environment.backendServer}/api/groups`;
    return this.http.post<Group>(urlPostGroup, params, this.httpOptions);
  }

  public getSubtestGroups(subtestId : number): Observable<Group[]> {
    const urlGroups = `${environment.backendServer}/api/groups?subtestId=${subtestId}`;
    return this.http.get<Group[]>(urlGroups, this.httpOptions);
  }

  public deleteGroup(groupId: number): Observable<MessageResponse> {
    const url = `${environment.backendServer}/api/groups?groupId=${groupId}`
    return this.http.delete<MessageResponse>(url, this.httpOptions);
  }
}
