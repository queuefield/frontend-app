import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { FileUploaderComponent } from '../../shared/file-uploader/file-uploader.component';
import { TenantService } from '../../../services/tenant.service';
import { LookupsService, LookupType } from '../../../services/lookups.service';

@Component({
  selector: 'app-add-edit-store',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
    FileUploaderComponent,
  ],
  templateUrl: './add-edit-store.component.html',
  styleUrl: './add-edit-store.component.scss',
})
export class AddEditStoreComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tenantService = inject(TenantService);
  private lookupsService = inject(LookupsService);

  // State
  activeTab = signal(0);
  isEditMode = signal(false);
  editId = signal<number | null>(null);
  isSaving = signal(false);
  isLoading = signal(false);

  // File GUIDs
  logoFileId = signal<string | null>(null);
  legalDocumentFileIds = signal<string[]>([]);
  contractDocumentFileIds = signal<string[]>([]);

  // Tab labels
  tabs = ['Store Main Info', 'Legal Info', 'Branches'];

  // Dropdown options loaded from LookupsService
  categories = signal<any[]>([]);
  countries = signal<any[]>([]);
  regions = signal<any[]>([]);
  cities = signal<any[]>([]);
  salesAgents = signal<any[]>([]);
  supportAgents = signal<any[]>([]);
  plans = signal<any[]>([]);
  sources = signal<any[]>([]);
  statuses = signal<any[]>([]);
  zones = signal<any[]>([]);

  // ── Forms ──
  storeForm!: FormGroup;
  legalForm!: FormGroup;

  // ── Computed ──
  get branches(): FormArray {
    return this.storeForm?.get('branches') as FormArray;
  }

  get contacts(): FormArray {
    return this.storeForm?.get('contacts') as FormArray;
  }

  // Validation state (bridged from reactive forms via valueChanges)
  isTab1Valid = signal(false);
  isTab2Valid = signal(true);
  isTab3Valid = signal(false);
  canGoNext = signal(false);
  canSave = signal(false);
  showValidationInfo = signal(false);

  // Tab 1 required fields with labels
  private tab1RequiredFields = [
    { field: 'nameEn', label: 'Store Name (English)' },
    { field: 'nameAr', label: 'Store Name (Arabic)' },
    { field: 'username', label: 'Username' },
    { field: 'categoryId', label: 'Store Category' },
    { field: 'countryId', label: 'Country' },
    { field: 'headOfficeLocation', label: 'Head Office Location' },
    { field: 'headOfficeAddress', label: 'Head Office Address' },
  ];

  // Tab 2 required fields with labels
  private tab2RequiredFields = [
    { field: 'salesAgentId', label: 'Sales Agent' },
    { field: 'supportAgentId', label: 'Support Agent' },
    { field: 'planId', label: 'Subscription Plan' },
  ];

  /** Returns list of invalid field labels for the current tab */
  getInvalidFields(): string[] {
    const tab = this.activeTab();
    if (tab === 0) {
      const storeInvalid = this.tab1RequiredFields
        .filter(f => this.storeForm?.get(f.field)?.invalid)
        .map(f => f.label);

      // Check contact fields
      const contacts = this.contacts;
      for (let i = 0; i < contacts?.length; i++) {
        const c = contacts.at(i);
        if (c.get('name')?.invalid) storeInvalid.push(`Contact ${i + 1}: Name`);
        if (c.get('title')?.invalid) storeInvalid.push(`Contact ${i + 1}: Email`);
        if (c.get('phone')?.invalid) storeInvalid.push(`Contact ${i + 1}: Phone`);
      }
      return storeInvalid;
    }
    if (tab === 1) {
      return this.tab2RequiredFields
        .filter(f => this.legalForm?.get(f.field)?.invalid)
        .map(f => f.label);
    }
    if (tab === 2) {
      const branchInvalid: string[] = [];
      if (this.branches?.length === 0) {
        branchInvalid.push('At least one branch is required');
      } else {
        for (let i = 0; i < this.branches.length; i++) {
          const b = this.branches.at(i);
          if (b.get('nameEn')?.invalid) branchInvalid.push(`Branch ${i + 1}: Name (English)`);
          if (b.get('nameAr')?.invalid) branchInvalid.push(`Branch ${i + 1}: Name (Arabic)`);
          if (b.get('cityId')?.invalid) branchInvalid.push(`Branch ${i + 1}: City`);
          if (b.get('regionId')?.invalid) branchInvalid.push(`Branch ${i + 1}: Zone`);
          if (b.get('address')?.invalid) branchInvalid.push(`Branch ${i + 1}: Address`);
          if (b.get('location')?.invalid) branchInvalid.push(`Branch ${i + 1}: Location`);
          if (b.get('contactName')?.invalid) branchInvalid.push(`Branch ${i + 1}: Contact Name`);
          if (b.get('contactTitle')?.invalid) branchInvalid.push(`Branch ${i + 1}: Contact Title`);
          if (b.get('contactPhone')?.invalid) branchInvalid.push(`Branch ${i + 1}: Contact Phone`);
        }
      }
      return branchInvalid;
    }
    return [];
  }

  toggleValidationInfo(): void {
    this.showValidationInfo.update(v => !v);
  }

  private updateValidationState(): void {
    // Tab 1: store form fields + contacts
    const tab1 = this.tab1RequiredFields.every(f => this.storeForm?.get(f.field)?.valid)
      && this.contacts?.controls?.every((c: any) => c.valid) !== false;
    this.isTab1Valid.set(tab1);

    // Tab 2: legal form fields
    const tab2 = this.tab2RequiredFields.every(f => this.legalForm?.get(f.field)?.valid);
    this.isTab2Valid.set(tab2);

    // Tab 3: at least 1 branch + all branches valid
    const tab3 = this.branches?.length > 0
      && this.branches.controls.every((b: any) => b.valid);
    this.isTab3Valid.set(tab3);

    const tab = this.activeTab();
    if (tab === 0) this.canGoNext.set(tab1);
    else if (tab === 1) this.canGoNext.set(tab2);
    else this.canGoNext.set(false);

    this.canSave.set(tab3 && !this.isSaving());
  }

  // Expanded panels
  expandedBranches = signal<Set<number>>(new Set([0]));
  expandedContacts = signal<Set<number>>(new Set([0]));

  ngOnInit(): void {
    this.initForms();
    this.loadLookups();

    // Check edit mode
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode.set(true);
      this.editId.set(Number(idParam));
      this.loadTenant(Number(idParam));
    }
  }

  private loadLookups(): void {
    this.lookupsService.getLookup(LookupType.Categories).subscribe(res => this.categories.set(res));
    this.lookupsService.getLookup(LookupType.Countries).subscribe(res => this.countries.set(res));
    this.lookupsService.getLookup(LookupType.Regions).subscribe(res => this.regions.set(res));
    this.lookupsService.getLookup(LookupType.Cities).subscribe(res => this.cities.set(res));
    this.lookupsService.getLookup(LookupType.SalesAgents).subscribe(res => this.salesAgents.set(res));
    this.lookupsService.getLookup(LookupType.SupportAgents).subscribe(res => this.supportAgents.set(res));
    this.lookupsService.getLookup(LookupType.Plans).subscribe(res => this.plans.set(res));
    this.lookupsService.getLookup(LookupType.Sources).subscribe(res => this.sources.set(res));
    this.lookupsService.getLookup(LookupType.Statuses).subscribe(res => this.statuses.set(res));
    this.lookupsService.getLookup(LookupType.Zones).subscribe(res => this.zones.set(res));
  }

  private initForms(): void {
    this.storeForm = this.fb.group({
      nameEn: ['', Validators.required],
      nameAr: ['', Validators.required],
      username: ['', Validators.required],
      categoryId: [null, Validators.required],
      countryId: [null, Validators.required],
      regionId: [null],
      cityId: [null],
      headOfficeLocation: ['', Validators.required],
      headOfficeAddress: ['', Validators.required],
      lat: [''],
      lng: [''],
      hotline: [''],
      contacts: this.fb.array([]),
      sourceId: [null],
      statusId: [null],
      branches: this.fb.array([]),
    });

    this.legalForm = this.fb.group({
      salesAgentId: [null, Validators.required],
      supportAgentId: [null, Validators.required],
      planId: [null, Validators.required],
      subscriptionStartDate: [null],
      subscriptionExpireDate: [null],
    });

    // Add one default contact and branch
    this.addContact();
    this.addBranch();

    // Bridge reactive form changes → signals
    this.storeForm.valueChanges.subscribe(() => this.updateValidationState());
    this.legalForm.valueChanges.subscribe(() => this.updateValidationState());
    this.updateValidationState();
  }

  private loadTenant(id: number): void {
    this.isLoading.set(true);
    this.tenantService.getById(id).subscribe({
      next: (res: any) => {
        const data = res?.data || res;
        this.patchFormData(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  private patchFormData(data: any): void {
    // Patch store form
    this.storeForm.patchValue({
      nameEn: data.nameEn,
      nameAr: data.nameAr,
      username: data.username,
      categoryId: data.categoryId,
      countryId: data.countryId,
      regionId: data.regionId,
      cityId: data.cityId,
      headOfficeLocation: data.headOfficeLocation,
      headOfficeAddress: data.headOfficeAddress,
      lat: data.lat,
      lng: data.lng,
      hotline: data.hotline,
      sourceId: data.sourceId,
      statusId: data.statusId,
    });

    // Patch contacts
    this.contacts.clear();
    if (data.contact) {
      // Support single contact from API
      this.addContact(data.contact);
    } else if (data.contacts?.length > 0) {
      for (const c of data.contacts) {
        this.addContact(c);
      }
    } else {
      this.addContact();
    }

    // Patch legal form
    this.legalForm.patchValue({
      salesAgentId: data.salesAgentId,
      supportAgentId: data.supportAgentId,
      planId: data.planId,
      subscriptionStartDate: data.subscriptionStartDate ? new Date(data.subscriptionStartDate) : null,
      subscriptionExpireDate: data.subscriptionExpireDate ? new Date(data.subscriptionExpireDate) : null,
    });

    // Patch file IDs
    if (data.logoFileId) this.logoFileId.set(data.logoFileId);
    if (data.legalDocumentFileIds) this.legalDocumentFileIds.set(data.legalDocumentFileIds);
    if (data.contractDocumentFileIds) this.contractDocumentFileIds.set(data.contractDocumentFileIds);

    // Patch branches
    this.branches.clear();
    if (data.branches?.length > 0) {
      for (const branch of data.branches) {
        this.addBranch(branch);
      }
    } else {
      this.addBranch();
    }
  }

  // ── Contact Management ──
  addContact(data?: any): void {
    const contactGroup = this.fb.group({
      name: [data?.name || '', Validators.required],
      title: [data?.title || '', Validators.required],
      phone: [data?.phone || '', Validators.required],
      hotline: [data?.hotline || ''],
    });
    this.contacts.push(contactGroup);

    // Expand the new contact
    const newSet = new Set(this.expandedContacts());
    newSet.add(this.contacts.length - 1);
    this.expandedContacts.set(newSet);
  }

  removeContact(index: number): void {
    if (this.contacts.length > 1) {
      this.contacts.removeAt(index);
    }
  }

  // ── Branch Management ──
  addBranch(data?: any): void {
    const branchGroup = this.fb.group({
      id: [data?.id || 0],
      nameEn: [data?.nameEn || '', Validators.required],
      nameAr: [data?.nameAr || '', Validators.required],
      regionId: [data?.regionId || null, Validators.required],
      cityId: [data?.cityId || null, Validators.required],
      contactName: [data?.contact?.name || '', Validators.required],
      contactTitle: [data?.contact?.title || '', Validators.required],
      contactPhone: [data?.contact?.phone || '', Validators.required],
      address: [data?.address || '', Validators.required],
      location: [data?.location || '', Validators.required],
      lat: [data?.lat || ''],
      lng: [data?.lng || ''],
      isActive: [data?.isActive ?? true],
    });

    this.branches.push(branchGroup);

    // Expand the new branch
    const newSet = new Set(this.expandedBranches());
    newSet.add(this.branches.length - 1);
    this.expandedBranches.set(newSet);
  }

  removeBranch(index: number): void {
    if (this.branches.length > 1) {
      this.branches.removeAt(index);
      this.updateValidationState();
    }
  }

  toggleBranch(index: number): void {
    const set = new Set(this.expandedBranches());
    if (set.has(index)) {
      set.delete(index);
    } else {
      set.add(index);
    }
    this.expandedBranches.set(set);
  }

  isBranchExpanded(index: number): boolean {
    return this.expandedBranches().has(index);
  }

  toggleContact(index: number): void {
    const set = new Set(this.expandedContacts());
    if (set.has(index)) {
      set.delete(index);
    } else {
      set.add(index);
    }
    this.expandedContacts.set(set);
  }

  isContactExpanded(index: number): boolean {
    return this.expandedContacts().has(index);
  }

  // ── Tab Navigation ──
  goToTab(index: number): void {
    if (index === 0 || (index === 1 && this.isTab1Valid()) || (index === 2 && this.isTab1Valid() && this.isTab2Valid())) {
      this.activeTab.set(index);
      this.updateValidationState();
      this.showValidationInfo.set(false);
    }
  }

  nextTab(): void {
    const current = this.activeTab();
    if (current < 2 && this.canGoNext()) {
      this.activeTab.set(current + 1);
      this.updateValidationState();
      this.showValidationInfo.set(false);
    }
  }

  // ── File Upload Handlers ──
  onLogoUploaded(guids: string[]): void {
    this.logoFileId.set(guids[0] || null);
  }

  onLegalDocsUploaded(guids: string[]): void {
    this.legalDocumentFileIds.set(guids);
  }

  onContractDocsUploaded(guids: string[]): void {
    this.contractDocumentFileIds.set(guids);
  }

  // ── Save ──
  onSave(): void {
    if (!this.canSave()) return;

    this.isSaving.set(true);

    const storeData = this.storeForm.getRawValue();
    const legalData = this.legalForm.getRawValue();

    // Use first contact as the primary contact for the API payload
    const primaryContact = storeData.contacts?.[0] || {};

    const payload = {
      nameAr: storeData.nameAr,
      nameEn: storeData.nameEn,
      categoryId: storeData.categoryId,
      countryId: storeData.countryId,
      regionId: storeData.regionId,
      cityId: storeData.cityId,
      contact: {
        name: primaryContact.name || '',
        title: primaryContact.title || '',
        phone: primaryContact.phone || '',
      },
      headOfficeAddress: storeData.headOfficeAddress,
      headOfficeLocation: storeData.headOfficeLocation,
      lat: storeData.lat,
      lng: storeData.lng,
      hotline: primaryContact.hotline || storeData.hotline || '',
      salesAgentId: legalData.salesAgentId,
      supportAgentId: legalData.supportAgentId,
      sourceId: storeData.sourceId,
      planId: legalData.planId,
      subscriptionStartDate: legalData.subscriptionStartDate?.toISOString() || null,
      subscriptionExpireDate: legalData.subscriptionExpireDate?.toISOString() || null,
      logoFileId: this.logoFileId(),
      legalDocumentFileIds: this.legalDocumentFileIds(),
      contractDocumentFileIds: this.contractDocumentFileIds(),
      statusId: storeData.statusId,
      branches: storeData.branches.map((b: any) => ({
        id: b.id || 0,
        nameAr: b.nameAr,
        nameEn: b.nameEn,
        regionId: b.regionId,
        cityId: b.cityId,
        contact: {
          name: b.contactName,
          title: b.contactTitle,
          phone: b.contactPhone,
        },
        address: b.address,
        location: b.location,
        lat: b.lat,
        lng: b.lng,
        isActive: b.isActive,
      })),
    };

    const request$ = this.isEditMode()
      ? this.tenantService.update(this.editId()!, payload)
      : this.tenantService.create(payload);

    request$.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.router.navigate(['/stores']);
      },
      error: () => {
        this.isSaving.set(false);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/stores']);
  }
}
