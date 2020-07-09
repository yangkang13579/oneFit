'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _page = require('./../../mixins/page.js');

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* global wx */


var Lesson = function (_wepy$page) {
  _inherits(Lesson, _wepy$page);

  function Lesson() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Lesson);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Lesson.__proto__ || Object.getPrototypeOf(Lesson)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
      // navigationBarTitleText: '会员卡列表',
      // navigationStyle: 'default',
      // navigationBarBackgroundColor: '#e84644'
    }, _this.components = {}, _this.data = {
      hide: false,
      hideTwo: false,
      model: '',
      modelpeople: '',
      tab: 1,
      list: [{
        name: '团课',
        id: 0
      }, {
        name: '模体工房团课',
        id: 1
      }, {
        name: '网易企业团课',
        id: 2
      }, {
        name: '广发银行企业团课',
        id: 3
      }, {
        name: '信谊医药企业团课',
        id: 4
      }],
      people: [{
        name: 'OneFit彭',
        id: 0
      }, {
        name: 'OneFit杨',
        id: 1
      }, {
        name: 'OneFit王',
        id: 2
      }, {
        name: 'OneFit利',
        id: 3
      }, {
        name: 'OneFit赵',
        id: 4
      }, {
        name: 'OneFit赵',
        id: 5
      }, {
        name: 'OneFit孙',
        id: 6
      }, {
        name: 'OneFit周',
        id: 7
      }]
    }, _this.methods = {
      selcetPle: function selcetPle(e) {
        var self = this;
        var id = e.currentTarget.dataset.item.id;
        var people = this.people;
        people.map(function (item, index) {
          if (item.id == id) {
            if (item.check == 0) {
              item.check = 1;
              self.modelpeople = item.name;
            }
          } else {
            item.check = 0;
          }
        });
        this.hideTwo = false;
      },
      selcet: function selcet(e) {
        var self = this;
        var id = e.currentTarget.dataset.item.id;
        var list = this.list;
        list.map(function (item, index) {
          if (item.id == id) {
            if (item.check == 0) {
              item.check = 1;
              self.model = item.name;
            }
          } else {
            item.check = 0;
          }
        });
        this.hide = false;
      },
      inputText: function inputText() {
        this.hide = true;
      },
      inputPeople: function inputPeople() {
        this.hideTwo = true;
      },
      hideTwo: function hideTwo() {
        this.hideTwo = false;
      },
      hide: function hide() {
        this.hide = false;
      },
      btn: function btn() {},
      back: function back() {
        wx.navigateBack({
          delta: 1
        });
      },
      tabs: function tabs() {
        console.log("this.tab", this.tab);
        if (this.tab == 1) {
          this.tab = 2;
        } else {
          this.tab = 1;
        }
        this.$apply();
      },
      goDetail: function goDetail() {
        wx.navigateTo({
          url: 'card'
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  // mixins = [PageMixin];


  _createClass(Lesson, [{
    key: 'onReachBottom',
    value: function onReachBottom() {}
  }, {
    key: 'whenAppReadyShow',
    value: function whenAppReadyShow() {
      var _this2 = this;

      this.fetchDataPromise('user/userInfo.json', {}).then(function (data) {
        var userInfo = data;
        _this2.$apply();
        wx.setStorage({
          key: 'userInfo',
          data: JSON.stringify(userInfo)
        });
      }).catch(function (error) {});
    }
  }, {
    key: 'onShow',
    value: function onShow() {
      var list = this.list;
      list.map(function (item, index) {
        item.check = 0;
      });
      this.list = list;

      var people = this.people;
      people.map(function (item, index) {
        item.check = 0;
      });
      this.people = people;
      console.log('this.people', this.people);
    }
  }, {
    key: 'onShareAppMessage',
    value: function onShareAppMessage(res) {}
  }, {
    key: 'regionchange',
    value: function regionchange(e) {
      console.log(e.type);
    }
  }, {
    key: 'markertap',
    value: function markertap(e) {
      console.log(e.markerId);
    }
  }, {
    key: 'controltap',
    value: function controltap(e) {
      console.log(e.controlId);
    }
  }]);

  return Lesson;
}(_wepy2.default.page);


Page(require('./../../npm/wepy/lib/wepy.js').default.$createPage(Lesson , 'pages/coursed/lesson'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxlc3Nvbi5qcyJdLCJuYW1lcyI6WyJMZXNzb24iLCJjb25maWciLCJjb21wb25lbnRzIiwiZGF0YSIsImhpZGUiLCJoaWRlVHdvIiwibW9kZWwiLCJtb2RlbHBlb3BsZSIsInRhYiIsImxpc3QiLCJuYW1lIiwiaWQiLCJwZW9wbGUiLCJtZXRob2RzIiwic2VsY2V0UGxlIiwiZSIsInNlbGYiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YXNldCIsIml0ZW0iLCJtYXAiLCJpbmRleCIsImNoZWNrIiwic2VsY2V0IiwiaW5wdXRUZXh0IiwiaW5wdXRQZW9wbGUiLCJidG4iLCJiYWNrIiwid3giLCJuYXZpZ2F0ZUJhY2siLCJkZWx0YSIsInRhYnMiLCJjb25zb2xlIiwibG9nIiwiJGFwcGx5IiwiZ29EZXRhaWwiLCJuYXZpZ2F0ZVRvIiwidXJsIiwiZmV0Y2hEYXRhUHJvbWlzZSIsInRoZW4iLCJ1c2VySW5mbyIsInNldFN0b3JhZ2UiLCJrZXkiLCJKU09OIiwic3RyaW5naWZ5IiwiY2F0Y2giLCJlcnJvciIsInJlcyIsInR5cGUiLCJtYXJrZXJJZCIsImNvbnRyb2xJZCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0FBRkE7OztJQUdxQkEsTTs7Ozs7Ozs7Ozs7Ozs7c0xBRW5CQyxNLEdBQVM7QUFDTDtBQUNBO0FBQ0E7QUFISyxLLFFBS1RDLFUsR0FBYSxFLFFBQ2JDLEksR0FBTztBQUNMQyxZQUFLLEtBREE7QUFFTEMsZUFBUSxLQUZIO0FBR0xDLGFBQU0sRUFIRDtBQUlMQyxtQkFBWSxFQUpQO0FBS0pDLFdBQUssQ0FMRDtBQU1KQyxZQUFLLENBQ0g7QUFDRUMsY0FBSyxJQURQO0FBRUVDLFlBQUc7QUFGTCxPQURHLEVBS0g7QUFDRUQsY0FBSyxRQURQO0FBRUVDLFlBQUc7QUFGTCxPQUxHLEVBU0g7QUFDRUQsY0FBSyxRQURQO0FBRUVDLFlBQUc7QUFGTCxPQVRHLEVBYUg7QUFDRUQsY0FBSyxVQURQ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QUFSLENBQVlsQixFQUFFa0MsUUFBZDtBQUNIOzs7K0JBQ1VsQyxDLEVBQUc7QUFDVmlCLGNBQVFDLEdBQVIsQ0FBWWxCLEVBQUVtQyxTQUFkO0FBQ0g7Ozs7RUFsTGlDQyxlQUFLQyxJOztrQkFBcEJwRCxNIiwiZmlsZSI6Imxlc3Nvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKiBnbG9iYWwgd3ggKi9cclxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbmltcG9ydCBQYWdlTWl4aW4gZnJvbSAnLi4vLi4vbWl4aW5zL3BhZ2UnO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMZXNzb24gZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gIC8vIG1peGlucyA9IFtQYWdlTWl4aW5dO1xyXG4gIGNvbmZpZyA9IHtcclxuICAgICAgLy8gbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+S8muWRmOWNoeWIl+ihqCcsXHJcbiAgICAgIC8vIG5hdmlnYXRpb25TdHlsZTogJ2RlZmF1bHQnLFxyXG4gICAgICAvLyBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiAnI2U4NDY0NCdcclxuICB9O1xyXG4gIGNvbXBvbmVudHMgPSB7fTtcclxuICBkYXRhID0ge1xyXG4gICAgaGlkZTpmYWxzZSxcclxuICAgIGhpZGVUd286ZmFsc2UsXHJcbiAgICBtb2RlbDonJyxcclxuICAgIG1vZGVscGVvcGxlOicnLFxyXG4gICAgIHRhYjogMSxcclxuICAgICBsaXN0OltcclxuICAgICAgIHtcclxuICAgICAgICAgbmFtZTon5Zui6K++JyxcclxuICAgICAgICAgaWQ6MCxcclxuICAgICAgIH0sXHJcbiAgICAgICB7XHJcbiAgICAgICAgIG5hbWU6J+aooeS9k+W3peaIv+WbouivvicsXHJcbiAgICAgICAgIGlkOjEsXHJcbiAgICAgICB9LFxyXG4gICAgICAge1xyXG4gICAgICAgICBuYW1lOifnvZHmmJPkvIHkuJrlm6Lor74nLFxyXG4gICAgICAgICBpZDoyLFxyXG4gICAgICAgfSxcclxuICAgICAgIHtcclxuICAgICAgICAgbmFtZTon5bm/5Y+R6ZO26KGM5LyB5Lia5Zui6K++JyxcclxuICAgICAgICAgaWQ6MyxcclxuICAgICAgIH0sXHJcbiAgICAgICB7XHJcbiAgICAgICAgIG5hbWU6J+S/oeiwiuWMu+iNr+S8geS4muWbouivvicsXHJcbiAgICAgICAgIGlkOjQsXHJcbiAgICAgICB9LFxyXG4gICAgIF0sXHJcbiAgICAgcGVvcGxlOltcclxuICAgICAgIHtcclxuICAgICAgICAgbmFtZTonT25lRml05b2tJyxcclxuICAgICAgICAgaWQ6MCxcclxuICAgICAgIH0sXHJcbiAgICAgICB7XHJcbiAgICAgICAgIG5hbWU6J09uZUZpdOadqCcsXHJcbiAgICAgICAgIGlkOjEsXHJcbiAgICAgICB9LFxyXG4gICAgICAge1xyXG4gICAgICAgICBuYW1lOidPbmVGaXTnjosnLFxyXG4gICAgICAgICBpZDoyLFxyXG4gICAgICAgfSxcclxuICAgICAgIHtcclxuICAgICAgICAgbmFtZTonT25lRml05YipJyxcclxuICAgICAgICAgaWQ6MyxcclxuICAgICAgIH0sXHJcbiAgICAgICB7XHJcbiAgICAgICAgIG5hbWU6J09uZUZpdOi1tScsXHJcbiAgICAgICAgIGlkOjQsXHJcbiAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgbmFtZTonT25lRml06LW1JyxcclxuICAgICAgICAgaWQ6NSxcclxuICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICBuYW1lOidPbmVGaXTlrZknLFxyXG4gICAgICAgICBpZDo2LFxyXG4gICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgIG5hbWU6J09uZUZpdOWRqCcsXHJcbiAgICAgICAgIGlkOjcsXHJcbiAgICAgICB9LFxyXG4gICAgIF0sXHJcbiAgfTtcclxuICBtZXRob2RzID0ge1xyXG4gICAgc2VsY2V0UGxlKGUpe1xyXG4gICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICAgIGxldCBpZCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0Lml0ZW0uaWQ7XHJcbiAgICAgIGxldCBwZW9wbGUgPSB0aGlzLnBlb3BsZTtcclxuICAgICAgcGVvcGxlLm1hcCgoaXRlbSxpbmRleCk9PntcclxuICAgICAgICBpZihpdGVtLmlkID09IGlkKXtcclxuICAgICAgICAgIGlmKGl0ZW0uY2hlY2s9PTApe1xyXG4gICAgICAgICAgICBpdGVtLmNoZWNrID0xO1xyXG4gICAgICAgICAgICBzZWxmLm1vZGVscGVvcGxlID0gaXRlbS5uYW1lXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICBpdGVtLmNoZWNrID0wO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgdGhpcy5oaWRlVHdvID0gZmFsc2U7XHJcbiAgICB9LFxyXG4gICAgc2VsY2V0KGUpe1xyXG4gICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICAgIGxldCBpZCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0Lml0ZW0uaWQ7XHJcbiAgICAgIGxldCBsaXN0ID0gdGhpcy5saXN0O1xyXG4gICAgICBsaXN0Lm1hcCgoaXRlbSxpbmRleCk9PntcclxuICAgICAgICBpZihpdGVtLmlkID09IGlkKXtcclxuICAgICAgICAgIGlmKGl0ZW0uY2hlY2s9PTApe1xyXG4gICAgICAgICAgICBpdGVtLmNoZWNrID0xO1xyXG4gICAgICAgICAgICBzZWxmLm1vZGVsID0gaXRlbS5uYW1lXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICBpdGVtLmNoZWNrID0wO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgdGhpcy5oaWRlID0gZmFsc2U7XHJcbiAgICB9LFxyXG4gICAgaW5wdXRUZXh0KCl7XHJcbiAgICAgICB0aGlzLmhpZGUgPSB0cnVlO1xyXG4gICAgfSxcclxuICAgIGlucHV0UGVvcGxlKCl7XHJcbiAgICAgIHRoaXMuaGlkZVR3byA9IHRydWU7XHJcbiAgICB9LFxyXG4gICAgaGlkZVR3bygpe1xyXG4gICAgIHRoaXMuaGlkZVR3byA9IGZhbHNlO1xyXG4gICAgfSxcclxuICAgIGhpZGUoKXtcclxuICAgICAgdGhpcy5oaWRlID0gZmFsc2U7XHJcbiAgICB9LFxyXG4gICAgYnRuKCl7XHJcblxyXG4gICAgfSxcclxuICAgICBiYWNrKCl7XHJcbiAgICAgIHd4Lm5hdmlnYXRlQmFjayh7XHJcbiAgICAgICAgZGVsdGE6IDFcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICAgXHJcbiAgICAgdGFicygpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJ0aGlzLnRhYlwiLCB0aGlzLnRhYik7XHJcbiAgICAgIGlmICh0aGlzLnRhYiA9PSAxKSB7XHJcbiAgICAgICAgdGhpcy50YWIgPSAyO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMudGFiID0gMTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgfSxcclxuICAgICAgZ29EZXRhaWwoKSB7XHJcbiAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgICAgICB1cmw6ICdjYXJkJ1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICB9O1xyXG5cclxuICBvblJlYWNoQm90dG9tKCkge31cclxuXHJcbiAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCd1c2VyL3VzZXJJbmZvLmpzb24nLCB7fSlcclxuICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHVzZXJJbmZvID0gZGF0YTtcclxuICAgICAgICAgICAgICB0aGlzLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICBrZXk6ICd1c2VySW5mbycsXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHVzZXJJbmZvKVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge30pO1xyXG4gIH1cclxuICBvblNob3coKSB7XHJcbiAgICBsZXQgbGlzdCA9IHRoaXMubGlzdDtcclxuICAgIGxpc3QubWFwKChpdGVtLGluZGV4KT0+e1xyXG4gICAgICBpdGVtLmNoZWNrID0gMFxyXG4gICAgfSlcclxuICAgIHRoaXMubGlzdCA9IGxpc3Q7XHJcblxyXG4gICAgbGV0IHBlb3BsZSA9IHRoaXMucGVvcGxlO1xyXG4gICAgcGVvcGxlLm1hcCgoaXRlbSxpbmRleCk9PntcclxuICAgICAgaXRlbS5jaGVjayA9IDBcclxuICAgIH0pXHJcbiAgICB0aGlzLnBlb3BsZSA9IHBlb3BsZTtcclxuICAgIGNvbnNvbGUubG9nKCd0aGlzLnBlb3BsZScsdGhpcy5wZW9wbGUpXHJcbiAgfVxyXG4gIG9uU2hhcmVBcHBNZXNzYWdlKHJlcykge31cclxuICByZWdpb25jaGFuZ2UoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlLnR5cGUpO1xyXG4gIH1cclxuICBtYXJrZXJ0YXAoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlLm1hcmtlcklkKTtcclxuICB9XHJcbiAgY29udHJvbHRhcChlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUuY29udHJvbElkKTtcclxuICB9XHJcbn1cclxuIl19