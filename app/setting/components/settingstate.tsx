export interface ProfileFormState {
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  bio: string;
  avatarFile: File | null;
  avatarPreview: string;
}

export interface ProfileFormErrors {
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface OrganizationFormState {
  companyName: string;
  industry: string;
  email: string;
  phoneNumber: string;
  websiteUrl: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateProvince: string;
  zipPostalCode: string;
  logoFile: File | null;
  logoPreview: string;
}

export interface OrganizationFormErrors {
  companyName?: string;
  industry?: string;
  email?: string;
  phoneNumber?: string;
  logo?: string;
}