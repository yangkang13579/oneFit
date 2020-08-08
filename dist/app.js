"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _app = require('./lib/app.js');

var _app2 = _interopRequireDefault(_app);

require('./npm/wepy-async-function/index.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* global wx */
// 在Page页面实例中，可以通过this.$parent来访问App实例。


var _class = function (_wepy$app) {
  _inherits(_class, _wepy$app);

  function _class() {
    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));

    _this.config = {
      pages: ["pages/home/home1", "pages/home/home", "pages/user/user", "pages/user/membersNext4", "pages/user/membersNext3", "pages/user/membersNext2", "pages/user/membersNext1", "pages/user/membersNext", "pages/user/members", "pages/user/yuekeNext", "pages/user/yueNext", "pages/user/yueKe", "pages/doors/doors", "pages/doors/featDetails", "pages/doors/corseDetails", "pages/doors/doorsDetails", "pages/user/changeFeat", "pages/user/myInfo", "pages/user/myCorse", "pages/user/myTice", "pages/user/teceData", "pages/user/myGroup", "pages/user/card", "pages/home/buyMoney", "pages/home/buyNext", "pages/home/buy", "pages/home/appointment", "pages/login"],
      window: {
        backgroundColor: "#fefefe",
        navigationBarBackgroundColor: "#fefefe",
        navigationBarTitleText: "首页",
        navigationBarTextStyle: "white",
        navigationStyle: "custom"
      },
      tabBar: {
        color: "#878787",
        selectedColor: "#fff",
        backgroundColor: "#343434",
        borderStyle: "black",
        list: [{
          pagePath: "pages/home/home1",
          text: "首页",
          iconPath: "images/icon43.png",
          selectedIconPath: "images/icon4.png"
        }, {
          pagePath: "pages/doors/doors",
          text: "课程",
          iconPath: "images/icon5.png",
          selectedIconPath: "images/icon54.png"
        }, {
          pagePath: "pages/user/user",
          text: "我的",
          iconPath: "images/icon6.png",
          selectedIconPath: "images/icon31.png"
        }]
      },
      permission: {
        "scope.userLocation": {
          desc: "您的位置信息将用于寻找附近的检测点"
        }
      }
    };
    _this.globalData = {
      // 中化作物
      appId: "wx2597963c30f20afd",
      appType: "xcx",
      wxId: "gh_b69825f64e58",
      passportUrl: "https://onefit-passport.jteam.cn/passport/", // 认证服务器
      dataUrl: "https://onefit.jteam.cn/data/", // 数据服务器
      uploadUrl: "https://up.jteam.cn/",
      isCoach: null //是否是教练
    };

    _this.use("promisify");
    return _this;
  }

  _createClass(_class, [{
    key: "onLaunch",
    value: function onLaunch(options) {
      // 初始化都是异步的
      //  wx.navigateTo({
      //         url: '/pages/animate'
      //     });
      _app2.default.init(this.globalData, options);
      _wepy2.default.showShareMenu({
        withShareTicket: true
      });
    }
  }]);

  return _class;
}(_wepy2.default.app);


