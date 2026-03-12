const { get } = require('../../utils/request');
const auth = require('../../utils/auth');
const { formatDate } = require('../../utils/format');

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

Page({
  data: {
    hotBooks: [],
    newArrivals: [],
    myBorrows: [],
    isAdmin: false,
    loading: true,
    userInfo: null,
    dateDay: '',
    dateWeekday: '',
    dateMonth: '',
  },

  onLoad() {
    this.setDateInfo();
  },

  onShow() {
    if (!auth.checkLogin()) return;
    const userInfo = auth.getUserInfo();
    this.setData({
      isAdmin: auth.isAdmin(),
      userInfo,
    });
    this.loadData();
    this.loadMyBorrows();
  },

  setDateInfo() {
    const now = new Date();
    this.setData({
      dateDay: now.getDate(),
      dateWeekday: WEEKDAYS[now.getDay()],
      dateMonth: MONTHS[now.getMonth()] + ' ' + now.getFullYear(),
    });
  },

  async loadData() {
    this.setData({ loading: true });
    try {
      const data = await get('/recommendations/home');
      this.setData({
        hotBooks: data.hotBooks || [],
        newArrivals: data.newArrivals || [],
      });
    } catch (err) {
      console.error('Failed to load home data:', err);
    } finally {
      this.setData({ loading: false });
    }
  },

  async loadMyBorrows() {
    try {
      const res = await get('/borrow-records/my', { page: 1, pageSize: 5, status: 'BORROWED' });
      const items = (res.items || []).map((r) => ({
        ...r,
        dueDateStr: formatDate(r.dueDate),
        isOverdue: new Date(r.dueDate) < new Date(),
      }));
      this.setData({ myBorrows: items });
    } catch (err) {
      console.error('Failed to load my borrows:', err);
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

  goProfile() {
    wx.switchTab({ url: '/pages/my-borrows/my-borrows' });
  },

  onPullDownRefresh() {
    this.setDateInfo();
    Promise.all([this.loadData(), this.loadMyBorrows()]).then(() => wx.stopPullDownRefresh());
  },
});
