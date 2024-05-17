const postContoller = require('../contollers/postContoller');
const requireUser = require('../middlewares/requireUser');



const router = require('express').Router();

router.get('/all',requireUser,postContoller.getAllPostController);
router.post('/',requireUser,postContoller.createPostController);
router.post('/like',requireUser,postContoller.likeAndUnlikePost);
router.put('/',requireUser,postContoller.updatePostController);
router.delete('/delete',requireUser,postContoller.deletePostcontoller);
router.post('/comment',requireUser,postContoller.createCommentController);

module.exports = router;