import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { UsersMenuComponent } from './users-menu.component';
import { StateService } from '../../services/state.service';

describe('UsersMenuComponent', () => {
 let component: UsersMenuComponent;
 let fixture: ComponentFixture<UsersMenuComponent>;
 let stateService: StateService;
 let router: Router;

 beforeEach(async () => {
  const stateServiceMock = {
   getState: jasmine
    .createSpy('getState')
    .and.returnValue(of({ loginState: 'idle', currentUser: null })),
   setLogout: jasmine.createSpy('setLogout'),
   setLoginState: jasmine.createSpy('setLoginState'),
  };

  const routerMock = {
   navigate: jasmine.createSpy('navigate'),
  };

  await TestBed.configureTestingModule({
   imports: [UsersMenuComponent],
   providers: [
    { provide: StateService, useValue: stateServiceMock },
    { provide: Router, useValue: routerMock },
   ],
  }).compileComponents();

  fixture = TestBed.createComponent(UsersMenuComponent);
  component = fixture.componentInstance;
  stateService = TestBed.inject(StateService);
  router = TestBed.inject(Router);
  fixture.detectChanges();
 });

 it('should create', () => {
  expect(component).toBeTruthy();
 });

 xit('should initialize with state from StateService', () => {
  expect(stateService.getState).toHaveBeenCalled();
  expect(component.state).toEqual({
   loginState: 'logged',
   currentUser: {
    id: '1',
    name: 'User',
    email: 'email@gmail.com',
    avatar: 'avatar.jpg',
    articles: [],
   },
   token: 'token',
   currentPayload: { id: '1', role: 'user' },
   users: [],
   articles: [],
  });
 });

 it('should navigate to profile on click when logged in', () => {
  component.state = {
   loginState: 'logged',
   currentUser: {
    id: '1',
    name: 'User',
    email: 'email@gmail.com',
    avatar: 'avatar.jpg',
    articles: [],
   },
   token: 'token',
   currentPayload: { id: '1', role: 'user' },
   users: [],
   articles: [],
  };
  component.isShow = true;
  fixture.detectChanges();

  const profileButton =
   fixture.nativeElement.querySelector('.users-menu-option');
  profileButton.click();

  expect(router.navigate).toHaveBeenCalledWith(['/profile', '1']);
  expect(component.isShow).toBe(false);
 });

 it('should navigate to sign up on click', () => {
  component.isShow = true;
  fixture.detectChanges();

  const signUpButton =
   fixture.nativeElement.querySelector('.users-menu-option');
  signUpButton.click();

  expect(router.navigate).toHaveBeenCalledWith(['/sign-up']);
  expect(component.isShow).toBe(false);
 });

 xit('should navigate to login on click', () => {
  component.isShow = true;
  fixture.detectChanges();

  const loginButton = fixture.nativeElement.querySelector('.users-menu-option');
  loginButton.click();

  expect(router.navigate).toHaveBeenCalledWith(['/login']);
  expect(component.isShow).toBe(false);
 });

 xit('should log out on click and reset state', () => {
  component.isShow = true;
  component.state = {
   loginState: 'logged',
   currentUser: {
    id: '1',
    name: 'User',
    email: 'email@gmail.com',
    avatar: 'avatar.jpg',
    articles: [],
   },
   token: 'token',
   currentPayload: { id: '1', role: 'user' },
   users: [],
   articles: [],
  };
  fixture.detectChanges();

  const logoutButton =
   fixture.nativeElement.querySelector('.users-menu-option');
  logoutButton.click();

  expect(stateService.setLogout).toHaveBeenCalled();
  expect(stateService.setLoginState).toHaveBeenCalledWith('idle');
  expect(router.navigate).toHaveBeenCalledWith(['/']);
  expect(component.isShow).toBe(false);
 });

 it('should call onClickLogin and navigate to login', () => {
  component.onClickLogin();
  expect(router.navigate).toHaveBeenCalledWith(['/login']);
  expect(component.isShow).toBe(false);
 });

 it('should call onClickLogout, reset state, and navigate to root', () => {
  spyOn(localStorage, 'removeItem');
  component.onClickLogout();
  expect(stateService.setLogout).toHaveBeenCalled();
  expect(stateService.setLoginState).toHaveBeenCalledWith('idle');
  expect(localStorage.removeItem).toHaveBeenCalledWith('books');
  expect(router.navigate).toHaveBeenCalledWith(['/']);
  expect(component.isShow).toBe(false);
 });
});
