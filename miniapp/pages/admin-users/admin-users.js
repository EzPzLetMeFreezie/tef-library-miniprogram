const { get, patch, del } = require('../../utils/request');

Page({
  data: {
    users: [],
    keyword: '',
    total: 0,
    page: 1,
    pageSize: 20,
    hasMore: true,
    loading: false,
  },

  onShow() {
    this.setData({ page: 1, users: [] });
    this.loadUsers();
  },

  async loadUsers(append = false) {
    if (this.data.loading) return;
    this.setData({ loading: true });
    try {
      const params = { page: this.data.page, pageSize: this.data.pageSize };
      if (this.data.keyword) params.keyword = this.data.keyword;

      const res = await get('/users', params);
      const items = (res.items || []).map((u) => ({
        ...u,
        roleText: u.role === 'ADMIN' ? '管理员' : '普通用户',
        createdDateStr: u.createdAt ? u.createdAt.substring(0, 10) : '',
      }));
      const users = append ? [...this.data.users, ...items] : items;
      this.setData({ users, total: res.total, hasMore: users.length < res.total });
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      this.setData({ loading: false });
    }
  },

  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  doSearch() {
    this.setData({ page: 1, users: [] });
    this.loadUsers();
  },

  clearSearch() {
    this.setData({ keyword: '', page: 1, users: [] });
    this.loadUsers();
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ page: this.data.page + 1 });
      this.loadUsers(true);
    }
  },

  handleToggleRole(e) {
    const { id, name, role } = e.currentTarget.dataset;
    const newRole = role === 'ADMIN' ? 'USER' : 'ADMIN';
    const newRoleText = newRole === 'ADMIN' ? '管理员' : '普通用户';

    wx.showModal({
      title: '修改角色',
      content: `确认将「${name}」设为${newRoleText}？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            await patch(`/users/${id}/role`, { role: newRole });
            wx.showToast({ title: '修改成功', icon: 'success' });
            this.setData({ page: 1, users: [] });
            this.loadUsers();
          } catch (err) {
            console.error('Update role failed:', err);
          }
        }
      },
    });
  },

  handleDelete(e) {
    const { id, name } = e.currentTarget.dataset;
    wx.showModal({
      title: '删除用户',
      content: `确认删除用户「${name}」？此操作不可撤销，该用户的借阅记录也将被删除。`,
      confirmColor: '#e74c3c',
      success: async (res) => {
        if (res.confirm) {
          try {
            await del(`/users/${id}`);
            wx.showToast({ title: '删除成功', icon: 'success' });
            this.setData({ page: 1, users: [] });
            this.loadUsers();
          } catch (err) {
            console.error('Delete user failed:', err);
          }
        }
      },
    });
  },
});
