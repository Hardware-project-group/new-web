import dotenv from 'dotenv'
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true 
}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(cookieParser());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

const con = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PW || "",
    database: process.env.DB || "StockSync"
});
// const con2 = mysql.createConnection({
//     host: "sql12.freesqldatabase.com",
//     user:"sql12718314",
//     password: "2Bbynx9UkN",
//     database:"sql12718314"
// });

con.connect(function(err) {
    if (err) {
        console.error('Error connecting to database:', err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});
// con2.connect(function(err) {
//     if (err) {
//         console.error('Error connecting to database:', err.stack);
//         return;
//     }
//     console.log('Connected to MySQL database');
// });


app.get('/', (req, res) => {
    res.json({ message: "Hello world" });
    console.log(req.session.username); 
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);

    con.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
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
                console.log(req.session.username); 
                res.status(200).json({ message: 'Login successful', session: req.session });
            });
        } else {
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

app.post('/create-user', (req, res) => {
    const { username, password, userType } = req.body;
    console.log(username, password, userType);
    console.log(req.body);

    if (!username || !password || !userType) {
        return res.status(400).json({ error: 'Please provide username, password, and userType' });
    }

    const query = 'INSERT INTO users (username, userpassword, userType) VALUES (?, ?, ?)';
    con.query(query, [username, password, userType], (err, result) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            return res.status(500).json({ error: 'Failed to create user' });
        }

        const userId = result.insertId;
        const selectQuery = 'SELECT username, userId, userType FROM users WHERE userId = ?';
        con.query(selectQuery, [userId], (err, result) => {
            if (err) {
                console.error('Error querying database:', err.stack);
                return res.status(500).json({ message: 'Database error' });
            }

            if (result.length > 0) {
                res.status(201).json(result[0]);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        });
    });
});

app.post('/imagess', (req, res) => {
    const { accessId } = req.body;
    const selectQuery = 'SELECT image FROM image WHERE accessId = ?';
        con2.query(selectQuery, [accessId], (err, result) => {
            if (err) {
                console.error('Error querying database:', err.stack);
                return res.status(500).json({ message: 'Database error' });
            }

            if (result.length > 0) {
                res.status(201).json(result[0]);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        });
})

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

        const users = results.map(user => ({
            userId: user.userId,
            username: user.username,
            userType: user.userType,
        }));
        console.log(users);
        res.status(200).json(users);
    });
});

app.get('/get-access-details', (req, res) => {
    con.query('SELECT * FROM warehouseaccessdetail LEFT JOIN users ON warehouseaccessdetail.userId = users.userId;', (err, results) => {
        if (err) {
            console.error('Error querying database:', err.stack);
            res.status(500).json({ message: 'Database error' });
            return;
        }
        const accessDetails = results.map(element => ({
            userId: element.userId,
            username: element.username,
            accessDate: element.AccessDate,
            InTime: element.InTime,
            OutTime: element.OutTime,
        }));
        console.log(accessDetails);
        res.status(200).json(accessDetails);
    });
});

app.get('/profile/:id', (req, res) => {
    const userId = req.params.id;
    console.log(userId);

    const query = 'SELECT * FROM users WHERE userId = ?';
    con.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error querying database:', err.stack);
            res.status(500).json({ message: 'Database error' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const user = {
            userId: results[0].userId,
            username: results[0].username,
            userType: results[0].userType,
            InsideFinger: results[0].insideFinger,
            OutsideFinger: results[0].outsideFinger
        };

        console.log(user);
        res.status(200).json(user);
    });
});

app.get('/image/:id', (req, res) => {
    const imageId = req.params.id;
    const query = 'SELECT file_name FROM images WHERE id = ?';

    con.query(query, [imageId], (err, results) => {
        if (err) {
            console.error('Error querying database:', err.stack);
            return res.status(500).json({ error: 'Database query error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Image not found' });
        }

        const fileName = results[0].file_name;
        const filePath = path.join(__dirname, 'uploads', fileName);
        res.sendFile(filePath);
    });
});


