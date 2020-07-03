'use strict';

var _showdown = require('./showdown.js');

var _showdown2 = _interopRequireDefault(_showdown);

var _html2json = require('./html2json.js');

var _html2json2 = _interopRequireDefault(_html2json);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /**
                                                                                                                                                                                                                   * author: Di (微信小程序开发工程师)
                                                                                                                                                                                                                   * organization: WeAppDev(微信小程序开发论坛)(http://weappdev.com)
                                                                                                                                                                                                                   *               垂直微信小程序开发交流社区
                                                                                                                                                                                                                   *
                                                                                                                                                                                                                   * github地址: https://github.com/icindy/wxParse
                                                                                                                                                                                                                   *
                                                                                                                                                                                                                   * for: 微信小程序富文本解析
                                                                                                                                                                                                                   * detail : http://weappdev.com/t/wxparse-alpha0-1-html-markdown/184
                                                                                                                                                                                                                   */

/**
 * utils函数引入
 **/


/**
 * 配置及公有属性
 **/
var realWindowWidth = 0;
var realWindowHeight = 0;
wx.getSystemInfo({
    success: function success(res) {
        realWindowWidth = res.windowWidth;
        realWindowHeight = res.windowHeight;
    }
});
/**
 * 主函数入口区
 **/
function wxParse() {
    var bindName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'wxParseData';
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'html';
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '<div class="color:red;">数据不能为空</div>';
    var target = arguments[3];
    var imagePadding = arguments[4];

    var that = target;
    var transData = {}; // 存放转化后的数据
    if (type == 'html') {
        transData = _html2json2.default.html2json(data, bindName);
        console.log(JSON.stringify(transData, ' ', ' '));
    } else if (type == 'md' || type == 'markdown') {
        var converter = new _showdown2.default.Converter();
        var html = converter.makeHtml(data);
        transData = _html2json2.default.html2json(html, bindName);
        console.log(JSON.stringify(transData, ' ', ' '));
    }
    transData.view = {};
    transData.view.imagePadding = 0;
    if (typeof imagePadding !== 'undefined') {
        transData.view.imagePadding = imagePadding;
    }
    var bindData = {};
    bindData[bindName] = transData;
    that.setData(bindData);
    that.wxParseImgLoad = wxParseImgLoad;
    that.wxParseImgTap = wxParseImgTap;
}
// 图片点击事件
function wxParseImgTap(e) {
    var that = this;
    var nowImgUrl = e.target.dataset.src;
    var tagFrom = e.target.dataset.from;
    if (typeof tagFrom !== 'undefined' && tagFrom.length > 0) {
        wx.previewImage({
            current: nowImgUrl, // 当前显示图片的http链接
            urls: that.data[tagFrom].imageUrls // 需要预览的图片http链接列表
        });
    }
}

/**
 * 图片视觉宽高计算函数区
 **/
function wxParseImgLoad(e) {
    var that = this;
    var tagFrom = e.target.dataset.from;
    var idx = e.target.dataset.idx;
    if (typeof tagFrom !== 'undefined' && tagFrom.length > 0) {
        calMoreImageInfo(e, idx, that, tagFrom);
    }
}
// 假循环获取计算图片视觉最佳宽高
function calMoreImageInfo(e, idx, that, bindName) {
    var _that$setData;

    var temData = that.data[bindName];
    if (!temData || temData.images.length == 0) {
        return;
    }
    var temImages = temData.images;
    // 因为无法获取view宽度 需要自定义padding进行计算，稍后处理
    var recal = wxAutoImageCal(e.detail.width, e.detail.height, that, bindName);
    // temImages[idx].width = recal.imageWidth;
    // temImages[idx].height = recal.imageheight;
    // temData.images = temImages;
    // var bindData = {};
    // bindData[bindName] = temData;
    // that.setData(bindData);
    var index = temImages[idx].index;
    var key = '' + bindName;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = index.split('.')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var i = _step.value;
            key += '.nodes[' + i + ']';
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    var keyW = key + '.width';
    var keyH = key + '.height';
    that.setData((_that$setData = {}, _defineProperty(_that$setData, keyW, recal.imageWidth), _defineProperty(_that$setData, keyH, recal.imageheight), _that$setData));
}

