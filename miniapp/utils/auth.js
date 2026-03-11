const { post } = require('./request');

function checkLogin() {
  const token = wx.getStorageSync('token');
  if (!token) {
    wx.reLaunch({ url: '/pages/login/login' });
    return false;
  }
  return true;
}

function getUserInfo() {
  return wx.getStorageSync('userInfo') || null;
}

function isAdmin() {
  const user = getUserInfo();
  return user?.role === 'ADMIN';
}

async function wxLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => resolve(res.code),
      fail: reject,
    });
  });
}

async function login(code, nickname, avatarUrl) {
  const data = await post('/auth/login', { code, nickname, avatarUrl });
  wx.setStorageSync('token', data.token);
  wx.setStorageSync('userInfo', data.user);
  return data;
}

module.exports = { checkLogin, getUserInfo, isAdmin, wxLogin, login };
