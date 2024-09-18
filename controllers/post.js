import query from '../config/db.js';


const postsControllers = {
    getAllPosts: async (req, res) => {
        
    },
    getOnePost: async (req, res) => {
        
    },
    addPost: async (req, res) => {
        try {
            const { username, title, content, img, cat , date, uid} = req.body;
            if (!username || !title || !content || !img ||!date ||!cat || !uid) {
                return res
                    .status(400)
                    .json({ ok: false, message: `please fill all the field` });
            } else {
                const addPost = await query(
                    'INSERT INTO posts  (title, content, img, date, cat, uid) VALUES (?, ?, ?, ?, ?, ?) ',
                    [title, content, img, date, cat, uid]
                );
                return res.status(200).json({ ok: true, post: req.body });
            }
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    },
    updatePost: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, content, img, cat} = req.body;
            if (!title || !content ||!img || !cat ) {
                return res
                    .status(404)
                    .json({  message: `please fill all the field` });
            } else {
                const updatePost = await query(
                    'UPDATE posts SET title = ?, content = ?, img = ?, cat = ?  WHERE id = ?',
                    [title, content, img, cat, id] );
                return res.status(200).json({  post: req.body });
            }
        } catch (error) {
            return res.status(500).json({  message: error.message });
        }
    },
    deletePost: async (req, res) => {}
};

export default postsControllers;