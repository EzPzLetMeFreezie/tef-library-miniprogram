const { get } = require('../../utils/request');
const { formatDate, getStatusClass } = require('../../utils/format');
const { getTexts, t } = require('../../utils/i18n');
const app = getApp();

function getStatusTextI18n(status) {
  const map = {
    BORROWED: 'statusBorrowed',
    RETURNED: 'statusReturned',
    OVERDUE: 'statusOverdue',
    AVAILABLE: 'statusAvailable',
    DISABLED: 'statusDisabled',
  };
  return t(map[status] || status);
}

Page({
  data: {
    userInfo: null,
    records: [],
    currentTab: 'all',
    page: 1,
    pageSize: 20,
    loading: false,
    i18n: {},
  },

  onLoad() {
    this.setData({ userInfo: app.globalData.userInfo, i18n: getTexts() });
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
    this.setData({ page: 1, records: [], i18n: getTexts() });
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
        statusText: getStatusTextI18n(r.status),
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
    const i18n = getTexts();
    wx.showModal({
      title: i18n.logoutConfirmTitle,
      content: i18n.logoutConfirmContent,
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
