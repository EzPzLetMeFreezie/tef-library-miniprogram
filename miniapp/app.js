const auth = require('./utils/auth');

App({
  globalData: {
    userInfo: null,
    token: null,
  },

  onLaunch() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    if (token && userInfo) {
      this.globalData.token = token;
      this.globalData.userInfo = userInfo;
    }
  },

  isLoggedIn() {
    return !!this.globalData.token;
  },

  isAdmin() {
    return this.globalData.userInfo?.role === 'ADMIN';
  },

  setLoginData(token, user) {
    this.globalData.token = token;
    this.globalData.userInfo = user;
    wx.setStorageSync('token', token);
    wx.setStorageSync('userInfo', user);
  },

  logout() {
    this.globalData.token = null;
    this.globalData.userInfo = null;
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
    wx.reLaunch({ url: '/pages/login/login' });
  },
});
