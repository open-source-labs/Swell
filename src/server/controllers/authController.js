const axios = require('axios');
const fs = require('node:fs/promises');
const { buffer } = require('stream/consumers');

const authController = {};

authController.getToken = async (req, res, next) => {
  const requestToken = req.query.code;
  const url = `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_SECRET_ID}&code=${requestToken}&scope=repo`;
  try {
    const response = await axios.post(url, {
      headers: { Accept: 'application/json', 'Content-Type': 'text/json' },
    });
    // console.log('access token', response);
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

authController.getProfile = async (req, res, next) => {
  const url = 'https://api.github.com/user';
  console.log('cookies auth', req.cookies.auth)
  //console.log('cookies auth', req.cookies.auth)
  try {
    const profileInfo = await axios.get(url, {
      headers: {
        authorization: `token ${req.cookies.auth}`,
      },
    });
    res.locals.github = {};
    res.locals.github.profile = profileInfo.data;
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
  // get all repos with profile username
  try {
    const username = res.locals.github.profile.login;
    const q = `user:${username}`;
    const query = encodeURIComponent(q);
    const url = `https://api.github.com/search/repositories?q=${query}`;
    const response = await axios(url, {
      method: 'GET',
      headers: {
        authorization: `token ${req.cookies.auth}`,
        accept: 'application/vnd.github.v3+json',
      },
    });
    res.locals.github.repos = response.data.items;
    //console.log('repos\n', res.locals.github.repos)
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
  // get all .swell files
  try {
    const username = res.locals.github.profile.login;
    const q = `user:${username}+filename:swell`;
    let url = `https://api.github.com/search/code?q=`;
    let response = await axios(url + q, {
      method: 'GET',
      headers: {
        authorization: `token ${req.cookies.auth}`,
        accept: 'application/vnd.github.v3+json',
      } 
    });
    res.locals.github.swellUrls = response.data.items;
    //console.log('swellurls\n', res.locals.github.swellUrls)
    // response = await axios(res.locals.swellUrl, {
    //   method: 'GET',
    //   headers: {
    //     authorization: `token ${req.cookies.auth}`,
    //     accept: 'application/vnd.github.v3+json',
    //   },
    // });

    // const buff = new Buffer.from(response.data.content, 'base64');
    // res.locals.swellFile = JSON.parse(buff)
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

