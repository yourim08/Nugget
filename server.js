const path = require('path');
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// MySQL 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // MySQL 사용자 이름
  password: 'qwer1357!',  // MySQL 비밀번호
  database: 'user_db'  // 사용하고자 하는 데이터베이스 이름
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected...');
});

// Express 설정
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public')); // 'public' 폴더에 HTML 파일을 위치시킬 예정

// main.html을 라우팅하는 코드 (app 초기화 이후에 추가)
app.get('/main', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
  });

// 회원가입 페이지 제공
app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/public/signup.html');
});

// 로그인 페이지 제공
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

// 회원가입 처리
app.post('/signup', (req, res) => {
  const { username, password, email } = req.body;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).send('서버 오류');
    }
    const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    db.query(query, [username, hashedPassword, email], (err, result) => {
      if (err) {
        return res.status(400).send(); // 오류 발생 시 400 상태 코드
      }
      res.status(200).send(); // 회원가입 성공 시 아무 메시지 없이 200 상태 코드
    });
  });
});

// 로그인 처리
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
      if (err) return res.status(500).send('서버 오류');
      if (results.length === 0) {
        return res.status(400).send('사용자를 찾을 수 없습니다');
      }
      const user = results[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return res.status(500).send('비밀번호 비교 오류');
        if (isMatch) {
          // 로그인 성공 시 JSON 형식으로 응답
          res.json({ success: true, message: '로그인 성공' });
        } else {
          res.status(400).send('비밀번호가 일치하지 않습니다');
        }
      });
    });
  });

app.listen(port, () => {
  
});