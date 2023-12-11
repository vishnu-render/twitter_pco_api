const Influencer = require('../models/Influencer');
const axios = require('axios');

exports.validateInfluencer = async (req, res) => {};

exports.addInfluencer = async (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  let twitterId = req.body.twitterId.replaceAll('twitter', '');
  twitterId = twitterId.replaceAll('@', '');
  twitterId = twitterId.replaceAll('/', '');
  twitterId = twitterId.replaceAll('.', '');
  twitterId = twitterId.replaceAll('https:', '');
  twitterId = twitterId.replaceAll('com', '');
  twitterId = twitterId.replaceAll('www', '');
  twitterId = twitterId.replaceAll('http:', '');
  let igId = req.body.igId.replaceAll('instagram', '');
  twitterId = twitterId.replaceAll('@', '');
  igId = igId.replaceAll('/', '');
  igId = igId.replaceAll('.', '');
  igId = igId.replaceAll('https:', '');
  igId = igId.replaceAll('com', '');
  igId = igId.replaceAll('www', '');
  igId = igId.replaceAll('http:', '');
  let ytChannelId = '';
  let ytChannelName = '';
  let errorMessages = [];
  let ytId = req.body.ytId;
  if (ytId) {
    try {
      if (!/^https?:\/\//i.test(ytId)) {
        ytId = 'https://' + ytId;
      }
      const response = await axios.request({
        method: 'GET',
        url: req.body.ytId.split('.com/')[1],
        baseURL: 'https://www.youtube.com',
      });
      const mix = response.data.indexOf('externalId');
      const twitter = response.data.indexOf('twitter:title');
      ytChannelId = response.data.slice(mix, mix + 50).split('"')[2];
      ytChannelName = response.data.slice(twitter, twitter + 50).split('"')[2];
      if (!ytChannelId || !ytChannelName) {
        errorMessages.push('yt');
      }
    } catch (e) {
      errorMessages.push('yt');
    }
  }

  if (igId) {
    try {
      const resp = await axios.get(`https://www.instagram.com/${igId}/?__a=1`, {
        headers: {
          Cookie: 'sessionid=53522211638%3AmEy1prLbdJa6cX%3A13',
        },
      });
      const response = resp.data;
      const data = response['graphql']['user']['username'];
      if (igId !== data) {
        errorMessages.push('ig');
      }
    } catch (e) {
      errorMessages.push('ig');
    }
  }

  if (twitterId) {
    try {
      const resp = await axios.get(
        `https://api.twitter.com/2/users/by?usernames=${twitterId}`,
        {
          headers: {
            Authorization:
              'Bearer AAAAAAAAAAAAAAAAAAAAACOAbgEAAAAAbar10KGJjZrma3MX49gnPxLn0y8%3DavhxgA4N6KHwkHYxpXlAo6EgvMMdKFywRIWaQPccbEzqDCOWbE',
          },
        }
      );
      const response = resp.data.data[0];
      if (twitterId.toLowerCase() !== response.username.toLowerCase()) {
        console.log('Twitter error: ' + console.log(JSON.stringify(resp.data)));
        errorMessages.push('twitter');
      }
    } catch (e) {
      console.log(e);
      errorMessages.push('twitter');
    }
  }

  if (errorMessages.length > 0) {
    return res.status(200).json({
      error: true,
      message: errorMessages,
    });
  }
  const inf = new Influencer({
    name: req.body.name,
    twitterId,
    telegramIds: req.body.telegramIds,
    fbId: req.body.fbId,
    ttId: req.body.ttId,
    igId,
    ytId,
    ytChannelName,
    ytChannelId,
  });
  inf.save((error) => {
    if (error) {
      return res.status(500).json({
        error: true,
        message: error.message,
      });
    }
    res.status(200).json({
      error: false,
      message: 'DB save operation success',
    });
  });
};

