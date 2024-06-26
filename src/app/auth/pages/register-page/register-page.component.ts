import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from '../../interfaces/user.interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styles: [
  ]
})
export class RegisterPageComponent{

  constructor(
    private authService: AuthService,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private snakebar: MatSnackBar,

  ){}

  public userForm = new FormGroup(
    {
      id: new FormControl<number | null>(null, ),
      user: new FormControl<string>('', {nonNullable: true}),
      email: new FormControl<string>(''),
      password: new FormControl<string>(''),
    }
  )

  get currentUser(): User
  {
    const user = this.userForm.value as User;
    return user;
  }


  onRegistrer(): void
  {
    if(this.userForm.invalid) return;

    this.authService.addUser(this.currentUser).subscribe(
      user =>{
        this.router.navigate(['/auth/login']);
        this.showSnackbar(`${user.email} registrado`);
      }
    )
  }
  showSnackbar(message: string):void
  {
    this.snakebar.open(message, 'Bienvenido',
      {
        duration: 2500
      }
    )
    this.router.navigate(['./']);
  }
}
