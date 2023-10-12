// loads required modules
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Dashboard page
router.get('/', async (req, res) => {
  try {
    const userId = req.session.userId; // store user ID from the session

    // Check if userId is defined before using it in the query
    if (userId !== undefined) {
      const posts = await Post.findAll({
        where: {
          user: userId // Use the retrieved userId
        },
      });
      const posts2 = posts.map((posts) =>
      posts.get({ plain: true })
    );
    console.log(posts2);
      // Render the view with the retrieved posts
      res.render('dashboard', {posts2});
   
      
    } else {
      // Handle case where userId is undefined
      res.status(403).send('<center><br><br><font size="5">Please, go back and login first ! <br><br> <a href="/">Go Back</a></font></center>');
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Create new post
// Define the GET route for displaying the create post form
router.get('/createpost', (req, res) => {
  const userId = req.session.userId;
  if (userId !== undefined) {
    // Render the create post form view
    res.render('createpost'); // Make sure you have a corresponding view file
  }
  else {
     // Handle case where userId is undefined
     res.status(403).send('<center><br><br><font size="5">Please, go back and login first ! <br><br> <a href="/">Go Back</a></font></center>');
  }
});
// cretaes new post
router.post('/createpost', async (req, res) => {
  const userId = req.session.userId;
  const { title, content } = req.body;
  //  checks user is logged in
  if (userId !== undefined) {
    await Post.create({
      title,
      content,
      user:userId,
      username:req.session.userName
    });

    res.redirect('/dashboard');
  }
  else {
    // Handle case where userId is undefined
    res.status(403).send('<center><br><br><font size="5">Please, go back and login first ! <br><br> <a href="/">Go Back</a></font></center>');
  }
});

// Edit post
router.get('/edit-post/:id', async (req, res) => {
  const userId = req.session.userId; 
  if (userId !== undefined) {
    const postId = req.params.id;
    const posts = await Post.findAll({ where: { id: postId } });
    const posts2 = posts.map((posts) =>
        posts.get({ plain: true })
      );

    res.render('edit-post', { posts2 });
    
    router.post('/edit-post/:id', async (req, res) => {
    const postId = req.params.id;
    const { title, content } = req.body;

    const post = await Post.findByPk(postId);
    post.title = title;
    post.content = content;
    await post.save();

    res.redirect('/dashboard');
    });
  }
  else {
    // Handle case where userId is undefined
    res.status(403).send('<center><br><br><font size="5">Please, go back and login first ! <br><br> <a href="/">Go Back</a></font></center>');
  }
  });

// Delete post
router.get('/delete-post/:id', async (req, res) => {
  const userId = req.session.userId; 
  if (userId !== undefined) {
    const postId = req.params.id;
    const post = await Post.findByPk(postId);
    await post.destroy();
    
    res.redirect('/dashboard');
  }
  else {
    // Handle case where userId is undefined
    res.status(403).send('<center><br><br><font size="5">Please, go back and login first ! <br><br> <a href="/">Go Back</a></font></center>');
  }
});

// Add a comment to a post (requires authentication)
router.post('/add/:postId', async (req, res) => {
  const userId = req.session.userId;
  const postId = req.params.postId;
  const { content } = req.body;
 
  if (userId !== undefined) {
    await Comment.create({
      content,
      postId,
      userId,
    });

    res.redirect(`/posts/view/${postId}`);
  } 
  else {
    // Handle case where userId is undefined
    res.status(403).send('<center><br><br><font size="5">Please, go back and login first ! <br><br> <a href="/">Go Back</a></font></center>');
  }
});

// Delete a comment (requires authentication)
router.get('/delete/:commentId', async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.session.userId;
  if (userId !== undefined) {
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.redirect('/'); // Handle if the comment doesn't exist
    }

    await comment.destroy();
    res.redirect('/');
  } 
  else {
    // Handle case where userId is undefined
    res.status(403).send('<center><br><br><font size="5">Please, go back and login first ! <br><br> <a href="/">Go Back</a></font></center>');
  }
});

// Add comment
router.post('/post/:id', async (req, res) => {
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
      //res.redirect(`/posts/${postId}`);
      res.redirect(commentsurl);
  }
  else {
    // Handle case where userId is undefined
    res.status(403).send('<center><br><br><font size="5">Please, go back and login first ! <br><br> <a href="/">Go Back</a></font></center>');
  }
});


// View individual post
router.get('/post/:id', async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findByPk(postId);
  const comments = await Comment.findAll({ where: { post_id: postId } });
  const comments2 = comments.map((comments) =>
  comments.get({ plain: true })
  );
  const post2 = await Post.findByPk(postId);
  const posts = await Post.findAll({ where: { id: postId } });
  const post3 = posts.map((posts) =>
  posts.get({ plain: true })
  );
  res.render('comments', { post3, comments2 });
});
// exports router
module.exports = router;
