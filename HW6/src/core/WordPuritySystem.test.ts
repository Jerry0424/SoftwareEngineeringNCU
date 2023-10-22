import { WordPuritySystem } from './WordPuritySystem';
import { WordPurityService } from '@externals/word-purity';
import { TestBookInfo } from '../__test__/TestingData';

describe('WordPuritySystem', () => {
    let mockWordPurityService: jest.Mocked<WordPurityService>;
  
// create WordPurityService mock for each testcase
    beforeEach(() => {
        mockWordPurityService = {
            words: ['Game', 'One', 'Jerry'],
            addWord: jest.fn(),
            purity: jest.fn(),
        };

// mock the purity word setting 
// gi : for global matching (g) and ignoring case-insensitive (i)
        mockWordPurityService.purity.mockImplementation((str: string) => {
                return str.replace(/Game|One|Jerry/gi, '***');
        });
    });


    test('should replace sensitive words in book titles', async () => {
// build WordPuritySystem with mock 
        const wordPuritySystem = new WordPuritySystem(mockWordPurityService);

// activate Purity 
        wordPuritySystem.setDisablePurity(false);
        expect(wordPuritySystem.isDisablePurity()).toEqual(false);

        await wordPuritySystem.process(TestBookInfo);

// check mock called time
        expect(mockWordPurityService.purity).toBeCalledTimes(TestBookInfo.length);

// check replacing result
        const result = TestBookInfo.map((item) => ({...item,title: item.title.replace(/Game|One|Jerry/gi, '***'),}));
        expect(wordPuritySystem.getItems()).toEqual(result);
    });

    test('should not replace sensitive words in book titles', async () => {
        const wordPuritySystem = new WordPuritySystem(mockWordPurityService);

// disable purity
        wordPuritySystem.setDisablePurity(true);
        expect(wordPuritySystem.isDisablePurity()).toEqual(true);

        await wordPuritySystem.process(TestBookInfo);

//mock should not be actievated
        expect(mockWordPurityService.purity).toBeCalledTimes(0);
// Since no replacement happen, the info should be the same as the origin  
        expect(wordPuritySystem.getItems()).toEqual(TestBookInfo);
    });
});
