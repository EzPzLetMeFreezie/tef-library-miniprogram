const { get, post } = require('../../utils/request');
const { formatDate, getStatusText, getStatusClass } = require('../../utils/format');

Page({
  data: {
    records: [],
    keyword: '',
    currentStatus: '',
    total: 0,
    statusCounts: { all: 0, BORROWED: 0, OVERDUE: 0, RETURNED: 0 },
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    pageSize: 20,
    hasMore: true,
    loading: false,
  },

  onShow() {
    this.loadStatusCounts();
    this.setData({ page: 1, records: [] });
    this.loadRecords();
  },

  async loadStatusCounts() {
    try {
      const [allRes, borrowedRes, overdueRes, returnedRes] = await Promise.all([
        get('/borrow-records', { page: 1, pageSize: 1 }),
        get('/borrow-records', { page: 1, pageSize: 1, status: 'BORROWED' }),
        get('/borrow-records', { page: 1, pageSize: 1, status: 'OVERDUE' }),
        get('/borrow-records', { page: 1, pageSize: 1, status: 'RETURNED' }),
      ]);
      this.setData({
        statusCounts: {
          all: allRes.total || 0,
          BORROWED: borrowedRes.total || 0,
          OVERDUE: overdueRes.total || 0,
          RETURNED: returnedRes.total || 0,
        },
      });
    } catch (err) {
      console.error('Failed to load status counts:', err);
    }
  },

  async loadRecords(append = false) {
    if (this.data.loading) return;
    this.setData({ loading: true });
    try {
      const params = { page: this.data.page, pageSize: this.data.pageSize };
      if (this.data.keyword) params.keyword = this.data.keyword;
      if (this.data.currentStatus) params.status = this.data.currentStatus;
      params.sortBy = this.data.sortBy;
      params.sortOrder = this.data.sortOrder;

      const res = await get('/borrow-records', params);
      const items = (res.items || []).map((r) => ({
        ...r,
        borrowDateStr: formatDate(r.borrowDate),
        dueDateStr: formatDate(r.dueDate),
        returnDateStr: formatDate(r.returnDate),
        statusText: getStatusText(r.status),
        statusClass: getStatusClass(r.status),
      }));
      const records = append ? [...this.data.records, ...items] : items;
      this.setData({ records, total: res.total, hasMore: records.length < res.total });
    } catch (err) {
      console.error('Failed to load records:', err);
    } finally {
      this.setData({ loading: false });
    }
  },

  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  doSearch() {
    this.setData({ page: 1, records: [] });
    this.loadRecords();
  },

  switchStatus(e) {
    this.setData({ currentStatus: e.currentTarget.dataset.status, page: 1, records: [] });
    this.loadRecords();
  },

  toggleSort(e) {
    const field = e.currentTarget.dataset.field;
    const { sortBy, sortOrder } = this.data;
    let newOrder = 'asc';
    if (sortBy === field) {
      newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    this.setData({ sortBy: field, sortOrder: newOrder, page: 1, records: [] });
    this.loadRecords();
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ page: this.data.page + 1 });
      this.loadRecords(true);
    }
  },

  goCreateBorrow() {
    wx.navigateTo({ url: '/pages/admin-borrow-form/admin-borrow-form' });
  },

  handleReturn(e) {
    const { id, title } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认归还',
      content: `确认《${title}》已归还？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            await post('/borrow-records/return', { recordId: id });
            wx.showToast({ title: '归还成功', icon: 'success' });
            this.loadStatusCounts();
            this.setData({ page: 1, records: [] });
            this.loadRecords();
          } catch (err) {
            console.error('Return failed:', err);
          }
        }
      },
    });
  },
});
