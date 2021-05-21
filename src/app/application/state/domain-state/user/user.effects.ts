import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, concatMap, map, switchMap } from "rxjs/operators";
import { AppUserService } from "src/app/application/services/app-user.service";
import * as UserActions from "./user.actions";

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private appService: AppUserService) {}

  registerUserSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.addUser),
      switchMap((props) =>
        this.appService.registerUser(props.user).pipe(
          map(() => UserActions.addUserSuccess({ success: true })),
          catchError(() => of(UserActions.addUserSuccess({ success: false })))
        )
      )
    );
  });

  updateUserPasswordSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.updateUserPassword),
      switchMap((props) =>
        this.appService.changePassword(props.user).pipe(
          map(() => UserActions.updateUserPasswordSuccess({ success: true })),
          catchError(() => of(UserActions.updateUserPasswordSuccess({ success: false })))
        )
      )
    );
  });

  loginUserSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.loginUser),
      switchMap((props) =>
        this.appService.loginUser(props.user).pipe(
          map(() => UserActions.loginUserSuccess({ success: true })),
          catchError((err) => {
            console.log(err)
            return of(UserActions.loginUserSuccess({ success: false }))
          })
        )
      )
    );
  });

  logoutUserSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.logoutUser),
      switchMap((props) =>
        this.appService.removeAuthAndMoveAway(props.manual).pipe( 
          map(() => UserActions.logoutUserSuccess({ success: true })),
          catchError((err) => {
            console.log(err)
            return of(UserActions.logoutUserSuccess({ success: false }))
          })
        )
      )
    );
  });

  passwordChangeSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.changeUserPasswordRequest),
      switchMap((props) =>
        this.appService.requestPasswordChange(props.user).pipe(
          map(() => UserActions.changeUserPasswordRequestSuccess({ success: true })),
          catchError((err) => {
            console.log(err)
            return of(UserActions.changeUserPasswordRequestSuccess({ success: false }))
          })
        )
      )
    );
  });
}
