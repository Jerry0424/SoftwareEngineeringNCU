import { FilterSystem } from "./FilterSystem"
import { TestBookInfo } from "../__test__/TestingData"

describe("FilterSystem class", () => {
    let filterSystem: FilterSystem;

    beforeEach(() => {
        filterSystem = new FilterSystem();
      });


    test("should set and get the correct filter word", () => {
        const filterWord = 'filterWord';
        filterSystem.setFilterWord(filterWord);
        expect(filterSystem.getFilterWord()).toBe(filterWord);
    });

    test("should set and check the IgnoreCase", () => {
       filterSystem.setIgnoreCase(true);
       expect(filterSystem.isIgnoreCase()).toBe(true);
       filterSystem.setIgnoreCase(false);
       expect(filterSystem.isIgnoreCase()).toBe(false);
    });

    test("should filter list based on filterWord while IgnoreCase is true", async() => {
       filterSystem.setFilterWord('the lord of The rings');
       filterSystem.setIgnoreCase(true);
       await filterSystem.process(TestBookInfo);

       expect(filterSystem.getItems().length).toEqual(1);
     });

     test("should filter list based on filterWord while IgnoreCase is false", async() => {
        filterSystem.setFilterWord('the lord of The rings');
        filterSystem.setIgnoreCase(false);
        await filterSystem.process(TestBookInfo);
 
        expect(filterSystem.getItems().length).toEqual(0);
      });

});
