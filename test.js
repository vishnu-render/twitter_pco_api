const axios = require('axios');

const c = 'www.youtube.com/c/LinusTechTips';

const options = {
  method: 'GET',
  url: c.split('.com/')[1],
  baseURL: 'https://www.youtube.com',
};

axios
  .request(options)
  .then(function (response) {
    const mix = response.data.indexOf('externalId');
    const twitter = response.data.indexOf('twitter:title');
    console.log(response.data.slice(mix, mix + 50).split('"')[2]);
    console.log(response.data.slice(twitter, twitter + 50).split('"')[2]);
  })
  .catch(function (error) {
    console.error(error);
  });
