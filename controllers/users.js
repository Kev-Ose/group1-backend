import query from "../config/db.js";


const usersController = {
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
}

export default usersController;