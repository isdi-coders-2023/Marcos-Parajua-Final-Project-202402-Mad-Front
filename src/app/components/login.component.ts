import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RepoUsersService } from '../../services/users.repo';
import { StateService } from '../../services/state.service';
import { UserLoginDto } from '../../entities/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-header__container">
        <h2 class="login-header">Log In.</h2>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="login-form">
        <label for="nameOrEmail" class="header-label">Name or Email</label>
        <input
          type="text"
          id="nameOrEmail"
          formControlName="nameOrEmail"
          class="header-input"
        />
        <label for="password" class="header-label">Password</label>
        <input
          type="password"
          id="password"
          formControlName="password"
          class="header-input"
        />

        <button type="submit" [disabled]="form.invalid" class="login-button">
          Log In
        </button>
      </form>
    </div>
  `,
  styles: `
    .login-container {
      display: flex;
      flex-direction: column;
      align-items: center;

      padding: 61px 46px;
      gap: 28px;
    }

    .login-header__container {
      display: flex;
      padding: 20px;
      width: 100vw;
      justify-content: start;
      align-content: flex-start;
    }

    .login-header {
      font-size: 24px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px;
      color: #1c1a1c;
      margin-left: 10px;
    }
    .login-form {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      width: 80vw;
    }
    .header-label {
      align-self: start;
      font-size: 16px;
      font-style: normal;
      font-weight: 200;
      line-height: 16px;
      color: #9d95a0;
    }
    .header-input {
      padding: 8px 16px;
      align-self: start;
      border-bottom: 1px solid #9d95a0;
      width: 80vw;
      border-top: none;
      border-inline: none;
      height: 34px;
      font-size: 16px;
    }
    .login-button {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 4px 16px;
      gap: 8px;

      width: 128px;
      height: 39px;
      background: #1c1a1c;
      border-radius: 6px;
      font-style: normal;
      font-weight: 400;
      font-size: 20px;
      line-height: 40px;
      color: #ffffff;
      margin-top: 40px;
    }
    .login-button:disabled {
      background: #9d95a0;
      border: none;
    }
  `,
})
export default class LoginComponent {
  private repo = inject(RepoUsersService);
  private state = inject(StateService);
  private fb = inject(FormBuilder);
  router = inject(Router);

  form = this.fb.group({
    nameOrEmail: ['', Validators.required],
    password: ['', Validators.required],
  });

  submit() {
    const { nameOrEmail, password } = this.form.value;
    const userLogin = { password } as UserLoginDto;

    if (nameOrEmail!.includes('@')) {
      userLogin.email = this.form.value.nameOrEmail as string;
    } else {
      userLogin.name = this.form.value.nameOrEmail as string;
    }

    this.repo.login(userLogin).subscribe({
      next: ({ token }) => {
        this.state.setLogin(token);
        console.log('Logged in', token);
      },
      error: (err) => {
        console.error(err);
        this.state.setLoginState('error');
      },
    });
    this.router.navigate(['home']);
  }
}
