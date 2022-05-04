const axios = require('axios');
const { access } = require('fs');
const { buffer } = require('stream/consumers');

const authController = {};

/**
 * Middleware for the /signup/github/callback route
 */
authController.getToken = async (req, res, next) => {
  const requestToken = req.query.code;
  const url = `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_SECRET_ID}&code=${requestToken}&scope=repo`;
  try {
    const response = await axios.post(url, {
      headers: { Accept: 'application/json', 'Content-Type': 'text/json' },
    });
    // TODO: make this less hacky :)
    const token = response.data.split('=')[1].split('&')[0];
    res.locals.access_token = token;
    return next();
  } catch (err) {
    return next({
      log: `Error in authController.getToken Err: ${err.message}`,
      status: 500,
      message: { err: 'An error occurred' },
    });
  }
};

authController.getUserInfo = async (req, res, next) => {
  const { access_token } = res.locals;
  const url = 'https://api.github.com/user';
  try {
    const response = await axios.get(url, {
      headers: {
        authorization: `token ${access_token}`,
      },
    });
    res.locals.userInfo = response.data;
    return next();
  } catch (err) {
    return next({
      log: `Error in authController.getProfile Err: ${err.message}`,
      status: 500,
      message: { err: 'An error occurred' },
    });
  }
}

/**
 * Middleware for the /api/import route
 */
authController.getProfile = async (req, res, next) => {
  // console.log('cookies from getProfile', req.cookies)
  const url = 'https://api.github.com/user';
  console.log('cookies', req.cookies)
  console.log('cookies auth', req.cookies.auth)
  try {
    const response = await axios.get(url, {
      headers: {
        // authorization: `token ${res.locals.access_token}`,
        authorization: `token ${req.cookies.auth}`,
      },
    });
    // const profileInfo = await profileInfoJSON.json();
    res.locals.profile = response.data;
    // console.log('res.locals in getProfile', res.locals.profile);
    return next();
  } catch (err) {
    return next({
      log: `Error in authController.getProfile Err: ${err.message}`,
      status: 500,
      message: { err: 'An error occurred' },
    });
  }
};

authController.getRepos = async (req, res, next) => {
  try {
    //console.log('is auth available?', req.cookies.auth_token);
    const username = res.locals.profile.login;
    //console.log('res.locals in getLanguages', res.locals);
    // adding page=n to query will give page n as a result
    // mirror:false, per_page=100
    const q = `user:${username}`;
    const query = encodeURIComponent(q);
    const url = `https://api.github.com/search/repositories?q=${query}`;
    // console.log('url', url);
    const response = await axios(url, {
      method: 'GET',
      headers: {
        // authorization: `token ${res.locals.access_token}`,
        authorization: `token ${req.cookies.auth}`,
        accept: 'application/vnd.github.v3+json',
      },
    });
    //console.log('getLang response', response);
    //console.log('getRepos after await .json()', response);
    //console.log(response.data.items);
    res.locals.repos = response.data.items;

    return next();
  } catch (err) {
    return next({
      log: `Error in authController.getRepos Err: ${err.message}`,
      status: 500,
      message: { err: 'An error occurred' },
    });
  }
};

authController.getSwellFile = async (req, res, next) => {
  try {
    const username = res.locals.profile.login;
    //console.log('res.locals in getLanguages', res.locals);
    // adding page=n to query will give page n as a result
    // mirror:false, per_page=100
    // const q = `repository_id=${res.locals.repos[0].id}`;
    const q = `filename:.swell+repo:swell-guy/unit-9-express`;
    const query = encodeURIComponent(q);
    // const q = `.swell+in:path+repo:swell-guy/unit-9-express`;
    let url = `https://api.github.com/search/code?q=${query}`;
    //console.log('url', url);
    let response = await axios(url, {
      method: 'GET',
      headers: {
        // authorization: `token ${res.locals.access_token}`,
        authorization: `token ${req.cookies.auth}`,
        accept: 'application/vnd.github.v3+json',
      },
    });
    //console.log('getLang response', response);
    //console.log('getRepos after await .json()', response);
    //console.log(response.data.items);
    res.locals.swellUrl = response.data.items[0].url;
    // now get .swell file contents
    response = await axios(res.locals.swellUrl, {
      method: 'GET',
      headers: {
        // authorization: `token ${res.locals.access_token}`,
        authorization: `token ${req.cookies.auth}`,
        accept: 'application/vnd.github.v3+json',
      },
    });

    const buff = new Buffer.from(response.data.content, 'base64');
    res.locals.swellFile = JSON.parse(buff)
    return next();
  } catch (err) {
    return next({
      log: `Error in authController.getSwellFile Err: ${err.message}`,
      status: 500,
      message: { err: 'An error occurred' },
    });
  }
};



module.exports = authController;

