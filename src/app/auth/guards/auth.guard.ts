import { Injectable } from '@angular/core';
import { CanMatchFn, CanActivateFn, UrlSegment, Route, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard
{
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  private checkAuthStatus(): boolean | Observable<boolean>
  {
    return this.authService.checkAuthentication().pipe(
      tap(isAuthenticated => console.log('Autenticado:', isAuthenticated)),
      tap( isAuthenticated => {
        if(!isAuthenticated)
        {
          this.router.navigate(['./auth/login']);
        }
      })
    );
  }

  public canMatch: CanMatchFn = (route, segments) => {

    //console.log('canMatch', { route, segments });
    //return true;

    return this.checkAuthStatus()

  };

  public canActivate: CanActivateFn = (route, state) => {

    //console.log('canActivate', { route, state });
    //return true;
    return this.checkAuthStatus()

  };
}