app.post('/SendIp', (req, res) => {
    const { Board, ip } = req.body;

    if (Board && ip) {
        const sql = 'UPDATE ip SET IpAddress = ? WHERE Board = ?';
        con.query(sql, [ip, Board], (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Error updating data: ' + error.message });
            }
            res.json({ message: 'Data updated successfully.' });
        });
    } else {
        res.status(400).json({ message: 'Missing Board or ip parameters.' });
    }
});



app.post('/get-ip', (req, res) => {
    const { id: Board } = req.body;

    if (!Board) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const sql = 'SELECT IpAddress FROM ip WHERE Board = ?';
    con.query(sql, [Board], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Database query error: ' + error.message });
        }

        if (results.length > 0) {
            return res.status(200).json({ ip_address: results[0].IpAddress });
        } else {
            return res.status(404).json({ message: 'No record found.' });
        }
    });
});


app.post('/process-tag', (req, res) => {
    const { tag } = req.body;

    if (!tag) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const tagId = tag.trim().replace(/\s+/g, ''); 
    console.log("Processed tagId:", tagId);

    const sql = 'SELECT tagId, serialNumber FROM tagdetails WHERE tagId = ?';
    con.query(sql, [tagId], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Database query error: ' + error.message });
        }
        process.env.TZ = 'Asia/Colombo';

        const currentDate = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
        const currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false }); // "HH:mm:ss"

        if (results.length > 0) {
            const fetchedTagId = results[0].tagId;
            const serialNumber = results[0].serialNumber;

            console.log("Fetched tagId:", fetchedTagId);

            const insertSql = 'INSERT INTO grabproduct (tagId, SerialNumber, grabDate, grabTime) VALUES (?, ?, ?, ?)';
            con.query(insertSql, [fetchedTagId, serialNumber, currentDate, currentTime], (insertError) => {
                if (insertError) {
                    return res.status(500).json({ message: 'Failed to insert tag into grabproduct: ' + insertError.message });
                }

                const deleteSql = 'DELETE FROM tagdetails WHERE tagId = ?';
                con.query(deleteSql, [fetchedTagId], (deleteError) => {
                    if (deleteError) {
                        return res.status(500).json({ message: 'Failed to delete tag from tagdetails: ' + deleteError.message });
                    }

                    res.status(200).json({ message: 'Tag processed successfully.' });
                });
            });
        } else {
            // Insert new tag into tagdetails table
            const insertNewTagSql = 'INSERT INTO tagdetails (tagId, serialNumber) VALUES (?, ?)';
            con.query(insertNewTagSql, [tagId, ''], (insertNewTagError) => {
                if (insertNewTagError) {
                    if (insertNewTagError.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ message: 'Duplicate entry for tagId.' });
                    }
                    return res.status(500).json({ message: 'Failed to add tag ID to tagdetails: ' + insertNewTagError.message });
                }

                res.status(201).json({ message: 'Tag ID added to tagdetails.' });
            });
        }
    });
});

//

app.post('/update-inside-finger', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'No ID provided' });
    }

    const userId = parseInt(id, 10);
    const insideFinger = true;

    const sql = 'UPDATE users SET insideFinger = ? WHERE userId = ?';
    con.query(sql, [insideFinger, userId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error: ' + error.message });
        }

        if (results.affectedRows > 0) {
            res.status(200).json({ message: `Updated insideFinger for userId ${userId}` });
        } else {
            res.status(404).json({ error: `No rows updated for userId ${userId}` });
        }
    });
});


//

