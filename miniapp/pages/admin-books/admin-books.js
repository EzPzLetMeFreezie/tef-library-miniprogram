const { get, del } = require('../../utils/request');

Page({
  data: {
    books: [],
    keyword: '',
    categories: [],
    selectedCategoryId: '',
    selectedStatus: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    total: 0,
    page: 1,
    pageSize: 20,
    hasMore: true,
    loading: false,
  },

  onShow() {
    this.loadCategories();
    this.setData({ page: 1, books: [] });
    this.loadBooks();
  },

  async loadCategories() {
    try {
      const res = await get('/categories');
      this.setData({ categories: res || [] });
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  },

  async loadBooks(append = false) {
    if (this.data.loading) return;
    this.setData({ loading: true });
    try {
      const params = { page: this.data.page, pageSize: this.data.pageSize };
      if (this.data.keyword) params.keyword = this.data.keyword;
      if (this.data.selectedCategoryId) params.categoryId = this.data.selectedCategoryId;
      if (this.data.selectedStatus) params.status = this.data.selectedStatus;
      params.sortBy = this.data.sortBy;
      params.sortOrder = this.data.sortOrder;
      const res = await get('/books', params);
      const books = append ? [...this.data.books, ...res.items] : res.items;
      this.setData({
        books,
        total: res.total,
        hasMore: books.length < res.total,
      });
    } catch (err) {
      console.error('Failed to load books:', err);
    } finally {
      this.setData({ loading: false });
    }
  },

  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  doSearch() {
    this.setData({ page: 1, books: [] });
    this.loadBooks();
  },

  clearSearch() {
    this.setData({ keyword: '', page: 1, books: [] });
    this.loadBooks();
  },

  selectCategory(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ selectedCategoryId: id, page: 1, books: [] });
    this.loadBooks();
  },

  selectStatus(e) {
    const status = e.currentTarget.dataset.status;
    this.setData({ selectedStatus: status, page: 1, books: [] });
    this.loadBooks();
  },

  toggleSort(e) {
    const field = e.currentTarget.dataset.field;
    const { sortBy, sortOrder } = this.data;
    let newOrder = 'asc';
    if (sortBy === field) {
      newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    this.setData({ sortBy: field, sortOrder: newOrder, page: 1, books: [] });
    this.loadBooks();
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ page: this.data.page + 1 });
      this.loadBooks(true);
    }
  },

  goAdd() {
    wx.navigateTo({ url: '/pages/admin-book-form/admin-book-form' });
  },

  goEdit(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/admin-book-form/admin-book-form?id=${id}` });
  },

  handleDelete(e) {
    const { id, title } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: `确定要删除《${title}》吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            await del(`/books/${id}`);
            wx.showToast({ title: '删除成功', icon: 'success' });
            this.setData({ page: 1, books: [] });
            this.loadBooks();
          } catch (err) {
            console.error('Delete failed:', err);
          }
        }
      },
    });
  },
});
