import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interfaces';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService
{
  private baseUrl= environments.baseUrl;
  private user?: User;

  constructor
  (
    private http: HttpClient,
  ) { }

  get currentUser(): User | undefined
  {
    if(!this.user) return undefined;
    return structuredClone(this.user);
  }

  addUser(user: User): Observable <User>
  {
    return this.http.post<User>(`${this.baseUrl}/users/`,user);
  }

  login(email: string, password: string): Observable<User | null>
  {
    return this.http.get<User[]>(`${this.baseUrl}/users?email=${email}&password=${password}`).pipe(
      map( user => user.length > 0 ? user[0]: null),
      tap(user => {
        if (user) {
          this.user = user;
          localStorage.setItem('token', user.id.toString());
        }
      }),
      catchError(error => {
        console.error('Login failed', error);
        return of(null);
      })
    );
  }

  checkAuthentication(): Observable<boolean>
  {
    if(!localStorage.getItem('token')) return of(false);

    const token = localStorage.getItem('token');
    return this.http.get<User>(`${this.baseUrl}/users/${token}`).pipe(
      tap( user => this.user = user),
      map( user => !!user),
      catchError( error => of(false))
    )
  }

  logout()
  {
    this.user = undefined;
    localStorage.clear();
  }
}
