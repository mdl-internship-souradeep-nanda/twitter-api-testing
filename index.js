const Twit = require('twit');

const twitterSecret = require('./config.json');

const T = new Twit(twitterSecret);

const TWITTER_GLOBAL_AVERAGE_FOLLOWER_COUNT = 60;

// const getAllFollowersOfFollowers = (screenName, cb) => {
//   let totalScore = 0;
//   T.get('followers/list', { screen_name: screenName }, function getData(err, data) {
//     setTimeout(() => {
//       console.log('TICK');
//       if (data.error === undefined) {
//         totalScore += data.users
//           .map(user => user.followers_count)
//           .reduce((acc, score) => acc + score, 0);
//       }
//       if (data.next_cursor > 0) {
//         T.get(
//           'followers/ids',
//           {
//             screen_name: screenName,
//             next_cursor: data.next_cursor,
//           }, getData,
//         );
//       } else cb(totalScore);
//     }, 60 * 1000); // 15 calls every 15 mins = 1 call / min
//   });
// };

/**
 * Takes a twitter screen_name and returns the number of followers of
 * followers. Makes an estimate if number of followers is greater than 5000.
 * @param {string} screenName Screen name of the twitter user
 * @param {function} callback Callback function
 * @returns {number} returns the number of followers
 * @throws {error} relays the twitter error
 */
const getTwitterScore = (screenName, callback) => {
  // Queries twitter for basic user info
  T.get('users/show', { screen_name: screenName }, (err1, data) => {
    if (err1) throw err1;

    // If the number of followers is greater than 5000 then a single
    // twitter request would not be sufficient to count the number of followers
    // Multiple twitter requests might cause the rate to exceed so make an
    // approximation.
    if (data.followers_count > 5000) {
      callback(data.followers_count * TWITTER_GLOBAL_AVERAGE_FOLLOWER_COUNT);
    } else {
      T.get('followers/list', { screen_name: screenName }, (err2, followersData) => {
        if (err2) throw err2;
        const totalScore = followersData.users
          .map(user => user.followers_count)
          .reduce((acc, score) => acc + score, 0);
        callback(totalScore);
      });
    }
  });
};

const screenName = 'fchollet'; // 'SouradeepNanda';
getTwitterScore(screenName, console.log);
