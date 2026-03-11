const { get, post, patch } = require('../../utils/request');

Page({
  data: {
    isEdit: false,
    bookId: null,
    form: {
      title: '',
      author: '',
      publisher: '',
      isbn: '',
      description: '',
      coverUrl: '',
      totalCount: '',
      availableCount: '',
      location: '',
    },
    categories: [],
    categoryNames: [],
    categoryIndex: -1,
    statusOptions: ['AVAILABLE', 'DISABLED'],
    statusIndex: 0,
    saving: false,
  },

  onLoad(options) {
    this.loadCategories();
    if (options.id) {
      this.setData({ isEdit: true, bookId: Number(options.id) });
      wx.setNavigationBarTitle({ title: '编辑图书' });
      this.loadBook(options.id);
    } else {
      wx.setNavigationBarTitle({ title: '新增图书' });
    }
  },

  async loadCategories() {
    try {
      const categories = await get('/categories');
      const categoryNames = categories.map((c) => c.name);
      this.setData({ categories, categoryNames });
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  },

  async loadBook(id) {
    try {
      const book = await get(`/books/${id}`);
      const categoryIndex = this.data.categories.findIndex(
        (c) => c.id === book.categoryId,
      );
      const statusIndex = this.data.statusOptions.indexOf(book.status);
      this.setData({
        form: {
          title: book.title,
          author: book.author,
          publisher: book.publisher || '',
          isbn: book.isbn || '',
          description: book.description || '',
          coverUrl: book.coverUrl || '',
          totalCount: String(book.totalCount),
          availableCount: String(book.availableCount),
          location: book.location || '',
        },
        categoryIndex: categoryIndex >= 0 ? categoryIndex : -1,
        statusIndex: statusIndex >= 0 ? statusIndex : 0,
      });
    } catch (err) {
      console.error('Failed to load book:', err);
    }
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  onCategoryChange(e) {
    this.setData({ categoryIndex: Number(e.detail.value) });
  },

  onStatusChange(e) {
    this.setData({ statusIndex: Number(e.detail.value) });
  },

  async handleSave() {
    const { form, categoryIndex, categories, statusOptions, statusIndex } =
      this.data;

    if (!form.title.trim() || !form.author.trim()) {
      wx.showToast({ title: '书名和作者为必填项', icon: 'none' });
      return;
    }

    this.setData({ saving: true });

    try {
      const data = {
        title: form.title.trim(),
        author: form.author.trim(),
        publisher: form.publisher.trim() || undefined,
        isbn: form.isbn.trim() || undefined,
        description: form.description.trim() || undefined,
        coverUrl: form.coverUrl.trim() || undefined,
        totalCount: Number(form.totalCount) || 1,
        availableCount: Number(form.availableCount) || 1,
        location: form.location.trim() || undefined,
        status: statusOptions[statusIndex],
        categoryId:
          categoryIndex >= 0 ? categories[categoryIndex].id : undefined,
      };

      if (this.data.isEdit) {
        await patch(`/books/${this.data.bookId}`, data);
        wx.showToast({ title: '更新成功', icon: 'success' });
      } else {
        await post('/books', data);
        wx.showToast({ title: '创建成功', icon: 'success' });
      }

      setTimeout(() => wx.navigateBack(), 500);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      this.setData({ saving: false });
    }
  },
});
