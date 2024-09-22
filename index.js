import express from 'express';
import cookieParser from 'cookie-parser';

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';


// import routes
import postRoutes from './routes/post.js';
import userRoutes from './routes/user.js'

import cors from 'cors';
// set port
const PORT = process.env.PORT || 5001;

// Construct path
const __filename = fileURLToPath(import.meta.url);
const PATH = dirname(__filename);

// initialize express
const app = express();

app.use(cors("*"))
// parse body and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(PATH, 'public')));

// create tables
// createUsersTable();
// createPostsTable();

// use routes
app.use(userRoutes);

app.use(express.urlencoded({ extended: true }));
// This is required to handle urlencoded data
app.use(express.json()); 

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});


app.use(postRoutes);

// error
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
});

// handle 404
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Page is not found' });
});

// listen
app.listen(PORT, () => {
    console.log(`Server is up and running on port : ${PORT}`);
});
