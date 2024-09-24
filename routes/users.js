import express from "express";
import usersController from '../controllers/users.js'

const router = express.Router();

router.get("/myposts/:id", usersController.getMyPosts)
router.get("/user/:id", usersController.getUser)
router.put('/:id', usersController.updateProfile)

export default router;