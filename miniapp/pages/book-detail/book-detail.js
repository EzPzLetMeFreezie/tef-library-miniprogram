const { get, post } = require('../../utils/request');
const { getTexts } = require('../../utils/i18n');

Page({
  data: {
    book: null,
    borrowing: false,
    i18n: {},
  },

  onLoad(options) {
    this.setData({ i18n: getTexts() });
    if (options.id) {
      this.loadBook(options.id);
    }
  },

  async loadBook(id) {
    try {
      const book = await get(`/books/${id}`);
      this.setData({ book });
      wx.setNavigationBarTitle({ title: book.title });
    } catch (err) {
      console.error('Failed to load book:', err);
    }
  },

  handleBorrow() {
    const i18n = getTexts();
    const isZh = require('../../utils/i18n').getLang() === 'zh';
    wx.showModal({
      title: isZh ? '确认借阅' : 'Confirm Borrow',
      content: isZh
        ? `确定要借阅《${this.data.book.title}》吗？`
        : `Borrow "${this.data.book.title}"?`,
      success: (res) => {
        if (res.confirm) {
          this.doBorrow();
        }
      },
    });
  },

  async doBorrow() {
    if (this.data.borrowing) return;
    this.setData({ borrowing: true });
    const isZh = require('../../utils/i18n').getLang() === 'zh';

    try {
      await post('/borrow-records/borrow', {
        bookId: this.data.book.id,
      });
      wx.showToast({ title: isZh ? '借阅成功' : 'Success', icon: 'success' });
      this.loadBook(this.data.book.id);
    } catch (err) {
      console.error('Borrow failed:', err);
    } finally {
      this.setData({ borrowing: false });
    }
  },
});
