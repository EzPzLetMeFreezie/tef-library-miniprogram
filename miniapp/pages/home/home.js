const { get } = require('../../utils/request');
const auth = require('../../utils/auth');

Page({
  data: {
    hotBooks: [],
    newArrivals: [],
    categoryShelves: [],
    isAdmin: false,
    loading: true,
  },

  onLoad() {
    this.setData({ isAdmin: auth.isAdmin() });
  },

  onShow() {
    if (!auth.checkLogin()) return;
    this.loadData();
  },

  async loadData() {
    this.setData({ loading: true });
    try {
      const data = await get('/recommendations/home');
      this.setData({
        hotBooks: data.hotBooks || [],
        newArrivals: data.newArrivals || [],
        categoryShelves: data.categoryShelves || [],
      });
    } catch (err) {
      console.error('Failed to load home data:', err);
    } finally {
      this.setData({ loading: false });
    }
  },

  goSearch() {
    wx.switchTab({ url: '/pages/books/books' });
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/book-detail/book-detail?id=${id}` });
  },

  goBooks() {
    wx.switchTab({ url: '/pages/books/books' });
  },

  goAdmin() {
    wx.navigateTo({ url: '/pages/admin-dashboard/admin-dashboard' });
  },

  onPullDownRefresh() {
    this.loadData().then(() => wx.stopPullDownRefresh());
  },
});
