const axios = require('axios');
const { access } = require('fs');
const fs = require('node:fs/promises');
const { buffer } = require('stream/consumers');

const authController = {};

authController.checkForCookie = async (req, res, next) => {
  try{
    if (!req.cookies.auth){
      console.log('no auth', req.cookies)
      // res.cookie()
    }
    return next()
  } catch (err) {
    return next({
      log: `Error in authController.checkForCookie Err: ${err.message}`,
      status: 500,
      message: { err: 'An error occurred' },
    });
  }
}

/**
 * Middleware for the /signup/github/callback route
 */
authController.getToken = async (req, res, next) => {
  const requestToken = req.query.code;
  const url = `https://github.com/login/oauth/access_token?client_id=6e9d37a09ab8bda68d50&client_secret=02f39942f97b1e2210db340a274f762561e6adf0&code=${requestToken}&scope=repo`;
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
  const url = 'https://api.github.com/user';
  console.log('cookies auth', req.cookies.auth)
  //console.log('cookies auth', req.cookies.auth)
  try {
    const response = await axios.get(url, {
      headers: {
        authorization: `token ${req.cookies.auth}`,
      },
    });
    res.locals.github = {};
    res.locals.github.profile = response.data;
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
    // res.locals.github.files = response.data.items;
    // const regex = new RegExp("/\.swell/", 'g' )
    // response.data.items.filter((val) => val.name.search('.swell') !== -1)
    res.locals.github.files = response.data.items.filter((val) => val.name.search('.swell') !== -1) // response.data.items
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

