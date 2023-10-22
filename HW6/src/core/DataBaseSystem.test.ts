import { DataBaseSystem } from "./DataBaseSystem";
import { BookDataBaseService} from "@externals/simple-db";
import { HashGenerator } from "../utils/HashGenerator";
import { TestBookInfo } from '../__test__/TestingData';


describe("DataBaseSystem Unit Tests", () => {
    let dataBaseSystem: DataBaseSystem;
    let mockDb: jest.Mocked<BookDataBaseService>;
    let mockHashGenerator: jest.Mocked<HashGenerator>;
  
    beforeEach(() => {
      mockDb = {
        setUp: jest.fn(),
        addBook: jest.fn(),
        deleteBook: jest.fn(),
        getBooks: jest.fn(),
      }as any;
  
      mockHashGenerator = {
        simpleISBN: jest.fn(),
        g: jest.fn(),
      } as any;
  
      
      dataBaseSystem = new DataBaseSystem(mockDb, mockHashGenerator);
    });

// connect to database
    test("should connect to the database successfully", async () => {
      mockDb.setUp.mockResolvedValue("Connected");
  
      const result = await dataBaseSystem.connectDB();
  
      expect(result).toBe("Connected");
    });
  
// unable connect to database 5 times
    test("should throw an error if unable to connect after 5 retries", async () => {
      mockDb.setUp.mockRejectedValue("Connection Error");
  
      await expect(dataBaseSystem.connectDB()).rejects.toThrow("Cannnot connect to DB");
    });
  
    test("should add a book to the database", async () => {
      const title = "Jerry's Autobiography";
      const author = "Jerry YE";
      const mockISBN = "112-52-20090-42-4";
  
// mock the ISBN
      mockHashGenerator.simpleISBN.mockReturnValue(mockISBN);
  
      await dataBaseSystem.addBook(title, author);
  

      expect(mockHashGenerator.simpleISBN).toHaveBeenCalledWith("000-00-00000-00-0");
      expect(mockDb.addBook).toHaveBeenCalledWith({ ISBN: mockISBN, title, author });
    });
  
    test("should throw an error when adding a book with missing title or author", async () => {
 
      await expect(dataBaseSystem.addBook("Jerry's Autobiography","")).rejects.toThrow("Add book failed");
      await expect(dataBaseSystem.addBook("", "Jerry YE")).rejects.toThrow("Add book failed");
      await expect(dataBaseSystem.addBook("", "")).rejects.toThrow("Add book failed");
    });
  
    test("should delete a book from the database", async () => {
      const bookISBN = "112-52-20090-42-4";
  
      await dataBaseSystem.deleteBook(bookISBN);
  
      expect(mockDb.deleteBook).toHaveBeenCalledWith(bookISBN);
    });
  
    test("should throw an error when deleting a book with an empty ISBN", async () => {
      await expect(dataBaseSystem.deleteBook("")).rejects.toThrow("Delete book failed");
    });
  
    test("should update its items from the database", async () => {
  
      mockDb.getBooks.mockResolvedValue(TestBookInfo);
  
      await dataBaseSystem.process(TestBookInfo);
  
      expect(dataBaseSystem.getItems()).toEqual(TestBookInfo);
    });
  });



describe("Constructor Test", () => {
  test("should use provided db instance and default hash generator", () => {
    const mockDb = {} as BookDataBaseService;
    const dataBaseSystem = new DataBaseSystem(mockDb);

    expect(dataBaseSystem.db).toBe(mockDb);
    expect(dataBaseSystem.hashGenerator).toBeInstanceOf(HashGenerator);
  });
});

