Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: '/pages/home/home',
        text: 'Home',
        icon: '\u2302',
      },
      {
        pagePath: '/pages/books/books',
        text: 'Search',
        icon: '\u2315',
      },
      {
        pagePath: '/pages/my-borrows/my-borrows',
        text: 'Library',
        icon: '\u2261',
      },
    ],
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      wx.switchTab({
        url: data.path,
      });
    },
  },
});
