// konfiguracja aplikacji – dostęp przez zmienne środowiskowe
require('dotenv').config();

// jako „bazy” używamy Express.js
const express = require('express');

const app = express();
const path = require('path');
const flash = require('connect-flash');

app.use(flash());
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/lib', express.static(path.normalize('./node_modules/axios/dist')));

// wszelkie dane przesyłamy w formacie JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// machnaizm sesji – z wykorzystaniem ciasteczek
const cookieParser = require('cookie-parser');

app.use(cookieParser());
const expressSession = require('express-session');

app.use(
  expressSession({
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

// do obsługi autoryzacji używamy Passport.js
const passport = require('./passport');

app.use(passport.initialize());
app.use(passport.session());

// routing aplikacji
const routes = require('./routes');

app.use(routes);
// wyłapujemy odwołania do nieobsługiwanych adresów
app.use((_, res) => {
  // Not Found
  res.sendStatus(404);
});

// Serwer HTTPS
// openssl req -x509 -nodes -days 365 -newkey rsa:1024 -out my.crt -keyout my.key
const server = require('./https')(app);

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`Serwer działa pod adresem: https://localhost:${port}`);
});
