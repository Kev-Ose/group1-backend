import express from 'express';
import postsControllers from '../controllers/post.js';

const router = express.Router();

router.get("/", postsControllers.getAllPosts)
router.get("/:id", postsControllers.getOnePost)
router.post("/",  postsControllers.addPost)
router.delete("/:id" ,postsControllers.deletePost)
router.put("/:id", postsControllers.updatePost)

export default router;
