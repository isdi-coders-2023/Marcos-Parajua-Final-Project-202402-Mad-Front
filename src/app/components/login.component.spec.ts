import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { RepoUsersService } from '../../services/users.repo';
import { StateService } from '../../services/state.service';
import LoginComponent from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let repoService: jasmine.SpyObj<RepoUsersService>;
  let stateService: jasmine.SpyObj<StateService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const repoServiceMock = jasmine.createSpyObj('RepoUsersService', ['login']);
    const stateServiceMock = jasmine.createSpyObj('StateService', [
      'setLogin',
      'setLoginState',
    ]);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent],
      providers: [
        { provide: RepoUsersService, useValue: repoServiceMock },
        { provide: StateService, useValue: stateServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    repoService = TestBed.inject(
      RepoUsersService,
    ) as jasmine.SpyObj<RepoUsersService>;
    stateService = TestBed.inject(StateService) as jasmine.SpyObj<StateService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('should have a valid form when filled', () => {
    component.form.setValue({ nameOrEmail: 'test', password: 'password' });
    expect(component.form.valid).toBeTrue();
  });

  it('should call login and navigate on successful submit with email', () => {
    component.form.setValue({
      nameOrEmail: 'test@example.com',
      password: 'password',
    });
    repoService.login.and.returnValue(of({ token: 'test-token' }));

    component.submit();

    expect(repoService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
    expect(stateService.setLogin).toHaveBeenCalledWith('test-token');
    expect(router.navigate).toHaveBeenCalledWith(['home']);
  });

  it('should call login and navigate on successful submit with username', () => {
    component.form.setValue({ nameOrEmail: 'username', password: 'password' });
    repoService.login.and.returnValue(of({ token: 'test-token' }));

    component.submit();

    expect(repoService.login).toHaveBeenCalledWith({
      name: 'username',
      password: 'password',
    });
    expect(stateService.setLogin).toHaveBeenCalledWith('test-token');
    expect(router.navigate).toHaveBeenCalledWith(['home']);
  });

  it('should handle login error', () => {
    component.form.setValue({ nameOrEmail: 'username', password: 'password' });
    const errorResponse = new Error('Invalid credentials');
    repoService.login.and.returnValue(throwError(() => errorResponse));

    component.submit();

    expect(repoService.login).toHaveBeenCalledWith({
      name: 'username',
      password: 'password',
    });
    expect(stateService.setLoginState).toHaveBeenCalledWith('error');
  });

  it('should disable the submit button if form is invalid', () => {
    component.form.setValue({ nameOrEmail: '', password: '' });
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('.login-button');
    expect(submitButton.disabled).toBeTrue();
  });
});
