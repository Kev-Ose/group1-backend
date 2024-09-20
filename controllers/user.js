import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import validateEmail from '../utils/validateEmail.js';
import validatePassword from '../utils/validatePassword.js';
import matchPasswords from '../utils/matchPasswords.js';
import hashPassword from '../utils/hashPassword.js';
import query from '../config/db.js';


const userControllers = {
    register: async (req, res,next) => {

        res.header("Access-Control-Allow-Origin", "*");

        console.log(req.body);
        const {name, email, password, confirmPassword} = req.body;
    
    if (!name || !email ||  !password|| !confirmPassword)
    {
        const error = new Error(JSON.stringify("Please enter all field for user registration"));
        error.status = 400;
        return res.status(400).send(JSON.stringify("Please enter all field for user registration"));
    }

    // if (!validateEmail(email)) {
    //     return res.status(400).send('Invalid email format');
    // }

 
    // Check if the user already exists
    const existingUser = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
        return res.status(409).send(JSON.stringify('User already exists'));
    }

     // Save the user to the database
     await query('INSERT INTO users (name, email, password, confirmPassword) VALUES (?, ?, ?, ?)', [name, email, password, confirmPassword]);
     res.status(200).send(JSON.stringify('User registered successfully'));
    },

    login: async (req, res) => {

        res.header("Access-Control-Allow-Origin", "*");
        const { email, password } = req.body;

        
        
        // Validate email and password
        // if (!validateEmail(email)) {
        //     return res.status(400).send('Invalid email or password');
        // }

               
        // Check if the user exists
        const users = await query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).send(JSON.stringify('Invalid email or password'));
        }

        
        const user = users[0];

        // Check if the password matches
        const passwordMatches = await matchPasswords(password, user.password);
        if (!passwordMatches) {
            return res.status(401).send(JSON.stringify('Invalid email or password'));
        }

        // Generate a token
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.send(JSON.stringify('Logged in successfully'));

    },

    logout: (req, res) => {
        res.clearCookie('token');
        res.send('Logged out successfully');
    }
};

export default userControllers;


