import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RepoUsersService } from '../../services/users.repo';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="sign-up-container">
      <div class="sign-up-header__container">
        <h2 class="sign-up-header">Sign Up.</h2>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="sign-up-form">
        <label for="name" class="header-label">Name</label>
        <input
          type="text"
          id="name"
          formControlName="name"
          class="header-input"
        />
        <label for="email" class="header-label">Email</label>
        <input
          type="email"
          id="email"
          formControlName="email"
          class="header-input"
        />
        <label for="password" class="header-label">Password</label>
        <input
          type="password"
          id="password"
          formControlName="password"
          class="header-input"
        />
        <label for="repeatPassword" class="header-label">Repeat Password</label>
        <input
          type="password"
          id="repeatPassword"
          formControlName="repeatPassword"
          class="header-input"
        />
        <label class="header-label">
          <span>Choose an Avatar</span>

          <input
            type="file"
            id="avatar"
            class="sign-up-avatar"
            #avatar
            (change)="onFileChange()"
        /></label>

        <button type="submit" [disabled]="form.invalid" class="sign-up-button">
          Sign Up
        </button>
      </form>
    </div>
  `,
  styles: `
    .sign-up-container {
      display: flex;
      flex-direction: column;
      align-items: center;

      padding: 25px 46px;
      gap: 28px;
      height: 85vh;
    }
    .sign-up-form {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      width: 80vw;
    }
    .login-container {
      display: flex;
      flex-direction: column;
      align-items: center;

      padding: 61px 46px;
      gap: 28px;
    }

    .sign-up-header__container {
      display: flex;
      padding: 20px;
      width: 100vw;
      justify-content: start;
      align-content: flex-start;
    }

    .sign-up-header {
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
    .sign-up-button {
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
    .sign-up-button:disabled {
      background: #9d95a0;
      border: none;
    }
    .sign-up-avatar {
      display: none;
    }
  `,
})
export default class SignUpComponent {
  fb = inject(FormBuilder);
  repo = inject(RepoUsersService);
  router = inject(Router);
  form: FormGroup;

  @ViewChild('avatar') avatar!: ElementRef;

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      avatar: [null],
    });
  }

  async onFileChange() {
    const htmlElement: HTMLInputElement = this.avatar.nativeElement;
    const file = htmlElement.files![0];
    console.log(file);
    await this.form.patchValue({ avatar: file });
  }

  submit() {
    console.log(this.form.value);

    const fd = new FormData();
    fd.append('name', this.form.value.name);
    fd.append('email', this.form.value.email);
    fd.append('password', this.form.value.password);
    fd.append('repeatPassword', this.form.value.repeatPassword);
    fd.append('avatar', this.form.value.avatar);
    fd.append('role', 'user');

    return this.repo.create(fd).subscribe((data) => {
      console.log(data);
      this.router.navigate(['login']);
    });
  }
}
