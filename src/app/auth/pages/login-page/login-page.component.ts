import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: [
  ]
})
export class LoginPageComponent
{
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  onLogin():void
  {
    this.authService.login(this.email,this.password).subscribe(
      user => {
        if(user)
        {
          this.router.navigate(['/']);
        }
      });
  }
}
