import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { AuthGuard } from './auth.guard';

@Injectable({providedIn: 'root'})
export class PublicGuard {
  constructor(
    private authService:AuthService,
    private router: Router,
  ) { }

  private checkAuthStatusLogin(): boolean | Observable<boolean>
  {
   return this.authService.checkAuthentication().pipe(
      tap(NoAuthenticated => console.log('Con autenticacion: ', NoAuthenticated)),

      tap(NoAuthenticated => {
        if (NoAuthenticated) {
          this.router.navigate(['./']);
        }
      }),
      map(NoAuthenticated => !NoAuthenticated)
    );
  }
  public canMatch: CanMatchFn = (route, segments) => {

    return this.checkAuthStatusLogin()

  };

  public canActivate: CanActivateFn = (route, state) => {

    return this.checkAuthStatusLogin()

  };
}
