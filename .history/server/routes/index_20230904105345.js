const express = require('express');
const UserModel = require('../../models/UserModel');
const router = express.Router();

// Require the index file
const speakersRoute = require('./speakers');
const feedbackRoute = require('./feedback');
const usersRoute = require('./users');

module.exports = (params) => {
  // Destructuring assignment
  const { speakers } = params;

  // Now let's define the index route and mount it on slash.
  router.get('/', async (req, res) => {
    const speakerslist = await speakers.getListShort();
    const artwork = await speakers.getAllArtwork();
    return res.render('index', { page: 'Home', speakerslist, artwork });
  });

  router.get('/registration',(req,res) => res.render('/users/registration',{success:req.query.success}));
  router.post('/registration',async(req,res,next) =>{
    try{
      const user = new UserModel({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
      });
      const savedUser = await user.save();
      if (savedUser) return res.redirect('/user/registration?success=true');
      return next (new Error ('Failed to save user'));
    } catch (err){
      return next(err);
    }
  })

  // And mount it to the path speakers.
  router.use('/speakers', speakersRoute(params));
  router.use('/feedback', feedbackRoute(params));
  router.use('/users', usersRoute(params));
  return router;
};
