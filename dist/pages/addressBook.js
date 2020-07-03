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
                console.log(e.target.dataset.item.startDate.replace(/-/g, '/'), 'e.target.dataset.item.startDate');
                if (new Date(e.target.dataset.item.startDate.replace(/-/g, '/')).getTime() < new Date().getTime()) {
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
                if (new Date(e.target.dataset.item.startDate.replace(/-/g, '/')).getTime() < new Date().getTime()) {
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
                    obj.edit = !(new Date(obj.startDate.replace(/-/g, '/')).getTime() < new Date().getTime());
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkZHJlc3NCb29rLmpzIl0sIm5hbWVzIjpbIkFkZHJlc3NCb29rIiwibWl4aW5zIiwiUGFnZU1peGluIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJjb21wb25lbnRzIiwiZGF0YSIsImxpc3QiLCJkZWxJdGVtIiwic2hvd1RvYXN0IiwiZXJyb3IiLCJ1c2VyIiwicGFnZVNpemUiLCJ0b3RhbFBhZ2UiLCJpbmRleFBhZ2UiLCJtZXRob2RzIiwiZWRpdCIsImUiLCJ0YXJnZXQiLCJkYXRhc2V0IiwiaXRlbSIsImNyZWF0ZVVzZXIiLCJzcGxpdCIsImlkIiwidG9hc3QiLCJjb25zb2xlIiwibG9nIiwic3RhcnREYXRlIiwicmVwbGFjZSIsIkRhdGUiLCJnZXRUaW1lIiwid3giLCJuYXZpZ2F0ZVRvIiwidXJsIiwiSlNPTiIsInN0cmluZ2lmeSIsImRlbCIsInNlbGYiLCJzaG93TW9kYWwiLCJ0aXRsZSIsImNvbnRlbnQiLCJjYW5jZWxUZXh0IiwiY29uZmlybVRleHQiLCJzdWNjZXNzIiwicmVzIiwiY29uZmlybSIsImRlbEZ1biIsImZhaWwiLCJlcnIiLCJnZXRMaXN0IiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJtYXAiLCJvYmoiLCJjcmVhdGVEYXRlIiwidGltZUZvcm1hdCIsInN0YXJ0IiwiZW5kIiwiZW5kRGF0ZSIsInF1ZXJ5UGFyYW0iLCJjb25jYXQiLCIkYXBwbHkiLCJ0aW1lU3RyIiwiZGF0YU9uZSIsImRhdGFUd28iLCJkYXRhVGhyZWUiLCJuZXdUaW1lU3RyIiwic3RhdHVzIiwidGhhdCIsInNldFRpbWVvdXQiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDRTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFDcUJBLFc7Ozs7Ozs7Ozs7Ozs7O29NQUNuQkMsTSxHQUFTLENBQUNDLGNBQUQsQyxRQUNUQyxNLEdBQVM7QUFDTEMsb0NBQXdCLE1BRG5C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QUFVRCxRQUFReEMsS0FBUixDQUFjLEdBQWQsRUFBbUIsQ0FBbkIsQ0FBZDtBQUNBLGdCQUFJMEMsVUFBVUYsUUFBUXhDLEtBQVIsQ0FBYyxHQUFkLEVBQW1CLENBQW5CLENBQWQ7QUFDQSxnQkFBSTJDLFlBQVlELFFBQVExQyxLQUFSLENBQWMsR0FBZCxFQUFtQixDQUFuQixDQUFoQjtBQUNBLGdCQUFJNEMsYUFBYUgsVUFBVSxHQUFWLEdBQWdCRSxTQUFqQztBQUNBLG1CQUFPQyxVQUFQO0FBQ0g7OztpQ0FDUztBQUNOLGdCQUFJN0IsT0FBTyxJQUFYO0FBQ0EsaUJBQUs3QixPQUFMLENBQWEyRCxNQUFiLEdBQXNCLENBQUMsQ0FBdkI7QUFDQSxpQkFBS2pCLGdCQUFMLENBQXNCLHNDQUF0QixFQUE4RCxLQUFLMUMsT0FBbkUsRUFBNEUsRUFBNUUsRUFDSzJDLElBREwsQ0FDVSxVQUFTN0MsSUFBVCxFQUFlO0FBQ2pCK0IscUJBQUtZLE9BQUw7QUFDQVoscUJBQUt3QixNQUFMO0FBQ0gsYUFKTDtBQUtIOzs7OEJBQ01uRCxLLEVBQU87QUFDVixpQkFBS0QsU0FBTCxHQUFpQixJQUFqQjtBQUNBLGlCQUFLQyxLQUFMLEdBQWFBLEtBQWI7QUFDQSxnQkFBSTBELE9BQU8sSUFBWDtBQUNBQyx1QkFBVyxZQUFNO0FBQ2JELHFCQUFLM0QsU0FBTCxHQUFpQixLQUFqQjtBQUNILGFBRkQsRUFFRyxJQUZIO0FBR0g7OztpQ0E4Q1MsQ0FFVDs7OzJDQUNrQjtBQUNmLGlCQUFLd0MsT0FBTDtBQUNBLGlCQUFLeEMsU0FBTCxHQUFpQixLQUFqQjtBQUNBO0FBQ0g7Ozs7RUE5SHNDNkQsZUFBS0MsSTs7a0JBQXpCeEUsVyIsImZpbGUiOiJhZGRyZXNzQm9vay5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4gIGltcG9ydCB3ZXB5IGZyb20gJ3dlcHknO1xyXG4gIGltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vbWl4aW5zL3BhZ2UnO1xyXG4gIGV4cG9ydCBkZWZhdWx0IGNsYXNzIEFkZHJlc3NCb29rIGV4dGVuZHMgd2VweS5wYWdlIHtcclxuICAgIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gICAgY29uZmlnID0ge1xyXG4gICAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfkvJrorq7nrqHnkIYnLFxyXG4gICAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJ1xyXG4gICAgfTtcclxuICAgIGNvbXBvbmVudHMgPSB7XHJcbiAgICB9O1xyXG4gICAgZGF0YSA9IHtcclxuICAgICAgICBsaXN0OiBbXSxcclxuICAgICAgICBkZWxJdGVtOiBudWxsLFxyXG4gICAgICAgIHNob3dUb2FzdDogZmFsc2UsXHJcbiAgICAgICAgZXJyb3I6ICcnLFxyXG4gICAgICAgIHVzZXI6IHRoaXMudXNlcixcclxuICAgICAgICBwYWdlU2l6ZTogMTAsXHJcbiAgICAgICAgdG90YWxQYWdlOiAwLFxyXG4gICAgICAgIGluZGV4UGFnZTogMFxyXG4gICAgfTtcclxuICAgIG9uUmVhY2hCb3R0b20oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5kZXhQYWdlID49IHRoaXMudG90YWxQYWdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudG9hc3QoJ+aXoOabtOWkmuaVsOaNricpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW5kZXhQYWdlKys7XHJcbiAgICAgICAgLy8g5LiL5ouJ6Kem5bqV77yM5YWI5Yik5pat5piv5ZCm5pyJ6K+35rGC5q2j5Zyo6L+b6KGM5LitXHJcbiAgICAgICAgLy8g5Lul5Y+K5qOA5p+l5b2T5YmN6K+35rGC6aG15pWw5piv5LiN5piv5bCP5LqO5pWw5o2u5oC76aG15pWw77yM5aaC56ym5ZCI5p2h5Lu277yM5YiZ5Y+R6YCB6K+35rGCXHJcbiAgICAgICAgdGhpcy5nZXRMaXN0KCk7XHJcbiAgICB9XHJcbiAgICAgIC8vIOiOt+WPluWIl+ihqFxyXG4gICAgZ2V0TGlzdCAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuZmV0Y2hEYXRhUHJvbWlzZSgnbWVldGluZy93ZWNoYXQvcXVlcnlNZWV0aW5nQXBpLmpzb24nLCB7XHJcbiAgICAgICAgICAgIHBhZ2VTaXplOiB0aGlzLnBhZ2VTaXplLFxyXG4gICAgICAgICAgICBpbmRleFBhZ2U6IHRoaXMuaW5kZXhQYWdlXHJcbiAgICAgICAgfSwge30pXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYubGlzdCk7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmxpc3QgPSBkYXRhLmxpc3QubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBvYmogPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIG9iai5jcmVhdGVEYXRlID0gc2VsZi50aW1lRm9ybWF0KG9iai5jcmVhdGVEYXRlKTtcclxuICAgICAgICAgICAgICAgICAgICBvYmouc3RhcnQgPSBvYmouc3RhcnREYXRlLnNwbGl0KCcgJylbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLmVuZCA9IG9iai5lbmREYXRlLnNwbGl0KCcgJylbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLmVkaXQgPSAhKG5ldyBEYXRlKG9iai5zdGFydERhdGUucmVwbGFjZSgvLS9nLCAnLycpKS5nZXRUaW1lKCkgPCBuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgc2VsZi50b3RhbFBhZ2UgPSBkYXRhLnF1ZXJ5UGFyYW0udG90YWxQYWdlO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5saXN0ID0gc2VsZi5saXN0LmNvbmNhdChkYXRhLmxpc3QpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICB0aW1lRm9ybWF0ICh0aW1lU3RyKSB7XHJcbiAgICAgICAgdmFyIGRhdGFPbmUgPSB0aW1lU3RyLnNwbGl0KCdUJylbMF07XHJcbiAgICAgICAgdmFyIGRhdGFUd28gPSB0aW1lU3RyLnNwbGl0KCdUJylbMV07XHJcbiAgICAgICAgdmFyIGRhdGFUaHJlZSA9IGRhdGFUd28uc3BsaXQoJysnKVswXTtcclxuICAgICAgICB2YXIgbmV3VGltZVN0ciA9IGRhdGFPbmUgKyAnICcgKyBkYXRhVGhyZWU7XHJcbiAgICAgICAgcmV0dXJuIG5ld1RpbWVTdHI7XHJcbiAgICB9XHJcbiAgICBkZWxGdW4gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmRlbEl0ZW0uc3RhdHVzID0gLTE7XHJcbiAgICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCdtZWV0aW5nL3dlY2hhdC91cGRhdGVNZWV0aW5nQXBpLmpzb24nLCB0aGlzLmRlbEl0ZW0sIHt9KVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmdldExpc3QoKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgdG9hc3QgKGVycm9yKSB7XHJcbiAgICAgICAgdGhpcy5zaG93VG9hc3QgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZXJyb3IgPSBlcnJvcjtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoYXQuc2hvd1RvYXN0ID0gZmFsc2U7XHJcbiAgICAgICAgfSwgMjAwMCk7XHJcbiAgICB9XHJcbiAgICBtZXRob2RzID0ge1xyXG4gICAgICAgIC8vIOe8lui+kVxyXG4gICAgICAgIGVkaXQgKGUpIHtcclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0LmRhdGFzZXQuaXRlbS5jcmVhdGVVc2VyLnNwbGl0KCdfJylbMV0gIT09IHRoaXMudXNlci5pZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2FzdCgn5oKo5LiN5piv6K+l5Lya6K6u55qE5Yib5bu66ICFLCDkuI3og73nvJbovpEnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnVzZXIsICd1c2VydXNlcicpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlLnRhcmdldC5kYXRhc2V0Lml0ZW0uc3RhcnREYXRlLnJlcGxhY2UoLy0vZywgJy8nKSwgJ2UudGFyZ2V0LmRhdGFzZXQuaXRlbS5zdGFydERhdGUnKTtcclxuICAgICAgICAgICAgaWYgKG5ldyBEYXRlKGUudGFyZ2V0LmRhdGFzZXQuaXRlbS5zdGFydERhdGUucmVwbGFjZSgvLS9nLCAnLycpKS5nZXRUaW1lKCkgPCBuZXcgRGF0ZSgpLmdldFRpbWUoKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2FzdCgn6K+l5Lya6K6u5bey57uP5byA5aeLLCDkuI3og73nvJbovpEnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9wYWdlcy9lZGl0QWRkcmVzcz9pdGVtPScgKyBKU09OLnN0cmluZ2lmeShlLnRhcmdldC5kYXRhc2V0Lml0ZW0pXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8g5Yig6ZmkXHJcbiAgICAgICAgZGVsIChlKSB7XHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldC5kYXRhc2V0Lml0ZW0uY3JlYXRlVXNlci5zcGxpdCgnXycpWzFdICE9PSB0aGlzLnVzZXIuaWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG9hc3QoJ+aCqOS4jeaYr+ivpeS8muiurueahOWIm+W7uuiAhSwg5LiN6IO957yW6L6RJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5ldyBEYXRlKGUudGFyZ2V0LmRhdGFzZXQuaXRlbS5zdGFydERhdGUucmVwbGFjZSgvLS9nLCAnLycpKS5nZXRUaW1lKCkgPCBuZXcgRGF0ZSgpLmdldFRpbWUoKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2FzdCgn6K+l5Lya6K6u5bey57uP5byA5aeLLCDkuI3og73liKDpmaQnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRlbEl0ZW0gPSBlLnRhcmdldC5kYXRhc2V0Lml0ZW07XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICfmmK/lkKbnoa7orqTliKDpmaTlvZPliY3kvJrorq4/JyxcclxuICAgICAgICAgICAgICAgIGNhbmNlbFRleHQ6ICflj5bmtognLFxyXG4gICAgICAgICAgICAgICAgY29uZmlybVRleHQ6ICfnoa7orqQnLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuY29uZmlybSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmRlbEZ1bigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG9uTG9hZCAoKSB7XHJcbiAgXHJcbiAgICB9XHJcbiAgICB3aGVuQXBwUmVhZHlTaG93KCkge1xyXG4gICAgICAgIHRoaXMuZ2V0TGlzdCgpO1xyXG4gICAgICAgIHRoaXMuc2hvd1RvYXN0ID0gZmFsc2U7XHJcbiAgICAgICAgLy8g5q+P5qyh6YO95Yi35pawXHJcbiAgICB9XHJcbiAgfVxyXG4iXX0=