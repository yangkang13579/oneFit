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
      pages: ["pages/loading", "pages/home/home1", "pages/home/home", "pages/home/buyMoney", "pages/user/user", "pages/user/membersNext4", "pages/user/membersNext3", "pages/user/membersNext2", "pages/user/membersNext1", "pages/user/membersNext", "pages/user/members", "pages/user/yuekeNext", "pages/user/yueNext", "pages/user/yueKe", "pages/doors/doors", "pages/doors/featDetails", "pages/doors/corseDetails", "pages/doors/doorsDetails", "pages/user/changeFeat", "pages/user/myInfo", "pages/user/myCorse", "pages/user/myTice", "pages/user/teceData", "pages/user/myGroup", "pages/user/card", "pages/home/buyNext", "pages/home/buy", "pages/home/appointment", "pages/login", "pages/home/text"],
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
          text: "首页"
        }, {
          pagePath: "pages/doors/doors",
          text: "门店"
        }, {
          pagePath: "pages/user/user",
          text: "我的"
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJjb25maWciLCJwYWdlcyIsIndpbmRvdyIsImJhY2tncm91bmRDb2xvciIsIm5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3IiLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwibmF2aWdhdGlvbkJhclRleHRTdHlsZSIsIm5hdmlnYXRpb25TdHlsZSIsInRhYkJhciIsImNvbG9yIiwic2VsZWN0ZWRDb2xvciIsImJvcmRlclN0eWxlIiwibGlzdCIsInBhZ2VQYXRoIiwidGV4dCIsInBlcm1pc3Npb24iLCJkZXNjIiwiZ2xvYmFsRGF0YSIsImFwcElkIiwiYXBwVHlwZSIsInd4SWQiLCJwYXNzcG9ydFVybCIsImRhdGFVcmwiLCJ1cGxvYWRVcmwiLCJpc0NvYWNoIiwidXNlIiwib3B0aW9ucyIsImFwcCIsImluaXQiLCJ3ZXB5Iiwic2hvd1NoYXJlTWVudSIsIndpdGhTaGFyZVRpY2tldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFHQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7OztBQUpBO0FBQ0E7Ozs7OztBQWlGRSxvQkFBYztBQUFBOztBQUFBOztBQUFBLFVBNUVkQSxNQTRFYyxHQTVFTDtBQUNQQyxhQUFPLENBQ0wsZUFESyxFQUVMLGtCQUZLLEVBR0wsaUJBSEssRUFJTCxxQkFKSyxFQUtMLGlCQUxLLEVBTUwseUJBTkssRUFPTCx5QkFQSyxFQVFMLHlCQVJLLEVBU0wseUJBVEssRUFVTCx3QkFWSyxFQVdMLG9CQVhLLEVBWUwsc0JBWkssRUFhTCxvQkFiSyxFQWNMLGtCQWRLLEVBZUwsbUJBZkssRUFnQkwseUJBaEJLLEVBaUJMLDBCQWpCSyxFQWtCTCwwQkFsQkssRUFtQkwsdUJBbkJLLEVBb0JMLG1CQXBCSyxFQXFCTCxvQkFyQkssRUFzQkwsbUJBdEJLLEVBdUJMLHFCQXZCSyxFQXdCTCxvQkF4QkssRUF5QkwsaUJBekJLLEVBMEJMLG9CQTFCSyxFQTJCTCxnQkEzQkssRUE0Qkwsd0JBNUJLLEVBNkJMLGFBN0JLLEVBOEJMLGlCQTlCSyxDQURBO0FBaUNQQyxjQUFRO0FBQ05DLHlCQUFpQixTQURYO0FBRU5DLHNDQUE4QixTQUZ4QjtBQUdOQyxnQ0FBd0IsSUFIbEI7QUFJTkMsZ0NBQXdCLE9BSmxCO0FBS05DLHlCQUFpQjtBQUxYLE9BakNEO0FBd0NQQyxjQUFRO0FBQ05DLGVBQU8sU0FERDtBQUVOQyx1QkFBZSxNQUZUO0FBR05QLHlCQUFpQixTQUhYO0FBSU5RLHFCQUFhLE9BSlA7QUFLTkMsY0FBTSxDQUNKO0FBQ0VDLG9CQUFVLGtCQURaO0FBRUVDLGdCQUFNO0FBRlIsU0FESSxFQUtKO0FBQ0VELG9CQUFVLG1CQURaO0FBRUVDLGdCQUFNO0FBRlIsU0FMSSxFQVNKO0FBQ0VELG9CQUFVLGlCQURaO0FBRUVDLGdCQUFNO0FBRlIsU0FUSTtBQUxBLE9BeENEO0FBNERQQyxrQkFBWTtBQUNWLDhCQUFzQjtBQUNwQkMsZ0JBQU07QUFEYztBQURaO0FBNURMLEtBNEVLO0FBQUEsVUFWZEMsVUFVYyxHQVZEO0FBQ1g7QUFDQUMsYUFBTyxvQkFGSTtBQUdYQyxlQUFTLEtBSEU7QUFJWEMsWUFBTSxpQkFKSztBQUtYQyxtQkFBYSw0Q0FMRixFQUtnRDtBQUMzREMsZUFBUywrQkFORSxFQU0rQjtBQUMxQ0MsaUJBQVcsc0JBUEE7QUFRWEMsZUFBUyxJQVJFLENBUUc7QUFSSCxLQVVDOztBQUVaLFVBQUtDLEdBQUwsQ0FBUyxXQUFUO0FBRlk7QUFHYjs7Ozs2QkFDUUMsTyxFQUFTO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0FDLG9CQUFJQyxJQUFKLENBQVMsS0FBS1gsVUFBZCxFQUEwQlMsT0FBMUI7QUFDQUcscUJBQUtDLGFBQUwsQ0FBbUI7QUFDakJDLHlCQUFpQjtBQURBLE9BQW5CO0FBR0Q7Ozs7RUExRjBCRixlQUFLRixHIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKiBnbG9iYWwgd3ggKi9cclxuLy8g5ZyoUGFnZemhtemdouWunuS+i+S4re+8jOWPr+S7pemAmui/h3RoaXMuJHBhcmVudOadpeiuv+mXrkFwcOWunuS+i+OAglxyXG5pbXBvcnQgd2VweSBmcm9tIFwid2VweVwiO1xyXG5pbXBvcnQgYXBwIGZyb20gXCIuL2xpYi9hcHBcIjtcclxuaW1wb3J0IFwid2VweS1hc3luYy1mdW5jdGlvblwiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIHdlcHkuYXBwIHtcclxuICBjb25maWcgPSB7XHJcbiAgICBwYWdlczogW1xyXG4gICAgICBcInBhZ2VzL2xvYWRpbmdcIixcclxuICAgICAgXCJwYWdlcy9ob21lL2hvbWUxXCIsXHJcbiAgICAgIFwicGFnZXMvaG9tZS9ob21lXCIsXHJcbiAgICAgIFwicGFnZXMvaG9tZS9idXlNb25leVwiLFxyXG4gICAgICBcInBhZ2VzL3VzZXIvdXNlclwiLFxyXG4gICAgICBcInBhZ2VzL3VzZXIvbWVtYmVyc05leHQ0XCIsXHJcbiAgICAgIFwicGFnZXMvdXNlci9tZW1iZXJzTmV4dDNcIixcclxuICAgICAgXCJwYWdlcy91c2VyL21lbWJlcnNOZXh0MlwiLFxyXG4gICAgICBcInBhZ2VzL3VzZXIvbWVtYmVyc05leHQxXCIsXHJcbiAgICAgIFwicGFnZXMvdXNlci9tZW1iZXJzTmV4dFwiLFxyXG4gICAgICBcInBhZ2VzL3VzZXIvbWVtYmVyc1wiLFxyXG4gICAgICBcInBhZ2VzL3VzZXIveXVla2VOZXh0XCIsXHJcbiAgICAgIFwicGFnZXMvdXNlci95dWVOZXh0XCIsXHJcbiAgICAgIFwicGFnZXMvdXNlci95dWVLZVwiLFxyXG4gICAgICBcInBhZ2VzL2Rvb3JzL2Rvb3JzXCIsXHJcbiAgICAgIFwicGFnZXMvZG9vcnMvZmVhdERldGFpbHNcIixcclxuICAgICAgXCJwYWdlcy9kb29ycy9jb3JzZURldGFpbHNcIixcclxuICAgICAgXCJwYWdlcy9kb29ycy9kb29yc0RldGFpbHNcIixcclxuICAgICAgXCJwYWdlcy91c2VyL2NoYW5nZUZlYXRcIixcclxuICAgICAgXCJwYWdlcy91c2VyL215SW5mb1wiLFxyXG4gICAgICBcInBhZ2VzL3VzZXIvbXlDb3JzZVwiLFxyXG4gICAgICBcInBhZ2VzL3VzZXIvbXlUaWNlXCIsXHJcbiAgICAgIFwicGFnZXMvdXNlci90ZWNlRGF0YVwiLFxyXG4gICAgICBcInBhZ2VzL3VzZXIvbXlHcm91cFwiLFxyXG4gICAgICBcInBhZ2VzL3VzZXIvY2FyZFwiLFxyXG4gICAgICBcInBhZ2VzL2hvbWUvYnV5TmV4dFwiLFxyXG4gICAgICBcInBhZ2VzL2hvbWUvYnV5XCIsXHJcbiAgICAgIFwicGFnZXMvaG9tZS9hcHBvaW50bWVudFwiLFxyXG4gICAgICBcInBhZ2VzL2xvZ2luXCIsXHJcbiAgICAgIFwicGFnZXMvaG9tZS90ZXh0XCJcclxuICAgIF0sXHJcbiAgICB3aW5kb3c6IHtcclxuICAgICAgYmFja2dyb3VuZENvbG9yOiBcIiNmZWZlZmVcIixcclxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogXCIjZmVmZWZlXCIsXHJcbiAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6IFwi6aaW6aG1XCIsXHJcbiAgICAgIG5hdmlnYXRpb25CYXJUZXh0U3R5bGU6IFwid2hpdGVcIixcclxuICAgICAgbmF2aWdhdGlvblN0eWxlOiBcImN1c3RvbVwiXHJcbiAgICB9LFxyXG4gICAgdGFiQmFyOiB7XHJcbiAgICAgIGNvbG9yOiBcIiM4Nzg3ODdcIixcclxuICAgICAgc2VsZWN0ZWRDb2xvcjogXCIjZmZmXCIsXHJcbiAgICAgIGJhY2tncm91bmRDb2xvcjogXCIjMzQzNDM0XCIsXHJcbiAgICAgIGJvcmRlclN0eWxlOiBcImJsYWNrXCIsXHJcbiAgICAgIGxpc3Q6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBwYWdlUGF0aDogXCJwYWdlcy9ob21lL2hvbWUxXCIsXHJcbiAgICAgICAgICB0ZXh0OiBcIummlumhtVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBwYWdlUGF0aDogXCJwYWdlcy9kb29ycy9kb29yc1wiLFxyXG4gICAgICAgICAgdGV4dDogXCLpl6jlupdcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgcGFnZVBhdGg6IFwicGFnZXMvdXNlci91c2VyXCIsXHJcbiAgICAgICAgICB0ZXh0OiBcIuaIkeeahFwiXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgcGVybWlzc2lvbjoge1xyXG4gICAgICBcInNjb3BlLnVzZXJMb2NhdGlvblwiOiB7XHJcbiAgICAgICAgZGVzYzogXCLmgqjnmoTkvY3nva7kv6Hmga/lsIbnlKjkuo7lr7vmib7pmYTov5HnmoTmo4DmtYvngrlcIlxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuICBnbG9iYWxEYXRhID0ge1xyXG4gICAgLy8g5Lit5YyW5L2c54mpXHJcbiAgICBhcHBJZDogXCJ3eDI1OTc5NjNjMzBmMjBhZmRcIixcclxuICAgIGFwcFR5cGU6IFwieGN4XCIsXHJcbiAgICB3eElkOiBcImdoX2I2OTgyNWY2NGU1OFwiLFxyXG4gICAgcGFzc3BvcnRVcmw6IFwiaHR0cHM6Ly9vbmVmaXQtcGFzc3BvcnQuanRlYW0uY24vcGFzc3BvcnQvXCIsIC8vIOiupOivgeacjeWKoeWZqFxyXG4gICAgZGF0YVVybDogXCJodHRwczovL29uZWZpdC5qdGVhbS5jbi9kYXRhL1wiLCAvLyDmlbDmja7mnI3liqHlmahcclxuICAgIHVwbG9hZFVybDogXCJodHRwczovL3VwLmp0ZWFtLmNuL1wiLFxyXG4gICAgaXNDb2FjaDogbnVsbCAvL+aYr+WQpuaYr+aVmee7g1xyXG4gIH07XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy51c2UoXCJwcm9taXNpZnlcIik7XHJcbiAgfVxyXG4gIG9uTGF1bmNoKG9wdGlvbnMpIHtcclxuICAgIC8vIOWIneWni+WMlumDveaYr+W8guatpeeahFxyXG4gICAgLy8gIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgLy8gICAgICAgICB1cmw6ICcvcGFnZXMvYW5pbWF0ZSdcclxuICAgIC8vICAgICB9KTtcclxuICAgIGFwcC5pbml0KHRoaXMuZ2xvYmFsRGF0YSwgb3B0aW9ucyk7XHJcbiAgICB3ZXB5LnNob3dTaGFyZU1lbnUoe1xyXG4gICAgICB3aXRoU2hhcmVUaWNrZXQ6IHRydWVcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=