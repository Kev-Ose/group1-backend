import query from "../config/db.js";
import bcrypt from 'bcryptjs';

import matchPasswords from "../utils/matchPasswords.js";
import validatePassword from "../utils/validatePassword.js";
import hashPassword from '../utils/hashPassword.js';




const usersController = {
    getUser: async(req, res) =>{
        try {
            const  uid  = req.params.id;
            const getUserQuery = `SELECT *  FROM users WHERE id = ?`
                const user = await query(getUserQuery, uid);
                if (user.length > 0) {
                    return res.status(200).json(user);
                } else {
                    return res.status(404).json({
                        ok: false,
                        post: `No user found with userId: ${id}`
                    });
                }
        } catch (err) {
            return res.status(500).json({ ok: false, message: err.message });
        }
    },
    getMyPosts : async(req, res) =>{
        try {
            const  uid  = req.params.id;
            const getMyPostQuery = `SELECT *  FROM posts WHERE uid = ?`
                const myPosts = await query(getMyPostQuery, uid);
                if (myPosts.length > 0) {
                    return res.status(200).json(myPosts);
                } else {
                    return res.status(404).json({
                        ok: false,
                        post: `No post found with userId: ${id}`
                    });
                }
        } catch (err) {
            return res.status(500).json({ ok: false, message: err.message });
        }
    },
    updateProfile: async(req, res)=>{
        try {
            const  id  = req.params.id;
            const {currentPassword, newPassword, confirmNewPassword, img} = req.body;
            if(!img && !currentPassword && !newPassword && !confirmNewPassword){
                return res.status(400).json( {ok: false, message: "Please enter all fields"} );

            }
             if(img ){
                const updateImg = await query(
                    'UPDATE users SET img = ? WHERE id = ?', [img, id])
                    return res.status(200).json({ ok: true, message: `Your image has been change` });
            }
             if(currentPassword && newPassword && confirmNewPassword ){
                const [existingUser] = await query('SELECT password FROM users WHERE id = ? ', [id]);

                console.log(existingUser);

                if (!existingUser) {
                    return res.status(404).json({ ok: false, message: 'User not found' });
                }
                const isValid = bcrypt.compare(
                    currentPassword,
                    existingUser.password)
                    
                        if (! isValid) {
                            return res.status(409).json({ ok: false, message: `Your current password is incorrect` });
                        }

                        console.log(isValid);
                            const isMatch = matchPasswords(newPassword, confirmNewPassword);
                            if (newPassword !== confirmNewPassword) {
                                return res.status(409).json({ ok: false, message: 'New password and confirmation do not match' });
                            }
                            const validatedPassword = validatePassword(newPassword)
                            if (!validatedPassword) {
                                return res.status(409).json({ ok: false, message: `Password does not meet validation criteria` });
                            }
                            
                                const hashedPassword = hashPassword(newPassword)
                                await query(
                                    'UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id])
                                }

                                return res.status(200).json({ ok: true, message: `Profile updated successfully` });
        
        } catch (err) {
            return res.status(500).json({ ok: false, message: err.message });
            
        }
    },
    addFavorites: async(req, res) => {
        try {
            const  id  = req.params.id;
            const {pid, uid} = req.body
            if (  !pid|| !uid) {

                return res
                    .status(400)
                    .json({ ok: false, message: `failed to save` });
            } else {
                await query(
                    'INSERT INTO favorites  (pid, uid) VALUES (?, ?) ',
                    [pid, uid]
                );
                return res.status(200).json({ ok: true, message: `Post has been saved` });
            }
            
        } catch (err) {
            return res.status(500).json({ ok: false, message: err.message });
        }
    },
    getFavorites: async(req, res) => {
        try {
            const  id  = req.params.id;
            console.log(id);
            const getFavoritesQuery = `SELECT p.id, p.title,  p.img FROM posts p JOIN favorites f ON p.id = f.pid WHERE f.uid = ? ;`
            const favoritePosts = await query(getFavoritesQuery, id);
            console.log(favoritePosts);
            if (favoritePosts.length > 0) {
                return res.status(200).json(favoritePosts);
            } else {
                return res.status(404).json({
                    ok: false,
                    post: `You Have No Favorite Posts`
                });
            }
        } catch (err) {
            return res.status(500).json({ ok: false, message: err.message });
        }
    },
    deleteFavorite : async (req, res) => {
        try {
            const { id } = req.params;
            const deleteFavoritePost = await query(
                'delete  FROM favorites WHERE pid = ?',
                id
            );
            if (!deletePost) {
                return res
                    .status(404)
                    .json({ ok: false, message: `This post does not exist` });
            } else {
                return res.status(200).json({
                    ok: true,
                    message: `This post has  deleted successfully`
                });
            }
        } catch (err) {
            return res.status(500).json({ ok: false, message: err.message });
            
        }
    }
}

export default usersController;