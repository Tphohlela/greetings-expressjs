let express = require('express');
let app = express();
let exphbs = require('express-handlebars');
let bodyParser = require('body-parser');
let greetings = require("./greetings");
const flash = require('express-flash');
const session = require('express-session');
const pg = require("pg");
const routes = require("./routes/greetingRoutes");

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/greetings';

const { Pool } = require('pg');

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

let greeting = greetings(pool);
const route = routes(greeting);

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// initialise session middleware - flash-express depends on it
app.use(session({
  secret: "this is my long string that is used for sessions in http",
  resave: false,
  saveUninitialized: true
}));

// initialise the flash middleware
app.use(flash());

app.use(express.static('public'));

//Home route
app.get("/", route.index);

//Getting name and language route
app.post("/greetings", route.greet);

//reset route
app.post("/reset", route.reset);

//displaying the links of the names
app.get("/greeted", route.listOfNames);

//displaying how many times user has been greeted
app.get("/greeted/:user", route.numberUserHasBeenGreeted);

let PORT = process.env.PORT || 3010;

app.listen(PORT, function () {
  console.log('App starting on port', PORT);
});
