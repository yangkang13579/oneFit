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

var _tabBar = require('./../../components/tabBar.js');

var _tabBar2 = _interopRequireDefault(_tabBar);

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
      common: _common2.default,
      tabBar: _tabBar2.default
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
      buys: function buys() {
        wx.navigateTo({
          url: "/pages/home/buy?branchId=" + this.pageFirst.coachInfo.branchs[0].id
        });
      },
      buy: function buy() {
        wx.navigateTo({
          url: "/pages/home/home?branchId=" + this.pageFirst.coachInfo.branchs[0].id
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
              that.$apply();
            });
          });
        }
      });
    }
  }, {
    key: "getUserInfo",
    value: function getUserInfo(callBack) {
      var that = this;
      wx.getStorage({
        key: "userInfo",
        success: function success(res) {
          that.userInfo = JSON.parse(res.data);
          that.$broadcast("tab", {
            current: 0,
            userInfo: that.userInfo
          });
          that.userInfo.isNewUser = true;
          callBack(that.userInfo);
        }
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

      wx.hideTabBar();
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUxLmpzIl0sIm5hbWVzIjpbIkNvdXJzZSIsIm1peGlucyIsIlBhZ2VNaXhpbiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJjb21wb25lbnRzIiwiY29tbW9uIiwidGFiQmFyIiwiZGF0YSIsImxvYWRVc2VyIiwiaGVpZ2h0IiwiaW1nVXJscyIsImN1cnJlbnQiLCJpc1Nob3ciLCJicmFuY2hzIiwidXNlckluZm8iLCJpc05ld1VzZXIiLCJwYWdlRmlyc3QiLCJtZXRob2RzIiwiYnV5cyIsInd4IiwibmF2aWdhdGVUbyIsInVybCIsImNvYWNoSW5mbyIsImlkIiwiYnV5IiwiY29yc2UiLCJsZWZ0RnVuIiwibGVuZ3RoIiwicmlnaHRGdW4iLCJvcHRpb25zIiwiY2lyY2xlIiwiZ2V0UGFnZUZpcnN0IiwidGhhdCIsImdldExvY2F0aW9uIiwidHlwZSIsInN1Y2Nlc3MiLCJyZXMiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsInNob3dMb2FkaW5nIiwidGl0bGUiLCJnZXRVc2VySW5mbyIsImZldGNoRGF0YVByb21pc2UiLCJhY3Rpb24iLCJ1c2VyIiwieCIsInkiLCJ0aGVuIiwiaGlkZUxvYWRpbmciLCIkYnJvYWRjYXN0IiwiJGFwcGx5IiwiY2FsbEJhY2siLCJnZXRTdG9yYWdlIiwia2V5IiwiSlNPTiIsInBhcnNlIiwiYyIsInciLCJoIiwiY3R4MSIsIm51bSIsIk1hdGgiLCJQSSIsInNldExpbmVXaWR0aCIsInNldFN0cm9rZVN0eWxlIiwic2V0TGluZUNhcCIsInN0cm9rZSIsImRyYXciLCJhcmMiLCJzdGFydCIsInJ1biIsImNyZWF0ZUNhbnZhc0NvbnRleHQiLCJjcmVhdGVTZWxlY3RvclF1ZXJ5Iiwic2VsZWN0IiwiYm91bmRpbmdDbGllbnRSZWN0IiwicmVjdCIsImNvbnNvbGUiLCJsb2ciLCJwYXJzZUludCIsIndpZHRoIiwiY2FudmFzVGFwIiwiZXhlYyIsImhpZGVUYWJCYXIiLCJnZXRTeXN0ZW1JbmZvIiwi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O0FBQ0Q7Ozs2QkFDUTtBQUNQLFVBQUkzQixPQUFPLElBQVg7QUFDQSxVQUFNMkIsT0FBT3hDLEdBQUdvRCxtQkFBSCxDQUF1QixXQUF2QixDQUFiO0FBQ0FwRCxTQUNHcUQsbUJBREgsR0FFR0MsTUFGSCxDQUVVLFlBRlYsRUFHR0Msa0JBSEgsQ0FHc0IsVUFBU0MsSUFBVCxFQUFlO0FBQ2pDO0FBQ0FDLGdCQUFRQyxHQUFSLENBQVlGLElBQVosRUFBa0IsS0FBbEI7QUFDQSxZQUFJbEIsSUFBSXFCLFNBQVNILEtBQUtJLEtBQUwsR0FBYSxDQUF0QixDQUFSLENBSGlDLENBR0M7QUFDbEMsWUFBSXJCLElBQUlvQixTQUFTSCxLQUFLbEUsTUFBTCxHQUFjLENBQXZCLENBQVIsQ0FKaUMsQ0FJRTtBQUNuQ3VCLGFBQUtnRCxTQUFMLENBQWUsQ0FBZixFQUFrQnZCLENBQWxCLEVBQXFCQyxDQUFyQixFQUF3QkMsSUFBeEI7QUFDRCxPQVRILEVBVUdzQixJQVZIO0FBV0Q7Ozs2QkFDUTtBQUFBOztBQUNQOUQsU0FBRytELFVBQUg7QUFDQS9ELFNBQUdnRSxhQUFILENBQWlCO0FBQ2ZoRCxpQkFBUyxzQkFBTztBQUNkLGlCQUFLMUIsTUFBTCxHQUFjMkIsSUFBSWdELGVBQWxCO0FBQ0Q7QUFIYyxPQUFqQjtBQUtBLFVBQUlwRCxPQUFPLElBQVg7QUFDQWIsU0FBR2lDLFVBQUgsQ0FBYztBQUNaQyxhQUFLLE1BRE87QUFFWmxCLGVBRlksbUJBRUpDLEdBRkksRUFFQztBQUNYSixlQUFLcEIsTUFBTCxHQUFjLElBQWQ7QUFDRDtBQUpXLE9BQWQ7QUFNRDs7OztFQWhKaUN5RSxlQUFLQyxJOztrQkFBcEJ2RixNIiwiZmlsZSI6ImhvbWUxLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKiBnbG9iYWwgd3ggKi9cbmltcG9ydCB3ZXB5IGZyb20gXCJ3ZXB5XCI7XG5pbXBvcnQgUGFnZU1peGluIGZyb20gXCIuLi8uLi9taXhpbnMvcGFnZVwiO1xuaW1wb3J0IGNvbW1vbiBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy9jb21tb25cIjtcbmltcG9ydCB0YWJCYXIgZnJvbSBcIi4uLy4uL2NvbXBvbmVudHMvdGFiQmFyXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3Vyc2UgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xuICBtaXhpbnMgPSBbUGFnZU1peGluXTtcbiAgY29uZmlnID0ge1xuICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZlwiXG4gIH07XG4gIGNvbXBvbmVudHMgPSB7XG4gICAgY29tbW9uLFxuICAgIHRhYkJhclxuICB9O1xuICBkYXRhID0ge1xuICAgIGxvYWRVc2VyOiB0cnVlLCAvLyDpnIDopoHnmbvlvZXkv6Hmga9cbiAgICBoZWlnaHQ6IFwiXCIsXG4gICAgaW1nVXJsczogWzEsIDJdLFxuICAgIGN1cnJlbnQ6IDAsXG4gICAgaXNTaG93OiBmYWxzZSxcbiAgICBicmFuY2hzOiBbXSxcbiAgICB1c2VySW5mbzoge1xuICAgICAgaXNOZXdVc2VyOiB0cnVlXG4gICAgfSxcbiAgICBwYWdlRmlyc3Q6IHt9XG4gIH07XG4gIHdoZW5BcHBSZWFkeVNob3cob3B0aW9ucykge1xuICAgIHRoaXMuY2lyY2xlKCk7XG4gICAgdGhpcy5nZXRQYWdlRmlyc3QoKTtcbiAgfVxuICBtZXRob2RzID0ge1xuICAgIGJ1eXMoKSB7XG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgdXJsOlxuICAgICAgICAgIFwiL3BhZ2VzL2hvbWUvYnV5P2JyYW5jaElkPVwiICsgdGhpcy5wYWdlRmlyc3QuY29hY2hJbmZvLmJyYW5jaHNbMF0uaWRcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgYnV5KCkge1xuICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgIHVybDpcbiAgICAgICAgICBcIi9wYWdlcy9ob21lL2hvbWU/YnJhbmNoSWQ9XCIgKyB0aGlzLnBhZ2VGaXJzdC5jb2FjaEluZm8uYnJhbmNoc1swXS5pZFxuICAgICAgfSk7XG4gICAgfSxcbiAgICBjb3JzZSgpIHtcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICB1cmw6IFwiL3BhZ2VzL2hvbWUvYXBwb2ludG1lbnRcIlxuICAgICAgfSk7XG4gICAgfSxcbiAgICBsZWZ0RnVuKCkge1xuICAgICAgaWYgKHRoaXMuY3VycmVudCA9PT0gMCkgdGhpcy5jdXJyZW50ID0gdGhpcy5pbWdVcmxzLmxlbmd0aCAtIDE7XG4gICAgICBlbHNlIHRoaXMuY3VycmVudC0tO1xuICAgIH0sXG4gICAgcmlnaHRGdW4oKSB7XG4gICAgICBpZiAodGhpcy5jdXJyZW50ID09PSB0aGlzLmltZ1VybHMubGVuZ3RoIC0gMSkgdGhpcy5jdXJyZW50ID0gMDtcbiAgICAgIGVsc2UgdGhpcy5jdXJyZW50Kys7XG4gICAgfVxuICB9O1xuICBnZXRQYWdlRmlyc3QoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHd4LmdldExvY2F0aW9uKHtcbiAgICAgIHR5cGU6IFwid2dzODRcIixcbiAgICAgIHN1Y2Nlc3MocmVzKSB7XG4gICAgICAgIGNvbnN0IGxhdGl0dWRlID0gcmVzLmxhdGl0dWRlO1xuICAgICAgICBjb25zdCBsb25naXR1ZGUgPSByZXMubG9uZ2l0dWRlO1xuICAgICAgICB3eC5zaG93TG9hZGluZyh7XG4gICAgICAgICAgdGl0bGU6IFwi5Yqg6L295LitXCJcbiAgICAgICAgfSk7XG4gICAgICAgIHRoYXQuZ2V0VXNlckluZm8odXNlciA9PiB7XG4gICAgICAgICAgdGhhdFxuICAgICAgICAgICAgLmZldGNoRGF0YVByb21pc2UoXCJwYWdlL2ZpcnN0Lmpzb25cIiwge1xuICAgICAgICAgICAgICBhY3Rpb246IHVzZXIuaXNOZXdVc2VyID8gXCJpbmZvXCIgOiBcImNvYWNoXCIsXG4gICAgICAgICAgICAgIHg6IGxhdGl0dWRlLFxuICAgICAgICAgICAgICB5OiBsb25naXR1ZGVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgIHRoYXQucGFnZUZpcnN0ID0gZGF0YTtcbiAgICAgICAgICAgICAgZGF0YS51c2VyID0gdXNlcjtcbiAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgICAgICAgdGhhdC4kYnJvYWRjYXN0KFwiaW5kZXgtYnJvYWRjYXN0XCIsIGRhdGEpO1xuICAgICAgICAgICAgICB0aGF0LiRhcHBseSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGdldFVzZXJJbmZvKGNhbGxCYWNrKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHd4LmdldFN0b3JhZ2Uoe1xuICAgICAga2V5OiBcInVzZXJJbmZvXCIsXG4gICAgICBzdWNjZXNzKHJlcykge1xuICAgICAgICB0aGF0LnVzZXJJbmZvID0gSlNPTi5wYXJzZShyZXMuZGF0YSk7XG4gICAgICAgIHRoYXQuJGJyb2FkY2FzdChcInRhYlwiLCB7XG4gICAgICAgICAgY3VycmVudDogMCxcbiAgICAgICAgICB1c2VySW5mbzogdGhhdC51c2VySW5mb1xuICAgICAgICB9KTtcbiAgICAgICAgdGhhdC51c2VySW5mby5pc05ld1VzZXIgPSB0cnVlO1xuICAgICAgICBjYWxsQmFjayh0aGF0LnVzZXJJbmZvKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBydW4oYywgdywgaCwgY3R4MSkge1xuICAgIC8vY+aYr+WchueOr+i/m+W6pueZvuWIhuavlCAgIHfvvIxo5piv5ZyG5b+D55qE5Z2Q5qCHXG4gICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgIHZhciBudW0gPSAyICogTWF0aC5QSSAvIDEwMCAqIGMgLSAwLjUgKiBNYXRoLlBJO1xuICAgIC8v5ZyG546v55qE57uY5Yi2XG4gICAgY3R4MS5zZXRMaW5lV2lkdGgoNik7XG4gICAgY3R4MS5zZXRTdHJva2VTdHlsZShcIiNkMmQyZDJcIik7XG4gICAgY3R4MS5zZXRMaW5lQ2FwKFwicm91bmRcIik7XG4gICAgY3R4MS5zdHJva2UoKTtcbiAgICBjdHgxLmRyYXcoKTtcbiAgICBjdHgxLmFyYyh3LCBoLCB3IC0gOCwgLTAuNSAqIE1hdGguUEksIG51bSk7IC8v57uY5Yi255qE5Yqo5L2cXG4gICAgY3R4MS5zZXRTdHJva2VTdHlsZShcIiNlMDI1MTBcIik7IC8v5ZyG546v57q/5p2h55qE6aKc6ImyXG4gICAgY3R4MS5zZXRMaW5lV2lkdGgoXCI0XCIpOyAvL+WchueOr+eahOeyl+e7hlxuICAgIGN0eDEuc2V0TGluZUNhcChcImJ1dHRcIik7IC8v5ZyG546v57uT5p2f5pat54K555qE5qC35byPICBidXR05Li65bmz55u06L6557yYIHJvdW5k5Li65ZyG5b2i57q/5bi9ICBzcXVhcmXkuLrmraPmlrnlvaLnur/luL1cbiAgICBjdHgxLnN0cm9rZSgpO1xuICAgIGN0eDEuZHJhdygpO1xuICB9XG4gIGNhbnZhc1RhcChzdGFydCwgdywgaCwgY3R4MSkge1xuICAgIHRoaXMucnVuKDUwLCB3LCBoLCBjdHgxKTtcbiAgfVxuICBjaXJjbGUoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIGNvbnN0IGN0eDEgPSB3eC5jcmVhdGVDYW52YXNDb250ZXh0KFwicnVuQ2FudmFzXCIpO1xuICAgIHd4XG4gICAgICAuY3JlYXRlU2VsZWN0b3JRdWVyeSgpXG4gICAgICAuc2VsZWN0KFwiI3J1bkNhbnZhc1wiKVxuICAgICAgLmJvdW5kaW5nQ2xpZW50UmVjdChmdW5jdGlvbihyZWN0KSB7XG4gICAgICAgIC8v55uR5ZCsY2FudmFz55qE5a696auYXG4gICAgICAgIGNvbnNvbGUubG9nKHJlY3QsIFwiMTExXCIpO1xuICAgICAgICB2YXIgdyA9IHBhcnNlSW50KHJlY3Qud2lkdGggLyAyKTsgLy/ojrflj5ZjYW52YXPlrr3nmoTnmoTkuIDljYpcbiAgICAgICAgdmFyIGggPSBwYXJzZUludChyZWN0LmhlaWdodCAvIDIpOyAvL+iOt+WPlmNhbnZhc+mrmOeahOS4gOWNiu+8jFxuICAgICAgICB0aGF0LmNhbnZhc1RhcCgwLCB3LCBoLCBjdHgxKTtcbiAgICAgIH0pXG4gICAgICAuZXhlYygpO1xuICB9XG4gIG9uU2hvdygpIHtcbiAgICB3eC5oaWRlVGFiQmFyKCk7XG4gICAgd3guZ2V0U3lzdGVtSW5mbyh7XG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICB0aGlzLmhlaWdodCA9IHJlcy5zdGF0dXNCYXJIZWlnaHQ7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHd4LmdldFN0b3JhZ2Uoe1xuICAgICAga2V5OiBcImhvbWVcIixcbiAgICAgIHN1Y2Nlc3MocmVzKSB7XG4gICAgICAgIHRoYXQuaXNTaG93ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19