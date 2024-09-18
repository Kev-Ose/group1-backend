import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import cors from 'cors';

import { v2 as cloudinary } from 'cloudinary';
import multer from "multer";
import {CloudinaryStorage} from 'multer-storage-cloudinary';

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// initialize express
const app = express();

// import routes
import postRoutes from './routes/post.js';
import userRoutes from './routes/user.js'

// set port
dotenv.config()
const PORT = process.env.PORT || 5000;

// Construct path
const __filename = fileURLToPath(import.meta.url);
const PATH = dirname(__filename);

app.use(cors({
    origin: 'http://localhost:5173', // Allow this specific origin
    methods: 'GET,POST,PUT,DELETE',  // Specify allowed HTTP methods
    credentials: true                // Enable sending cookies with requests
}));


// parse body and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(PATH, 'public')));

// create tables
createUsersTable();
createPostsTable();

// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blog_images', // The folder where images will be stored on Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});

// Set up multer to use Cloudinary storage
const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        const file = req.file;
        res.status(200).json({ url: file.path }); // Return Cloudinary URL
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// use routes
app.use(userRoutes);
app.use(postRoutes);

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});



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
