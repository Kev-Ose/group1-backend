import query from '../config/db.js';


const postsControllers = {
    getAllPosts: async (req, res) => {
        try {

            let getAllPostsQuery = 'SELECT * FROM posts';
            let params = [];

            if (req.query.cat) {
                getAllPostsQuery += ' WHERE cat=?';
                params = [req.query.cat];
            }

        const allPosts = await query(getAllPostsQuery, params);
            

            if (allPosts.length > 0) {
                return res.status(200).json(allPosts );
            } else {
                return res
                    .status(404)
                    .json({ ok: false, posts: 'No posts found' });
            }
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    },
    getOnePost: async (req, res) => {
        try {
            const  id  = req.params.id;
            const getOnePostQuery = `SELECT p.id, u.username, p.title, p.content, u.img as userImg, p.cat, p.date, p.view , p.img as postImg
                FROM users AS u  
                JOIN posts AS p ON u.id = p.uid  
                WHERE p.id = ?;`
            const onePost = await query(getOnePostQuery, id);
            if (onePost.length > 0) {
                
                // const viewCount = onePost[0].view + 1 ;
    
                // const sendViewQuery = await query('UPDATE  posts SET view = ?  WHERE id = ?', [viewCount, id]) 
                return res.status(200).json(onePost);
            } else {
                return res.status(404).json({
                    ok: false,
                    post: `No post found with id: ${id}`
                });
            }
        } catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    },
    addPost: async (req, res) => {
        try {
            const {  title, content, img, cat , date, uid} = req.body;
            if (  !title || !content || !img ||!date ||!cat || !uid) {
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
    updatePost: async (req, res) => { try {
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
    deletePost: async (req, res) => {
        try {
            const token = req.cookies.access_token;
            if (!token) return res.status(401).json("Not authenticated!");

            const { id } = req.params;
            const deletePost = await query(
                'delete  FROM posts WHERE ID = ?',
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
        }catch (error) {
            return res.status(500).json({ ok: false, message: error.message });
        }
    }
};

export default postsControllers;