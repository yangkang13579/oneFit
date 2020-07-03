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
            navigationBarTitleText: '田间实验',
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
            createFun: function createFun() {
                wx.navigateTo({
                    url: '/pages/createTest'
                });
            },
            go: function go(e) {
                wx.navigateTo({
                    url: '/pages/textDetails?id=' + e.currentTarget.dataset.id
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
            this.fetchDataPromise('wx/experiment/queryExperimentApi.json', {
                pageSize: this.pageSize,
                indexPage: this.indexPage
            }, {}).then(function (data) {
                data.list = data.list.map(function (item) {
                    var obj = item;
                    obj.createDates = obj.createDate.split('T')[0].split('-');
                    console.log(obj.createDates);
                    obj.createDate = obj.createDates[0] + '年' + obj.createDates[1] + '月' + obj.createDates[2] + '月';
                    return obj;
                });
                self.totalPage = data.queryParam.totalPage;
                self.list = self.list.concat(data.list);
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
            this.list = [];
            this.getList();
        }
    }]);

    return AddressBook;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(AddressBook , 'pages/done'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvbmUuanMiXSwibmFtZXMiOlsiQWRkcmVzc0Jvb2siLCJtaXhpbnMiLCJQYWdlTWl4aW4iLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwibmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvciIsImNvbXBvbmVudHMiLCJkYXRhIiwibGlzdCIsImRlbEl0ZW0iLCJzaG93VG9hc3QiLCJlcnJvciIsInVzZXIiLCJwYWdlU2l6ZSIsInRvdGFsUGFnZSIsImluZGV4UGFnZSIsIm1ldGhvZHMiLCJjcmVhdGVGdW4iLCJ3eCIsIm5hdmlnYXRlVG8iLCJ1cmwiLCJnbyIsImUiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YXNldCIsImlkIiwidG9hc3QiLCJnZXRMaXN0Iiwic2VsZiIsImZldGNoRGF0YVByb21pc2UiLCJ0aGVuIiwibWFwIiwib2JqIiwiaXRlbSIsImNyZWF0ZURhdGVzIiwiY3JlYXRlRGF0ZSIsInNwbGl0IiwiY29uc29sZSIsImxvZyIsInF1ZXJ5UGFyYW0iLCJjb25jYXQiLCIkYXBwbHkiLCJ0aGF0Iiwic2V0VGltZW91dCIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNFOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUNxQkEsVzs7Ozs7Ozs7Ozs7Ozs7b01BQ25CQyxNLEdBQVMsQ0FBQ0MsY0FBRCxDLFFBQ1RDLE0sR0FBUztBQUNMQyxvQ0FBd0IsTUFEbkI7QUFFTEMsMENBQThCO0FBRnpCLFMsUUFJVEMsVSxHQUFhLEUsUUFFYkMsSSxHQUFPO0FBQ0hDLGtCQUFNLEVBREg7QUFFSEMscUJBQVMsSUFGTjtBQUdIQyx1QkFBVyxLQUhSO0FBSUhDLG1CQUFPLEVBSko7QUFLSEMsa0JBQU0sTUFBS0EsSUFMUjtBQU1IQyxzQkFBVSxFQU5QO0FBT0hDLHVCQUFXLENBUFI7QUFRSEMsdUJBQVc7QUFSUixTLFFBZ0RQQyxPLEdBQVU7QUFDTkMscUJBRE0sdUJBQ007QUFDUkMsbUJBQUdDLFVBQUgsQ0FBYztBQUNWQyx5QkFBSztBQURLLGlCQUFkO0FBR0gsYUFMSztBQU1OQyxjQU5NLGNBTUhDLENBTkcsRUFNQTtBQUNGSixtQkFBR0MsVUFBSCxDQUFjO0FBQ1ZDLHlCQUFLLDJCQUEyQkUsRUFBRUMsYUFBRixDQUFnQkMsT0FBaEIsQ0FBd0JDO0FBRDlDLGlCQUFkO0FBR0g7QUFWSyxTOzs7Ozt3Q0F0Q007QUFDWixnQkFBSSxLQUFLVixTQUFMLElBQWtCLEtBQUtELFNBQTNCLEVBQXNDO0FBQ2xDLHFCQUFLWSxLQUFMLENBQVcsT0FBWDtBQUNBO0FBQ0g7QUFDRCxpQkFBS1gsU0FBTDtBQUNBO0FBQ0E7QUFDQSxpQkFBS1ksT0FBTDtBQUNIO0FBQ0Q7Ozs7a0NBQ1c7QUFDUCxnQkFBTUMsT0FBTyxJQUFiO0FBQ0EsaUJBQUtDLGdCQUFMLENBQXNCLHVDQUF0QixFQUErRDtBQUMzRGhCLDBCQUFVLEtBQUtBLFFBRDRDO0FBRTNERSwyQkFBVyxLQUFLQTtBQUYyQyxhQUEvRCxFQUdHLEVBSEgsRUFJS2UsSUFKTCxDQUlVLFVBQVN2QixJQUFULEVBQWU7QUFDakJBLHFCQUFLQyxJQUFMLEdBQVlELEtBQUtDLElBQUwsQ0FBVXVCLEdBQVYsQ0FBYyxnQkFBUTtBQUM5Qix3QkFBSUMsTUFBTUMsSUFBVjtBQUNBRCx3QkFBSUUsV0FBSixHQUFrQkYsSUFBSUcsVUFBSixDQUFlQyxLQUFmLENBQXFCLEdBQXJCLEVBQTBCLENBQTFCLEVBQTZCQSxLQUE3QixDQUFtQyxHQUFuQyxDQUFsQjtBQUNBQyw0QkFBUUMsR0FBUixDQUFZTixJQUFJRSxXQUFoQjtBQUNBRix3QkFBSUcsVUFBSixHQUFpQkgsSUFBSUUsV0FBSixDQUFnQixDQUFoQixJQUFxQixHQUFyQixHQUEyQkYsSUFBSUUsV0FBSixDQUFnQixDQUFoQixDQUEzQixHQUFnRCxHQUFoRCxHQUFzREYsSUFBSUUsV0FBSixDQUFnQixDQUFoQixDQUF0RCxHQUEyRSxHQUE1RjtBQUNBLDJCQUFPRixHQUFQO0FBQ0gsaUJBTlcsQ0FBWjtBQU9BSixxQkFBS2QsU0FBTCxHQUFpQlAsS0FBS2dDLFVBQUwsQ0FBZ0J6QixTQUFqQztBQUNBYyxxQkFBS3BCLElBQUwsR0FBWW9CLEtBQUtwQixJQUFMLENBQVVnQyxNQUFWLENBQWlCakMsS0FBS0MsSUFBdEIsQ0FBWjtBQUNBb0IscUJBQUthLE1BQUw7QUFDSCxhQWZMO0FBZ0JIOzs7OEJBQ005QixLLEVBQU87QUFDVixpQkFBS0QsU0FBTCxHQUFpQixJQUFqQjtBQUNBLGlCQUFLQyxLQUFMLEdBQWFBLEtBQWI7QUFDQSxnQkFBSStCLE9BQU8sSUFBWDtBQUNBQyx1QkFBVyxZQUFNO0FBQ2JELHFCQUFLaEMsU0FBTCxHQUFpQixLQUFqQjtBQUNILGFBRkQsRUFFRyxJQUZIO0FBR0g7OztpQ0FhUyxDQUNUOzs7MkNBQ2tCO0FBQ2YsaUJBQUtGLElBQUwsR0FBWSxFQUFaO0FBQ0EsaUJBQUttQixPQUFMO0FBQ0g7Ozs7RUF6RXNDaUIsZUFBS0MsSTs7a0JBQXpCN0MsVyIsImZpbGUiOiJkb25lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbiAgaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XHJcbiAgaW1wb3J0IFBhZ2VNaXhpbiBmcm9tICcuLi9taXhpbnMvcGFnZSc7XHJcbiAgZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWRkcmVzc0Jvb2sgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG4gICAgbWl4aW5zID0gW1BhZ2VNaXhpbl07XHJcbiAgICBjb25maWcgPSB7XHJcbiAgICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+eUsOmXtOWunumqjCcsXHJcbiAgICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNmZmYnXHJcbiAgICB9O1xyXG4gICAgY29tcG9uZW50cyA9IHtcclxuICAgIH07XHJcbiAgICBkYXRhID0ge1xyXG4gICAgICAgIGxpc3Q6IFtdLFxyXG4gICAgICAgIGRlbEl0ZW06IG51bGwsXHJcbiAgICAgICAgc2hvd1RvYXN0OiBmYWxzZSxcclxuICAgICAgICBlcnJvcjogJycsXHJcbiAgICAgICAgdXNlcjogdGhpcy51c2VyLFxyXG4gICAgICAgIHBhZ2VTaXplOiAxMCxcclxuICAgICAgICB0b3RhbFBhZ2U6IDAsXHJcbiAgICAgICAgaW5kZXhQYWdlOiAwXHJcbiAgICB9O1xyXG4gICAgb25SZWFjaEJvdHRvbSgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbmRleFBhZ2UgPj0gdGhpcy50b3RhbFBhZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy50b2FzdCgn5peg5pu05aSa5pWw5o2uJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbmRleFBhZ2UrKztcclxuICAgICAgICAvLyDkuIvmi4nop6blupXvvIzlhYjliKTmlq3mmK/lkKbmnInor7fmsYLmraPlnKjov5vooYzkuK1cclxuICAgICAgICAvLyDku6Xlj4rmo4Dmn6XlvZPliY3or7fmsYLpobXmlbDmmK/kuI3mmK/lsI/kuo7mlbDmja7mgLvpobXmlbDvvIzlpoLnrKblkIjmnaHku7bvvIzliJnlj5HpgIHor7fmsYJcclxuICAgICAgICB0aGlzLmdldExpc3QoKTtcclxuICAgIH1cclxuICAgIC8vIOiOt+WPluWIl+ihqFxyXG4gICAgZ2V0TGlzdCAoKSB7XHJcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5mZXRjaERhdGFQcm9taXNlKCd3eC9leHBlcmltZW50L3F1ZXJ5RXhwZXJpbWVudEFwaS5qc29uJywge1xyXG4gICAgICAgICAgICBwYWdlU2l6ZTogdGhpcy5wYWdlU2l6ZSxcclxuICAgICAgICAgICAgaW5kZXhQYWdlOiB0aGlzLmluZGV4UGFnZVxyXG4gICAgICAgIH0sIHt9KVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmxpc3QgPSBkYXRhLmxpc3QubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBvYmogPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIG9iai5jcmVhdGVEYXRlcyA9IG9iai5jcmVhdGVEYXRlLnNwbGl0KCdUJylbMF0uc3BsaXQoJy0nKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhvYmouY3JlYXRlRGF0ZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIG9iai5jcmVhdGVEYXRlID0gb2JqLmNyZWF0ZURhdGVzWzBdICsgJ+W5tCcgKyBvYmouY3JlYXRlRGF0ZXNbMV0gKyAn5pyIJyArIG9iai5jcmVhdGVEYXRlc1syXSArICfmnIgnO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHNlbGYudG90YWxQYWdlID0gZGF0YS5xdWVyeVBhcmFtLnRvdGFsUGFnZTtcclxuICAgICAgICAgICAgICAgIHNlbGYubGlzdCA9IHNlbGYubGlzdC5jb25jYXQoZGF0YS5saXN0KTtcclxuICAgICAgICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgdG9hc3QgKGVycm9yKSB7XHJcbiAgICAgICAgdGhpcy5zaG93VG9hc3QgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZXJyb3IgPSBlcnJvcjtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoYXQuc2hvd1RvYXN0ID0gZmFsc2U7XHJcbiAgICAgICAgfSwgMjAwMCk7XHJcbiAgICB9XHJcbiAgICBtZXRob2RzID0ge1xyXG4gICAgICAgIGNyZWF0ZUZ1bigpIHtcclxuICAgICAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvY3JlYXRlVGVzdCdcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnbyhlKSB7XHJcbiAgICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL3RleHREZXRhaWxzP2lkPScgKyBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBvbkxvYWQgKCkge1xyXG4gICAgfVxyXG4gICAgd2hlbkFwcFJlYWR5U2hvdygpIHtcclxuICAgICAgICB0aGlzLmxpc3QgPSBbXTtcclxuICAgICAgICB0aGlzLmdldExpc3QoKTtcclxuICAgIH1cclxuICB9XHJcbiJdfQ==