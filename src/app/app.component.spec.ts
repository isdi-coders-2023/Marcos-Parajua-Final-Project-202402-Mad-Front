/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header.component';
import { StateService } from '../services/state.service';
import LoaderComponent from './components/loader.component';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let stateServiceMock: jasmine.SpyObj<StateService>;

  beforeEach(async () => {
    stateServiceMock = jasmine.createSpyObj('StateService', [
      'setLogin',
      'isLoading',
    ]);
    stateServiceMock.isLoading.and.returnValue(true); // Mock isLoading to return an observable

    await TestBed.configureTestingModule({
      imports: [RouterOutlet, HeaderComponent, LoaderComponent, AppComponent],
      providers: [{ provide: StateService, useValue: stateServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should contain app-header, app-loader, and router-outlet', () => {
    const header = fixture.debugElement.query(By.directive(HeaderComponent));
    const loader = fixture.debugElement.query(By.directive(LoaderComponent));
    const routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));

    expect(header).toBeTruthy();
    expect(loader).toBeTruthy();
    expect(routerOutlet).toBeTruthy();
  });

  it('should set login state if token is found in localStorage', () => {
    const token = 'sample-token';
    const tokenData = JSON.stringify({ token });
    spyOn(localStorage, 'getItem').and.returnValue(tokenData);

    // Recreate the component to trigger the constructor logic
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(localStorage.getItem).toHaveBeenCalledWith('books');
    expect(stateServiceMock.setLogin).toHaveBeenCalledWith(token);
  });

  it('should not set login state if token is not found in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    // Recreate the component to trigger the constructor logic
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(localStorage.getItem).toHaveBeenCalledWith('books');
    expect(stateServiceMock.setLogin).not.toHaveBeenCalled();
  });
});
