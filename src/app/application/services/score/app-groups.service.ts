import { Injectable } from '@angular/core';
import { MessageResponse } from '@entities/message-response';
import { Group } from '@entities/score/group';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GroupsRepositoryService } from 'src/app/domain/repository/score/groups-repository.service';
import { State } from '../../state/core/reducers';

@Injectable({
  providedIn: 'root'
})
export class AppGroupsService {

  constructor(private groupsRepositoryService : GroupsRepositoryService, private store$: Store<State>) { }

  /**
   * @description calls group repository method postGroup
   * @returns observable of type Group, the value returned by the backend
   */
   postGroup(params: Group): Observable<Group> {
    return this.groupsRepositoryService
      .postGroup(params)
      .pipe(map((response) => response));
  }

  /**
   * @description calls group repository method getTestGroups with subtestId from current subtest
   * @returns observable of type Test, the value returned by the backend
   */
  getSubtestGroups(subtestId: number): Observable<Group[]> {
     return this.groupsRepositoryService
            .getSubtestGroups(subtestId)
            .pipe(map((response) => response));        
  }

  /**
   * @description funtion that logically deletes a group
   * @param groupId the id of the group we want to delete
   * @returns observable of type MessageResponse, the value returned by the backend
   */
  public deleteGroup(groupId : number) : Observable<MessageResponse> {
    return this.groupsRepositoryService
      .deleteGroup(groupId)
      .pipe(map((response) => response));
  }
}
