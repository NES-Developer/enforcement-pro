import { isGenericPlaceText } from './place-text';
import { EnviroPost } from '../models/enviro';
import { NotebookEntry } from '../models/notebook-entry';

export type FpnWizardStep =
  | 'zone'
  | 'offence_group'
  | 'offence'
  | 'offender'
  | 'proofs'
  | 'incident'
  | 'place'
  | 'images'
  | 'signature'
  | 'confirm';

export interface FpnFieldGap {
  field: string;
  message: string;
  stepperStep: number;
  wizardStep: FpnWizardStep;
}

export interface FpnValidationOptions {
  requireZone?: boolean;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^(\+44|0)[\d\s-]{9,14}$/;

export function findFirstMissingFpnField(
  enviro: EnviroPost | null | undefined,
  options: FpnValidationOptions = {}
): FpnFieldGap | null {
  const requireZone = options.requireZone !== false;
  const draft = enviro || ({} as EnviroPost);

  if (isMissingId(draft.site_id)) {
    return gap('site_id', 'Please provide your Site. Please navigate on Home Page', 1, 'zone');
  }
  if (requireZone && isMissingId(draft.zone_id)) {
    return gap('zone_id', 'Please provide your Zone.', 1, 'zone');
  }
  if (isMissingId(draft.offence_type_id)) {
    return gap('offence_type_id', 'Please provide the Offence Group.', 1, 'offence_group');
  }
  if (isMissingId(draft.offence_id)) {
    return gap('offence_id', 'Please provide the Offence.', 1, 'offence');
  }
  if (!hasBwc(draft)) {
    return gap('is_bwc_active', 'Please provide BWC.', 2, 'offender');
  }
  if (isBlank(draft.salutation)) {
    return gap('salutation', 'Please provide offender Salutation.', 2, 'offender');
  }
  if (isBlank(draft.first_name)) {
    return gap('first_name', 'Please provide offender First Name.', 2, 'offender');
  }
  if (isBlank(draft.last_name)) {
    return gap('last_name', 'Please provide offender Last Name.', 2, 'offender');
  }
  if (isBlank(draft.address)) {
    return gap('address', 'Please provide offender Address.', 2, 'offender');
  }
  if (isBlank(draft.town)) {
    return gap('town', 'Please provide offender Town.', 2, 'offender');
  }
  if (isBlank(draft.county)) {
    return gap('county', 'Please provide offender Country.', 2, 'offender');
  }
  if (isBlank(draft.post_code)) {
    return gap('post_code', 'Please provide offender Postal Code.', 2, 'offender');
  }
  if (isBlank(draft.date_of_birth)) {
    return gap('date_of_birth', 'Please provide offender Date of Birth.', 2, 'offender');
  }
  if (!isValidDateOfBirth(draft.date_of_birth)) {
    return gap('date_of_birth', 'Please provide a valid Date of Birth.', 2, 'offender');
  }
  if (!isBlank(draft.email) && !isValidEmail(draft.email)) {
    return gap('email', 'Please provide a valid email address, or leave it blank.', 2, 'offender');
  }
  if (!isBlank(draft.phone) && !isValidPhone(draft.phone)) {
    return gap('phone', 'Please provide a valid UK mobile number, or leave it blank.', 2, 'offender');
  }
  if (isBlank(draft.proof_of_address)) {
    return gap('proof_of_address', 'Please provide Proof of Address.', 3, 'proofs');
  }
  if (isBlank(draft.proof_of_id)) {
    return gap('proof_of_id', 'Please provide Proof of ID.', 3, 'proofs');
  }
  if (isMissingId(draft.location_id)) {
    return gap('location_id', 'Please provide Location.', 4, 'incident');
  }
  if (isMissingId(draft.action_id)) {
    return gap('action_id', 'Please provide Action.', 4, 'incident');
  }
  if (isBlank(draft.language)) {
    return gap('language', 'Please provide Language.', 4, 'incident');
  }
  if (isBlank(draft.offence_location) || isGenericPlaceText(draft.offence_location)) {
    return gap('offence_location', 'Enter a real offence address. Placeholder text such as "test" is not accepted.', 5, 'place');
  }
  if (isBlank(draft.town_area) || isGenericPlaceText(draft.town_area)) {
    return gap('town_area', 'Select the town / ward. It is required.', 5, 'place');
  }
  if (isBlank(draft.poi) || isGenericPlaceText(draft.poi)) {
    return gap('poi', 'Enter a real point of interest, such as the nearest shop, library, or business.', 5, 'place');
  }
  if (isMissingId(draft.land_type_id)) {
    return gap('land_type_id', 'Please provide Land Type.', 5, 'place');
  }
  if (isBlank(draft.offence_datetime)) {
    return gap('offence_datetime', 'Please provide Offence timestamp.', 5, 'place');
  }
  if (isBlank(draft.issue_datetime)) {
    return gap('issue_datetime', 'Please provide Issue timestamp.', 5, 'place');
  }
  if (!Array.isArray(draft.offence_images) || draft.offence_images.length === 0) {
    return gap('offence_images', 'This FPN still needs offence images.', 6, 'images');
  }
  if (isBlank(draft.signature)) {
    return gap('signature', 'This FPN still needs a signature.', 7, 'signature');
  }

  return null;
}

export function findFirstMissingNotebookField(
  enviro: EnviroPost | null | undefined
): FpnFieldGap | null {
  const notebook = ensureNotebookEntries(enviro || ({} as EnviroPost));

  if (isBlank(notebook.is_fpn_advised)) {
    return gap('is_fpn_advised', 'Please provide if FPN is advised.', 8, 'confirm');
  }
  if (isBlank(notebook.is_fpn_handed)) {
    return gap('is_fpn_handed', 'Please provide if FPN is handed.', 8, 'confirm');
  }
  if (isMissingId(notebook.hair)) {
    return gap('hair', 'Please provide hair details.', 8, 'confirm');
  }
  if (isBlank(notebook.gender)) {
    return gap('gender', 'Please provide offender Gender.', 8, 'confirm');
  }
  if (isMissingId(notebook.visibility_id)) {
    return gap('visibility_id', 'Please provide Visibility.', 8, 'confirm');
  }
  if (isMissingId(notebook.weather_id)) {
    return gap('weather_id', 'Please provide Weather.', 8, 'confirm');
  }
  if (isMissingId(notebook.ethnicity_id)) {
    return gap('ethnicity_id', 'Please provide offender Ethnicity.', 8, 'confirm');
  }

  return null;
}

export function enviroStepperStep(
  enviro: EnviroPost | null | undefined,
  options: FpnValidationOptions = {}
): number {
  return findFirstMissingFpnField(enviro, options)?.stepperStep ?? 8;
}

export function ensureNotebookEntries(enviro: EnviroPost): NotebookEntry {
  if (!enviro.notebook_entries) {
    enviro.notebook_entries = new NotebookEntry();
  }
  return enviro.notebook_entries;
}

export function hasInProgressFpnDraft(enviro: EnviroPost | null | undefined): boolean {
  if (!enviro) {
    return false;
  }

  return !!(
    enviro.offence_id ||
    enviro.first_name ||
    enviro.last_name ||
    enviro.offence_location ||
    enviro.signature ||
    enviro.offence_images?.length
  );
}

export function isValidDateOfBirth(value: unknown): boolean {
  const parts = parseDateOfBirth(String(value ?? ''));
  if (!parts) {
    return false;
  }

  const year = Number(parts.year);
  const month = Number(parts.month);
  const day = Number(parts.day);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date > today) {
    return false;
  }

