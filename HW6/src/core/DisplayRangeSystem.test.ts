import { DisplayRangeSystem } from "./DisplayRangeSystem"
import { TestBookInfo } from "../__test__/TestingData"

describe("Need implement", () => {
    let displayRangeSystem: DisplayRangeSystem;

    beforeEach(() => {
        displayRangeSystem = new DisplayRangeSystem();
      });

    test("should set and get the start and end range corresctly", () => {
        displayRangeSystem.setRange(2, 8);
        expect(displayRangeSystem.getStartRange()).toBe(2);
        expect(displayRangeSystem.getEndRange()).toBe(8);
    });

    test("should slice the list within the specified range while checking string input", async() => {
        displayRangeSystem.setRange('4', '8');
        displayRangeSystem.process(TestBookInfo);
        expect(displayRangeSystem.getItems()).toEqual(TestBookInfo.slice(3,8));
    });


    test("should throw an error for a non-negative integer range", () => {
        expect(() => {displayRangeSystem.setRange(0);}).toThrow('Cannot be less than 0');
    });
    
    test("should throw an error for a float number range", () => {
        expect(() => {displayRangeSystem.setRange(2.5);}).toThrow('Invalid Float Input');
    });


    test("should throw an error for Invalid String Input", () => {
        expect(() => {displayRangeSystem.setRange('InvalidString');}).toThrow('Invalid String Input');
    });
    
    test("should throw an error if the endRange is less than startRange", () => {
        expect(() => {displayRangeSystem.setRange(8, 2);}).toThrow('End Range cannot less than Start Range');
    });

   
});