exports.edit = async (req, res) => {
  let twitterId = req.body.twitterId.replaceAll('twitter', '');
  twitterId = twitterId.replaceAll('@', '');
  twitterId = twitterId.replaceAll('/', '');
  twitterId = twitterId.replaceAll('.', '');
  twitterId = twitterId.replaceAll('https:', '');
  twitterId = twitterId.replaceAll('com', '');
  twitterId = twitterId.replaceAll('www', '');
  twitterId = twitterId.replaceAll('http:', '');
  let igId = req.body.igId.replaceAll('instagram', '');
  twitterId = twitterId.replaceAll('@', '');
  igId = igId.replaceAll('/', '');
  igId = igId.replaceAll('.', '');
  igId = igId.replaceAll('https:', '');
  igId = igId.replaceAll('com', '');
  igId = igId.replaceAll('www', '');
  igId = igId.replaceAll('http:', '');
  let ytChannelId = '';
  let ytChannelName = '';
  let errorMessages = [];
  let ytId = req.body.ytId;
  if (ytId) {
    try {
      if (!/^https?:\/\//i.test(ytId)) {
        ytId = 'https://' + ytId;
      }
      const response = await axios.request({
        method: 'GET',
        url: req.body.ytId.split('.com/')[1],
        baseURL: 'https://www.youtube.com',
      });
      const mix = response.data.indexOf('externalId');
      const twitter = response.data.indexOf('twitter:title');
      ytChannelId = response.data.slice(mix, mix + 50).split('"')[2];
      ytChannelName = response.data.slice(twitter, twitter + 50).split('"')[2];
      if (!ytChannelId || !ytChannelName) {
        errorMessages.push('yt');
      }
    } catch (e) {
      errorMessages.push('yt');
    }
  }

  if (igId) {
    try {
      const resp = await axios.get(`https://www.instagram.com/${igId}/?__a=1`, {
        headers: {
          Cookie: 'sessionid=53522211638%3AmEy1prLbdJa6cX%3A13',
        },
      });
      const response = resp.data;
      const data = response['graphql']['user']['username'];
      if (igId !== data) {
        errorMessages.push('ig');
      }
    } catch (e) {
      errorMessages.push('ig');
    }
  }

  if (twitterId) {
    try {
      const resp = await axios.get(
        `https://api.twitter.com/2/users/by?usernames=${twitterId}`,
        {
          headers: {
            Authorization:
              'Bearer AAAAAAAAAAAAAAAAAAAAACOAbgEAAAAAbar10KGJjZrma3MX49gnPxLn0y8%3DavhxgA4N6KHwkHYxpXlAo6EgvMMdKFywRIWaQPccbEzqDCOWbE',
          },
        }
      );
      const response = resp.data.data;
      if (twitterId !== response.username) {
        errorMessages.push('twitter');
      }
    } catch (e) {
      errorMessages.push('twitter');
    }
  }

  if (errorMessages.length > 0) {
    return res.status(200).json({
      error: true,
      message: errorMessages,
    });
  }
  Influencer.updateOne(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        twitterId: twitterId,
        telegramIds: req.body.telegramIds,
        fbId: req.body.fbId,
        ttId: req.body.ttId,
        igId,
        ytId,
        ytChannelName,
        ytChannelId,
      },
    }
  )
    .then(() => {
      res.status(200).json({
        error: false,
        message: 'DB edit operation success',
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: true,
        message: error.message,
      });
    });
};

exports.delete = (req, res) => {
  Influencer.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        error: false,
        message: 'DB delete operation success',
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: true,
        message: error.message,
      });
    });
};

exports.getById = (req, res) => {
  Influencer.findOne({ _id: req.params.id })
    .then((data) => {
      res.status(200).json({
        error: false,
        message: 'DB get operation success',
        payload: data,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: true,
        message: error.message,
      });
    });
};

exports.getAll = (req, res) => {
  Influencer.find()
    .then((data) => {
      res.status(200).json({
        error: false,
        message: 'DB get operation success',
        payload: data,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: true,
        message: error.message,
      });
    });
};
