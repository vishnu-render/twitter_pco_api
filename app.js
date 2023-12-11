const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const TikTok = require('tiktok-search');
const app = express();
app.use(express.json({ limit: 1e6 }));
const { Api, TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const infCtrl = require('./controllers/influencer');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, Content-Type, X-Auth-Token'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PATCH');
  next();
});

const apiId = 14878688;
const mongoUrl =
  'mongodb+srv://app:7U32UhLEwpdyOlsD@dataextraction.b64ff.mongodb.net/data?retryWrites=true&w=majority';
const apiHash = '7e9e17c602314d95ec633b04e9ac58c0';
const session = new StringSession(
  `1BQANOTEuMTA4LjU2LjEyOAG7HJeh39/Ix8/a2ekckIBJTv/2JAUhi1u6GUPwcEpq7A0a57lcvANfjOFLUFjdsmso4rWu7E+zrIVbtZ9DWWrSJ55XTFtdmFitkaewYKZXiSU+ke5Tr4QmEUgTw5byVtZ2VtmHsCix+fiCSg6wz3VNtzd7DFGGuNgrvteGxCo2Uiy1x1YyfC/7MVVVrZ0JF4LiULpQtHBC+1iwu+gkPDmR1D8Mh7p83ZOesNugN5oFRJNhfQbwHCMNffTjzayXcIqa+tluNIwBuyeghw1Gcq5GX0yf0ZQQDCArP1xUXrC4eEQ8CU4zutYAQos0CMXTOMZNJOcbqIsRxwi7dlYHhvqy4Q==`
);
const client = new TelegramClient(session, apiId, apiHash, {});
mongoose
  .connect(mongoUrl, { useNewUrlParser: true })
  .then(() => console.log('Connected to database'))
  .catch((error) => console.error(error));

app.get('/api/inf', infCtrl.getAll);
app.post('/api/inf', infCtrl.addInfluencer);
app.patch('/api/inf/:id', infCtrl.edit);
app.delete('/api/inf/:id', infCtrl.delete);
app.get('/api/inf/:id', infCtrl.getById);

app.get('/api/telegram', async (req, res) => {
  try {
    const channels = req.query.channels;
    const channelArray = channels.replaceAll('https://t.me/', '').split(',');
    const keyword = req.query.keyword;
    await client.connect();
    const promises = channelArray.map((channel) => {
      return client.invoke(
        new Api.messages.Search({
          peer: channel,
          q: keyword,
          filter: new Api.InputMessagesFilterEmpty({}),
          limit: 100,
        })
      );
    });
    const result = await Promise.all(promises);
    const merged = result.reduce((acc, i, index) => {
      const temp = i.messages.map((item) => {
        const temp2 = { ...item };
        temp2.userName = channelArray[index];
        return temp2;
      });
      acc = [...acc, ...temp];
      return acc;
    }, []);
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.json(merged);
    await client.disconnect();
  } catch (e) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.json(e);
  }
});

app.get('/api/yt', (req, res) => {
  const channelId = req.query.channelId.replaceAll(
    'https://www.youtube.com/channel/',
    ''
  );
  const keyword = req.query.keyword;
  axios
    .get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50&key=AIzaSyCA3rw4r3S1jN8VbDIg6EIglxgfeXOHJVM&channelId=${channelId}&q=${keyword}`
    )
    .then((response) => {
      res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With');
      const data = response.data.items.filter((i) =>
        i.snippet.title.toLowerCase().includes(keyword.toLowerCase())
      );
      res.json(data);
    })
    .catch((er) => {
      console.log(er);
    });
});

app.get('/api/tiktok', (req, res) => {
  TikTok.getInfo(
    'https://www.tiktok.com/@scout2015/video/6718335390845095173'
  ).then((data) => {
    res.json(data);
  });
});

app.get('/api/instagram', (req, res) => {
  const username = req.query.username;
  const keyword = req.query.keyword;
  axios
    .get(`https://www.instagram.com/${username}/?__a=1`, {
      headers: {
        Cookie: 'sessionid=53522211638%3AmEy1prLbdJa6cX%3A13',
      },
    })
    .then((resp) => {
      const response = resp.data;
      const data =
        response['graphql']['user']['edge_owner_to_timeline_media']['edges'];
      const arr = data.map((i) => {
        const temp = i.node;
        const caption =
          temp['edge_media_to_caption']['edges'][0]['node']['text'];
        const commentCount = temp['edge_media_to_comment'].count;
        const likeCount = temp['edge_liked_by'].count;
        const url = `https://www.instagram.com/p/${temp.shortcode}/`;
        return { caption, commentCount, likeCount, url, username };
      });
      const filtered = arr.filter((i) => i.caption.includes(keyword));
      res.json(filtered);
    })
    .catch((err) => console.log(err));
});

app.get('/api/twitter', (req, res) => {
  const username = req.query.username;
  const hashtag = req.query.hashtag;
  let searchQuery = hashtag;
  if (typeof username === 'string') {
    const mod = username.split(',').map((name) => `from:${name} -is:reply`);
    searchQuery += ` (${mod.join(' OR ')})`;
  }

  axios
    .get(
      `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(
        searchQuery
      )}&expansions=author_id,entities.mentions.username&max_results=100&tweet.fields=created_at,referenced_tweets,public_metrics&user.fields=username`,
      {
        headers: {
          Authorization:
            'Bearer AAAAAAAAAAAAAAAAAAAAACOAbgEAAAAAbar10KGJjZrma3MX49gnPxLn0y8%3DavhxgA4N6KHwkHYxpXlAo6EgvMMdKFywRIWaQPccbEzqDCOWbE',
        },
      }
    )
    .then((response) => {
      if (response.data.includes && response.data.data) {
        const filteredUsers = response.data.includes.users.filter((u) =>
          username.includes(u.username)
        );
        const result = response.data.data.map((t) => {
          const matchedUser = filteredUsers.find(
            (u) => u.id === t['author_id']
          );
          const temp = { ...t };
          temp.author_username = matchedUser.username;
          return temp;
        });
        res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');
        res.json(result);
      } else {
        res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');
        res.json([]);
      }
    })
    .catch((er) => {
      console.log(er);
    });
});

app.listen(3000);
