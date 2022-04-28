const axios = require('axios');

const authController = {};

authController.getToken = async (req, res, next) => {
  const requestToken = req.query.code;
  const url = `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_SECRET_ID}&code=${requestToken}&scope=repo`;
  try {
    const token = await axios.post(url, {
      headers: { Accept: 'application/json' },
    });
    // const token = await tokenJSON.json();
    res.locals.access_token = token.access_token;
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
  // console.log('cookies from getProfile', req.cookies)
  const url = 'https://api.github.com/user';
  try {
    const profileInfo = await axios.get(url, {
      headers: {
        authorization: `token ${res.locals.access_token}`,
      },
    });
    // const profileInfo = await profileInfoJSON.json();
    res.locals.profile = profileInfo;
    // console.log('res.locals in getProfile', res.locals.profile)
    return next();
  } catch (err) {
    return next({
      log: `Error in authController.getProfile Err: ${err.message}`,
      status: 500,
      message: { err: 'An error occurred' },
    });
  }
};

module.exports = authController;

