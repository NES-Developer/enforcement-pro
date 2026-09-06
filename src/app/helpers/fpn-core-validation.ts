import { EnviroPost } from '../models/enviro';

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

export const LEMO_WIZARD_STEPS: readonly FpnWizardStep[] = [
  'zone',
  'offence_group',
  'offence',
  'offender',
  'proofs',
  'incident',
  'place',
  'images',
  'signature',
  'confirm',
];

const WIZARD_LABELS: Record<FpnWizardStep, string> = {
  zone: 'Zone',
  offence_group: 'Offence group',
  offence: 'Offence',
  offender: 'Offender',
  proofs: 'Validation',
  incident: 'Offence details',
  place: 'Location',
  images: 'Evidence',
  signature: 'Signature',
  confirm: 'Confirm',
};

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
  if (isBlank(draft.offence_location)) {
    return gap('offence_location', 'Please provide Offence Location.', 5, 'place');
  }
  if (isBlank(draft.poi)) {
    return gap('poi', 'Please provide POI.', 5, 'place');
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

export function enviroStepperStep(
  enviro: EnviroPost | null | undefined,
  options: FpnValidationOptions = {}
): number {
  return findFirstMissingFpnField(enviro, options)?.stepperStep ?? 8;
}

export function lemoWizardProgress(step: FpnWizardStep | null | undefined): {
  current: number;
  total: number;
  label: string;
} {
  const total = LEMO_WIZARD_STEPS.length;
  if (!step) {
    return { current: 0, total, label: '' };
  }

  const index = LEMO_WIZARD_STEPS.indexOf(step);
  return {
    current: index >= 0 ? index + 1 : 0,
    total,
    label: WIZARD_LABELS[step] || '',
  };
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
