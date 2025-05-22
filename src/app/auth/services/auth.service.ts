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
    map(users => users.length > 0 ? users[0] : null),
    tap(user => {
      console.log('Resultado del login:', user);  // <--- AÑADA ESTO
      if (user) {
        this.user = user;
        localStorage.setItem('token', user.id.toString());
      }
    }),
    catchError(error => {
      console.error('Login fallido', error);
      return of(null);
    })
  );
}

  checkAuthentication(): Observable<boolean>
{
  const token = localStorage.getItem('token');
  if (!token) return of(false);

  return this.http.get<User[]>(`${this.baseUrl}/users?id=${token}`).pipe(
    map(users => {
      if (users.length === 0) return false;
      this.user = users[0];
      return true;
    }),
    catchError(error => {
      console.error('Error al verificar autenticación', error);
      return of(false);
    })
  );
}

  logout()
  {
    this.user = undefined;
    localStorage.clear();
  }
}
