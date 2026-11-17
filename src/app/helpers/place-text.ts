const GENERIC_EXACT = new Set([
  'test',
  'testing',
  'tester',
  'test location',
  'test address',
  'test town',
  'test poi',
  'na',
  'n a',
  'none',
  'nil',
  'null',
  'unknown',
  'unk',
  'tbc',
  'tba',
  'todo',
  'asdf',
  'asdfgh',
  'qwerty',
  'xxx',
  'xxxx',
  'abc',
  'aaa',
  'bbb',
  'foo',
  'bar',
  'dummy',
  'fake',
  'sample',
  'placeholder',
  'here',
  'there',
  'location',
  'address',
  'offence location',
  'offense location',
  'poi',
  'point of interest',
  'town',
  'ward',
  'street',
  'road',
  'somewhere',
  'anywhere',
  'no',
  'yes',
  'ok',
  'okay',
]);

export function isGenericPlaceText(value: unknown): boolean {
  const raw = String(value ?? '').trim();
  if (!raw) {
    return false;
  }

  const normalized = raw
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()'"]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const compact = normalized.replace(/\s/g, '');

  if (compact.length < 2) {
    return true;
  }
  if (/^(.)\1+$/.test(compact)) {
    return true;
  }
  if (/^\d+$/.test(compact)) {
    return true;
  }
  if (GENERIC_EXACT.has(normalized)) {
    return true;
  }
  if (/^test(ing|er)?\d+$/.test(compact)) {
    return true;
  }

  return false;
}
