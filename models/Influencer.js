const mongoose = require('mongoose');

const infSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name is required',
  },
  twitterId: {
    type: String,
    trim: true,
  },
  telegramIds: [
    {
      type: String,
      trim: true,
    },
  ],
  fbId: {
    type: String,
    trim: true,
  },
  ttId: {
    type: String,
    trim: true,
  },
  igId: {
    type: String,
    trim: true,
  },
  ytId: {
    type: String,
    trim: true,
  },
  ytChannelName: {
    type: String,
    trim: true,
  },
  ytChannelId: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model('Influencer', infSchema);
