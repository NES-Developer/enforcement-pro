import { isGenericPlaceText } from './place-text';

describe('isGenericPlaceText', () => {
  it('rejects placeholder answers', () => {
    expect(isGenericPlaceText('test')).toBeTrue();
    expect(isGenericPlaceText('Test')).toBeTrue();
    expect(isGenericPlaceText('testing')).toBeTrue();
    expect(isGenericPlaceText('test1')).toBeTrue();
    expect(isGenericPlaceText('n/a')).toBeTrue();
    expect(isGenericPlaceText('N/A')).toBeTrue();
    expect(isGenericPlaceText('asdf')).toBeTrue();
    expect(isGenericPlaceText('xxx')).toBeTrue();
    expect(isGenericPlaceText('123')).toBeTrue();
  });

  it('accepts real places and leaves blanks to the required-field check', () => {
    expect(isGenericPlaceText('')).toBeFalse();
    expect(isGenericPlaceText('High Street')).toBeFalse();
    expect(isGenericPlaceText('Tesco')).toBeFalse();
    expect(isGenericPlaceText("McDonald's")).toBeFalse();
    expect(isGenericPlaceText('Central Library')).toBeFalse();
    expect(isGenericPlaceText('Test Valley')).toBeFalse();
  });
});
