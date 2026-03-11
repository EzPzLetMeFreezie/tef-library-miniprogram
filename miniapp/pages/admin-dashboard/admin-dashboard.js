const { get } = require('../../utils/request');

Page({
  data: {
    stats: {
      totalBooks: 0,
      availableBooks: 0,
      activeBorrows: 0,
      overdueRecords: 0,
      totalUsers: 0,
    },
  },

  onShow() {
    this.loadStats();
  },

  async loadStats() {
    try {
      const [booksRes, borrowedRes, overdueRes, usersRes] = await Promise.all([
        get('/books', { page: 1, pageSize: 1 }),
        get('/borrow-records', { status: 'BORROWED', page: 1, pageSize: 1 }),
        get('/borrow-records', { status: 'OVERDUE', page: 1, pageSize: 1 }),
        get('/users', { page: 1, pageSize: 1 }),
      ]);

      const booksAllRes = await get('/books', { page: 1, pageSize: 1, status: 'AVAILABLE' });

      this.setData({
        stats: {
          totalBooks: booksRes.total || 0,
          availableBooks: booksAllRes.total || 0,
          activeBorrows: borrowedRes.total || 0,
          overdueRecords: overdueRes.total || 0,
          totalUsers: usersRes.total || 0,
        },
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  },

  goTo(e) {
    wx.navigateTo({ url: e.currentTarget.dataset.url });
  },
});
