import express from "express";
import usersController from '../controllers/users.js'

const router = express.Router();

router.get("/myposts/:id", usersController.getMyPosts)
router.get('/myfavorites/:id', usersController.getFavorites)
router.delete('/myfavorites/:id', usersController.deleteFavorite)
router.get("/user/:id", usersController.getUser)
router.put('/:id', usersController.updateProfile)
router.post('/myfavorites', usersController.addFavorites)

export default router;