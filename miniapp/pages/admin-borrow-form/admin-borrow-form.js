const { get, post } = require('../../utils/request');

Page({
  data: {
    // User search
    userKeyword: '',
    userResults: [],
    showUserResults: false,
    selectedUser: null,

    // Book search
    bookKeyword: '',
    bookResults: [],
    showBookResults: false,
    selectedBook: null,

    // Due date
    dueDate: '',
    minDate: '',

    // Submit
    submitting: false,
  },

  onLoad() {
    const today = new Date();
    const defaultDue = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    this.setData({
      minDate: this._formatDateStr(today),
      dueDate: this._formatDateStr(defaultDue),
    });
  },

  _formatDateStr(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  },

  // ========== User search ==========
  onUserKeywordInput(e) {
    this.setData({ userKeyword: e.detail.value });
    if (e.detail.value.trim().length > 0) {
      this._searchUsers(e.detail.value.trim());
    } else {
      this.setData({ userResults: [], showUserResults: false });
    }
  },

  async _searchUsers(keyword) {
    try {
      const res = await get('/users', { keyword, page: 1, pageSize: 20 });
      this.setData({
        userResults: res.items || [],
        showUserResults: (res.items || []).length > 0,
      });
    } catch (err) {
      console.error('Search users failed:', err);
    }
  },

  selectUser(e) {
    const user = e.currentTarget.dataset.user;
    this.setData({
      selectedUser: user,
      userKeyword: user.name,
      showUserResults: false,
      userResults: [],
    });
  },

  clearUser() {
    this.setData({
      selectedUser: null,
      userKeyword: '',
      userResults: [],
      showUserResults: false,
    });
  },

  // ========== Book search ==========
  onBookKeywordInput(e) {
    this.setData({ bookKeyword: e.detail.value });
    if (e.detail.value.trim().length > 0) {
      this._searchBooks(e.detail.value.trim());
    } else {
      this.setData({ bookResults: [], showBookResults: false });
    }
  },

  async _searchBooks(keyword) {
    try {
      const res = await get('/books', { keyword, page: 1, pageSize: 20, status: 'AVAILABLE' });
      const items = (res.items || []).filter((b) => b.availableCount > 0);
      this.setData({
        bookResults: items,
        showBookResults: items.length > 0,
      });
    } catch (err) {
      console.error('Search books failed:', err);
    }
  },

  selectBook(e) {
    const book = e.currentTarget.dataset.book;
    this.setData({
      selectedBook: book,
      bookKeyword: book.title,
      showBookResults: false,
      bookResults: [],
    });
  },

  clearBook() {
    this.setData({
      selectedBook: null,
      bookKeyword: '',
      bookResults: [],
      showBookResults: false,
    });
  },

  // ========== Due date ==========
  onDueDateChange(e) {
    this.setData({ dueDate: e.detail.value });
  },

  // ========== Submit ==========
  async handleSubmit() {
    const { selectedUser, selectedBook, dueDate } = this.data;

    if (!selectedUser) {
      wx.showToast({ title: '请选择借阅人', icon: 'none' });
      return;
    }
    if (!selectedBook) {
      wx.showToast({ title: '请选择图书', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    try {
      await post('/borrow-records/borrow', {
        userId: selectedUser.id,
        bookId: selectedBook.id,
        dueDate: dueDate || undefined,
      });
      wx.showToast({ title: '借阅创建成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 500);
    } catch (err) {
      console.error('Create borrow failed:', err);
    } finally {
      this.setData({ submitting: false });
    }
  },
});
