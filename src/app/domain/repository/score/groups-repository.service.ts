import { Injectable } from "@angular/core";
import { MessageResponse } from "@entities/message-response";
import { Group } from "@entities/score/group";
import { GroupsService } from "@infrastructure/services/score/groups.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class GroupsRepositoryService {
  constructor(private groupsService: GroupsService) {}

  /**
   * @description calls group service method postGroup or postDivision depending on type
   * @returns observable of type Group, the value returned by the backend
   */

  public postGroup(params: Group, type = ""): Observable<Group> {
    const serviceCall =
      type === "division"
        ? this.groupsService.postDivision(params)
        : this.groupsService.postGroup(params);
    return serviceCall.pipe(map((response) => response));
  }

  /**
   * @description calls group service method getSubtestGroups or getSubtestDivisions depending on type
   * @returns observable of type array of groups, the value returned by the backend
   */

  public getSubtestGroups(subtestId: number, type = ""): Observable<Group[]> {
    const serviceCall =
      type === "division"
      ? this.groupsService.getSubtestDivisions(subtestId)
      : this.groupsService.getSubtestGroups(subtestId);
    return serviceCall.pipe(map((response) => response));
  }

  /**
   * @description funtion that logically deletes a group
   * @param groupId the id of the group we want to delete
   * @returns observable of type MessageResponse, the value returned by the backend
   */
  public deleteGroup(groupId: number, type = ""): Observable<MessageResponse> {
    const serviceCall =
      type === "division"
      ? this.groupsService.deleteDivision(groupId)
      : this.groupsService.deleteGroup(groupId);
    return serviceCall.pipe(map((response) => response));
  }
}
