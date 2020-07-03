"use strict";

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
/* global wx */


var GitSample = function (_wepy$page) {
  _inherits(GitSample, _wepy$page);

  function GitSample() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, GitSample);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = GitSample.__proto__ || Object.getPrototypeOf(GitSample)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarTitleText: "样品申领",
      navigationBarBackgroundColor: "#fff"
    }, _this.components = {}, _this.data = {
      list: [],
      userInfo: []
    }, _this.methods = {
      toFrom: function toFrom(e) {
        console.log("e", e);
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
          url: '/pages/form?id=' + id
        });
      },

      // 我的样品申领
      mySamples: function mySamples() {
        wx.navigateTo({
          url: "/pages/mysample"
        });
      },
      goDetails: function goDetails(e) {
        console.log("e11", e);
        var id = e.currentTarget.dataset.id;
        console.log(id);
        wx.navigateTo({
          url: '/pages/sampleDetail?id=' + id
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(GitSample, [{
    key: "onLoad",
    value: function onLoad() {}
  }, {
    key: "init",
    value: function init() {
      var _this2 = this;

      this.fetchDataPromise("user/userInfo.json", {}).then(function (data) {
        console.log("6677", data);
        _this2.userInfo = data;
        _this2.$apply();
      }).catch(function (error) {});
    }
  }, {
    key: "whenAppReadyShow",
    value: function whenAppReadyShow() {
      var _this3 = this;

      this.fetchDataPromise("wx/specimen/querySpecimenApi.json", {}).then(function (data) {
        console.log("11 ", data);
        _this3.list = data.list;
        _this3.init();
        _this3.$apply();
      }).catch(function (error) {});
    }
  }]);

  return GitSample;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(GitSample , 'pages/meSample'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lU2FtcGxlLmpzIl0sIm5hbWVzIjpbIkdpdFNhbXBsZSIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwiY29tcG9uZW50cyIsImRhdGEiLCJsaXN0IiwidXNlckluZm8iLCJtZXRob2RzIiwidG9Gcm9tIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJpZCIsImN1cnJlbnRUYXJnZXQiLCJkYXRhc2V0Iiwid3giLCJuYXZpZ2F0ZVRvIiwidXJsIiwibXlTYW1wbGVzIiwiZ29EZXRhaWxzIiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCIkYXBwbHkiLCJjYXRjaCIsImVycm9yIiwiaW5pdCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBRkE7OztJQUdxQkEsUzs7Ozs7Ozs7Ozs7Ozs7NExBQ25CQyxNLEdBQVMsQ0FBQ0MsY0FBRCxDLFFBQ1RDLE0sR0FBUztBQUNQQyw4QkFBd0IsTUFEakI7QUFFUEMsb0NBQThCO0FBRnZCLEssUUFJVEMsVSxHQUFhLEUsUUFDYkMsSSxHQUFPO0FBQ0xDLFlBQUssRUFEQTtBQUVMQyxnQkFBUztBQUZKLEssUUFJUEMsTyxHQUFVO0FBQ1JDLFlBRFEsa0JBQ0RDLENBREMsRUFDQztBQUNQQyxnQkFBUUMsR0FBUixDQUFZLEdBQVosRUFBZ0JGLENBQWhCO0FBQ0EsWUFBSUcsS0FBS0gsRUFBRUksYUFBRixDQUFnQkMsT0FBaEIsQ0FBd0JGLEVBQWpDO0FBQ0FHLFdBQUdDLFVBQUgsQ0FBYztBQUNWQyxlQUFLLG9CQUFvQkw7QUFEZixTQUFkO0FBR0QsT0FQTzs7QUFRTDtBQUNITSxlQVRRLHVCQVNHO0FBQ1ZILFdBQUdDLFVBQUgsQ0FBYztBQUNYQyxlQUFLO0FBRE0sU0FBZDtBQUdBLE9BYk87QUFjVEUsZUFkUyxxQkFjQ1YsQ0FkRCxFQWNHO0FBQ1RDLGdCQUFRQyxHQUFSLENBQVksS0FBWixFQUFrQkYsQ0FBbEI7QUFDRixZQUFJRyxLQUFLSCxFQUFFSSxhQUFGLENBQWdCQyxPQUFoQixDQUF3QkYsRUFBakM7QUFDQUYsZ0JBQVFDLEdBQVIsQ0FBWUMsRUFBWjtBQUNDRyxXQUFHQyxVQUFILENBQWM7QUFDWEMsZUFBSyw0QkFBNEJMO0FBRHRCLFNBQWQ7QUFJRDtBQXRCUSxLOzs7Ozs2QkF3QkYsQ0FDUDs7OzJCQUNNO0FBQUE7O0FBQ0gsV0FBS1EsZ0JBQUwsQ0FBc0Isb0JBQXRCLEVBQTRDLEVBQTVDLEVBQ0dDLElBREgsQ0FDUSxnQkFBUTtBQUNaWCxnQkFBUUMsR0FBUixDQUFZLE1BQVosRUFBbUJQLElBQW5CO0FBQ0EsZUFBS0UsUUFBTCxHQUFnQkYsSUFBaEI7QUFDQSxlQUFLa0IsTUFBTDtBQUNELE9BTEgsRUFNR0MsS0FOSCxDQU1TLFVBQVNDLEtBQVQsRUFBZ0IsQ0FBRSxDQU4zQjtBQU9EOzs7dUNBQ2dCO0FBQUE7O0FBQ2pCLFdBQUtKLGdCQUFMLENBQXNCLG1DQUF0QixFQUEyRCxFQUEzRCxFQUNHQyxJQURILENBQ1EsZ0JBQVE7QUFDWlgsZ0JBQVFDLEdBQVIsQ0FBWSxLQUFaLEVBQW1CUCxJQUFuQjtBQUNBLGVBQUtDLElBQUwsR0FBWUQsS0FBS0MsSUFBakI7QUFDQSxlQUFLb0IsSUFBTDtBQUNBLGVBQUtILE1BQUw7QUFDRCxPQU5ILEVBT0dDLEtBUEgsQ0FPUyxVQUFTQyxLQUFULEVBQWdCLENBQUUsQ0FQM0I7QUFVRDs7OztFQXpEb0NFLGVBQUtDLEk7O2tCQUF2QjlCLFMiLCJmaWxlIjoibWVTYW1wbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qIGdsb2JhbCB3eCAqL1xuaW1wb3J0IHdlcHkgZnJvbSBcIndlcHlcIjtcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSBcIi4uL21peGlucy9wYWdlXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHaXRTYW1wbGUgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xuICBtaXhpbnMgPSBbUGFnZU1peGluXTtcbiAgY29uZmlnID0ge1xuICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6IFwi5qC35ZOB55Sz6aKGXCIsXG4gICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcbiAgfTtcbiAgY29tcG9uZW50cyA9IHt9O1xuICBkYXRhID0ge1xuICAgIGxpc3Q6W10sXG4gICAgdXNlckluZm86W11cbiAgfTtcbiAgbWV0aG9kcyA9IHtcbiAgICB0b0Zyb20oZSl7XG4gICAgICBjb25zb2xlLmxvZyhcImVcIixlKVxuICAgICAgbGV0IGlkID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaWQ7XG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgICB1cmw6ICcvcGFnZXMvZm9ybT9pZD0nICsgaWRcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgICAgLy8g5oiR55qE5qC35ZOB55Sz6aKGXG4gICAgbXlTYW1wbGVzKCl7XG4gICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICB1cmw6IFwiL3BhZ2VzL215c2FtcGxlXCJcbiAgICAgIH0pO1xuICAgIH0sXG4gICBnb0RldGFpbHMoZSl7XG4gICAgICBjb25zb2xlLmxvZyhcImUxMVwiLGUpXG4gICAgbGV0IGlkID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaWQ7XG4gICAgY29uc29sZS5sb2coaWQpXG4gICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICB1cmw6ICcvcGFnZXMvc2FtcGxlRGV0YWlsP2lkPScgKyBpZFxuICAgICB9KTtcbiAgICBcbiAgIH1cbiAgfVxuICBvbkxvYWQoKXtcbiAgfVxuICAgaW5pdCgpe1xuICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKFwidXNlci91c2VySW5mby5qc29uXCIsIHt9KVxuICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIjY2NzdcIixkYXRhKVxuICAgICAgICAgIHRoaXMudXNlckluZm8gPSBkYXRhXG4gICAgICAgICAgdGhpcy4kYXBwbHkoKVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHt9KTtcbiAgICB9XG4gIHdoZW5BcHBSZWFkeVNob3coKSB7XG4gICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKFwid3gvc3BlY2ltZW4vcXVlcnlTcGVjaW1lbkFwaS5qc29uXCIsIHt9KVxuICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiMTEgXCIsIGRhdGEpO1xuICAgICAgICB0aGlzLmxpc3QgPSBkYXRhLmxpc3Q7XG4gICAgICAgIHRoaXMuaW5pdCgpXG4gICAgICAgIHRoaXMuJGFwcGx5KClcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHt9KTtcbiAgICAgIFxuICAgICAgXG4gIH1cbn1cbiJdfQ==