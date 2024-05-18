import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import UsersCardComponent from './users-card.component';
import { StateService } from '../../services/state.service';

describe('UsersCardComponent', () => {
  let component: UsersCardComponent;
  let fixture: ComponentFixture<UsersCardComponent>;
  let stateService: StateService;

  beforeEach(async () => {
    const stateServiceMock = {
      loadUsers: jasmine.createSpy('loadUsers'),
      getState: jasmine.createSpy('getState').and.returnValue(
        of({
          users: [
            { id: '1', name: 'User 1', avatar: 'avatar1.jpg' },
            { id: '2', name: 'User 2', avatar: 'avatar2.jpg' },
          ],
        }),
      ),
    };

    await TestBed.configureTestingModule({
      imports: [UsersCardComponent],
      providers: [{ provide: StateService, useValue: stateServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersCardComponent);
    component = fixture.componentInstance;
    stateService = TestBed.inject(StateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on initialization', () => {
    expect(stateService.loadUsers).toHaveBeenCalled();
  });

  it('should render users', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const userCards = compiled.querySelectorAll('.users-card');
    expect(userCards.length).toBe(2);

    const firstUserName = userCards[0].querySelector('.users-name').textContent;
    expect(firstUserName).toContain('User 1');

    const secondUserName =
      userCards[1].querySelector('.users-name').textContent;
    expect(secondUserName).toContain('User 2');
  });

  it('should display user avatars', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const userAvatars = compiled.querySelectorAll('.users-avatar');
    expect(userAvatars.length).toBe(2);

    const firstUserAvatarSrc = userAvatars[0].getAttribute('src');
    expect(firstUserAvatarSrc).toBe('avatar1.jpg');

    const secondUserAvatarSrc = userAvatars[1].getAttribute('src');
    expect(secondUserAvatarSrc).toBe('avatar2.jpg');
  });

  it('should handle empty user list', () => {
    (stateService.getState as jasmine.Spy).and.returnValue(of({ users: [] }));
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const userCards = compiled.querySelectorAll('.users-card');
    expect(userCards.length).toBe(0);
  });
});
