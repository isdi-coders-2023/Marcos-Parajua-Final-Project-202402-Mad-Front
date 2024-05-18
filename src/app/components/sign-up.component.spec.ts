import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { RepoUsersService } from '../../services/users.repo';
import SignUpComponent from './sign-up.component';
import { ElementRef } from '@angular/core';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let repoService: jasmine.SpyObj<RepoUsersService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const repoServiceMock = jasmine.createSpyObj('RepoUsersService', [
      'create',
    ]);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SignUpComponent],
      providers: [
        { provide: RepoUsersService, useValue: repoServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    repoService = TestBed.inject(
      RepoUsersService,
    ) as jasmine.SpyObj<RepoUsersService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.form.value).toEqual({
      name: '',
      email: '',
      password: '',
      repeatPassword: '',
      avatar: null,
    });
  });

  it('should handle file input change', async () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [file] } };

    spyOn(component.form, 'patchValue');
    component.avatar = { nativeElement: event.target } as ElementRef;
    await component.onFileChange();

    expect(component.form.patchValue).toHaveBeenCalledWith({ avatar: file });
  });

  it('should submit form and navigate to login', () => {
    const mockUser = {};
    component.form.setValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      repeatPassword: 'password123',
      avatar: new File([''], 'test.jpg', { type: 'image/jpeg' }),
    });

    repoService.create.and.returnValue(of(mockUser));

    component.submit();

    expect(repoService.create).toHaveBeenCalledWith(jasmine.any(FormData));
    expect(router.navigate).toHaveBeenCalledWith(['login']);
  });

  it('should disable submit button if form is invalid', () => {
    component.form.controls['email'].setValue('');
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('.sign-up-button');
    expect(submitButton.disabled).toBeTruthy();
  });
});
