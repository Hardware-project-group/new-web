import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const app = express();
const port = 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from your frontend
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'your-secret-key', // Change this to a secure random key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure:true if using HTTPS
}));

// MySQL Connection
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "StockSync"
});

con.connect(function(err) {
    if (err) {
        console.error('Error connecting to database:', err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

// Routes
app.get('/', (req, res) => {
    res.json({ message: "Hello world" });
    console.log(req.session.username); // Log session username
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  // Example authentication logic
  con.query(`SELECT * FROM users WHERE username = "${username}"`, function (err, result, fields) {
    if (err) {
      console.error('Error querying database:', err.stack);
      res.status(500).json({ message: 'Database error' });
      return;
    }
    if (result.length > 0 && password === result[0].userpassword) {
        req.session.username = result[0].username;
        req.session.userId = result[0].userId;
        req.session.userType = result[0].userType;
      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err);
          res.status(500).json({ message: 'Session save error' });
          return;
        }
        console.log(req.session.username); // Log session username
          res.status(200).json({ message: 'Login successful', session: req.session });
      });
    } else {
      // Invalid credentials
      res.status(401).json({ message: 'Invalid username or password' });
    }
  });
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).json({ message: 'Logout error' });
      return;
    }
    res.status(200).json({ message: 'Logout successful' });
  });
});

app.get('/check-session', (req, res) => {
  if (req.session.username) {
    res.status(200).json({ session: req.session });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

app.get('/get-user', (req, res) => {
  con.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error querying database:', err.stack);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    // Format data into array
    const users = results.map(user => ({
      userId: user.userId,
      username: user.username,
      userType: user.userType, // Adjust based on your schema
      // Add other fields as needed
    }));
    console.log(users);
    res.status(200).json(users);
  });
});



// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
