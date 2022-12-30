const router = require("express").Router();
const req = require("express/lib/request");
const posts = require("../models/posts");
const {
    verifyToken
} = require("../validation");



router.post("/", verifyToken, (req, res) => {

    data = req.body;

    posts.create(data)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        })
});

router.get("/", (req, res) => {
    posts.find()
        .then(data => {
            res.send(data);
        })
});

router.get("/:id", async (req, res) => {
    const id = req.params.id    
    console.log(id)
    try {
        let data = await posts.findById(id);
        res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
});


router.put("/:id", verifyToken, (req, res) => {

    const id = req.params.id;

    posts.findByIdAndUpdate(id, req.body)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: "Cannot update post :( id=" + id
                })
            } else {
                res.send({
                    message: "post is updated :)"
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "error updating post with id=" + id
            });
        });

});

router.delete("/:id", verifyToken, (req, res) => {

    const id = req.params.id;

    posts.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: "Cannot delete project :( id=" + id
                })
            } else {
                res.send({
                    message: "Project is deleted :)"
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "error deleting product with id=" + id
            });
        });

});



module.exports = router;