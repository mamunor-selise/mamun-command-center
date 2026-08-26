import { TestBed, ComponentFixture } from '@angular/core/testing';
import { VaultPageComponent } from './vault-page.component';
import { VaultService } from '../../core/services/vault.service';
import { signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('VaultPageComponent', () => {
  let component: VaultPageComponent;
  let fixture: ComponentFixture<VaultPageComponent>;
  let mockVaultService: any;

  beforeEach(async () => {
    mockVaultService = {
      vaultState: signal('LOCKED'),
      items: signal([]),
      searchQuery: signal(''),
      selectedCategory: signal('all'),
      toastMessage: signal(null),
      generatePassword: () => 'mockedPassword',
      unlockVault: jasmine.createSpy('unlockVault').and.resolveTo(true),
      lockVault: jasmine.createSpy('lockVault'),
      saveItem: jasmine.createSpy('saveItem').and.resolveTo(),
      deleteItem: jasmine.createSpy('deleteItem').and.resolveTo(),
      copyToClipboard: jasmine.createSpy('copyToClipboard').and.resolveTo(),
    };

    await TestBed.configureTestingModule({
      imports: [VaultPageComponent, FormsModule],
      providers: [
        { provide: VaultService, useValue: mockVaultService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VaultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the Confidential Secrets heading', () => {
    const heading = fixture.debugElement.query(By.css('h1'));
    expect(heading.nativeElement.textContent).toContain('Confidential Secrets');
  });

  it('should render the Unlock Confidential Secrets card when LOCKED', () => {
    mockVaultService.vaultState.set('LOCKED');
    fixture.detectChanges();
    const subHeading = fixture.debugElement.query(By.css('h2'));
    expect(subHeading.nativeElement.textContent).toContain('Unlock Confidential Secrets');
  });

  it('should show 🔓 Unlock Secrets on the unlock button when LOCKED', () => {
    mockVaultService.vaultState.set('LOCKED');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button.nativeElement.textContent).toContain('🔓 Unlock Secrets');
  });

  it('should show Decrypting Secrets... on the unlock button when LOCKED and isSubmitting is true', () => {
    mockVaultService.vaultState.set('LOCKED');
    component.isSubmitting.set(true);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button.nativeElement.textContent).toContain('Decrypting Secrets...');
  });

  it('should show 🔒 Lock Secrets button when UNLOCKED', () => {
    mockVaultService.vaultState.set('UNLOCKED');
    fixture.detectChanges();
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const lockBtn = buttons.find(b => b.nativeElement.textContent.includes('Lock Secrets'));
    expect(lockBtn).toBeDefined();
  });

  it('should render No Confidential Secrets Found message when UNLOCKED and items is empty', () => {
    mockVaultService.vaultState.set('UNLOCKED');
    mockVaultService.items.set([]);
    fixture.detectChanges();
    const noItemsMsg = fixture.debugElement.query(By.css('h3'));
    expect(noItemsMsg.nativeElement.textContent).toContain('No Confidential Secrets Found');
  });

  it('should render Edit Confidential Secret title in modal when editingItemId is set', () => {
    mockVaultService.vaultState.set('UNLOCKED');
    component.editingItemId.set('vitem-123');
    component.showAddSecretModal.set(true);
    fixture.detectChanges();
    const modalTitle = fixture.debugElement.query(By.css('.fixed h3'));
    expect(modalTitle.nativeElement.textContent).toContain('Edit Confidential Secret');
  });
});
