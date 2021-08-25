const db = require('../config/connection');
const { User, Post, Tech } = require('../models');

const userData = require('./userData.json');
const postData = require('./postData.json');
const techData = require('./techData.json');


db.once('open', async () => {
  // clean database
  await User.deleteMany({});
  await Post.deleteMany({});
  await Tech.deleteMany({});

  // bulk create each model
  const users = await User.insertMany(userData);
  const posts = await Post.insertMany(postData);
  const techs = await Tech.insertMany(techData);

  for (newPost of posts) {
    const tempUser = users[Math.floor(Math.random() * users.length)];
    tempUser.posts.push(newPost._id);
    await tempUser.save();

    const tempTech = techs[Math.floor(Math.random() * techs.length)];
    newPost.tech = tempTech._id;
    await newPost.save();
    tempTech.posts.push(newPost._id);
    await tempTech.save();
  }

  console.log('all done!');
  process.exit(0);
});