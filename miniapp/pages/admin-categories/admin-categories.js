const { get, post, patch, del } = require('../../utils/request');

Page({
  data: {
    categories: [],
    newName: '',
  },

  onShow() {
    this.loadCategories();
  },

  async loadCategories() {
    try {
      const categories = await get('/categories');
      this.setData({ categories });
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  },

  onNewNameInput(e) {
    this.setData({ newName: e.detail.value });
  },

  async handleAdd() {
    const name = this.data.newName.trim();
    if (!name) {
      wx.showToast({ title: '请输入分类名称', icon: 'none' });
      return;
    }
    try {
      await post('/categories', { name });
      wx.showToast({ title: '添加成功', icon: 'success' });
      this.setData({ newName: '' });
      this.loadCategories();
    } catch (err) {
      console.error('Add failed:', err);
    }
  },

  handleEdit(e) {
    const { id, name } = e.currentTarget.dataset;
    wx.showModal({
      title: '编辑分类',
      editable: true,
      placeholderText: name,
      success: async (res) => {
        if (res.confirm && res.content && res.content.trim()) {
          try {
            await patch(`/categories/${id}`, { name: res.content.trim() });
            wx.showToast({ title: '更新成功', icon: 'success' });
            this.loadCategories();
          } catch (err) {
            console.error('Edit failed:', err);
          }
        }
      },
    });
  },

  handleDelete(e) {
    const { id, name, count } = e.currentTarget.dataset;
    if (count > 0) {
      wx.showToast({ title: '该分类下有图书，无法删除', icon: 'none' });
      return;
    }
    wx.showModal({
      title: '确认删除',
      content: `确定要删除分类"${name}"吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            await del(`/categories/${id}`);
            wx.showToast({ title: '删除成功', icon: 'success' });
            this.loadCategories();
          } catch (err) {
            console.error('Delete failed:', err);
          }
        }
      },
    });
  },
});
