import express from "express";
import usersController from '../controllers/users.js'

const router = express.Router();

router.get("/:id", usersController.getMyPosts)


export default router;