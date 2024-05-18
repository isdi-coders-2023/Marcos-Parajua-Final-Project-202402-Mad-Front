import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { State, StateService } from '../../services/state.service';
import { HamburgerMenuComponent } from './hamburger-menu.component';
import { User } from '../../entities/user';

describe('HamburgerMenuComponent', () => {
  let component: HamburgerMenuComponent;
  let fixture: ComponentFixture<HamburgerMenuComponent>;
  let stateService: jasmine.SpyObj<StateService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const stateServiceMock = jasmine.createSpyObj('StateService', ['getState']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    stateServiceMock.getState.and.returnValue(
      of({
        loginState: 'logged',
        currentUser: { id: '1', name: 'Test User' },
        articles: [],
      }),
    );

    await TestBed.configureTestingModule({
      imports: [HamburgerMenuComponent],
      providers: [
        { provide: StateService, useValue: stateServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HamburgerMenuComponent);
    component = fixture.componentInstance;
    stateService = TestBed.inject(StateService) as jasmine.SpyObj<StateService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with state from StateService', () => {
    expect(stateService.getState).toHaveBeenCalled();
    expect(component.state).toEqual({
      loginState: 'logged',
      currentUser: { id: '1', name: 'Test User' } as User,
      articles: [],
    } as unknown as State);
  });

  it('should navigate to articles and close menu', () => {
    component.isShowHamburger = true;
    fixture.detectChanges();

    component.onClickArticles();
    expect(router.navigate).toHaveBeenCalledWith(['articles']);
    expect(component.isShowHamburger).toBe(false);
  });

  it('should navigate to create article and close menu', () => {
    component.isShowHamburger = true;
    fixture.detectChanges();

    component.onClickCreateArticle();
    expect(router.navigate).toHaveBeenCalledWith(['create-article']);
    expect(component.isShowHamburger).toBe(false);
  });

  it('should display write new article option when logged in', () => {
    component.isShowHamburger = true;
    component.state = {
      loginState: 'logged',
      currentUser: { id: '1', name: 'Test User' } as User,
      articles: [],
    } as unknown as State;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.hamburger-menu-option')).toBeTruthy();
    expect(compiled.querySelectorAll('.hamburger-menu-option').length).toBe(2);
  });

  it('should not display write new article option when not logged in', () => {
    stateService.getState.and.returnValue(
      of({
        loginState: 'idle',
        currentUser: null,
        articles: [],
      } as unknown as State),
    );
    component.ngOnInit();
    component.isShowHamburger = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.hamburger-menu-option')).toBeTruthy();
    expect(compiled.querySelectorAll('.hamburger-menu-option').length).toBe(1);
  });
});
