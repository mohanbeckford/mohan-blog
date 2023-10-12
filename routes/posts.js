// loads required module
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// View individual post
router.get('/:id', async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findByPk(postId);
  const comments = await Comment.findAll({ where: { post_id: postId } });
  const comments2 = comments.map((comments) =>
  comments.get({ plain: true })
  );
  const posts = await Post.findAll({ where: { id: postId } });
  const post3 = posts.map((posts) =>
  posts.get({ plain: true })
  );
  res.render('post', { post3, comments2, postId });
});

// Add comment
router.post('/add-comment', async (req, res) => {
  const userId = req.session.userId; 
  if (userId !== undefined) {
      const postId = req.body.postId;
      const content = req.body.content;
      const commentsurl = req.body.commentsurl;
      await Comment.create({
        post_id: postId,
        content,
        user: req.session.userName
      });
      req.session.commentsid = postId;
      req.session.save(() => {
        req.session.commentsid = postId;
      });
      res.redirect(commentsurl);
    }
    else {
      // Handle case where userId is undefined
      res.status(403).send('<center><br><br><font size="5">Please, go back and login first ! <br><br> <a href="/">Go Back</a></font></center>');
    }
});
// exports router
module.exports = router;
