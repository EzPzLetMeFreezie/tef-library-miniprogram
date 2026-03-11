const { get, post } = require('../../utils/request');

Page({
  data: {
    book: null,
    borrowing: false,
  },

  onLoad(options) {
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
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  handleBorrow() {
    wx.showModal({
      title: '确认借阅',
      content: `确定要借阅《${this.data.book.title}》吗？`,
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

    try {
      await post('/borrow-records/borrow', {
        bookId: this.data.book.id,
      });
      wx.showToast({ title: '借阅成功', icon: 'success' });
      this.loadBook(this.data.book.id);
    } catch (err) {
      console.error('Borrow failed:', err);
    } finally {
      this.setData({ borrowing: false });
    }
  },
});
