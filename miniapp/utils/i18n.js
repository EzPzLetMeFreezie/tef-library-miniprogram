const langs = {
  zh: {
    // TabBar
    tabHome: '首页',
    tabSearch: '搜索',
    tabLibrary: '我的',

    // Home
    newArrivals: '新书上架',
    popularBooks: '热门图书',
    myBooks: '我的借阅',
    viewAll: '查看全部 >',
    returnUntil: '应还: ',
    noBooks: '暂无图书',

    // Search / Books
    searchPlaceholder: '搜索书名、作者...',
    searchBtn: '搜索',
    allCategories: '全部',
    loading: '加载中...',
    noResult: '暂无图书',
    loadMore: '加载更多',

    // Book Detail
    detailTitle: '图书详情',
    inStock: '可借阅',
    unavailable: '暂无库存',
    getBook: '立即借阅',
    currentlyUnavailable: '暂不可借',
    publisher: '出版社',
    category: '分类',
    location: '馆藏位置',
    stock: '库存',
    uncategorized: '未分类',

    // Library / My Borrows
    all: '全部',
    borrowed: '借阅中',
    returned: '已归还',
    overdue: '已逾期',
    adminPanel: '管理后台',
    admin: '管理员',
    user: '普通用户',
    borrowDate: '借阅: ',
    dueDate: '应还: ',
    returnDate: '归还: ',
    noRecords: '暂无借阅记录',
    logout: '退出登录',
    logoutConfirmTitle: '确认退出',
    logoutConfirmContent: '确定要退出登录吗？',

    // Login
    loginBtn: '微信登录',
    loginTip: '头像和昵称为选填，可直接登录',
    avatarChoose: '点击选择头像',
    avatarChange: '点击更换头像',
    nicknamePlaceholder: '请输入昵称',
    loginSuccess: '登录成功',
    loginFailed: '登录失败，请重试',

    // Status
    statusBorrowed: '借阅中',
    statusReturned: '已归还',
    statusOverdue: '已逾期',
    statusAvailable: '可借阅',
    statusDisabled: '已下架',

    // Language
    langSwitch: 'EN',
  },
  en: {
    // TabBar
    tabHome: 'Home',
    tabSearch: 'Search',
    tabLibrary: 'Library',

    // Home
    newArrivals: 'New arrivals',
    popularBooks: 'Popular books',
    myBooks: 'My books',
    viewAll: 'View all >',
    returnUntil: 'Return until ',
    noBooks: 'No books available yet',

    // Search / Books
    searchPlaceholder: 'Search title, author...',
    searchBtn: 'Search',
    allCategories: 'All',
    loading: 'Loading...',
    noResult: 'No books found',
    loadMore: 'Load more',

    // Book Detail
    detailTitle: 'Detail Book',
    inStock: 'In Stock',
    unavailable: 'Unavailable',
    getBook: 'Get the Book',
    currentlyUnavailable: 'Currently Unavailable',
    publisher: 'Publisher',
    category: 'Category',
    location: 'Location',
    stock: 'Stock',
    uncategorized: 'Uncategorized',

    // Library / My Borrows
    all: 'All',
    borrowed: 'Borrowed',
    returned: 'Returned',
    overdue: 'Overdue',
    adminPanel: 'Admin',
    admin: 'Admin',
    user: 'User',
    borrowDate: 'Borrowed: ',
    dueDate: 'Due: ',
    returnDate: 'Returned: ',
    noRecords: 'No borrow records',
    logout: 'Log out',
    logoutConfirmTitle: 'Confirm',
    logoutConfirmContent: 'Are you sure you want to log out?',

    // Login
    loginBtn: 'WeChat Login',
    loginTip: 'Avatar and nickname are optional',
    avatarChoose: 'Choose avatar',
    avatarChange: 'Change avatar',
    nicknamePlaceholder: 'Enter nickname',
    loginSuccess: 'Login success',
    loginFailed: 'Login failed, please retry',

    // Status
    statusBorrowed: 'Borrowed',
    statusReturned: 'Returned',
    statusOverdue: 'Overdue',
    statusAvailable: 'Available',
    statusDisabled: 'Disabled',

    // Language
    langSwitch: '中文',
  },
};

function getLang() {
  return wx.getStorageSync('lang') || 'en';
}

function setLang(lang) {
  wx.setStorageSync('lang', lang);
}

function t(key) {
  const lang = getLang();
  return (langs[lang] && langs[lang][key]) || key;
}

function getTexts() {
  const lang = getLang();
  return langs[lang] || langs.en;
}

module.exports = { getLang, setLang, t, getTexts };
