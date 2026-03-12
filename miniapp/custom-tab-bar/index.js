const { getTexts } = require('../utils/i18n');

function buildList() {
  const i18n = getTexts();
  return [
    { pagePath: '/pages/home/home', text: i18n.tabHome, icon: '\u2302' },
    { pagePath: '/pages/books/books', text: i18n.tabSearch, icon: '\u2315' },
    { pagePath: '/pages/my-borrows/my-borrows', text: i18n.tabLibrary, icon: '\u2261' },
  ];
}

Component({
  data: {
    selected: 0,
    list: buildList(),
  },
  lifetimes: {
    attached() {
      this.setData({ list: buildList() });
    },
  },
  pageLifetimes: {
    show() {
      this.setData({ list: buildList() });
    },
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      wx.switchTab({ url: data.path });
    },
  },
});
