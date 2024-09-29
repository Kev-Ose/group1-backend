import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import validateEmail from '../utils/validateEmail.js';
import validatePassword from '../utils/validatePassword.js';
import matchPasswords from '../utils/matchPasswords.js';
import hashPassword from '../utils/hashPassword.js';
import query from '../config/db.js';


const authControllers = {
    register: async (req, res,next) => {
        try {
        const {username, email, password, confirmPassword} = req.body;
    
    if (!username || !email ||  !password|| !confirmPassword)
    {
        const error = new Error(JSON.stringify("Please enter all field for user registration"));
        error.status = 400;
        return res.status(400).send(JSON.stringify("Please enter all field for user registration"));
    }



    // Check if the user already exists
    const existingUser = await query('SELECT * FROM users WHERE email = ? OR username = ?`', [email, username]);
    if (existingUser.length > 0) {
        return res.status(409).send(JSON.stringify('User already exists'));
    }

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isMatch = matchPasswords(password, confirmPassword);
    if (isEmailValid && isPasswordValid && isMatch) {

        // Hash the password
        const hashedPassword = hashPassword(password);

        // Insert the new user into the database
        const newUser = await query(
            'INSERT INTO users (username, email, password) VALUES (? , ?, ?) ',
            [username, email, hashedPassword]
        );
        return res
            .status(201)
            .json({
                ok: true,
                message: `User with email: ${email} has registered successfully`
            });
    } else {
        return res
            .status(400)
            .json({
                ok: false,
                message: `Email or Password is not valid`
            });
    }

    
    } catch (error) {
        return res.status(500).json({ok: false,  message: error.message });
    }    
},

    login: async (req, res) => {
        try {
        // res.header("Access-Control-Allow-Origin", "*");
        const { email } = req.body;

        
        // Check if the user exists
        const userExist = await query('SELECT * FROM users WHERE email = ?', [email]);

        if (userExist.length === 0) {
            return res.status(401).json({
                ok: false,
                message: `Email Does Not Exist`
            });
        }
        else {
            // check password
            const existPassword = await query(
                `SELECT password FROM users WHERE email = ?`,
                [email]
            );
            
            
            const { password, ...other } = userExist[0];
            bcrypt.compare(
                req.body.password,
                existPassword[0].password,
                (err, isValid) => {
                    if (isValid) {
                        const token = jwt.sign(
                            { user: other.id },
                            process.env.TOKEN_ACCESS_SECRET,
                            { expiresIn: '8h' }
                        );
                        res.cookie('access_token', token , { 
                            httpOnly: true,
                            secure: false, 
                            sameSite: 'Lax',
                            path: '/',
                            expires: new Date(Date.now() + 900000)
                        }); 
                        res.status(200).json(other);
                    } else {
                        res.status(409).json({
                            ok: true,
                            message: `Email or password is not correct`
                        });
                    }
                }
            );
        }

        } catch (error) {
            return res.status(500).json({ok: false, message: error.message });
        }
    },

    logout: (req, res) => {
        try {
            res.clearCookie('access_token', 
                {
                // sameSite: "none",
                httpOnly: true,  // Ensures it's the same cookie you set during login
                secure: false,   // Set to true if you're using HTTPS
                sameSite: 'Lax', // Prevents CSRF attacks
                path: '/'
            }
        );
            res.status(200).json({
                ok: true, message: `logged out successfully`
            });
        } catch (error) {
            return res.status(500).json({ok: false,  message: error.message });
        }
    }
};

export default authControllers;


