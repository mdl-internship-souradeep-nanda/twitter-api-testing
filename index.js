const Twit = require('twit');

const twitterSecret = require('./config.json');

const T = new Twit(twitterSecret);

const TWITTER_GLOBAL_AVERAGE_FOLLOWER_COUNT = 1; // 60

T.get('followers/list', { screen_name: 'SouradeepNanda' }, (err, data) => {
  console.log(data.users
    .map(user => user.followers_count / TWITTER_GLOBAL_AVERAGE_FOLLOWER_COUNT)
    .reduce((acc, score) => acc + score, 0));
});
