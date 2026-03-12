const { get } = require('../../utils/request');
const { formatDate, getStatusText, getStatusClass } = require('../../utils/format');
const app = getApp();

Page({
  data: {
    userInfo: null,
    records: [],
    currentTab: 'all',
    page: 1,
    pageSize: 20,
    loading: false,
  },

  onLoad() {
    this.setData({ userInfo: app.globalData.userInfo });
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
    this.setData({ page: 1, records: [] });
    this.loadRecords();
  },

  async loadRecords() {
    this.setData({ loading: true });
    try {
      const params = { page: this.data.page, pageSize: this.data.pageSize };
      if (this.data.currentTab !== 'all') {
        params.status = this.data.currentTab;
      }
      const res = await get('/borrow-records/my', params);
      const records = (res.items || []).map((r) => ({
        ...r,
        borrowDateStr: formatDate(r.borrowDate),
        dueDateStr: formatDate(r.dueDate),
        returnDateStr: formatDate(r.returnDate),
        statusText: getStatusText(r.status),
        statusClass: getStatusClass(r.status),
      }));
      this.setData({ records });
    } catch (err) {
      console.error('Failed to load records:', err);
    } finally {
      this.setData({ loading: false });
    }
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab, page: 1, records: [] });
    this.loadRecords();
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/book-detail/book-detail?id=${id}` });
  },

  goAdmin() {
    wx.navigateTo({ url: '/pages/admin-dashboard/admin-dashboard' });
  },

  handleLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.logout();
        }
      },
    });
  },

  onPullDownRefresh() {
    this.setData({ page: 1, records: [] });
    this.loadRecords().then(() => wx.stopPullDownRefresh());
  },
});
