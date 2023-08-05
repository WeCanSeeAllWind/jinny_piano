const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const methodOverride = require('method-override');

// method-override 미들웨어를 사용합니다.
app.use(methodOverride('_method'));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Array to store the song list
let songs = [];

// Middleware to parse JSON and urlencoded data from requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Route to render the list page
app.get('/list', (req, res) => {
  res.render('list', { songs });
});


// Route to render the admin page with the song list
app.get('/admin', (req, res) => {
  res.render('admin', { songs });
});

// Route to handle form submission from the admin page
app.post('/admin', (req, res) => {
  const song = req.body.song.trim();
  if (song !== '') {
    // songs.unshift(song);
    songs.push(song);// 맨 앞에 추가하기 위해 unshift 사용
  }
  res.redirect('/admin');
});


// Route to handle delete song
app.delete('/admin/:index', (req, res) => {
  const { index } = req.params;
  if (index >= 0 && index < songs.length) {
    songs.splice(index, 1);
  }
  res.redirect('/admin');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


