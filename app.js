const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const methodOverride = require('method-override');

const today = new Date();
const year = today.getFullYear(); // 년도
const month = today.getMonth() + 1;  // 월
const date = today.getDate();  // 날짜

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

    // 지니의 소중한 DB를 남기기
    fs.appendFileSync('./log/jinny_db', `${year}.${month}.${date} ` + song + "\r\n");
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

app.post('/admin/updateOrder', (req, res) => {
  // const songIds = req.body.songIds;
  // const newSongList = [];
  // for (const id of songIds) {
  //   if (songList[id]) {
  //     newSongList.push(songList[id]);
  //   }
  // }
  // songList = newSongList;
  res.json({ success: true });
});

// 위와 아래 버튼 처리를 위한 라우트
app.post('/admin/:index/up', (req, res) => {
  const index = parseInt(req.params.index);
  if (index > 0) {
    const temp = songs[index];
    songs[index] = songs[index - 1];
    songs[index - 1] = temp;
  }
  res.redirect('/admin');
});

app.post('/admin/:index/down', (req, res) => {
  const index = parseInt(req.params.index);
  if (index < songs.length - 1) {
    const temp = songs[index];
    songs[index] = songs[index + 1];
    songs[index + 1] = temp;
  }
  res.redirect('/admin');
});


// Route to render the admin page with the song list
app.get('/main', (req, res) => {
  res.render('main');
});

app.get('/soozin', (req, res) => {
  res.render('soozin');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


