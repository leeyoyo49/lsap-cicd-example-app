// app.js
const express = require('express');
const app = express();
const port = 3000;

app.get('/time', (req, res) => {
    // Returns current time in ISO format
    res.json({ date: new Date().toISOString() });
});

module.exports = app.listen(port, () => console.log(`App listening on port ${port}`));