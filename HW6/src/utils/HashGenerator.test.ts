
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

    const zeroString = '000-00-00000-00-0';
    expect( hashGenerator.simpleISBN(zeroString)).toMatch(/^\d{3}-\d{2}-\d{5}-\d{2}-\d{1}$/);

    mockMathRandom.mockRestore(); 
  });

});