app.post('/update-warehouse-access', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const intId = parseInt(id, 10);
    const currentTime = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Colombo', hour12: false });
    const sql1 = 'UPDATE warehouseaccessdetail SET OutTime = ? WHERE userId = ?';
    con.query(sql1, [currentTime, intId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Execute failed: ' + error.message });
        }

        console.log('Warehouse access detail updated successfully.');

        const sql2 = 'UPDATE grabproduct SET userId = ? WHERE userId IS NULL';
        con.query(sql2, [intId], (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Execute failed: ' + error.message });
            }

            console.log('Grab product updated successfully.');
            res.status(200).json({ message: 'Warehouse access detail and grab product updated successfully.' });
        });
    });
});

//
app.post('/update-outside-finger', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'No ID provided' });
    }

    const intId = parseInt(id, 10);
    const outsideFinger = "true"; // Adjust as needed

    const sql = 'UPDATE users SET outsideFinger = ? WHERE userId = ?';
    con.query(sql, [outsideFinger, intId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error: ' + error.message });
        }

        if (results.affectedRows > 0) {
            res.status(200).json({ message: `Updated outsideFinger for userId ${intId}` });
        } else {
            res.status(404).json({ error: `No rows updated for userId ${intId}` });
        }
    });
});

app.post('/insert-access-detail', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const userId = id;
    const date = new Date().toLocaleDateString('en-CA'); // Format: YYYY-MM-DD
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false }); // Format: HH:mm:ss

    const sql = 'INSERT INTO warehouseaccessdetail (userId, AccessDate, InTime) VALUES (?, ?, ?)';
    con.query(sql, [userId, date, time], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error: ' + error.message });
        }
        const sql2 = 'SELECT max(accessId) from warehouseaccessdetail'
        res.status(200).json({
            message: 'New access detail inserted successfully',
            accessId: results.insertId
        });
    });
});


app.post('/SendDoorState', (req, res) => {
    const { Door } = req.body;

    if (!Door) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const state = Door;

     const sql = 'UPDATE doorstate SET state = ? WHERE id = ?';
        con.query(sql, [Door, 1], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error: ' + error.message });
        }

        res.status(200).json({ message: 'Door State Updated' });
    });
});

app.get('/getPersonCount', (req, res) => {
  const query = 'SELECT COUNT(AccessId) AS personCount FROM warehouseaccessdetail WHERE OutTime IS NULL';

  con.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error retrieving person count');
    } else {
      res.json({ personCount: results[0].personCount });
    }
  });
});

app.post('/sendImage', (req, res) => {
    const { image } = req.body;

    if (!image) {
        return res.status(400).json({ error: 'No image provided' });
    }

    // Generate a unique file name with UUID
    const fileName = `image_${uuidv4()}.jpg`;
    const filePath = path.join(__dirname, 'uploads', fileName);

    // Decode Base64 image
    const imageBuffer = Buffer.from(image, 'base64');

    // Save image to the server's filesystem
    fs.writeFile(filePath, imageBuffer, (err) => {
        if (err) {
            console.error('Error saving image:', err);
            return res.status(500).json({ error: 'Failed to save image' });
        }

        // Save image info to the database
        const insertQuery = 'INSERT INTO images (file_name, timestamp) VALUES (?, ?)';
        const timestamp = new Date();

        con.query(insertQuery, [fileName, timestamp], (dbErr) => {
            if (dbErr) {
                console.error('Error saving image info to database:', dbErr);
                return res.status(500).json({ error: 'Failed to save image info to database' });
            }

            res.status(200).json({ message: 'Image saved successfully' });
        });
    });
});

app.post('/addimage', (req, res) => {
    const { image, accessId } = req.body;
    console.log(image,accessId);  
    console.log("a");

    if (!image || !accessId) {
        return res.status(400).json({ message: 'Missing image or accessId in request body' });
    }

    const sql = 'INSERT INTO image (image, accessId) VALUES (?, ?)';
    con.query(sql, [image, accessId], (err, result) => {
      if (err) {
        console.error('Error inserting image into database:', err);
        return res.status(500).json({ message: 'Database query error' });
      }
      res.status(200).json({ message: 'Image data saved successfully' });
    });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
