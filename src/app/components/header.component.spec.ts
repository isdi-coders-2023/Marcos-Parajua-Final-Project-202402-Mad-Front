import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { StateService } from '../../services/state.service';
import { SearchService } from '../../services/search.service';
import { HeaderComponent } from './header.component';
import { UsersMenuComponent } from './users-menu.component';
import { HamburgerMenuComponent } from './hamburger-menu.component';

describe('HeaderComponent', () => {
 let component: HeaderComponent;
 let fixture: ComponentFixture<HeaderComponent>;
 let stateService: jasmine.SpyObj<StateService>;
 let searchService: jasmine.SpyObj<SearchService>;
 let router: jasmine.SpyObj<Router>;

 beforeEach(async () => {
  const stateServiceMock = jasmine.createSpyObj('StateService', ['setLogout']);
  const searchServiceMock = jasmine.createSpyObj('SearchService', [
   'toggleSearch',
  ]);
  const routerMock = jasmine.createSpyObj('Router', ['navigate']);

  await TestBed.configureTestingModule({
   imports: [HeaderComponent, UsersMenuComponent, HamburgerMenuComponent],
   providers: [
    { provide: StateService, useValue: stateServiceMock },
    { provide: SearchService, useValue: searchServiceMock },
    { provide: Router, useValue: routerMock },
   ],
  }).compileComponents();

  fixture = TestBed.createComponent(HeaderComponent);
  component = fixture.componentInstance;
  stateService = TestBed.inject(StateService) as jasmine.SpyObj<StateService>;
  searchService = TestBed.inject(
   SearchService,
  ) as jasmine.SpyObj<SearchService>;
  router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

  fixture.detectChanges();
 });

 it('should create', () => {
  expect(component).toBeTruthy();
 });

 it('should toggle users menu', () => {
  component.toggleUsersMenu();
  expect(component.isShow).toBe(true);
  component.toggleUsersMenu();
  expect(component.isShow).toBe(false);
 });

 it('should toggle hamburger menu', () => {
  component.toggleHamburgerMenu();
  expect(component.isShowHamburger).toBe(true);
  component.toggleHamburgerMenu();
  expect(component.isShowHamburger).toBe(false);
 });

 it('should toggle search', () => {
  component.toggleSearch();
  expect(searchService.toggleSearch).toHaveBeenCalled();
 });

 it('should navigate to home', () => {
  component.onClickHome();
  expect(router.navigate).toHaveBeenCalledWith(['home']);
 });

 it('should navigate to login', () => {
  component.onClickLogin();
  expect(router.navigate).toHaveBeenCalledWith(['login']);
 });

 it('should log out and navigate to home', () => {
  spyOn(localStorage, 'removeItem');
  component.onClickLogout();
  expect(localStorage.removeItem).toHaveBeenCalledWith('books');
  expect(stateService.setLogout).toHaveBeenCalled();
 });

 xit('should display users menu when isShow is true', () => {
  component.isShow = true;
  fixture.detectChanges();
  const compiled = fixture.nativeElement;
  expect(compiled.querySelector('app-users-menu')).toBeTruthy();
 });

 xit('should display hamburger menu when isShowHamburger is true', () => {
  component.isShowHamburger = true;
  fixture.detectChanges();
  const compiled = fixture.nativeElement;
  expect(compiled.querySelector('app-hamburger-menu')).toBeTruthy();
 });
});
