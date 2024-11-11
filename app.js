const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
    res.render('index', { title: 'Card Guessing Game' });
});

// Winning route
app.get('/win', (req, res) => {
    res.render('win', { title: 'You Win!' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