  const age = today.getFullYear() - year
    - (today.getMonth() + 1 < month || (today.getMonth() + 1 === month && today.getDate() < day) ? 1 : 0);
  return age >= 10 && age <= 120;
}

export function parseDateOfBirth(value: string): { year: string; month: string; day: string } | null {
  const match = String(value || '').trim().match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
  if (!match) {
    return null;
  }

  return {
    year: match[1],
    month: match[2].padStart(2, '0'),
    day: match[3].padStart(2, '0'),
  };
}

export function formatDateOfBirth(year?: string | number, month?: string | number, day?: string | number): string {
  const formatted = `${String(year || '').padStart(4, '0')}/${String(month || '').padStart(2, '0')}/${String(day || '').padStart(2, '0')}`;
  return isValidDateOfBirth(formatted) ? formatted : '';
}

export function isValidEmail(value: unknown): boolean {
  return EMAIL.test(String(value ?? '').trim());
}

export function isValidPhone(value: unknown): boolean {
  return PHONE.test(String(value ?? '').replace(/\s+/g, ' ').trim());
}

function gap(field: string, message: string, stepperStep: number, wizardStep: FpnWizardStep): FpnFieldGap {
  return { field, message, stepperStep, wizardStep };
}

function hasBwc(enviro: EnviroPost): boolean {
  const value = String(enviro.is_bwc_active || '').trim().toLowerCase();
  return value === 'yes' || value === 'no';
}

function isBlank(value: unknown): boolean {
  return String(value ?? '').trim() === '';
}

function isMissingId(value: unknown): boolean {
  return Number(value) <= 0;
}
