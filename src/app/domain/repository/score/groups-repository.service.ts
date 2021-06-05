import { Injectable } from '@angular/core';
import { MessageResponse } from '@entities/message-response';
import { Group } from '@entities/score/group';
import { GroupsService } from '@infrastructure/services/score/groups.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupsRepositoryService {

  constructor( private groupsService: GroupsService) { }

  /**
   * @description calls group service method postGroup
   * @returns observable of type Group, the value returned by the backend
   */

   public postGroup(params: Group): Observable<Group> {
    return this.groupsService
      .postGroup(params)
      .pipe(map((response) => response));
  }

  /**
   * @description calls group service method getSubtestGroups
   * @returns observable of type array of groups, the value returned by the backend
   */

   public getSubtestGroups(subtestId: number): Observable<Group[]> {
    return this.groupsService
      .getSubtestGroups(subtestId)
      .pipe(map((response) => response));
  }

  /**
   * @description funtion that logically deletes a group
   * @param groupId the id of the group we want to delete
   * @returns observable of type MessageResponse, the value returned by the backend
   */
   public deleteGroup(groupId : number) : Observable<MessageResponse> {
    return this.groupsService
      .deleteGroup(groupId)
      .pipe(map((response) => response));
  }
}
