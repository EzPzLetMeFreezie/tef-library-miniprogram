const auth = require('../../utils/auth');
const app = getApp();

Page({
  data: {
    loading: false,
    avatarUrl: '',
    nickname: '',
  },

  onChooseAvatar(e) {
    this.setData({ avatarUrl: e.detail.avatarUrl });
  },

  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value });
  },

  async handleLogin() {
    if (this.data.loading) return;

    const { nickname, avatarUrl } = this.data;

    this.setData({ loading: true });

    try {
      const code = await auth.wxLogin();
      const result = await auth.login(code, nickname || undefined, avatarUrl || undefined);
      app.setLoginData(result.token, result.user);

      wx.showToast({ title: '登录成功', icon: 'success' });

      setTimeout(() => {
        wx.switchTab({ url: '/pages/home/home' });
      }, 500);
    } catch (err) {
      console.error('Login failed:', err);
      wx.showToast({ title: '登录失败，请重试', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },
});
