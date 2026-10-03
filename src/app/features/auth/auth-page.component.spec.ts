import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthPageComponent } from './auth-page.component';
import { AuthService } from '../../core/services/auth.service';

describe('AuthPageComponent', () => {
  let component: AuthPageComponent;
  let fixture: ComponentFixture<AuthPageComponent>;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    mockAuthService = {
      signin: jasmine.createSpy('signin').and.returnValue(Promise.resolve()),
      signup: jasmine.createSpy('signup').and.returnValue(Promise.resolve()),
      isLoading: jasmine.createSpy('isLoading').and.returnValue(false),
      isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(false),
      currentUser: jasmine.createSpy('currentUser').and.returnValue(null)
    };

    await TestBed.configureTestingModule({
      imports: [AuthPageComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should default to signin mode', () => {
    expect(component.mode).toBe('signin');
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeFalse();
  });

  it('should call signin when form submitted in signin mode', async () => {
    component.mode = 'signin';
    component.email = 'test@example.com';
    component.password = 'password123';

    const event = new Event('submit');
    await component.onSubmit(event);

    expect(mockAuthService.signin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should call signup when form submitted in signup mode', async () => {
    component.mode = 'signup';
    component.name = 'Mamun User';
    component.email = 'test@example.com';
    component.password = 'password123';

    const event = new Event('submit');
    await component.onSubmit(event);

    expect(mockAuthService.signup).toHaveBeenCalledWith('Mamun User', 'test@example.com', 'password123');
  });
});
