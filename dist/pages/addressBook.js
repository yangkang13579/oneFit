'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _page = require('./../mixins/page.js');

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AddressBook = function (_wepy$page) {
  _inherits(AddressBook, _wepy$page);

  function AddressBook() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AddressBook);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AddressBook.__proto__ || Object.getPrototypeOf(AddressBook)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarTitleText: '会议管理',
      navigationBarBackgroundColor: '#fff'
    }, _this.components = {}, _this.data = {
      list: [],
      delItem: null,
      showToast: false,
      error: '',
      user: _this.user,
      pageSize: 10,
      totalPage: 0,
      indexPage: 0
    }, _this.methods = {
      // 编辑
      edit: function edit(e) {
        if (e.target.dataset.item.createUser.split('_')[1] !== this.user.id) {
          this.toast('您不是该会议的创建者, 不能编辑');
          return;
        }
        console.log(this.user, 'useruser');
        console.log(e.target.dataset.item.startDate.replace(/-/g, "/"), 'e.target.dataset.item.startDate');
        if (new Date(e.target.dataset.item.startDate.replace(/-/g, "/")).getTime() < new Date().getTime()) {
          this.toast('该会议已经开始, 不能编辑');
          return;
        }
        wx.navigateTo({
          url: '/pages/editAddress?item=' + JSON.stringify(e.target.dataset.item)
        });
      },

      // 删除
      del: function del(e) {
        if (e.target.dataset.item.createUser.split('_')[1] !== this.user.id) {
          this.toast('您不是该会议的创建者, 不能编辑');
          return;
        }
        if (new Date(e.target.dataset.item.startDate.replace(/-/g, "/")).getTime() < new Date().getTime()) {
          this.toast('该会议已经开始, 不能删除');
          return;
        }
        this.delItem = e.target.dataset.item;
        var self = this;
        wx.showModal({
          title: '提示',
          content: '是否确认删除当前会议?',
          cancelText: '取消',
          confirmText: '确认',
          success: function success(res) {
            if (res.confirm) {
              self.delFun();
            };
          },
          fail: function fail(err) {}
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AddressBook, [{
    key: 'onReachBottom',
    value: function onReachBottom() {
      if (this.indexPage >= this.totalPage) {
        this.toast('无更多数据');
        return;
      }
      this.indexPage++;
      // 下拉触底，先判断是否有请求正在进行中
      // 以及检查当前请求页数是不是小于数据总页数，如符合条件，则发送请求
      this.getList();
    }
    // 获取列表

  }, {
    key: 'getList',
    value: function getList() {
      var self = this;
      this.fetchDataPromise('meeting/wechat/queryMeetingApi.json', {
        pageSize: this.pageSize,
        indexPage: this.indexPage
      }, {}).then(function (data) {
        console.log(self.list);
        data.list = data.list.map(function (item) {
          var obj = item;
          obj.createDate = self.timeFormat(obj.createDate);
          obj.start = obj.startDate.split(' ')[0];
          obj.end = obj.endDate.split(' ')[0];
          obj.edit = new Date(obj.startDate.replace(/-/g, "/")).getTime() < new Date().getTime() ? false : true;
          return obj;
        });
        self.totalPage = data.queryParam.totalPage;
        self.list = self.list.concat(data.list);
        self.$apply();
      });
    }
  }, {
    key: 'timeFormat',
    value: function timeFormat(timeStr) {
      var dataOne = timeStr.split('T')[0];
      var dataTwo = timeStr.split('T')[1];
      var dataThree = dataTwo.split('+')[0];
      var newTimeStr = dataOne + ' ' + dataThree;
      return newTimeStr;
    }
  }, {
    key: 'delFun',
    value: function delFun() {
      var self = this;
      this.delItem.status = -1;
      this.fetchDataPromise('meeting/wechat/updateMeetingApi.json', this.delItem, {}).then(function (data) {
        self.getList();
        self.$apply();
      });
    }
  }, {
    key: 'toast',
    value: function toast(error) {
      this.showToast = true;
      this.error = error;
      var that = this;
      setTimeout(function () {
        that.showToast = false;
      }, 2000);
    }
  }, {
    key: 'onLoad',
    value: function onLoad() {}
  }, {
    key: 'whenAppReadyShow',
    value: function whenAppReadyShow() {
      this.getList();
      this.showToast = false;
      // 每次都刷新
    }
  }]);

  return AddressBook;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(AddressBook , 'pages/addressBook'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkZHJlc3NCb29rLmpzIl0sIm5hbWVzIjpbIkFkZHJlc3NCb29rIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJjb21wb25lbnRzIiwiZGF0YSIsImxpc3QiLCJkZWxJdGVtIiwic2hvd1RvYXN0IiwiZXJyb3IiLCJ1c2VyIiwicGFnZVNpemUiLCJ0b3RhbFBhZ2UiLCJpbmRleFBhZ2UiLCJtZXRob2RzIiwiZWRpdCIsImUiLCJ0YXJnZXQiLCJkYXRhc2V0IiwiaXRlbSIsImNyZWF0ZVVzZXIiLCJzcGxpdCIsImlkIiwidG9hc3QiLCJjb25zb2xlIiwibG9nIiwic3RhcnREYXRlIiwicmVwbGFjZSIsIkRhdGUiLCJnZXRUaW1lIiwid3giLCJuYXZpZ2F0ZVRvIiwidXJsIiwiSlNPTiIsInN0cmluZ2lmeSIsImRlbCIsInNlbGYiLCJzaG93TW9kYWwiLCJ0aXRsZSIsImNvbnRlbnQiLCJjYW5jZWxUZXh0IiwiY29uZmlybVRleHQiLCJzdWNjZXNzIiwicmVzIiwiY29uZmlybSIsImRlbEZ1biIsImZhaWwiLCJlcnIiLCJnZXRMaXN0IiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJtYXAiLCJvYmoiLCJjcmVhdGVEYXRlIiwidGltZUZvcm1hdCIsInN0YXJ0IiwiZW5kIiwiZW5kRGF0ZSIsInF1ZXJ5UGFyYW0iLCJjb25jYXQiLCIkYXBwbHkiLCJ0aW1lU3RyIiwiZGF0YU9uZSIsImRhdGFUd28iLCJkYXRhVGhyZWUiLCJuZXdUaW1lU3RyIiwic3RhdHVzIiwidGhhdCIsInNldFRpbWVvdXQiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDRTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFDcUJBLFc7Ozs7Ozs7Ozs7Ozs7O2dNQUNuQkMsTSxHQUFTLENBQUNDLGNBQUQsQyxRQUNUQyxNLEdBQVM7QUFDUEMsOEJBQXdCLE1BRGpC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QWQsRUFBbUIsQ0FBbkIsQ0FBZDtBQUNBLFVBQUkwQyxVQUFVRixRQUFReEMsS0FBUixDQUFjLEdBQWQsRUFBbUIsQ0FBbkIsQ0FBZDtBQUNBLFVBQUkyQyxZQUFZRCxRQUFRMUMsS0FBUixDQUFjLEdBQWQsRUFBbUIsQ0FBbkIsQ0FBaEI7QUFDQSxVQUFJNEMsYUFBYUgsVUFBVSxHQUFWLEdBQWdCRSxTQUFqQztBQUNBLGFBQU9DLFVBQVA7QUFDRDs7OzZCQUNTO0FBQ1IsVUFBSTdCLE9BQU8sSUFBWDtBQUNBLFdBQUs3QixPQUFMLENBQWEyRCxNQUFiLEdBQXNCLENBQUMsQ0FBdkI7QUFDQSxXQUFLakIsZ0JBQUwsQ0FBc0Isc0NBQXRCLEVBQThELEtBQUsxQyxPQUFuRSxFQUE0RSxFQUE1RSxFQUNDMkMsSUFERCxDQUNNLFVBQVM3QyxJQUFULEVBQWU7QUFDbkIrQixhQUFLWSxPQUFMO0FBQ0FaLGFBQUt3QixNQUFMO0FBQ0QsT0FKRDtBQUtEOzs7MEJBQ01uRCxLLEVBQU87QUFDWixXQUFLRCxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsV0FBS0MsS0FBTCxHQUFhQSxLQUFiO0FBQ0EsVUFBSTBELE9BQU8sSUFBWDtBQUNBQyxpQkFBVyxZQUFNO0FBQ2ZELGFBQUszRCxTQUFMLEdBQWlCLEtBQWpCO0FBQ0QsT0FGRCxFQUVHLElBRkg7QUFHRDs7OzZCQThDUyxDQUVUOzs7dUNBQ2tCO0FBQ2pCLFdBQUt3QyxPQUFMO0FBQ0EsV0FBS3hDLFNBQUwsR0FBaUIsS0FBakI7QUFDQTtBQUNEOzs7O0VBOUhzQzZELGVBQUtDLEk7O2tCQUF6QnhFLFciLCJmaWxlIjoiYWRkcmVzc0Jvb2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuICBpbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcclxuICBpbXBvcnQgUGFnZU1peGluIGZyb20gJy4uL21peGlucy9wYWdlJztcclxuICBleHBvcnQgZGVmYXVsdCBjbGFzcyBBZGRyZXNzQm9vayBleHRlbmRzIHdlcHkucGFnZSB7XHJcbiAgICBtaXhpbnMgPSBbUGFnZU1peGluXTtcclxuICAgIGNvbmZpZyA9IHtcclxuICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+S8muiurueuoeeQhicsXHJcbiAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJ1xyXG4gICAgfTtcclxuICAgIGNvbXBvbmVudHMgPSB7XHJcbiAgICB9O1xyXG4gICAgZGF0YSA9IHtcclxuICAgICAgbGlzdDogW10sXHJcbiAgICAgIGRlbEl0ZW06IG51bGwsXHJcbiAgICAgIHNob3dUb2FzdDogZmFsc2UsXHJcbiAgICAgIGVycm9yOiAnJyxcclxuICAgICAgdXNlcjogdGhpcy51c2VyLFxyXG4gICAgICBwYWdlU2l6ZTogMTAsXHJcbiAgICAgIHRvdGFsUGFnZTogMCxcclxuICAgICAgaW5kZXhQYWdlOiAwXHJcbiAgICB9O1xyXG4gICAgb25SZWFjaEJvdHRvbSgpIHtcclxuICAgICAgaWYgKHRoaXMuaW5kZXhQYWdlID49IHRoaXMudG90YWxQYWdlKSB7XHJcbiAgICAgICAgdGhpcy50b2FzdCgn5peg5pu05aSa5pWw5o2uJylcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG4gICAgICB0aGlzLmluZGV4UGFnZSsrXHJcbiAgICAgIC8vIOS4i+aLieinpuW6le+8jOWFiOWIpOaWreaYr+WQpuacieivt+axguato+WcqOi/m+ihjOS4rVxyXG4gICAgICAvLyDku6Xlj4rmo4Dmn6XlvZPliY3or7fmsYLpobXmlbDmmK/kuI3mmK/lsI/kuo7mlbDmja7mgLvpobXmlbDvvIzlpoLnrKblkIjmnaHku7bvvIzliJnlj5HpgIHor7fmsYJcclxuICAgICAgdGhpcy5nZXRMaXN0KClcclxuICAgIH1cclxuICAgICAgLy8g6I635Y+W5YiX6KGoXHJcbiAgICBnZXRMaXN0ICgpIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgnbWVldGluZy93ZWNoYXQvcXVlcnlNZWV0aW5nQXBpLmpzb24nLCB7XHJcbiAgICAgICAgcGFnZVNpemU6IHRoaXMucGFnZVNpemUsXHJcbiAgICAgICAgaW5kZXhQYWdlOiB0aGlzLmluZGV4UGFnZVxyXG4gICAgICB9LCB7fSlcclxuICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHNlbGYubGlzdClcclxuICAgICAgICBkYXRhLmxpc3QgPSBkYXRhLmxpc3QubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgbGV0IG9iaiA9IGl0ZW1cclxuICAgICAgICAgIG9iai5jcmVhdGVEYXRlID0gc2VsZi50aW1lRm9ybWF0KG9iai5jcmVhdGVEYXRlKVxyXG4gICAgICAgICAgb2JqLnN0YXJ0ID0gb2JqLnN0YXJ0RGF0ZS5zcGxpdCgnICcpWzBdXHJcbiAgICAgICAgICBvYmouZW5kID0gb2JqLmVuZERhdGUuc3BsaXQoJyAnKVswXVxyXG4gICAgICAgICAgb2JqLmVkaXQgPSBuZXcgRGF0ZShvYmouc3RhcnREYXRlLnJlcGxhY2UoLy0vZywgXCIvXCIpKS5nZXRUaW1lKCkgPCBuZXcgRGF0ZSgpLmdldFRpbWUoKSA/IGZhbHNlIDogdHJ1ZVxyXG4gICAgICAgICAgcmV0dXJuIG9ialxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgc2VsZi50b3RhbFBhZ2UgPSBkYXRhLnF1ZXJ5UGFyYW0udG90YWxQYWdlXHJcbiAgICAgICAgc2VsZi5saXN0ID0gc2VsZi5saXN0LmNvbmNhdChkYXRhLmxpc3QpXHJcbiAgICAgICAgc2VsZi4kYXBwbHkoKVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gICAgdGltZUZvcm1hdCAodGltZVN0cikge1xyXG4gICAgICB2YXIgZGF0YU9uZSA9IHRpbWVTdHIuc3BsaXQoJ1QnKVswXTtcclxuICAgICAgdmFyIGRhdGFUd28gPSB0aW1lU3RyLnNwbGl0KCdUJylbMV07XHJcbiAgICAgIHZhciBkYXRhVGhyZWUgPSBkYXRhVHdvLnNwbGl0KCcrJylbMF07XHJcbiAgICAgIHZhciBuZXdUaW1lU3RyID0gZGF0YU9uZSArICcgJyArIGRhdGFUaHJlZVxyXG4gICAgICByZXR1cm4gbmV3VGltZVN0cjtcclxuICAgIH1cclxuICAgIGRlbEZ1biAoKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpc1xyXG4gICAgICB0aGlzLmRlbEl0ZW0uc3RhdHVzID0gLTFcclxuICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCdtZWV0aW5nL3dlY2hhdC91cGRhdGVNZWV0aW5nQXBpLmpzb24nLCB0aGlzLmRlbEl0ZW0sIHt9KVxyXG4gICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgc2VsZi5nZXRMaXN0KClcclxuICAgICAgICBzZWxmLiRhcHBseSgpXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgICB0b2FzdCAoZXJyb3IpIHtcclxuICAgICAgdGhpcy5zaG93VG9hc3QgPSB0cnVlXHJcbiAgICAgIHRoaXMuZXJyb3IgPSBlcnJvclxyXG4gICAgICB2YXIgdGhhdCA9IHRoaXNcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGhhdC5zaG93VG9hc3QgPSBmYWxzZVxyXG4gICAgICB9LCAyMDAwKTtcclxuICAgIH1cclxuICAgIG1ldGhvZHMgPSB7XHJcbiAgICAgIC8vIOe8lui+kVxyXG4gICAgICBlZGl0IChlKSB7XHJcbiAgICAgICAgaWYgKGUudGFyZ2V0LmRhdGFzZXQuaXRlbS5jcmVhdGVVc2VyLnNwbGl0KCdfJylbMV0gIT09IHRoaXMudXNlci5pZCkge1xyXG4gICAgICAgICAgdGhpcy50b2FzdCgn5oKo5LiN5piv6K+l5Lya6K6u55qE5Yib5bu66ICFLCDkuI3og73nvJbovpEnKVxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMudXNlciwgJ3VzZXJ1c2VyJylcclxuICAgICAgICBjb25zb2xlLmxvZyhlLnRhcmdldC5kYXRhc2V0Lml0ZW0uc3RhcnREYXRlLnJlcGxhY2UoLy0vZywgXCIvXCIpLCAnZS50YXJnZXQuZGF0YXNldC5pdGVtLnN0YXJ0RGF0ZScpXHJcbiAgICAgICAgaWYgKG5ldyBEYXRlKGUudGFyZ2V0LmRhdGFzZXQuaXRlbS5zdGFydERhdGUucmVwbGFjZSgvLS9nLCBcIi9cIikpLmdldFRpbWUoKSA8IG5ldyBEYXRlKCkuZ2V0VGltZSgpKSB7XHJcbiAgICAgICAgICB0aGlzLnRvYXN0KCfor6XkvJrorq7lt7Lnu4/lvIDlp4ssIOS4jeiDvee8lui+kScpXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICB1cmw6ICcvcGFnZXMvZWRpdEFkZHJlc3M/aXRlbT0nICsgSlNPTi5zdHJpbmdpZnkoZS50YXJnZXQuZGF0YXNldC5pdGVtKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICAvLyDliKDpmaRcclxuICAgICAgZGVsIChlKSB7XHJcbiAgICAgICAgaWYgKGUudGFyZ2V0LmRhdGFzZXQuaXRlbS5jcmVhdGVVc2VyLnNwbGl0KCdfJylbMV0gIT09IHRoaXMudXNlci5pZCkge1xyXG4gICAgICAgICAgdGhpcy50b2FzdCgn5oKo5LiN5piv6K+l5Lya6K6u55qE5Yib5bu66ICFLCDkuI3og73nvJbovpEnKVxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuZXcgRGF0ZShlLnRhcmdldC5kYXRhc2V0Lml0ZW0uc3RhcnREYXRlLnJlcGxhY2UoLy0vZywgXCIvXCIpKS5nZXRUaW1lKCkgPCBuZXcgRGF0ZSgpLmdldFRpbWUoKSkge1xyXG4gICAgICAgICAgdGhpcy50b2FzdCgn6K+l5Lya6K6u5bey57uP5byA5aeLLCDkuI3og73liKDpmaQnKVxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZGVsSXRlbSA9IGUudGFyZ2V0LmRhdGFzZXQuaXRlbVxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpc1xyXG4gICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICB0aXRsZTon5o+Q56S6JyxcclxuICAgICAgICAgIGNvbnRlbnQ6J+aYr+WQpuehruiupOWIoOmZpOW9k+WJjeS8muiurj8nLFxyXG4gICAgICAgICAgY2FuY2VsVGV4dDon5Y+W5raIJyxcclxuICAgICAgICAgIGNvbmZpcm1UZXh0Oifnoa7orqQnLFxyXG4gICAgICAgICAgc3VjY2VzczpmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXMuY29uZmlybSkge1xyXG4gICAgICAgICAgICAgIHNlbGYuZGVsRnVuKClcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmYWlsOmZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIG9uTG9hZCAoKSB7XHJcbiAgICAgIFxyXG4gICAgfVxyXG4gICAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgICAgdGhpcy5nZXRMaXN0KClcclxuICAgICAgdGhpcy5zaG93VG9hc3QgPSBmYWxzZVxyXG4gICAgICAvLyDmr4/mrKHpg73liLfmlrBcclxuICAgIH1cclxuICB9XHJcbiJdfQ==