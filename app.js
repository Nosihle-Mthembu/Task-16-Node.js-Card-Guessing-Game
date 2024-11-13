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
  
// Game route (Play Again)  
app.get('/game', (req, res) => {  
  res.render('index', { title: 'Card Guessing Game' });  
});

app.get('/lost', (req, res) => {
    res.render('lost'); // Ensure the 'lost' template exists in the views folder
});


app.get('/win', (req, res) => {
    res.render('win', { title: 'Congratulations!' }); // Ensure title is defined here
});
  
app.listen(PORT, () => {  
  console.log(`Server running at http://localhost:${PORT}`);  
});

