import { EnviroPost } from '../models/enviro';
import { NotebookEntry } from '../models/notebook-entry';
import {
  enviroStepperStep,
  findFirstMissingFpnField,
  findFirstMissingNotebookField,
  formatDateOfBirth,
  hasInProgressFpnDraft,
  isValidDateOfBirth,
  lemoWizardProgress,
  previousLemoWizardStep,
} from './fpn-core-validation';

function completeDraft(): EnviroPost {
  const enviro = new EnviroPost();
  enviro.site_id = 10;
  enviro.zone_id = 3;
  enviro.offence_type_id = 2;
  enviro.offence_id = 8;
  enviro.is_bwc_active = 'Yes';
  enviro.salutation = 'Mr';
  enviro.first_name = 'Alex';
  enviro.last_name = 'Jones';
  enviro.address = '1 High Street';
  enviro.town = 'Bristol';
  enviro.county = 'United Kingdom';
  enviro.post_code = 'BS1 1AA';
  enviro.date_of_birth = '1990/01/02';
  enviro.proof_of_address = '1';
  enviro.proof_of_id = '2';
  enviro.location_id = 4;
  enviro.action_id = 5;
  enviro.language = 'English';
  enviro.offence_location = 'High Street';
  enviro.poi = 'Tesco';
  enviro.land_type_id = 1;
  enviro.offence_images = ['data:image/png;base64,abc'];
  enviro.signature = 'data:image/png;base64,sig';
  return enviro;
}

describe('fpn-core-validation', () => {
  it('sends a half-finished offender, including BWC and DOB, to stepper step 2', () => {
    const enviro = completeDraft();
    enviro.is_bwc_active = '';
    enviro.date_of_birth = '';

    const gap = findFirstMissingFpnField(enviro);

    expect(gap?.wizardStep).toBe('offender');
    expect(gap?.stepperStep).toBe(2);
    expect(enviroStepperStep(enviro)).toBe(2);
  });

  it('gates submit on a missing signature', () => {
    const enviro = completeDraft();
    enviro.signature = '';

    const gap = findFirstMissingFpnField(enviro);

    expect(gap?.field).toBe('signature');
    expect(gap?.wizardStep).toBe('signature');
    expect(gap?.stepperStep).toBe(7);
    expect(gap?.message).toContain('signature');
  });

  it('returns no gap when the core FPN fields are complete', () => {
    const enviro = completeDraft();

    expect(findFirstMissingFpnField(enviro)).toBeNull();
    expect(enviroStepperStep(enviro)).toBe(8);
  });

  it('sends missing timestamps back to the location step', () => {
    const enviro = completeDraft();
    enviro.offence_datetime = '';

    const gap = findFirstMissingFpnField(enviro);

    expect(gap?.field).toBe('offence_datetime');
    expect(gap?.wizardStep).toBe('place');
    expect(gap?.stepperStep).toBe(5);
  });

  it('skips zone when the site has no zones', () => {
    const enviro = completeDraft();
    enviro.zone_id = 0;

    expect(findFirstMissingFpnField(enviro, { requireZone: false })).toBeNull();
    expect(findFirstMissingFpnField(enviro)?.wizardStep).toBe('zone');
  });

  it('accepts any non-empty postcode', () => {
    const enviro = completeDraft();
    enviro.post_code = 'XYZ';

    expect(findFirstMissingFpnField(enviro)).toBeNull();
  });

  it('rejects an impossible date of birth', () => {
    expect(isValidDateOfBirth('1990/02/31')).toBeFalse();
    expect(isValidDateOfBirth('2099/01/01')).toBeFalse();
    expect(formatDateOfBirth('1990', '1', '2')).toBe('1990/01/02');
    expect(findFirstMissingFpnField({
      ...completeDraft(),
      date_of_birth: '1990/02/31',
    })?.field).toBe('date_of_birth');
  });

  it('treats notebook as optional after issue', () => {
    const enviro = completeDraft();
    enviro.notebook_entries = new NotebookEntry();

    expect(findFirstMissingFpnField(enviro)).toBeNull();
    expect(findFirstMissingNotebookField(enviro)?.field).toBe('is_fpn_advised');
  });

  it('detects an in-progress draft and previous wizard step', () => {
    expect(hasInProgressFpnDraft(completeDraft())).toBeTrue();
    expect(hasInProgressFpnDraft(new EnviroPost())).toBeFalse();
    expect(previousLemoWizardStep('offender')).toBe('offence');
    expect(previousLemoWizardStep('zone')).toBeNull();
  });

  it('reports wizard progress for advance and confirm', () => {
    expect(lemoWizardProgress('offender')).toEqual({
      current: 4,
      total: 10,
      label: 'Offender',
    });
    expect(lemoWizardProgress('confirm')).toEqual({
      current: 10,
      total: 10,
      label: 'Confirm',
    });
  });
});
