// app.test.js
const request = require("supertest");
const app = require("./app"); // Import the app logic

let server; // Define a variable to hold the server instance

// This block runs once before all tests
beforeAll((done) => {
  // Start the server on a specific port for testing
  // 注意：如果你的電腦上 Port 3000 已經被佔用，這裡可能會報錯
  server = app.listen(3000, () => {
    console.log("Test server running on port 3000");
    done(); // Signal that the setup is complete
  });
});

// This block runs once after all tests are finished
afterAll((done) => {
  // Shut down the server and release the port
  server.close(done);
});

describe("API Endpoints", () => {
  it("should return a 200 OK status and welcome message for the root endpoint", async () => {
    // Test against the running server
    const res = await request(server).get("/");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain("Welcome to the CI/CD Workshop!");
  });

  // --- 新增的部分 (Part 1 Requirement) ---
  it("should return the current time in ISO format at /time", async () => {
    const res = await request(server).get("/time");
    
    // 驗證狀態碼為 200
    expect(res.statusCode).toEqual(200);
    
    // 驗證回傳的 JSON 是否包含 date 屬性
    expect(res.body).toHaveProperty("date");
    
    // 驗證該屬性是否為有效的 ISO Date 字串
    const date = new Date(res.body.date);
    expect(!isNaN(date.getTime())).toBe(true); // 確保是有效時間
    expect(res.body.date).toBe(date.toISOString()); // 確保格式完全符合 ISO 標準
  });
});