// 计算视觉优先的图片宽高
function wxAutoImageCal(originalWidth, originalHeight, that, bindName) {
    // 获取图片的原始长宽
    var windowWidth = 0,
        windowHeight = 0;
    var autoWidth = 0,
        autoHeight = 0;
    var results = {};
    var padding = that.data[bindName].view.imagePadding;
    windowWidth = realWindowWidth - 2 * padding;
    windowHeight = realWindowHeight;
    // 判断按照那种方式进行缩放
    // console.log("windowWidth" + windowWidth);
    if (originalWidth > windowWidth) {
        // 在图片width大于手机屏幕width时候
        autoWidth = windowWidth;
        // console.log("autoWidth" + autoWidth);
        autoHeight = autoWidth * originalHeight / originalWidth;
        // console.log("autoHeight" + autoHeight);
        results.imageWidth = autoWidth;
        results.imageheight = autoHeight;
    } else {
        // 否则展示原来的数据
        results.imageWidth = originalWidth;
        results.imageheight = originalHeight;
    }
    return results;
}

function wxParseTemArray(temArrayName, bindNameReg, total, that) {
    var array = [];
    var temData = that.data;
    var obj = null;
    for (var i = 0; i < total; i++) {
        var simArr = temData[bindNameReg + i].nodes;
        array.push(simArr);
    }

    temArrayName = temArrayName || 'wxParseTemArray';
    obj = JSON.parse('{"' + temArrayName + '":""}');
    obj[temArrayName] = array;
    that.setData(obj);
}

/**
 * 配置emojis
 *
 */

function emojisInit() {
    var reg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var baseSrc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/wxParse/emojis/';
    var emojis = arguments[2];

    _html2json2.default.emojisInit(reg, baseSrc, emojis);
}

