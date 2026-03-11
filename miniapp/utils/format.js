function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDateTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day} ${h}:${min}`;
}

function getStatusText(status) {
  const map = {
    BORROWED: '借阅中',
    RETURNED: '已归还',
    OVERDUE: '已逾期',
    AVAILABLE: '可借阅',
    DISABLED: '已下架',
  };
  return map[status] || status;
}

function getStatusClass(status) {
  const map = {
    BORROWED: 'tag-borrowed',
    RETURNED: 'tag-returned',
    OVERDUE: 'tag-overdue',
    AVAILABLE: 'tag-available',
    DISABLED: 'tag-overdue',
  };
  return map[status] || '';
}

module.exports = { formatDate, formatDateTime, getStatusText, getStatusClass };
