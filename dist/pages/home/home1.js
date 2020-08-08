"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _page = require('./../../mixins/page.js');

var _page2 = _interopRequireDefault(_page);

var _common = require('./../../components/common.js');

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* global wx */


var Course = function (_wepy$page) {
  _inherits(Course, _wepy$page);

  function Course() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Course);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Course.__proto__ || Object.getPrototypeOf(Course)).call.apply(_ref, [this].concat(args))), _this), _this.mixins = [_page2.default], _this.config = {
      navigationBarBackgroundColor: "#fff"
    }, _this.components = {
      common: _common2.default
    }, _this.data = {
      loadUser: true, // 需要登录信息
      height: "",
      imgUrls: [1, 2],
      current: 0,
      isShow: false,
      branchs: [],
      userInfo: {
        isNewUser: true
      },
      pageFirst: {}
    }, _this.methods = {
      buy: function buy() {
        wx.navigateTo({
          url: "/pages/home/buy?branchId=" + this.pageFirst.coachInfo.branchs[0].id
        });
      },
      corse: function corse() {
        wx.navigateTo({
          url: "/pages/home/appointment"
        });
      },
      leftFun: function leftFun() {
        if (this.current === 0) this.current = this.imgUrls.length - 1;else this.current--;
      },
      rightFun: function rightFun() {
        if (this.current === this.imgUrls.length - 1) this.current = 0;else this.current++;
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Course, [{
    key: "whenAppReadyShow",
    value: function whenAppReadyShow(options) {
      this.circle();

      this.getPageFirst();
    }
  }, {
    key: "getPageFirst",
    value: function getPageFirst() {
      var that = this;
      wx.getLocation({
        type: "wgs84",
        success: function success(res) {
          var latitude = res.latitude;
          var longitude = res.longitude;
          wx.showLoading({
            title: "加载中"
          });
          that.getUserInfo(function (user) {
            that.fetchDataPromise("page/first.json", {
              action: user.isNewUser ? "info" : "coach",
              x: latitude,
              y: longitude
            }).then(function (data) {
              that.pageFirst = data;
              data.user = user;
              wx.hideLoading();
              that.$broadcast("index-broadcast", data);
            });
          });
        }
      });
    }
  }, {
    key: "getUserInfo",
    value: function getUserInfo(callBack) {
      var that = this;
      this.fetchDataPromise("user/userInfo.json", {}).then(function (data) {
        that.userInfo = data;
        that.userInfo.isNewUser = true;
        wx.setStorage({
          key: "userInfo",
          data: JSON.stringify(data)
        });
        callBack(data);
        that.$apply();
      });
    }
  }, {
    key: "run",
    value: function run(c, w, h, ctx1) {
      //c是圆环进度百分比   w，h是圆心的坐标
      var that = this;
      var num = 2 * Math.PI / 100 * c - 0.5 * Math.PI;
      //圆环的绘制
      ctx1.setLineWidth(6);
      ctx1.setStrokeStyle("#d2d2d2");
      ctx1.setLineCap("round");
      ctx1.stroke();
      ctx1.draw();
      ctx1.arc(w, h, w - 8, -0.5 * Math.PI, num); //绘制的动作
      ctx1.setStrokeStyle("#e02510"); //圆环线条的颜色
      ctx1.setLineWidth("4"); //圆环的粗细
      ctx1.setLineCap("butt"); //圆环结束断点的样式  butt为平直边缘 round为圆形线帽  square为正方形线帽
      ctx1.stroke();
      ctx1.draw();
    }
  }, {
    key: "canvasTap",
    value: function canvasTap(start, w, h, ctx1) {
      this.run(50, w, h, ctx1);
    }
  }, {
    key: "circle",
    value: function circle() {
      var that = this;
      var ctx1 = wx.createCanvasContext("runCanvas");
      wx.createSelectorQuery().select("#runCanvas").boundingClientRect(function (rect) {
        //监听canvas的宽高
        console.log(rect, "111");
        var w = parseInt(rect.width / 2); //获取canvas宽的的一半
        var h = parseInt(rect.height / 2); //获取canvas高的一半，
        that.canvasTap(0, w, h, ctx1);
      }).exec();
    }
  }, {
    key: "onShow",
    value: function onShow() {
      var _this2 = this;

      wx.getSystemInfo({
        success: function success(res) {
          _this2.height = res.statusBarHeight;
        }
      });
      var that = this;
      wx.getStorage({
        key: "home",
        success: function success(res) {
          that.isShow = true;
        }
      });
    }
  }]);

  return Course;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Course , 'pages/home/home1'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUxLmpzIl0sIm5hbWVzIjpbIkNvdXJzZSIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJjb21wb25lbnRzIiwiY29tbW9uIiwiZGF0YSIsImxvYWRVc2VyIiwiaGVpZ2h0IiwiaW1nVXJscyIsImN1cnJlbnQiLCJpc1Nob3ciLCJicmFuY2hzIiwidXNlckluZm8iLCJpc05ld1VzZXIiLCJwYWdlRmlyc3QiLCJtZXRob2RzIiwiYnV5Iiwid3giLCJuYXZpZ2F0ZVRvIiwidXJsIiwiY29hY2hJbmZvIiwiaWQiLCJjb3JzZSIsImxlZnRGdW4iLCJsZW5ndGgiLCJyaWdodEZ1biIsIm9wdGlvbnMiLCJjaXJjbGUiLCJnZXRQYWdlRmlyc3QiLCJ0aGF0IiwiZ2V0TG9jYXRpb24iLCJ0eXBlIiwic3VjY2VzcyIsInJlcyIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwic2hvd0xvYWRpbmciLCJ0aXRsZSIsImdldFVzZXJJbmZvIiwiZmV0Y2hEYXRhUHJvbWlzZSIsImFjdGlvbiIsInVzZXIiLCJ4IiwieSIsInRoZW4iLCJoaWRlTG9hZGluZyIsIiRicm9hZGNhc3QiLCJjYWxsQmFjayIsInNldFN0b3JhZ2UiLCJrZXkiLCJKU09OIiwic3RyaW5naWZ5IiwiJGFwcGx5IiwiYyIsInciLCJoIiwiY3R4MSIsIm51bSIsIk1hdGgiLCJQSSIsInNldExpbmVXaWR0aCIsInNldFN0cm9rZVN0eWxlIiwic2V0TGluZUNhcCIsInN0cm9rZSIsImRyYXciLCJhcmMiLCJzdGFydCIsInJ1biIsImNyZWF0ZUNhbnZhc0NvbnRleHQiLCJjcmVhdGVTZWxlY3RvclF1ZXJ5Iiwic2VsZWN0IiwiYm91bmRpbmdDbGllbnRSZWN0IiwicmVjdCIsImNvbnNvbGUiLCJsb2ciLCJwYXJzZUludCIsIndpZHRoIiwiY2FudmFzVGFwIiwiZXhlYyIsImdldFN5c3RlbUluZm8iLCJzdGF0dXNCYXJIZWlnaHQiLCJnZXRTdG9y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QjtBQUNBLFlBQUlsQixJQUFJcUIsU0FBU0gsS0FBS0ksS0FBTCxHQUFhLENBQXRCLENBQVIsQ0FIaUMsQ0FHQztBQUNsQyxZQUFJckIsSUFBSW9CLFNBQVNILEtBQUtqRSxNQUFMLEdBQWMsQ0FBdkIsQ0FBUixDQUppQyxDQUlFO0FBQ25Dc0IsYUFBS2dELFNBQUwsQ0FBZSxDQUFmLEVBQWtCdkIsQ0FBbEIsRUFBcUJDLENBQXJCLEVBQXdCQyxJQUF4QjtBQUNELE9BVEgsRUFVR3NCLElBVkg7QUFXRDs7OzZCQUNRO0FBQUE7O0FBQ1A3RCxTQUFHOEQsYUFBSCxDQUFpQjtBQUNmL0MsaUJBQVMsc0JBQU87QUFDZCxpQkFBS3pCLE1BQUwsR0FBYzBCLElBQUkrQyxlQUFsQjtBQUNEO0FBSGMsT0FBakI7QUFLQSxVQUFJbkQsT0FBTyxJQUFYO0FBQ0FaLFNBQUdnRSxVQUFILENBQWM7QUFDWmhDLGFBQUssTUFETztBQUVaakIsZUFGWSxtQkFFSkMsR0FGSSxFQUVDO0FBQ1hKLGVBQUtuQixNQUFMLEdBQWMsSUFBZDtBQUNEO0FBSlcsT0FBZDtBQU1EOzs7O0VBdElpQ3dFLGVBQUtDLEk7O2tCQUFwQnJGLE0iLCJmaWxlIjoiaG9tZTEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qIGdsb2JhbCB3eCAqL1xuaW1wb3J0IHdlcHkgZnJvbSBcIndlcHlcIjtcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSBcIi4uLy4uL21peGlucy9wYWdlXCI7XG5pbXBvcnQgY29tbW9uIGZyb20gXCIuLi8uLi9jb21wb25lbnRzL2NvbW1vblwiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ291cnNlIGV4dGVuZHMgd2VweS5wYWdlIHtcbiAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XG4gIGNvbmZpZyA9IHtcbiAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxuICB9O1xuICBjb21wb25lbnRzID0ge1xuICAgIGNvbW1vblxuICB9O1xuICBkYXRhID0ge1xuICAgIGxvYWRVc2VyOiB0cnVlLCAvLyDpnIDopoHnmbvlvZXkv6Hmga9cbiAgICBoZWlnaHQ6IFwiXCIsXG4gICAgaW1nVXJsczogWzEsIDJdLFxuICAgIGN1cnJlbnQ6IDAsXG4gICAgaXNTaG93OiBmYWxzZSxcbiAgICBicmFuY2hzOiBbXSxcbiAgICB1c2VySW5mbzoge1xuICAgICAgaXNOZXdVc2VyOiB0cnVlXG4gICAgfSxcbiAgICBwYWdlRmlyc3Q6IHt9XG4gIH07XG4gIHdoZW5BcHBSZWFkeVNob3cob3B0aW9ucykge1xuICAgIHRoaXMuY2lyY2xlKCk7XG5cbiAgICB0aGlzLmdldFBhZ2VGaXJzdCgpO1xuICB9XG4gIG1ldGhvZHMgPSB7XG4gICAgYnV5KCkge1xuICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgIHVybDpcbiAgICAgICAgICBcIi9wYWdlcy9ob21lL2J1eT9icmFuY2hJZD1cIiArIHRoaXMucGFnZUZpcnN0LmNvYWNoSW5mby5icmFuY2hzWzBdLmlkXG4gICAgICB9KTtcbiAgICB9LFxuICAgIGNvcnNlKCkge1xuICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgIHVybDogXCIvcGFnZXMvaG9tZS9hcHBvaW50bWVudFwiXG4gICAgICB9KTtcbiAgICB9LFxuICAgIGxlZnRGdW4oKSB7XG4gICAgICBpZiAodGhpcy5jdXJyZW50ID09PSAwKSB0aGlzLmN1cnJlbnQgPSB0aGlzLmltZ1VybHMubGVuZ3RoIC0gMTtcbiAgICAgIGVsc2UgdGhpcy5jdXJyZW50LS07XG4gICAgfSxcbiAgICByaWdodEZ1bigpIHtcbiAgICAgIGlmICh0aGlzLmN1cnJlbnQgPT09IHRoaXMuaW1nVXJscy5sZW5ndGggLSAxKSB0aGlzLmN1cnJlbnQgPSAwO1xuICAgICAgZWxzZSB0aGlzLmN1cnJlbnQrKztcbiAgICB9XG4gIH07XG4gIGdldFBhZ2VGaXJzdCgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgd3guZ2V0TG9jYXRpb24oe1xuICAgICAgdHlwZTogXCJ3Z3M4NFwiLFxuICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgY29uc3QgbGF0aXR1ZGUgPSByZXMubGF0aXR1ZGU7XG4gICAgICAgIGNvbnN0IGxvbmdpdHVkZSA9IHJlcy5sb25naXR1ZGU7XG4gICAgICAgIHd4LnNob3dMb2FkaW5nKHtcbiAgICAgICAgICB0aXRsZTogXCLliqDovb3kuK1cIlxuICAgICAgICB9KTtcbiAgICAgICAgdGhhdC5nZXRVc2VySW5mbyh1c2VyID0+IHtcbiAgICAgICAgICB0aGF0XG4gICAgICAgICAgICAuZmV0Y2hEYXRhUHJvbWlzZShcInBhZ2UvZmlyc3QuanNvblwiLCB7XG4gICAgICAgICAgICAgIGFjdGlvbjogdXNlci5pc05ld1VzZXIgPyBcImluZm9cIiA6IFwiY29hY2hcIixcbiAgICAgICAgICAgICAgeDogbGF0aXR1ZGUsXG4gICAgICAgICAgICAgIHk6IGxvbmdpdHVkZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgdGhhdC5wYWdlRmlyc3QgPSBkYXRhO1xuICAgICAgICAgICAgICBkYXRhLnVzZXIgPSB1c2VyO1xuICAgICAgICAgICAgICB3eC5oaWRlTG9hZGluZygpO1xuICAgICAgICAgICAgICB0aGF0LiRicm9hZGNhc3QoXCJpbmRleC1icm9hZGNhc3RcIiwgZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgZ2V0VXNlckluZm8oY2FsbEJhY2spIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKFwidXNlci91c2VySW5mby5qc29uXCIsIHt9KS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHRoYXQudXNlckluZm8gPSBkYXRhO1xuICAgICAgdGhhdC51c2VySW5mby5pc05ld1VzZXIgPSB0cnVlO1xuICAgICAgd3guc2V0U3RvcmFnZSh7XG4gICAgICAgIGtleTogXCJ1c2VySW5mb1wiLFxuICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKVxuICAgICAgfSk7XG4gICAgICBjYWxsQmFjayhkYXRhKTtcbiAgICAgIHRoYXQuJGFwcGx5KCk7XG4gICAgfSk7XG4gIH1cbiAgcnVuKGMsIHcsIGgsIGN0eDEpIHtcbiAgICAvL2PmmK/lnIbnjq/ov5vluqbnmb7liIbmr5QgICB377yMaOaYr+WchuW/g+eahOWdkOagh1xuICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICB2YXIgbnVtID0gMiAqIE1hdGguUEkgLyAxMDAgKiBjIC0gMC41ICogTWF0aC5QSTtcbiAgICAvL+WchueOr+eahOe7mOWItlxuICAgIGN0eDEuc2V0TGluZVdpZHRoKDYpO1xuICAgIGN0eDEuc2V0U3Ryb2tlU3R5bGUoXCIjZDJkMmQyXCIpO1xuICAgIGN0eDEuc2V0TGluZUNhcChcInJvdW5kXCIpO1xuICAgIGN0eDEuc3Ryb2tlKCk7XG4gICAgY3R4MS5kcmF3KCk7XG4gICAgY3R4MS5hcmModywgaCwgdyAtIDgsIC0wLjUgKiBNYXRoLlBJLCBudW0pOyAvL+e7mOWItueahOWKqOS9nFxuICAgIGN0eDEuc2V0U3Ryb2tlU3R5bGUoXCIjZTAyNTEwXCIpOyAvL+WchueOr+e6v+adoeeahOminOiJslxuICAgIGN0eDEuc2V0TGluZVdpZHRoKFwiNFwiKTsgLy/lnIbnjq/nmoTnspfnu4ZcbiAgICBjdHgxLnNldExpbmVDYXAoXCJidXR0XCIpOyAvL+WchueOr+e7k+adn+aWreeCueeahOagt+W8jyAgYnV0dOS4uuW5s+ebtOi+uee8mCByb3VuZOS4uuWchuW9oue6v+W4vSAgc3F1YXJl5Li65q2j5pa55b2i57q/5bi9XG4gICAgY3R4MS5zdHJva2UoKTtcbiAgICBjdHgxLmRyYXcoKTtcbiAgfVxuICBjYW52YXNUYXAoc3RhcnQsIHcsIGgsIGN0eDEpIHtcbiAgICB0aGlzLnJ1big1MCwgdywgaCwgY3R4MSk7XG4gIH1cbiAgY2lyY2xlKCkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICBjb25zdCBjdHgxID0gd3guY3JlYXRlQ2FudmFzQ29udGV4dChcInJ1bkNhbnZhc1wiKTtcbiAgICB3eFxuICAgICAgLmNyZWF0ZVNlbGVjdG9yUXVlcnkoKVxuICAgICAgLnNlbGVjdChcIiNydW5DYW52YXNcIilcbiAgICAgIC5ib3VuZGluZ0NsaWVudFJlY3QoZnVuY3Rpb24ocmVjdCkge1xuICAgICAgICAvL+ebkeWQrGNhbnZhc+eahOWuvemrmFxuICAgICAgICBjb25zb2xlLmxvZyhyZWN0LCBcIjExMVwiKTtcbiAgICAgICAgdmFyIHcgPSBwYXJzZUludChyZWN0LndpZHRoIC8gMik7IC8v6I635Y+WY2FudmFz5a6955qE55qE5LiA5Y2KXG4gICAgICAgIHZhciBoID0gcGFyc2VJbnQocmVjdC5oZWlnaHQgLyAyKTsgLy/ojrflj5ZjYW52YXPpq5jnmoTkuIDljYrvvIxcbiAgICAgICAgdGhhdC5jYW52YXNUYXAoMCwgdywgaCwgY3R4MSk7XG4gICAgICB9KVxuICAgICAgLmV4ZWMoKTtcbiAgfVxuICBvblNob3coKSB7XG4gICAgd3guZ2V0U3lzdGVtSW5mbyh7XG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICB0aGlzLmhlaWdodCA9IHJlcy5zdGF0dXNCYXJIZWlnaHQ7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHd4LmdldFN0b3JhZ2Uoe1xuICAgICAga2V5OiBcImhvbWVcIixcbiAgICAgIHN1Y2Nlc3MocmVzKSB7XG4gICAgICAgIHRoYXQuaXNTaG93ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19