module.exports = {
    wxParse: wxParse,
    wxParseTemArray: wxParseTemArray,
    emojisInit: emojisInit
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInd4UGFyc2UuanMiXSwibmFtZXMiOlsicmVhbFdpbmRvd1dpZHRoIiwicmVhbFdpbmRvd0hlaWdodCIsInd4IiwiZ2V0U3lzdGVtSW5mbyIsInN1Y2Nlc3MiLCJyZXMiLCJ3aW5kb3dXaWR0aCIsIndpbmRvd0hlaWdodCIsInd4UGFyc2UiLCJiaW5kTmFtZSIsInR5cGUiLCJkYXRhIiwidGFyZ2V0IiwiaW1hZ2VQYWRkaW5nIiwidGhhdCIsInRyYW5zRGF0YSIsIkh0bWxUb0pzb24iLCJodG1sMmpzb24iLCJjb25zb2xlIiwibG9nIiwiSlNPTiIsInN0cmluZ2lmeSIsImNvbnZlcnRlciIsInNob3dkb3duIiwiQ29udmVydGVyIiwiaHRtbCIsIm1ha2VIdG1sIiwidmlldyIsImJpbmREYXRhIiwic2V0RGF0YSIsInd4UGFyc2VJbWdMb2FkIiwid3hQYXJzZUltZ1RhcCIsImUiLCJub3dJbWdVcmwiLCJkYXRhc2V0Iiwic3JjIiwidGFnRnJvbSIsImZyb20iLCJsZW5ndGgiLCJwcmV2aWV3SW1hZ2UiLCJjdXJyZW50IiwidXJscyIsImltYWdlVXJscyIsImlkeCIsImNhbE1vcmVJbWFnZUluZm8iLCJ0ZW1EYXRhIiwiaW1hZ2VzIiwidGVtSW1hZ2VzIiwicmVjYWwiLCJ3eEF1dG9JbWFnZUNhbCIsImRldGFpbCIsIndpZHRoIiwiaGVpZ2h0IiwiaW5kZXgiLCJrZXkiLCJzcGxpdCIsImkiLCJrZXlXIiwia2V5SCIsImltYWdlV2lkdGgiLCJpbWFnZWhlaWdodCIsIm9yaWdpbmFsV2lkdGgiLCJvcmlnaW5hbEhlaWdodCIsImF1dG9XaWR0aCIsImF1dG9IZWlnaHQiLCJyZXN1bHRzIiwicGFkZGluZyIsInd4UGFyc2VUZW1BcnJheSIsInRlbUFycmF5TmFtZSIsImJpbmROYW1lUmVnIiwidG90YWwiLCJhcnJheSIsIm9iaiIsInNpbUFyciIsIm5vZGVzIiwicHVzaCIsInBhcnNlIiwiZW1vamlzSW5pdCIsInJlZyIsImJhc2VTcmMiLCJlbW9qaXMiLCJtb2R1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O0FBQ0FJLFVBQU1wRCxLQUFLd0QsS0FBTCxDQUFXLE9BQU9SLFlBQVAsR0FBc0IsT0FBakMsQ0FBTjtBQUNBSSxRQUFJSixZQUFKLElBQW9CRyxLQUFwQjtBQUNBekQsU0FBS2UsT0FBTCxDQUFhMkMsR0FBYjtBQUNIOztBQUVEOzs7OztBQUtBLFNBQVNLLFVBQVQsR0FBb0U7QUFBQSxRQUFoREMsR0FBZ0QsdUVBQTFDLEVBQTBDO0FBQUEsUUFBdENDLE9BQXNDLHVFQUE1QixrQkFBNEI7QUFBQSxRQUFSQyxNQUFROztBQUNoRWhFLHdCQUFXNkQsVUFBWCxDQUFzQkMsR0FBdEIsRUFBMkJDLE9BQTNCLEVBQW9DQyxNQUFwQztBQUNIOztBQUVEQyxPQUFPQyxPQUFQLEdBQWlCO0FBQ2IxRSxhQUFTQSxPQURJO0FBRWIyRCxxQkFBaUJBLGVBRko7QUFHYlUsZ0JBQVlBO0FBSEMsQ0FBakIiLCJmaWxlIjoid3hQYXJzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBhdXRob3I6IERpICjlvq7kv6HlsI/nqIvluo/lvIDlj5Hlt6XnqIvluIgpXHJcbiAqIG9yZ2FuaXphdGlvbjogV2VBcHBEZXYo5b6u5L+h5bCP56iL5bqP5byA5Y+R6K665Z2bKShodHRwOi8vd2VhcHBkZXYuY29tKVxyXG4gKiAgICAgICAgICAgICAgIOWeguebtOW+ruS/oeWwj+eoi+W6j+W8gOWPkeS6pOa1geekvuWMulxyXG4gKlxyXG4gKiBnaXRodWLlnLDlnYA6IGh0dHBzOi8vZ2l0aHViLmNvbS9pY2luZHkvd3hQYXJzZVxyXG4gKlxyXG4gKiBmb3I6IOW+ruS/oeWwj+eoi+W6j+WvjOaWh+acrOino+aekFxyXG4gKiBkZXRhaWwgOiBodHRwOi8vd2VhcHBkZXYuY29tL3Qvd3hwYXJzZS1hbHBoYTAtMS1odG1sLW1hcmtkb3duLzE4NFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiB1dGlsc+WHveaVsOW8leWFpVxyXG4gKiovXHJcbmltcG9ydCBzaG93ZG93biBmcm9tICcuL3Nob3dkb3duLmpzJztcclxuaW1wb3J0IEh0bWxUb0pzb24gZnJvbSAnLi9odG1sMmpzb24uanMnO1xyXG4vKipcclxuICog6YWN572u5Y+K5YWs5pyJ5bGe5oCnXHJcbiAqKi9cclxudmFyIHJlYWxXaW5kb3dXaWR0aCA9IDA7XHJcbnZhciByZWFsV2luZG93SGVpZ2h0ID0gMDtcclxud3guZ2V0U3lzdGVtSW5mbyh7XHJcbiAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgcmVhbFdpbmRvd1dpZHRoID0gcmVzLndpbmRvd1dpZHRoO1xyXG4gICAgICAgIHJlYWxXaW5kb3dIZWlnaHQgPSByZXMud2luZG93SGVpZ2h0O1xyXG4gICAgfVxyXG59KTtcclxuLyoqXHJcbiAqIOS4u+WHveaVsOWFpeWPo+WMulxyXG4gKiovXHJcbmZ1bmN0aW9uIHd4UGFyc2UoYmluZE5hbWUgPSAnd3hQYXJzZURhdGEnLCB0eXBlID0gJ2h0bWwnLCBkYXRhID0gJzxkaXYgY2xhc3M9XCJjb2xvcjpyZWQ7XCI+5pWw5o2u5LiN6IO95Li656m6PC9kaXY+JywgdGFyZ2V0LCBpbWFnZVBhZGRpbmcpIHtcclxuICAgIHZhciB0aGF0ID0gdGFyZ2V0O1xyXG4gICAgdmFyIHRyYW5zRGF0YSA9IHt9Oy8vIOWtmOaUvui9rOWMluWQjueahOaVsOaNrlxyXG4gICAgaWYgKHR5cGUgPT0gJ2h0bWwnKSB7XHJcbiAgICAgICAgdHJhbnNEYXRhID0gSHRtbFRvSnNvbi5odG1sMmpzb24oZGF0YSwgYmluZE5hbWUpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHRyYW5zRGF0YSwgJyAnLCAnICcpKTtcclxuICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnbWQnIHx8IHR5cGUgPT0gJ21hcmtkb3duJykge1xyXG4gICAgICAgIHZhciBjb252ZXJ0ZXIgPSBuZXcgc2hvd2Rvd24uQ29udmVydGVyKCk7XHJcbiAgICAgICAgdmFyIGh0bWwgPSBjb252ZXJ0ZXIubWFrZUh0bWwoZGF0YSk7XHJcbiAgICAgICAgdHJhbnNEYXRhID0gSHRtbFRvSnNvbi5odG1sMmpzb24oaHRtbCwgYmluZE5hbWUpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHRyYW5zRGF0YSwgJyAnLCAnICcpKTtcclxuICAgIH1cclxuICAgIHRyYW5zRGF0YS52aWV3ID0ge307XHJcbiAgICB0cmFuc0RhdGEudmlldy5pbWFnZVBhZGRpbmcgPSAwO1xyXG4gICAgaWYgKHR5cGVvZiAoaW1hZ2VQYWRkaW5nKSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICB0cmFuc0RhdGEudmlldy5pbWFnZVBhZGRpbmcgPSBpbWFnZVBhZGRpbmc7XHJcbiAgICB9XHJcbiAgICB2YXIgYmluZERhdGEgPSB7fTtcclxuICAgIGJpbmREYXRhW2JpbmROYW1lXSA9IHRyYW5zRGF0YTtcclxuICAgIHRoYXQuc2V0RGF0YShiaW5kRGF0YSk7XHJcbiAgICB0aGF0Lnd4UGFyc2VJbWdMb2FkID0gd3hQYXJzZUltZ0xvYWQ7XHJcbiAgICB0aGF0Lnd4UGFyc2VJbWdUYXAgPSB3eFBhcnNlSW1nVGFwO1xyXG59XHJcbi8vIOWbvueJh+eCueWHu+S6i+S7tlxyXG5mdW5jdGlvbiB3eFBhcnNlSW1nVGFwKGUpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHZhciBub3dJbWdVcmwgPSBlLnRhcmdldC5kYXRhc2V0LnNyYztcclxuICAgIHZhciB0YWdGcm9tID0gZS50YXJnZXQuZGF0YXNldC5mcm9tO1xyXG4gICAgaWYgKHR5cGVvZiAodGFnRnJvbSkgIT09ICd1bmRlZmluZWQnICYmIHRhZ0Zyb20ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHd4LnByZXZpZXdJbWFnZSh7XHJcbiAgICAgICAgICAgIGN1cnJlbnQ6IG5vd0ltZ1VybCwgLy8g5b2T5YmN5pi+56S65Zu+54mH55qEaHR0cOmTvuaOpVxyXG4gICAgICAgICAgICB1cmxzOiB0aGF0LmRhdGFbdGFnRnJvbV0uaW1hZ2VVcmxzIC8vIOmcgOimgemihOiniOeahOWbvueJh2h0dHDpk77mjqXliJfooahcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOWbvueJh+inhuinieWuvemrmOiuoeeul+WHveaVsOWMulxyXG4gKiovXHJcbmZ1bmN0aW9uIHd4UGFyc2VJbWdMb2FkKGUpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHZhciB0YWdGcm9tID0gZS50YXJnZXQuZGF0YXNldC5mcm9tO1xyXG4gICAgdmFyIGlkeCA9IGUudGFyZ2V0LmRhdGFzZXQuaWR4O1xyXG4gICAgaWYgKHR5cGVvZiAodGFnRnJvbSkgIT09ICd1bmRlZmluZWQnICYmIHRhZ0Zyb20ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGNhbE1vcmVJbWFnZUluZm8oZSwgaWR4LCB0aGF0LCB0YWdGcm9tKTtcclxuICAgIH1cclxufVxyXG4vLyDlgYflvqrnjq/ojrflj5borqHnrpflm77niYfop4bop4nmnIDkvbPlrr3pq5hcclxuZnVuY3Rpb24gY2FsTW9yZUltYWdlSW5mbyhlLCBpZHgsIHRoYXQsIGJpbmROYW1lKSB7XHJcbiAgICB2YXIgdGVtRGF0YSA9IHRoYXQuZGF0YVtiaW5kTmFtZV07XHJcbiAgICBpZiAoIXRlbURhdGEgfHwgdGVtRGF0YS5pbWFnZXMubGVuZ3RoID09IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB2YXIgdGVtSW1hZ2VzID0gdGVtRGF0YS5pbWFnZXM7XHJcbiAgICAvLyDlm6DkuLrml6Dms5Xojrflj5Z2aWV35a695bqmIOmcgOimgeiHquWumuS5iXBhZGRpbmfov5vooYzorqHnrpfvvIznqI3lkI7lpITnkIZcclxuICAgIHZhciByZWNhbCA9IHd4QXV0b0ltYWdlQ2FsKGUuZGV0YWlsLndpZHRoLCBlLmRldGFpbC5oZWlnaHQsIHRoYXQsIGJpbmROYW1lKTtcclxuICAgIC8vIHRlbUltYWdlc1tpZHhdLndpZHRoID0gcmVjYWwuaW1hZ2VXaWR0aDtcclxuICAgIC8vIHRlbUltYWdlc1tpZHhdLmhlaWdodCA9IHJlY2FsLmltYWdlaGVpZ2h0O1xyXG4gICAgLy8gdGVtRGF0YS5pbWFnZXMgPSB0ZW1JbWFnZXM7XHJcbiAgICAvLyB2YXIgYmluZERhdGEgPSB7fTtcclxuICAgIC8vIGJpbmREYXRhW2JpbmROYW1lXSA9IHRlbURhdGE7XHJcbiAgICAvLyB0aGF0LnNldERhdGEoYmluZERhdGEpO1xyXG4gICAgdmFyIGluZGV4ID0gdGVtSW1hZ2VzW2lkeF0uaW5kZXg7XHJcbiAgICB2YXIga2V5ID0gYCR7YmluZE5hbWV9YDtcclxuICAgIGZvciAodmFyIGkgb2YgaW5kZXguc3BsaXQoJy4nKSkga2V5ICs9IGAubm9kZXNbJHtpfV1gO1xyXG4gICAgdmFyIGtleVcgPSBrZXkgKyAnLndpZHRoJztcclxuICAgIHZhciBrZXlIID0ga2V5ICsgJy5oZWlnaHQnO1xyXG4gICAgdGhhdC5zZXREYXRhKHtcclxuICAgICAgICBba2V5V106IHJlY2FsLmltYWdlV2lkdGgsXHJcbiAgICAgICAgW2tleUhdOiByZWNhbC5pbWFnZWhlaWdodCxcclxuICAgIH0pO1xyXG59XHJcblxyXG4vLyDorqHnrpfop4bop4nkvJjlhYjnmoTlm77niYflrr3pq5hcclxuZnVuY3Rpb24gd3hBdXRvSW1hZ2VDYWwob3JpZ2luYWxXaWR0aCwgb3JpZ2luYWxIZWlnaHQsIHRoYXQsIGJpbmROYW1lKSB7XHJcbiAgICAvLyDojrflj5blm77niYfnmoTljp/lp4vplb/lrr1cclxuICAgIHZhciB3aW5kb3dXaWR0aCA9IDAsIHdpbmRvd0hlaWdodCA9IDA7XHJcbiAgICB2YXIgYXV0b1dpZHRoID0gMCwgYXV0b0hlaWdodCA9IDA7XHJcbiAgICB2YXIgcmVzdWx0cyA9IHt9O1xyXG4gICAgdmFyIHBhZGRpbmcgPSB0aGF0LmRhdGFbYmluZE5hbWVdLnZpZXcuaW1hZ2VQYWRkaW5nO1xyXG4gICAgd2luZG93V2lkdGggPSByZWFsV2luZG93V2lkdGggLSAyICogcGFkZGluZztcclxuICAgIHdpbmRvd0hlaWdodCA9IHJlYWxXaW5kb3dIZWlnaHQ7XHJcbiAgICAvLyDliKTmlq3mjInnhafpgqPnp43mlrnlvI/ov5vooYznvKnmlL5cclxuICAgIC8vIGNvbnNvbGUubG9nKFwid2luZG93V2lkdGhcIiArIHdpbmRvd1dpZHRoKTtcclxuICAgIGlmIChvcmlnaW5hbFdpZHRoID4gd2luZG93V2lkdGgpIHsgLy8g5Zyo5Zu+54mHd2lkdGjlpKfkuo7miYvmnLrlsY/luZV3aWR0aOaXtuWAmVxyXG4gICAgICAgIGF1dG9XaWR0aCA9IHdpbmRvd1dpZHRoO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYXV0b1dpZHRoXCIgKyBhdXRvV2lkdGgpO1xyXG4gICAgICAgIGF1dG9IZWlnaHQgPSAoYXV0b1dpZHRoICogb3JpZ2luYWxIZWlnaHQpIC8gb3JpZ2luYWxXaWR0aDtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImF1dG9IZWlnaHRcIiArIGF1dG9IZWlnaHQpO1xyXG4gICAgICAgIHJlc3VsdHMuaW1hZ2VXaWR0aCA9IGF1dG9XaWR0aDtcclxuICAgICAgICByZXN1bHRzLmltYWdlaGVpZ2h0ID0gYXV0b0hlaWdodDtcclxuICAgIH0gZWxzZSB7IC8vIOWQpuWImeWxleekuuWOn+adpeeahOaVsOaNrlxyXG4gICAgICAgIHJlc3VsdHMuaW1hZ2VXaWR0aCA9IG9yaWdpbmFsV2lkdGg7XHJcbiAgICAgICAgcmVzdWx0cy5pbWFnZWhlaWdodCA9IG9yaWdpbmFsSGVpZ2h0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdHM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHd4UGFyc2VUZW1BcnJheSh0ZW1BcnJheU5hbWUsIGJpbmROYW1lUmVnLCB0b3RhbCwgdGhhdCkge1xyXG4gICAgdmFyIGFycmF5ID0gW107XHJcbiAgICB2YXIgdGVtRGF0YSA9IHRoYXQuZGF0YTtcclxuICAgIHZhciBvYmogPSBudWxsO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b3RhbDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHNpbUFyciA9IHRlbURhdGFbYmluZE5hbWVSZWcgKyBpXS5ub2RlcztcclxuICAgICAgICBhcnJheS5wdXNoKHNpbUFycik7XHJcbiAgICB9XHJcblxyXG4gICAgdGVtQXJyYXlOYW1lID0gdGVtQXJyYXlOYW1lIHx8ICd3eFBhcnNlVGVtQXJyYXknO1xyXG4gICAgb2JqID0gSlNPTi5wYXJzZSgne1wiJyArIHRlbUFycmF5TmFtZSArICdcIjpcIlwifScpO1xyXG4gICAgb2JqW3RlbUFycmF5TmFtZV0gPSBhcnJheTtcclxuICAgIHRoYXQuc2V0RGF0YShvYmopO1xyXG59XHJcblxyXG4vKipcclxuICog6YWN572uZW1vamlzXHJcbiAqXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gZW1vamlzSW5pdChyZWcgPSAnJywgYmFzZVNyYyA9ICcvd3hQYXJzZS9lbW9qaXMvJywgZW1vamlzKSB7XHJcbiAgICBIdG1sVG9Kc29uLmVtb2ppc0luaXQocmVnLCBiYXNlU3JjLCBlbW9qaXMpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHd4UGFyc2U6IHd4UGFyc2UsXHJcbiAgICB3eFBhcnNlVGVtQXJyYXk6IHd4UGFyc2VUZW1BcnJheSxcclxuICAgIGVtb2ppc0luaXQ6IGVtb2ppc0luaXRcclxufTtcclxuIl19