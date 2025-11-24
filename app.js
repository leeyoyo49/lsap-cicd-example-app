// app.js (完整範例)
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send("Welcome to the CI/CD Workshop!");
});

app.get('/time', (req, res) => {
    res.json({ date: new Date().toISOString() });
});

// --- 關鍵修改 ---
// 如果是直接執行 node app.js，則啟動 Server
if (require.main === module) {
    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
}

// 匯出 app (而不是已啟動的 server)，讓測試程式可以自己決定何時啟動
module.exports = app;