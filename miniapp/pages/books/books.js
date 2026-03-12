const { get } = require('../../utils/request');
const { getTexts } = require('../../utils/i18n');

Page({
  data: {
    books: [],
    categories: [],
    keyword: '',
    currentCategoryId: 0,
    page: 1,
    pageSize: 10,
    total: 0,
    hasMore: true,
    loading: false,
    i18n: {},
  },

  onLoad() {
    this.setData({ i18n: getTexts() });
    this.loadCategories();
    this.loadBooks();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
    this.setData({ i18n: getTexts() });
  },

  async loadCategories() {
    try {
      const categories = await get('/categories');
      this.setData({ categories });
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  },

  async loadBooks(append = false) {
    if (this.data.loading) return;
    this.setData({ loading: true });

    try {
      const params = {
        page: this.data.page,
        pageSize: this.data.pageSize,
      };
      if (this.data.keyword) params.keyword = this.data.keyword;
      if (this.data.currentCategoryId) params.categoryId = this.data.currentCategoryId;

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

  selectCategory(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ currentCategoryId: id, page: 1, books: [] });
    this.loadBooks();
  },

  loadMore() {
    this.setData({ page: this.data.page + 1 });
    this.loadBooks(true);
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/book-detail/book-detail?id=${id}` });
  },

  onPullDownRefresh() {
    this.setData({ page: 1, books: [] });
    this.loadBooks().then(() => wx.stopPullDownRefresh());
  },
});
