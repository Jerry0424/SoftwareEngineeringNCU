import { DataBaseSystem } from "./DataBaseSystem";
import { BookDataBaseService} from "@externals/simple-db";
import { HashGenerator } from "../utils/HashGenerator";
import { TestBookInfo } from '../__test__/TestingData';


describe("DataBaseSystem Unit Tests", () => {
    let dataBaseSystem: DataBaseSystem;
    let mockDb: jest.Mocked<BookDataBaseService>;
    let mockHashGenerator: jest.Mocked<HashGenerator>;
  
    beforeEach(() => {
      // 創建模擬的 BookDataBaseService 和 HashGenerator
      mockDb = {
        setUp: jest.fn(),
        addBook: jest.fn(),
        deleteBook: jest.fn(),
        getBooks: jest.fn(),
      };
  
      mockHashGenerator = {
        simpleISBN: jest.fn(),
        g: jest.fn(),
      } as jest.Mocked<HashGenerator>;
  
      // 創建 DataBaseSystem 並傳入模擬的物件
      dataBaseSystem = new DataBaseSystem(mockDb, mockHashGenerator);
    });
  
    it("should connect to the database successfully", async () => {
      // 模擬成功連接資料庫
      mockDb.setUp.mockResolvedValue("Connected");
  
      const result = await dataBaseSystem.connectDB();
  
      expect(result).toBe("Connected");
    });
  
    it("should handle connection failures and retry", async () => {
      // 模擬連接資料庫失敗，嘗試 5 次
      mockDb.setUp.mockRejectedValueOnce("Connection Error");
      mockDb.setUp.mockRejectedValueOnce("Connection Error");
      mockDb.setUp.mockRejectedValueOnce("Connection Error");
      mockDb.setUp.mockRejectedValueOnce("Connection Error");
      mockDb.setUp.mockResolvedValue("Connected");
  
      const result = await dataBaseSystem.connectDB();
  
      expect(result).toBe("Connected");
      expect(mockDb.setUp).toHaveBeenCalledTimes(5);
    });
  
    it("should throw an error if unable to connect after 5 retries", async () => {
      // 模擬連接資料庫失敗，嘗試 5 次仍然失敗
      mockDb.setUp.mockRejectedValue("Connection Error");
  
      await expect(dataBaseSystem.connectDB()).rejects.toThrow("Cannnot connect to DB");
    });
  
    it("should add a book to the database", async () => {
      const title = "Sample Title";
      const author = "Sample Author";
      const mockISBN = "123-45-67890-0-1";
  
      // 模擬 HashGenerator 產生 ISBN
      mockHashGenerator.simpleISBN.mockReturnValue(mockISBN);
  
      await dataBaseSystem.addBook(title, author);
  
      // 確保模擬的方法被呼叫
      expect(mockHashGenerator.simpleISBN).toHaveBeenCalledWith("000-00-00000-00-0");
      expect(mockDb.addBook).toHaveBeenCalledWith({ ISBN: mockISBN, title, author });
    });
  
    it("should throw an error when adding a book with missing title or author", async () => {
      // 嘗試新增書籍但缺少標題或作者
      await expect(dataBaseSystem.addBook("", "Sample Author")).rejects.toThrow("Title or Author cannot be null");
      await expect(dataBaseSystem.addBook("Sample Title", "")).rejects.toThrow("Title or Author cannot be null");
    });
  
    it("should delete a book from the database", async () => {
      const bookISBN = "123-45-67890-0-1";
  
      await dataBaseSystem.deleteBook(bookISBN);
  
      expect(mockDb.deleteBook).toHaveBeenCalledWith(bookISBN);
    });
  
    it("should throw an error when deleting a book with an empty ISBN", async () => {
      // 嘗試刪除書籍但ISBN為空
      await expect(dataBaseSystem.deleteBook("")).rejects.toThrow("ISBN cannot be empty");
    });
  
    it("should update its items from the database", async () => {
  
      // 模擬從資料庫中取得書籍
      mockDb.getBooks.mockResolvedValue(TestBookInfo);
  
      await dataBaseSystem.process([]);
  
      expect(dataBaseSystem.getItems()).toEqual(TestBookInfo);
    });
  });