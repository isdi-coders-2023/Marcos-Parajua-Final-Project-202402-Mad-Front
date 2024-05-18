import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StateService } from '../../services/state.service';
import LoaderComponent from './loader.component';
import { of } from 'rxjs';

describe('LoaderComponent', () => {
 let component: LoaderComponent;
 let fixture: ComponentFixture<LoaderComponent>;
 let stateService: jasmine.SpyObj<StateService>;

 beforeEach(async () => {
  const stateServiceMock = jasmine.createSpyObj('StateService', ['isLoading']);
  stateServiceMock.isLoading = of(true); // Mock isLoading to return true

  await TestBed.configureTestingModule({
   imports: [LoaderComponent],
   providers: [{ provide: StateService, useValue: stateServiceMock }],
  }).compileComponents();

  fixture = TestBed.createComponent(LoaderComponent);
  component = fixture.componentInstance;
  stateService = TestBed.inject(StateService) as jasmine.SpyObj<StateService>;

  fixture.detectChanges();
 });

 xit('should create', () => {
  expect(component).toBeTruthy();
 });

 xit('when isLoading is true, should display loader', () => {
  stateService.isLoading.and.returnValue(true);
  fixture.detectChanges();
  expect(fixture.nativeElement.querySelector('.loader')).toBeTruthy();
 });

 xit('when isLoading is false, should not display loader', () => {
  stateService.isLoading.and.returnValue(false);
  fixture.detectChanges();
  expect(fixture.nativeElement.querySelector('.loader')).toBeNull();
 });

 xit('should call isLoading from StateService', () => {
  expect(stateService.isLoading).toBeTruthy();
 });
});
