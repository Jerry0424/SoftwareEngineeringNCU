
import { HashGenerator } from './HashGenerator'

describe('HashGenerator', () => {
  let hashGenerator: HashGenerator;

  beforeEach(() => {
    hashGenerator = new HashGenerator();
  });

  test('should generate a random string consist of letters A~Z', () => {
    const mockMathRandom = jest.spyOn(Math, 'random');
    mockMathRandom.mockReturnValue(0.5); 

    expect(hashGenerator.g(8)).toMatch(/^[A-Z]{8}$/);

    mockMathRandom.mockRestore();
  });

  test('should throw an error if the input length is not greater than 0', () => {
    expect(() => {hashGenerator.g(0);}).toThrow("Hash number can't less than 0");
  });

  test('should generate a simple ISBN string with numbers and dashes', () => {
    const mockMathRandom = jest.spyOn(Math, 'random');
    mockMathRandom.mockReturnValue(0.5); 

    const pattern = 'edu-ncu-csie-msf';
    expect( hashGenerator.simpleISBN(pattern)).toMatch(/^\d{3}-\d{3}-\d{4}-\d{3}$/);

    mockMathRandom.mockRestore(); 
  });

});