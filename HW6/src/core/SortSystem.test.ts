import { SortSystem } from "./SortSystem"
import { TestBookInfo } from "../__test__/TestingData"

describe("SortSystem class", () => {
    let sortSystem: SortSystem;

    beforeEach(() => {
        sortSystem = new SortSystem();
      });


    test("Check Type ASC", () => {
        sortSystem.setSortType(SortSystem.ASC);
        expect(sortSystem.getSortType()).toBe(SortSystem.ASC);
    });

    test("Check Type DESC", () => {
        sortSystem.setSortType(SortSystem.DESC);
        expect(sortSystem.getSortType()).toBe(SortSystem.DESC);
    });

    test("Check Type None", () => {
        const invalidSortType = 'INVALID_SORT_TYPE';
        expect(() => sortSystem.setSortType(invalidSortType)).toThrowError('It must be ASC or DESC');
    });


    test("should sort title in ASC order", async() => {
        sortSystem.setSortType(SortSystem.ASC);

        await sortSystem.process(TestBookInfo);

        for(let i = 0 ; i < TestBookInfo.length - 1; i++){
            const comparison = (TestBookInfo[i].title).localeCompare(TestBookInfo[i + 1].title);
            expect(comparison).toBeLessThanOrEqual(0);
        }

    });

    test("should sort title in DESC order", async() => {
        sortSystem.setSortType(SortSystem.DESC);

        await sortSystem.process(TestBookInfo);

        for(let i = 0 ; i < TestBookInfo.length - 1; i++){
            const comparison = (TestBookInfo[i].title).localeCompare(TestBookInfo[i + 1].title);
            expect(comparison).toBeGreaterThanOrEqual(0);
        }
    });

});
