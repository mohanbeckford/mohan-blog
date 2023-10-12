// loads required modules
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/', async (req, res) => {
  const posts = await Post.findAll();
  const postsWithTruncatedContent = posts.map(post => {
    const truncatedContent = post.content.substring(0, 25);
    return {
      ...post.get({ plain: true }),
      truncatedContent,
    };
  });
  res.render('home', { blogPosts: postsWithTruncatedContent });

  
});





// exports router
module.exports = router;
