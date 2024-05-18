import { ComponentFixture, TestBed } from '@angular/core/testing';
import { State, StateService } from '../../services/state.service';
import { of } from 'rxjs';
import HomeComponent from './home.component';
import { User } from '../../entities/user';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let stateService: jasmine.SpyObj<StateService>;

  beforeEach(async () => {
    const stateServiceMock = jasmine.createSpyObj('StateService', ['getState']);
    const mockUser: User = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      avatar: 'avatar.jpg',
      articles: [],
    };

    stateServiceMock.getState.and.returnValue(
      of({
        currentUser: mockUser,
        loginState: 'logged',
        articles: [],
      }),
    );

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [{ provide: StateService, useValue: stateServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    stateService = TestBed.inject(StateService) as jasmine.SpyObj<StateService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with state from StateService', () => {
    expect(stateService.getState).toHaveBeenCalled();
    expect(component.currentUser).toEqual({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      avatar: 'avatar.jpg',
      articles: [],
    });
    expect(component.state).toEqual({
      currentUser: component.currentUser,
      loginState: 'logged',
      articles: [],
    } as unknown as State);
  });

  it('should display articles list when login state is "idle"', () => {
    stateService.getState.and.returnValue(
      of({
        currentUser: null,
        loginState: 'idle',
        articles: [],
      } as unknown as State),
    );
    component.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-articles-list')).toBeTruthy();
    expect(compiled.querySelector('p')).toBeNull();
  });

  it('should display articles list when login state is "logged"', () => {
    stateService.getState.and.returnValue(
      of({
        currentUser: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          avatar: 'avatar.jpg',
          articles: [],
        },
        loginState: 'logged',
        articles: [],
      } as unknown as State),
    );
    component.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-articles-list')).toBeTruthy();
    expect(compiled.querySelector('p')).toBeNull();
  });

  it('should display error message when login state is "error"', () => {
    stateService.getState.and.returnValue(
      of({
        currentUser: null,
        loginState: 'error',
        articles: [],
        token: '',
        currentPayload: {},
        users: [],
      } as unknown as State),
    );
    component.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain(
      'Failed to Access',
    );
    expect(compiled.querySelector('app-articles-list')).toBeNull();
  });
});