App(require('./npm/wepy/lib/wepy.js').default.$createApp(_class, {}));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJjb25maWciLCJwYWdlcyIsIndpbmRvdyIsImJhY2tncm91bmRDb2xvciIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwibmF2aWdhdGlvbkJhclRleHRTdHlsZSIsIm5hdmlnYXRpb25TdHlsZSIsInRhYkJhciIsImNvbG9yIiwic2VsZWN0ZWRDb2xvciIsImJvcmRlclN0eWxlIiwibGlzdCIsInBhZ2VQYXRoIiwidGV4dCIsImljb25QYXRoIiwic2VsZWN0ZWRJY29uUGF0aCIsInBlcm1pc3Npb24iLCJkZXNjIiwiZ2xvYmFsRGF0YSIsImFwcElkIiwiYXBwVHlwZSIsInd4SWQiLCJwYXNzcG9ydFVybCIsImRhdGFVcmwiLCJ1cGxvYWRVcmwiLCJpc0NvYWNoIiwidXNlIiwib3B0aW9ucyIsImFwcCIsImluaXQiLCJ3ZXB5Iiwic2hvd1NoYXJlTWVudSIsIndpdGhTaGFyZVRpY2tldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFHQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7OztBQUpBO0FBQ0E7Ozs7OztBQXNGRSxvQkFBYztBQUFBOztBQUFBOztBQUFBLFVBaEZkQSxNQWdGYyxHQWhGTDtBQUNQQyxhQUFPLENBQ0wsa0JBREssRUFFTCxpQkFGSyxFQUdMLGlCQUhLLEVBSUwseUJBSkssRUFLTCx5QkFMSyxFQU1MLHlCQU5LLEVBT0wseUJBUEssRUFRTCx3QkFSSyxFQVNMLG9CQVRLLEVBVUwsc0JBVkssRUFXTCxvQkFYSyxFQVlMLGtCQVpLLEVBYUwsbUJBYkssRUFjTCx5QkFkSyxFQWVMLDBCQWZLLEVBZ0JMLDBCQWhCSyxFQWlCTCx1QkFqQkssRUFrQkwsbUJBbEJLLEVBbUJMLG9CQW5CSyxFQW9CTCxtQkFwQkssRUFxQkwscUJBckJLLEVBc0JMLG9CQXRCSyxFQXVCTCxpQkF2QkssRUF3QkwscUJBeEJLLEVBeUJMLG9CQXpCSyxFQTBCTCxnQkExQkssRUEyQkwsd0JBM0JLLEVBNEJMLGFBNUJLLENBREE7QUErQlBDLGNBQVE7QUFDTkMseUJBQWlCLFNBRFg7QUFFTkMsc0NBQThCLFNBRnhCO0FBR05DLGdDQUF3QixJQUhsQjtBQUlOQyxnQ0FBd0IsT0FKbEI7QUFLTkMseUJBQWlCO0FBTFgsT0EvQkQ7QUFzQ1BDLGNBQVE7QUFDTkMsZUFBTyxTQUREO0FBRU5DLHVCQUFlLE1BRlQ7QUFHTlAseUJBQWlCLFNBSFg7QUFJTlEscUJBQWEsT0FKUDtBQUtOQyxjQUFNLENBQ0o7QUFDRUMsb0JBQVUsa0JBRFo7QUFFRUMsZ0JBQU0sSUFGUjtBQUdFQyxvQkFBVSxtQkFIWjtBQUlFQyw0QkFBa0I7QUFKcEIsU0FESSxFQU9KO0FBQ0VILG9CQUFVLG1CQURaO0FBRUVDLGdCQUFNLElBRlI7QUFHRUMsb0JBQVUsa0JBSFo7QUFJRUMsNEJBQWtCO0FBSnBCLFNBUEksRUFhSjtBQUNFSCxvQkFBVSxpQkFEWjtBQUVFQyxnQkFBTSxJQUZSO0FBR0VDLG9CQUFVLGtCQUhaO0FBSUVDLDRCQUFrQjtBQUpwQixTQWJJO0FBTEEsT0F0Q0Q7QUFnRVBDLGtCQUFZO0FBQ1YsOEJBQXNCO0FBQ3BCQyxnQkFBTTtBQURjO0FBRFo7QUFoRUwsS0FnRks7QUFBQSxVQVZkQyxVQVVjLEdBVkQ7QUFDWDtBQUNBQyxhQUFPLG9CQUZJO0FBR1hDLGVBQVMsS0FIRTtBQUlYQyxZQUFNLGlCQUpLO0FBS1hDLG1CQUFhLDRDQUxGLEVBS2dEO0FBQzNEQyxlQUFTLCtCQU5FLEVBTStCO0FBQzFDQyxpQkFBVyxzQkFQQTtBQVFYQyxlQUFTLElBUkUsQ0FRRztBQVJILEtBVUM7O0FBRVosVUFBS0MsR0FBTCxDQUFTLFdBQVQ7QUFGWTtBQUdiOzs7OzZCQUNRQyxPLEVBQVM7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQUMsb0JBQUlDLElBQUosQ0FBUyxLQUFLWCxVQUFkLEVBQTBCUyxPQUExQjtBQUNBRyxxQkFBS0MsYUFBTCxDQUFtQjtBQUNqQkMseUJBQWlCO0FBREEsT0FBbkI7QUFHRDs7OztFQTlGMEJGLGVBQUtGLEciLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8qIGdsb2JhbCB3eCAqL1xyXG4vLyDlnKhQYWdl6aG16Z2i5a6e5L6L5Lit77yM5Y+v5Lul6YCa6L+HdGhpcy4kcGFyZW505p2l6K6/6ZeuQXBw5a6e5L6L44CCXHJcbmltcG9ydCB3ZXB5IGZyb20gXCJ3ZXB5XCI7XHJcbmltcG9ydCBhcHAgZnJvbSBcIi4vbGliL2FwcFwiO1xyXG5pbXBvcnQgXCJ3ZXB5LWFzeW5jLWZ1bmN0aW9uXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIHdlcHkuYXBwIHtcclxuICBjb25maWcgPSB7XHJcbiAgICBwYWdlczogW1xyXG4gICAgICBcInBhZ2VzL2hvbWUvaG9tZTFcIixcclxuICAgICAgXCJwYWdlcy9ob21lL2hvbWVcIixcclxuICAgICAgXCJwYWdlcy91c2VyL3VzZXJcIixcclxuICAgICAgXCJwYWdlcy91c2VyL21lbWJlcnNOZXh0NFwiLFxyXG4gICAgICBcInBhZ2VzL3VzZXIvbWVtYmVyc05leHQzXCIsXHJcbiAgICAgIFwicGFnZXMvdXNlci9tZW1iZXJzTmV4dDJcIixcclxuICAgICAgXCJwYWdlcy91c2VyL21lbWJlcnNOZXh0MVwiLFxyXG4gICAgICBcInBhZ2VzL3VzZXIvbWVtYmVyc05leHRcIixcclxuICAgICAgXCJwYWdlcy91c2VyL21lbWJlcnNcIixcclxuICAgICAgXCJwYWdlcy91c2VyL3l1ZWtlTmV4dFwiLFxyXG4gICAgICBcInBhZ2VzL3VzZXIveXVlTmV4dFwiLFxyXG4gICAgICBcInBhZ2VzL3VzZXIveXVlS2VcIixcclxuICAgICAgXCJwYWdlcy9kb29ycy9kb29yc1wiLFxyXG4gICAgICBcInBhZ2VzL2Rvb3JzL2ZlYXREZXRhaWxzXCIsXHJcbiAgICAgIFwicGFnZXMvZG9vcnMvY29yc2VEZXRhaWxzXCIsXHJcbiAgICAgIFwicGFnZXMvZG9vcnMvZG9vcnNEZXRhaWxzXCIsXHJcbiAgICAgIFwicGFnZXMvdXNlci9jaGFuZ2VGZWF0XCIsXHJcbiAgICAgIFwicGFnZXMvdXNlci9teUluZm9cIixcclxuICAgICAgXCJwYWdlcy91c2VyL215Q29yc2VcIixcclxuICAgICAgXCJwYWdlcy91c2VyL215VGljZVwiLFxyXG4gICAgICBcInBhZ2VzL3VzZXIvdGVjZURhdGFcIixcclxuICAgICAgXCJwYWdlcy91c2VyL215R3JvdXBcIixcclxuICAgICAgXCJwYWdlcy91c2VyL2NhcmRcIixcclxuICAgICAgXCJwYWdlcy9ob21lL2J1eU1vbmV5XCIsXHJcbiAgICAgIFwicGFnZXMvaG9tZS9idXlOZXh0XCIsXHJcbiAgICAgIFwicGFnZXMvaG9tZS9idXlcIixcclxuICAgICAgXCJwYWdlcy9ob21lL2FwcG9pbnRtZW50XCIsXHJcbiAgICAgIFwicGFnZXMvbG9naW5cIlxyXG4gICAgXSxcclxuICAgIHdpbmRvdzoge1xyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiI2ZlZmVmZVwiLFxyXG4gICAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiBcIiNmZWZlZmVcIixcclxuICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogXCLpppbpobVcIixcclxuICAgICAgbmF2aWdhdGlvbkJhclRleHRTdHlsZTogXCJ3aGl0ZVwiLFxyXG4gICAgICBuYXZpZ2F0aW9uU3R5bGU6IFwiY3VzdG9tXCJcclxuICAgIH0sXHJcbiAgICB0YWJCYXI6IHtcclxuICAgICAgY29sb3I6IFwiIzg3ODc4N1wiLFxyXG4gICAgICBzZWxlY3RlZENvbG9yOiBcIiNmZmZcIixcclxuICAgICAgYmFja2dyb3VuZENvbG9yOiBcIiMzNDM0MzRcIixcclxuICAgICAgYm9yZGVyU3R5bGU6IFwiYmxhY2tcIixcclxuICAgICAgbGlzdDogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHBhZ2VQYXRoOiBcInBhZ2VzL2hvbWUvaG9tZTFcIixcclxuICAgICAgICAgIHRleHQ6IFwi6aaW6aG1XCIsXHJcbiAgICAgICAgICBpY29uUGF0aDogXCJpbWFnZXMvaWNvbjQzLnBuZ1wiLFxyXG4gICAgICAgICAgc2VsZWN0ZWRJY29uUGF0aDogXCJpbWFnZXMvaWNvbjQucG5nXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHBhZ2VQYXRoOiBcInBhZ2VzL2Rvb3JzL2Rvb3JzXCIsXHJcbiAgICAgICAgICB0ZXh0OiBcIuivvueoi1wiLFxyXG4gICAgICAgICAgaWNvblBhdGg6IFwiaW1hZ2VzL2ljb241LnBuZ1wiLFxyXG4gICAgICAgICAgc2VsZWN0ZWRJY29uUGF0aDogXCJpbWFnZXMvaWNvbjU0LnBuZ1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBwYWdlUGF0aDogXCJwYWdlcy91c2VyL3VzZXJcIixcclxuICAgICAgICAgIHRleHQ6IFwi5oiR55qEXCIsXHJcbiAgICAgICAgICBpY29uUGF0aDogXCJpbWFnZXMvaWNvbjYucG5nXCIsXHJcbiAgICAgICAgICBzZWxlY3RlZEljb25QYXRoOiBcImltYWdlcy9pY29uMzEucG5nXCJcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBwZXJtaXNzaW9uOiB7XHJcbiAgICAgIFwic2NvcGUudXNlckxvY2F0aW9uXCI6IHtcclxuICAgICAgICBkZXNjOiBcIuaCqOeahOS9jee9ruS/oeaBr+WwhueUqOS6juWvu+aJvumZhOi/keeahOajgOa1i+eCuVwiXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG4gIGdsb2JhbERhdGEgPSB7XHJcbiAgICAvLyDkuK3ljJbkvZznialcclxuICAgIGFwcElkOiBcInd4MjU5Nzk2M2MzMGYyMGFmZFwiLFxyXG4gICAgYXBwVHlwZTogXCJ4Y3hcIixcclxuICAgIHd4SWQ6IFwiZ2hfYjY5ODI1ZjY0ZTU4XCIsXHJcbiAgICBwYXNzcG9ydFVybDogXCJodHRwczovL29uZWZpdC1wYXNzcG9ydC5qdGVhbS5jbi9wYXNzcG9ydC9cIiwgLy8g6K6k6K+B5pyN5Yqh5ZmoXHJcbiAgICBkYXRhVXJsOiBcImh0dHBzOi8vb25lZml0Lmp0ZWFtLmNuL2RhdGEvXCIsIC8vIOaVsOaNruacjeWKoeWZqFxyXG4gICAgdXBsb2FkVXJsOiBcImh0dHBzOi8vdXAuanRlYW0uY24vXCIsXHJcbiAgICBpc0NvYWNoOiBudWxsIC8v5piv5ZCm5piv5pWZ57uDXHJcbiAgfTtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLnVzZShcInByb21pc2lmeVwiKTtcclxuICB9XHJcbiAgb25MYXVuY2gob3B0aW9ucykge1xyXG4gICAgLy8g5Yid5aeL5YyW6YO95piv5byC5q2l55qEXHJcbiAgICAvLyAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAvLyAgICAgICAgIHVybDogJy9wYWdlcy9hbmltYXRlJ1xyXG4gICAgLy8gICAgIH0pO1xyXG4gICAgYXBwLmluaXQodGhpcy5nbG9iYWxEYXRhLCBvcHRpb25zKTtcclxuICAgIHdlcHkuc2hvd1NoYXJlTWVudSh7XHJcbiAgICAgIHdpdGhTaGFyZVRpY2tldDogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==