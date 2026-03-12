const auth = require('../../utils/auth');
const { getLang, setLang, getTexts } = require('../../utils/i18n');
const app = getApp();

Page({
  data: {
    loading: false,
    avatarUrl: '',
    nickname: '',
    i18n: {},
  },

  onLoad() {
    this.setData({ i18n: getTexts() });
  },

  toggleLang() {
    const newLang = getLang() === 'en' ? 'zh' : 'en';
    setLang(newLang);
    this.setData({ i18n: getTexts() });
  },

  onChooseAvatar(e) {
    if (e.detail.avatarUrl) {
      this.setData({ avatarUrl: e.detail.avatarUrl });
    }
  },

  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value });
  },

  async handleLogin() {
    if (this.data.loading) return;

    const { nickname, avatarUrl } = this.data;
    const i18n = getTexts();

    this.setData({ loading: true });

    try {
      const code = await auth.wxLogin();
      const result = await auth.login(code, nickname || undefined, avatarUrl || undefined);
      app.setLoginData(result.token, result.user);

      wx.showToast({ title: i18n.loginSuccess, icon: 'success' });

      setTimeout(() => {
        wx.switchTab({ url: '/pages/home/home' });
      }, 500);
    } catch (err) {
      console.error('Login failed:', err);
      wx.showToast({ title: i18n.loginFailed, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },
});
