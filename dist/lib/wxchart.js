/*
 * charts for WeChat small app v1.0
 *
 * https://github.com/xiaolin3303/wx-charts
 * 2016-11-28
 *
 * Designed and built with all the love of Web
 */

'use strict';

var config = {
    yAxisWidth: 15,
    yAxisSplit: 5,
    xAxisHeight: 15,
    xAxisLineHeight: 15,
    legendHeight: 15,
    yAxisTitleWidth: 15,
    padding: 12,
    columePadding: 3,
    fontSize: 10,
    dataPointShape: ['diamond', 'circle', 'triangle', 'rect'],
    colors: ['#7cb5ec', '#f7a35c', '#434348', '#90ed7d', '#f15c80', '#8085e9'],
    pieChartLinePadding: 25,
    pieChartTextPadding: 15,
    xAxisTextPadding: 3,
    titleColor: '#333333',
    titleFontSize: 20,
    subtitleColor: '#999999',
    subtitleFontSize: 15,
    toolTipPadding: 3,
    toolTipBackground: '#000000',
    toolTipOpacity: 0.7,
    toolTipLineHeight: 14,
    radarGridCount: 3,
    radarLabelTextMargin: 15
};

// Object.assign polyfill
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
function assign(target, varArgs) {
    if (target == null) {
        // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) {
            // Skip over if undefined or null
            for (var nextKey in nextSource) {
                // Avoid bugs when hasOwnProperty is shadowed
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                    to[nextKey] = nextSource[nextKey];
                }
            }
        }
    }
    return to;
}

var util = {
    toFixed: function toFixed(num, limit) {
        limit = limit || 2;
        if (this.isFloat(num)) {
            num = num.toFixed(limit);
        }
        return num;
    },
    isFloat: function isFloat(num) {
        return num % 1 !== 0;
    },
    approximatelyEqual: function approximatelyEqual(num1, num2) {
        return Math.abs(num1 - num2) < 1e-10;
    },
    isSameSign: function isSameSign(num1, num2) {
        return Math.abs(num1) === num1 && Math.abs(num2) === num2 || Math.abs(num1) !== num1 && Math.abs(num2) !== num2;
    },
    isSameXCoordinateArea: function isSameXCoordinateArea(p1, p2) {
        return this.isSameSign(p1.x, p2.x);
    },
    isCollision: function isCollision(obj1, obj2) {
        obj1.end = {};
        obj1.end.x = obj1.start.x + obj1.width;
        obj1.end.y = obj1.start.y - obj1.height;
        obj2.end = {};
        obj2.end.x = obj2.start.x + obj2.width;
        obj2.end.y = obj2.start.y - obj2.height;
        var flag = obj2.start.x > obj1.end.x || obj2.end.x < obj1.start.x || obj2.end.y > obj1.start.y || obj2.start.y < obj1.end.y;

        return !flag;
    }
};

function findRange(num, type, limit) {
    if (isNaN(num)) {
        throw new Error('[wxCharts] unvalid series data!');
    }
    limit = limit || 10;
    type = type ? type : 'upper';
    var multiple = 1;
    while (limit < 1) {
        limit *= 10;
        multiple *= 10;
    }
    if (type === 'upper') {
        num = Math.ceil(num * multiple);
    } else {
        num = Math.floor(num * multiple);
    }
    while (num % limit !== 0) {
        if (type === 'upper') {
            num++;
        } else {
            num--;
        }
    }

    return num / multiple;
}

function calValidDistance(distance, chartData, config, opts) {

    var dataChartAreaWidth = opts.width - config.padding - chartData.xAxisPoints[0];
    var dataChartWidth = chartData.eachSpacing * opts.categories.length;
    var validDistance = distance;
    if (distance >= 0) {
        validDistance = 0;
    } else if (Math.abs(distance) >= dataChartWidth - dataChartAreaWidth) {
        validDistance = dataChartAreaWidth - dataChartWidth;
    }
    return validDistance;
}

function isInAngleRange(angle, startAngle, endAngle) {
    function adjust(angle) {
        while (angle < 0) {
            angle += 2 * Math.PI;
        }
        while (angle > 2 * Math.PI) {
            angle -= 2 * Math.PI;
        }

        return angle;
    }

    angle = adjust(angle);
    startAngle = adjust(startAngle);
    endAngle = adjust(endAngle);
    if (startAngle > endAngle) {
        endAngle += 2 * Math.PI;
        if (angle < startAngle) {
            angle += 2 * Math.PI;
        }
    }

    return angle >= startAngle && angle <= endAngle;
}

function calRotateTranslate(x, y, h) {
    var xv = x;
    var yv = h - y;

    var transX = xv + (h - yv - xv) / Math.sqrt(2);
    transX *= -1;

    var transY = (h - yv) * (Math.sqrt(2) - 1) - (h - yv - xv) / Math.sqrt(2);

    return {
        transX: transX,
        transY: transY
    };
}

function createCurveControlPoints(points, i) {

    function isNotMiddlePoint(points, i) {
        if (points[i - 1] && points[i + 1]) {
            return points[i].y >= Math.max(points[i - 1].y, points[i + 1].y) || points[i].y <= Math.min(points[i - 1].y, points[i + 1].y);
        } else {
            return false;
        }
    }

    var a = 0.2;
    var b = 0.2;
    var pAx = null;
    var pAy = null;
    var pBx = null;
    var pBy = null;
    if (i < 1) {
        pAx = points[0].x + (points[1].x - points[0].x) * a;
        pAy = points[0].y + (points[1].y - points[0].y) * a;
    } else {
        pAx = points[i].x + (points[i + 1].x - points[i - 1].x) * a;
        pAy = points[i].y + (points[i + 1].y - points[i - 1].y) * a;
    }

    if (i > points.length - 3) {
        var last = points.length - 1;
        pBx = points[last].x - (points[last].x - points[last - 1].x) * b;
        pBy = points[last].y - (points[last].y - points[last - 1].y) * b;
    } else {
        pBx = points[i + 1].x - (points[i + 2].x - points[i].x) * b;
        pBy = points[i + 1].y - (points[i + 2].y - points[i].y) * b;
    }

    // fix issue https://github.com/xiaolin3303/wx-charts/issues/79
    if (isNotMiddlePoint(points, i + 1)) {
        pBy = points[i + 1].y;
    }
    if (isNotMiddlePoint(points, i)) {
        pAy = points[i].y;
    }

    return {
        ctrA: { x: pAx, y: pAy },
        ctrB: { x: pBx, y: pBy }
    };
}

function convertCoordinateOrigin(x, y, center) {
    return {
        x: center.x + x,
        y: center.y - y
    };
}

function avoidCollision(obj, target) {
    if (target) {
        // is collision test
        while (util.isCollision(obj, target)) {
            if (obj.start.x > 0) {
                obj.start.y--;
            } else if (obj.start.x < 0) {
                obj.start.y++;
            } else {
                if (obj.start.y > 0) {
                    obj.start.y++;
                } else {
                    obj.start.y--;
                }
            }
        }
    }
    return obj;
}

function fillSeriesColor(series, config) {
    var index = 0;
    return series.map(function (item) {
        if (!item.color) {
            item.color = config.colors[index];
            index = (index + 1) % config.colors.length;
        }
        return item;
    });
}

function getDataRange(minData, maxData) {
    var limit = 0;
    var range = maxData - minData;
    if (range >= 10000) {
        limit = 1000;
    } else if (range >= 1000) {
        limit = 100;
    } else if (range >= 100) {
        limit = 10;
    } else if (range >= 10) {
        limit = 5;
    } else if (range >= 1) {
        limit = 1;
    } else if (range >= 0.1) {
        limit = 0.1;
    } else {
        limit = 0.01;
    }
    return {
        minRange: findRange(minData, 'lower', limit),
        maxRange: findRange(maxData, 'upper', limit)
    };
}

function measureText(text) {
    var fontSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

    // wx canvas 未实现measureText方法, 此处自行实现
    text = String(text);
    var text = text.split('');
    var width = 0;
    text.forEach(function (item) {
        if (/[a-zA-Z]/.test(item)) {
            width += 7;
        } else if (/[0-9]/.test(item)) {
            width += 5.5;
        } else if (/\./.test(item)) {
            width += 2.7;
        } else if (/-/.test(item)) {
            width += 3.25;
        } else if (/[\u4e00-\u9fa5]/.test(item)) {
            width += 10;
        } else if (/\(|\)/.test(item)) {
            width += 3.73;
        } else if (/\s/.test(item)) {
            width += 2.5;
        } else if (/%/.test(item)) {
            width += 8;
        } else {
            width += 10;
        }
    });
    return width * fontSize / 10;
}

function dataCombine(series) {
    return series.reduce(function (a, b) {
        return (a.data ? a.data : a).concat(b.data);
    }, []);
}

function getSeriesDataItem(series, index) {
    var data = [];
    series.forEach(function (item) {
        if (item.data[index] !== null && typeof item.data[index] !== 'undefined') {
            var seriesItem = {};
            seriesItem.color = item.color;
            seriesItem.name = item.name;
            seriesItem.data = item.format ? item.format(item.data[index]) : item.data[index];
            data.push(seriesItem);
        }
    });

    return data;
}

function getMaxTextListLength(list) {
    var lengthList = list.map(function (item) {
        return measureText(item);
    });
    return Math.max.apply(null, lengthList);
}

function getRadarCoordinateSeries(length) {
    var eachAngle = 2 * Math.PI / length;
    var CoordinateSeries = [];
    for (var i = 0; i < length; i++) {
        CoordinateSeries.push(eachAngle * i);
    }

    return CoordinateSeries.map(function (item) {
        return -1 * item + Math.PI / 2;
    });
}

function getToolTipData(seriesData, calPoints, index, categories) {
    var option = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

    var textList = seriesData.map(function (item) {
        return {
            text: option.format ? option.format(item, categories[index]) : item.name + ': ' + item.data,
            color: item.color
        };
    });
    var validCalPoints = [];
    var offset = {
        x: 0,
        y: 0
    };
    calPoints.forEach(function (points) {
        if (typeof points[index] !== 'undefined' && points[index] !== null) {
            validCalPoints.push(points[index]);
        }
    });
    validCalPoints.forEach(function (item) {
        offset.x = Math.round(item.x);
        offset.y += item.y;
    });

    offset.y /= validCalPoints.length;
    return { textList: textList, offset: offset };
}

function findCurrentIndex(currentPoints, xAxisPoints, opts, config) {
    var offset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    var currentIndex = -1;
    if (isInExactChartArea(currentPoints, opts, config)) {
        xAxisPoints.forEach(function (item, index) {
            if (currentPoints.x + offset > item) {
                currentIndex = index;
            }
        });
    }

    return currentIndex;
}

function isInExactChartArea(currentPoints, opts, config) {
    return currentPoints.x < opts.width - config.padding && currentPoints.x > config.padding + config.yAxisWidth + config.yAxisTitleWidth && currentPoints.y > config.padding && currentPoints.y < opts.height - config.legendHeight - config.xAxisHeight - config.padding;
}

function findRadarChartCurrentIndex(currentPoints, radarData, count) {
    var eachAngleArea = 2 * Math.PI / count;
    var currentIndex = -1;
    if (isInExactPieChartArea(currentPoints, radarData.center, radarData.radius)) {
        var fixAngle = function fixAngle(angle) {
            if (angle < 0) {
                angle += 2 * Math.PI;
            }
            if (angle > 2 * Math.PI) {
                angle -= 2 * Math.PI;
            }
            return angle;
        };

        var angle = Math.atan2(radarData.center.y - currentPoints.y, currentPoints.x - radarData.center.x);
        angle = -1 * angle;
        if (angle < 0) {
            angle += 2 * Math.PI;
        }

        var angleList = radarData.angleList.map(function (item) {
            item = fixAngle(-1 * item);

            return item;
        });

        angleList.forEach(function (item, index) {
            var rangeStart = fixAngle(item - eachAngleArea / 2);
            var rangeEnd = fixAngle(item + eachAngleArea / 2);
            if (rangeEnd < rangeStart) {
                rangeEnd += 2 * Math.PI;
            }
            if (angle >= rangeStart && angle <= rangeEnd || angle + 2 * Math.PI >= rangeStart && angle + 2 * Math.PI <= rangeEnd) {
                currentIndex = index;
            }
        });
    }

    return currentIndex;
}

function findPieChartCurrentIndex(currentPoints, pieData) {
    var currentIndex = -1;
    if (isInExactPieChartArea(currentPoints, pieData.center, pieData.radius)) {
        var angle = Math.atan2(pieData.center.y - currentPoints.y, currentPoints.x - pieData.center.x);
        angle = -angle;
        for (var i = 0, len = pieData.series.length; i < len; i++) {
            var item = pieData.series[i];
            if (isInAngleRange(angle, item._start_, item._start_ + item._proportion_ * 2 * Math.PI)) {
                currentIndex = i;
                break;
            }
        }
    }

    return currentIndex;
}

function isInExactPieChartArea(currentPoints, center, radius) {
    return Math.pow(currentPoints.x - center.x, 2) + Math.pow(currentPoints.y - center.y, 2) <= Math.pow(radius, 2);
}

function splitPoints(points) {
    var newPoints = [];
    var items = [];
    points.forEach(function (item, index) {
        if (item !== null) {
            items.push(item);
        } else {
            if (items.length) {
                newPoints.push(items);
            }
            items = [];
        }
    });
    if (items.length) {
        newPoints.push(items);
    }

    return newPoints;
}

function calLegendData(series, opts, config) {
    if (opts.legend === false) {
        return {
            legendList: [],
            legendHeight: 0
        };
    }
    var padding = 5;
    var marginTop = 8;
    var shapeWidth = 15;
    var legendList = [];
    var widthCount = 0;
    var currentRow = [];
    series.forEach(function (item) {
        var itemWidth = 3 * padding + shapeWidth + measureText(item.name || 'undefined');
        if (widthCount + itemWidth > opts.width) {
            legendList.push(currentRow);
            widthCount = itemWidth;
            currentRow = [item];
        } else {
            widthCount += itemWidth;
            currentRow.push(item);
        }
    });
    if (currentRow.length) {
        legendList.push(currentRow);
    }

    return {
        legendList: legendList,
        legendHeight: legendList.length * (config.fontSize + marginTop) + padding
    };
}

function calCategoriesData(categories, opts, config) {
    var result = {
        angle: 0,
        xAxisHeight: config.xAxisHeight
    };

    var _getXAxisPoints = getXAxisPoints(categories, opts, config),
        eachSpacing = _getXAxisPoints.eachSpacing;

    // get max length of categories text


    var categoriesTextLenth = categories.map(function (item) {
        return measureText(item);
    });

    var maxTextLength = Math.max.apply(this, categoriesTextLenth);

    if (maxTextLength + 2 * config.xAxisTextPadding > eachSpacing) {
        result.angle = 45 * Math.PI / 180;
        result.xAxisHeight = 2 * config.xAxisTextPadding + maxTextLength * Math.sin(result.angle);
    }

    return result;
}

function getRadarDataPoints(angleList, center, radius, series, opts) {
    var process = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;

    var radarOption = opts.extra.radar || {};
    radarOption.max = radarOption.max || 0;
    var maxData = Math.max(radarOption.max, Math.max.apply(null, dataCombine(series)));

    var data = [];
    series.forEach(function (each) {
        var listItem = {};
        listItem.color = each.color;
        listItem.data = [];
        each.data.forEach(function (item, index) {
            var tmp = {};
            tmp.angle = angleList[index];

            tmp.proportion = item / maxData;
            tmp.position = convertCoordinateOrigin(radius * tmp.proportion * process * Math.cos(tmp.angle), radius * tmp.proportion * process * Math.sin(tmp.angle), center);
            listItem.data.push(tmp);
        });

        data.push(listItem);
    });

    return data;
}

function getPieDataPoints(series) {
    var process = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    var count = 0;
    var _start_ = 0;
    series.forEach(function (item) {
        item.data = item.data === null ? 0 : item.data;
        count += item.data;
    });
    series.forEach(function (item) {
        item.data = item.data === null ? 0 : item.data;
        item._proportion_ = item.data / count * process;
    });
    series.forEach(function (item) {
        item._start_ = _start_;
        _start_ += 2 * item._proportion_ * Math.PI;
    });

    return series;
}

function getPieTextMaxLength(series) {
    series = getPieDataPoints(series);
    var maxLength = 0;
    series.forEach(function (item) {
        var text = item.format ? item.format(+item._proportion_.toFixed(2)) : util.toFixed(item._proportion_ * 100) + '%';
        maxLength = Math.max(maxLength, measureText(text));
    });

    return maxLength;
}

function fixColumeData(points, eachSpacing, columnLen, index, config, opts) {
    return points.map(function (item) {
        if (item === null) {
            return null;
        }
        item.width = (eachSpacing - 2 * config.columePadding) / columnLen;

        if (opts.extra.column && opts.extra.column.width && +opts.extra.column.width > 0) {
            // customer column width
            item.width = Math.min(item.width, +opts.extra.column.width);
        } else {
            // default width should less tran 25px
            // don't ask me why, I don't know
            item.width = Math.min(item.width, 25);
        }
        item.x += (index + 0.5 - columnLen / 2) * item.width;

        return item;
    });
}

function getXAxisPoints(categories, opts, config) {
    var yAxisTotalWidth = config.yAxisWidth + config.yAxisTitleWidth;
    var spacingValid = opts.width - 2 * config.padding - yAxisTotalWidth;
    var dataCount = opts.enableScroll ? Math.min(5, categories.length) : categories.length;
    var eachSpacing = spacingValid / dataCount;

    var xAxisPoints = [];
    var startX = config.padding + yAxisTotalWidth;
    var endX = opts.width - config.padding;
    categories.forEach(function (item, index) {
        xAxisPoints.push(startX + index * eachSpacing);
    });
    if (opts.enableScroll === true) {
        xAxisPoints.push(startX + categories.length * eachSpacing);
    } else {
        xAxisPoints.push(endX);
    }

    return { xAxisPoints: xAxisPoints, startX: startX, endX: endX, eachSpacing: eachSpacing };
}

function getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config) {
    var process = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 1;

    var points = [];
    var validHeight = opts.height - 2 * config.padding - config.xAxisHeight - config.legendHeight;
    data.forEach(function (item, index) {
        if (item === null) {
            points.push(null);
        } else {
            var point = {};
            point.x = xAxisPoints[index] + Math.round(eachSpacing / 2);
            var height = validHeight * (item - minRange) / (maxRange - minRange);
            height *= process;
            point.y = opts.height - config.xAxisHeight - config.legendHeight - Math.round(height) - config.padding;
            points.push(point);
        }
    });

    return points;
}

function getYAxisTextList(series, opts, config) {
    var data = dataCombine(series);
    // remove null from data
    data = data.filter(function (item) {
        return item !== null;
    });
    var minData = Math.min.apply(this, data);
    var maxData = Math.max.apply(this, data);
    if (typeof opts.yAxis.min === 'number') {
        minData = Math.min(opts.yAxis.min, minData);
    }
    if (typeof opts.yAxis.max === 'number') {
        maxData = Math.max(opts.yAxis.max, maxData);
    }

    // fix issue https://github.com/xiaolin3303/wx-charts/issues/9
    if (minData === maxData) {
        var rangeSpan = maxData || 1;
        minData -= rangeSpan;
        maxData += rangeSpan;
    }

    var dataRange = getDataRange(minData, maxData);
    var minRange = dataRange.minRange;
    var maxRange = dataRange.maxRange;

    var range = [];
    var eachRange = (maxRange - minRange) / config.yAxisSplit;

    for (var i = 0; i <= config.yAxisSplit; i++) {
        range.push(minRange + eachRange * i);
    }
    return range.reverse();
}

function calYAxisData(series, opts, config) {

    var ranges = getYAxisTextList(series, opts, config);
    var yAxisWidth = config.yAxisWidth;
    var rangesFormat = ranges.map(function (item) {
        item = util.toFixed(item, 2);
        item = opts.yAxis.format ? opts.yAxis.format(Number(item)) : item;
        yAxisWidth = Math.max(yAxisWidth, measureText(item) + 5);
        return item;
    });
    if (opts.yAxis.disabled === true) {
        yAxisWidth = 0;
    }

    return { rangesFormat: rangesFormat, ranges: ranges, yAxisWidth: yAxisWidth };
}

function drawPointShape(points, color, shape, context) {
    context.beginPath();
    context.setStrokeStyle("#ffffff");
    context.setLineWidth(1);
    context.setFillStyle(color);

    if (shape === 'diamond') {
        points.forEach(function (item, index) {
            if (item !== null) {
                context.moveTo(item.x, item.y - 4.5);
                context.lineTo(item.x - 4.5, item.y);
                context.lineTo(item.x, item.y + 4.5);
                context.lineTo(item.x + 4.5, item.y);
                context.lineTo(item.x, item.y - 4.5);
            }
        });
    } else if (shape === 'circle') {
        points.forEach(function (item, index) {
            if (item !== null) {
                context.moveTo(item.x + 3.5, item.y);
                context.arc(item.x, item.y, 4, 0, 2 * Math.PI, false);
            }
        });
    } else if (shape === 'rect') {
        points.forEach(function (item, index) {
            if (item !== null) {
                context.moveTo(item.x - 3.5, item.y - 3.5);
                context.rect(item.x - 3.5, item.y - 3.5, 7, 7);
            }
        });
    } else if (shape === 'triangle') {
        points.forEach(function (item, index) {
            if (item !== null) {
                context.moveTo(item.x, item.y - 4.5);
                context.lineTo(item.x - 4.5, item.y + 4.5);
                context.lineTo(item.x + 4.5, item.y + 4.5);
                context.lineTo(item.x, item.y - 4.5);
            }
        });
    }
    context.closePath();
    context.fill();
    context.stroke();
}

function drawRingTitle(opts, config, context) {
    var titlefontSize = opts.title.fontSize || config.titleFontSize;
    var subtitlefontSize = opts.subtitle.fontSize || config.subtitleFontSize;
    var title = opts.title.name || '';
    var subtitle = opts.subtitle.name || '';
    var titleFontColor = opts.title.color || config.titleColor;
    var subtitleFontColor = opts.subtitle.color || config.subtitleColor;
    var titleHeight = title ? titlefontSize : 0;
    var subtitleHeight = subtitle ? subtitlefontSize : 0;
    var margin = 5;
    if (subtitle) {
        var textWidth = measureText(subtitle, subtitlefontSize);
        var startX = (opts.width - textWidth) / 2 + (opts.subtitle.offsetX || 0);
        var startY = (opts.height - config.legendHeight + subtitlefontSize) / 2;
        if (title) {
            startY -= (titleHeight + margin) / 2;
        }
        context.beginPath();
        context.setFontSize(subtitlefontSize);
        context.setFillStyle(subtitleFontColor);
        context.fillText(subtitle, startX, startY);
        context.stroke();
        context.closePath();
    }
    if (title) {
        var _textWidth = measureText(title, titlefontSize);
        var _startX = (opts.width - _textWidth) / 2 + (opts.title.offsetX || 0);
        var _startY = (opts.height - config.legendHeight + titlefontSize) / 2;
        if (subtitle) {
            _startY += (subtitleHeight + margin) / 2;
        }
        context.beginPath();
        context.setFontSize(titlefontSize);
        context.setFillStyle(titleFontColor);
        context.fillText(title, _startX, _startY);
        context.stroke();
        context.closePath();
    }
}

function drawPointText(points, series, config, context) {
    // 绘制数据文案
    var data = series.data;

    context.beginPath();
    context.setFontSize(config.fontSize);
    context.setFillStyle('#666666');
    points.forEach(function (item, index) {
        if (item !== null) {
            var formatVal = series.format ? series.format(data[index]) : data[index];
            context.fillText(formatVal, item.x - measureText(formatVal) / 2, item.y - 2);
        }
    });
    context.closePath();
    context.stroke();
}

function drawRadarLabel(angleList, radius, centerPosition, opts, config, context) {
    var radarOption = opts.extra.radar || {};
    radius += config.radarLabelTextMargin;
    context.beginPath();
    context.setFontSize(config.fontSize);
    context.setFillStyle(radarOption.labelColor || '#666666');
    angleList.forEach(function (angle, index) {
        var pos = {
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle)
        };
        var posRelativeCanvas = convertCoordinateOrigin(pos.x, pos.y, centerPosition);
        var startX = posRelativeCanvas.x;
        var startY = posRelativeCanvas.y;
        if (util.approximatelyEqual(pos.x, 0)) {
            startX -= measureText(opts.categories[index] || '') / 2;
        } else if (pos.x < 0) {
            startX -= measureText(opts.categories[index] || '');
        }
        context.fillText(opts.categories[index] || '', startX, startY + config.fontSize / 2);
    });
    context.stroke();
    context.closePath();
}

function drawPieText(series, opts, config, context, radius, center) {
    var lineRadius = radius + config.pieChartLinePadding;
    var textObjectCollection = [];
    var lastTextObject = null;

    var seriesConvert = series.map(function (item) {
        var arc = 2 * Math.PI - (item._start_ + 2 * Math.PI * item._proportion_ / 2);
        var text = item.format ? item.format(+item._proportion_.toFixed(2)) : util.toFixed(item._proportion_ * 100) + '%';
        var color = item.color;
        return { arc: arc, text: text, color: color };
    });
    seriesConvert.forEach(function (item) {
        // line end
        var orginX1 = Math.cos(item.arc) * lineRadius;
        var orginY1 = Math.sin(item.arc) * lineRadius;

        // line start
        var orginX2 = Math.cos(item.arc) * radius;
        var orginY2 = Math.sin(item.arc) * radius;

        // text start
        var orginX3 = orginX1 >= 0 ? orginX1 + config.pieChartTextPadding : orginX1 - config.pieChartTextPadding;
        var orginY3 = orginY1;

        var textWidth = measureText(item.text);
        var startY = orginY3;

        if (lastTextObject && util.isSameXCoordinateArea(lastTextObject.start, { x: orginX3 })) {
            if (orginX3 > 0) {
                startY = Math.min(orginY3, lastTextObject.start.y);
            } else if (orginX1 < 0) {
                startY = Math.max(orginY3, lastTextObject.start.y);
            } else {
                if (orginY3 > 0) {
                    startY = Math.max(orginY3, lastTextObject.start.y);
                } else {
                    startY = Math.min(orginY3, lastTextObject.start.y);
                }
            }
        }

        if (orginX3 < 0) {
            orginX3 -= textWidth;
        }

        var textObject = {
            lineStart: {
                x: orginX2,
                y: orginY2
            },
            lineEnd: {
                x: orginX1,
                y: orginY1
            },
            start: {
                x: orginX3,
                y: startY
            },
            width: textWidth,
            height: config.fontSize,
            text: item.text,
            color: item.color
        };

        lastTextObject = avoidCollision(textObject, lastTextObject);
        textObjectCollection.push(lastTextObject);
    });

    textObjectCollection.forEach(function (item) {
        var lineStartPoistion = convertCoordinateOrigin(item.lineStart.x, item.lineStart.y, center);
        var lineEndPoistion = convertCoordinateOrigin(item.lineEnd.x, item.lineEnd.y, center);
        var textPosition = convertCoordinateOrigin(item.start.x, item.start.y, center);
        context.setLineWidth(1);
        context.setFontSize(config.fontSize);
        context.beginPath();
        context.setStrokeStyle(item.color);
        context.setFillStyle(item.color);
        context.moveTo(lineStartPoistion.x, lineStartPoistion.y);
        var curveStartX = item.start.x < 0 ? textPosition.x + item.width : textPosition.x;
        var textStartX = item.start.x < 0 ? textPosition.x - 5 : textPosition.x + 5;
        context.quadraticCurveTo(lineEndPoistion.x, lineEndPoistion.y, curveStartX, textPosition.y);
        context.moveTo(lineStartPoistion.x, lineStartPoistion.y);
        context.stroke();
        context.closePath();
        context.beginPath();
        context.moveTo(textPosition.x + item.width, textPosition.y);
        context.arc(curveStartX, textPosition.y, 2, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
        context.beginPath();
        context.setFillStyle('#666666');
        context.fillText(item.text, textStartX, textPosition.y + 3);
        context.closePath();
        context.stroke();

        context.closePath();
    });
}

function drawToolTipSplitLine(offsetX, opts, config, context) {
    var startY = config.padding;
    var endY = opts.height - config.padding - config.xAxisHeight - config.legendHeight;
    context.beginPath();
    context.setStrokeStyle('#cccccc');
    context.setLineWidth(1);
    context.moveTo(offsetX, startY);
    context.lineTo(offsetX, endY);
    context.stroke();
    context.closePath();
}

function drawToolTip(textList, offset, opts, config, context) {
    var legendWidth = 4;
    var legendMarginRight = 5;
    var arrowWidth = 8;
    var isOverRightBorder = false;
    offset = assign({
        x: 0,
        y: 0
    }, offset);
    offset.y -= 8;
    var textWidth = textList.map(function (item) {
        return measureText(item.text);
    });

    var toolTipWidth = legendWidth + legendMarginRight + 4 * config.toolTipPadding + Math.max.apply(null, textWidth);
    var toolTipHeight = 2 * config.toolTipPadding + textList.length * config.toolTipLineHeight;

    // if beyond the right border
    if (offset.x - Math.abs(opts._scrollDistance_) + arrowWidth + toolTipWidth > opts.width) {
        isOverRightBorder = true;
    }

    // draw background rect
    context.beginPath();
    context.setFillStyle(opts.tooltip.option.background || config.toolTipBackground);
    context.setGlobalAlpha(config.toolTipOpacity);
    if (isOverRightBorder) {
        context.moveTo(offset.x, offset.y + 10);
        context.lineTo(offset.x - arrowWidth, offset.y + 10 - 5);
        context.lineTo(offset.x - arrowWidth, offset.y + 10 + 5);
        context.moveTo(offset.x, offset.y + 10);
        context.fillRect(offset.x - toolTipWidth - arrowWidth, offset.y, toolTipWidth, toolTipHeight);
    } else {
        context.moveTo(offset.x, offset.y + 10);
        context.lineTo(offset.x + arrowWidth, offset.y + 10 - 5);
        context.lineTo(offset.x + arrowWidth, offset.y + 10 + 5);
        context.moveTo(offset.x, offset.y + 10);
        context.fillRect(offset.x + arrowWidth, offset.y, toolTipWidth, toolTipHeight);
    }

    context.closePath();
    context.fill();
    context.setGlobalAlpha(1);

    // draw legend
    textList.forEach(function (item, index) {
        context.beginPath();
        context.setFillStyle(item.color);
        var startX = offset.x + arrowWidth + 2 * config.toolTipPadding;
        var startY = offset.y + (config.toolTipLineHeight - config.fontSize) / 2 + config.toolTipLineHeight * index + config.toolTipPadding;
        if (isOverRightBorder) {
            startX = offset.x - toolTipWidth - arrowWidth + 2 * config.toolTipPadding;
        }
        context.fillRect(startX, startY, legendWidth, config.fontSize);
        context.closePath();
    });

    // draw text list
    context.beginPath();
    context.setFontSize(config.fontSize);
    context.setFillStyle('#ffffff');
    textList.forEach(function (item, index) {
        var startX = offset.x + arrowWidth + 2 * config.toolTipPadding + legendWidth + legendMarginRight;
        if (isOverRightBorder) {
            startX = offset.x - toolTipWidth - arrowWidth + 2 * config.toolTipPadding + +legendWidth + legendMarginRight;
        }
        var startY = offset.y + (config.toolTipLineHeight - config.fontSize) / 2 + config.toolTipLineHeight * index + config.toolTipPadding;
        context.fillText(item.text, startX, startY + config.fontSize);
    });
    context.stroke();
    context.closePath();
}

function drawYAxisTitle(title, opts, config, context) {
    var startX = config.xAxisHeight + (opts.height - config.xAxisHeight - measureText(title)) / 2;
    context.save();
    context.beginPath();
    context.setFontSize(config.fontSize);
    context.setFillStyle(opts.yAxis.titleFontColor || '#333333');
    context.translate(0, opts.height);
    context.rotate(-90 * Math.PI / 180);
    context.fillText(title, startX, config.padding + 0.5 * config.fontSize);
    context.stroke();
    context.closePath();
    context.restore();
}

function drawColumnDataPoints(series, opts, config, context) {
    var process = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

    var _calYAxisData = calYAxisData(series, opts, config),
        ranges = _calYAxisData.ranges;

    var _getXAxisPoints = getXAxisPoints(opts.categories, opts, config),
        xAxisPoints = _getXAxisPoints.xAxisPoints,
        eachSpacing = _getXAxisPoints.eachSpacing;

    var minRange = ranges.pop();
    var maxRange = ranges.shift();
    context.save();
    if (opts._scrollDistance_ && opts._scrollDistance_ !== 0 && opts.enableScroll === true) {
        context.translate(opts._scrollDistance_, 0);
    }

    series.forEach(function (eachSeries, seriesIndex) {
        var data = eachSeries.data;
        var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
        points = fixColumeData(points, eachSpacing, series.length, seriesIndex, config, opts);

        // 绘制柱状数据图
        context.beginPath();
        context.setFillStyle(eachSeries.color);
        points.forEach(function (item, index) {
            if (item !== null) {
                var startX = item.x - item.width / 2 + 1;
                var height = opts.height - item.y - config.padding - config.xAxisHeight - config.legendHeight;
                context.moveTo(startX, item.y);
                context.rect(startX, item.y, item.width - 2, height);
            }
        });
        context.closePath();
        context.fill();
    });
    series.forEach(function (eachSeries, seriesIndex) {
        var data = eachSeries.data;
        var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
        points = fixColumeData(points, eachSpacing, series.length, seriesIndex, config, opts);
        if (opts.dataLabel !== false && process === 1) {
            drawPointText(points, eachSeries, config, context);
        }
    });
    context.restore();
    return {
        xAxisPoints: xAxisPoints,
        eachSpacing: eachSpacing
    };
}

function drawAreaDataPoints(series, opts, config, context) {
    var process = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

    var _calYAxisData2 = calYAxisData(series, opts, config),
        ranges = _calYAxisData2.ranges;

    var _getXAxisPoints2 = getXAxisPoints(opts.categories, opts, config),
        xAxisPoints = _getXAxisPoints2.xAxisPoints,
        eachSpacing = _getXAxisPoints2.eachSpacing;

    var minRange = ranges.pop();
    var maxRange = ranges.shift();
    var endY = opts.height - config.padding - config.xAxisHeight - config.legendHeight;
    var calPoints = [];

    context.save();
    if (opts._scrollDistance_ && opts._scrollDistance_ !== 0 && opts.enableScroll === true) {
        context.translate(opts._scrollDistance_, 0);
    }

    if (opts.tooltip && opts.tooltip.textList && opts.tooltip.textList.length && process === 1) {
        drawToolTipSplitLine(opts.tooltip.offset.x, opts, config, context);
    }

    series.forEach(function (eachSeries, seriesIndex) {
        var data = eachSeries.data;
        var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
        calPoints.push(points);

        var splitPointList = splitPoints(points);

        splitPointList.forEach(function (points) {
            // 绘制区域数据
            context.beginPath();
            context.setStrokeStyle(eachSeries.color);
            context.setFillStyle(eachSeries.color);
            context.setGlobalAlpha(0.6);
            context.setLineWidth(2);
            if (points.length > 1) {
                var firstPoint = points[0];
                var lastPoint = points[points.length - 1];

                context.moveTo(firstPoint.x, firstPoint.y);
                if (opts.extra.lineStyle === 'curve') {
                    points.forEach(function (item, index) {
                        if (index > 0) {
                            var ctrlPoint = createCurveControlPoints(points, index - 1);
                            context.bezierCurveTo(ctrlPoint.ctrA.x, ctrlPoint.ctrA.y, ctrlPoint.ctrB.x, ctrlPoint.ctrB.y, item.x, item.y);
                        }
                    });
                } else {
                    points.forEach(function (item, index) {
                        if (index > 0) {
                            context.lineTo(item.x, item.y);
                        }
                    });
                }

                context.lineTo(lastPoint.x, endY);
                context.lineTo(firstPoint.x, endY);
                context.lineTo(firstPoint.x, firstPoint.y);
            } else {
                var item = points[0];
                context.moveTo(item.x - eachSpacing / 2, item.y);
                context.lineTo(item.x + eachSpacing / 2, item.y);
                context.lineTo(item.x + eachSpacing / 2, endY);
                context.lineTo(item.x - eachSpacing / 2, endY);
                context.moveTo(item.x - eachSpacing / 2, item.y);
            }
            context.closePath();
            context.fill();
            context.setGlobalAlpha(1);
        });

        if (opts.dataPointShape !== false) {
            var shape = config.dataPointShape[seriesIndex % config.dataPointShape.length];
            drawPointShape(points, eachSeries.color, shape, context);
        }
    });
    if (opts.dataLabel !== false && process === 1) {
        series.forEach(function (eachSeries, seriesIndex) {
            var data = eachSeries.data;
            var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
            drawPointText(points, eachSeries, config, context);
        });
    }

    context.restore();

    return {
        xAxisPoints: xAxisPoints,
        calPoints: calPoints,
        eachSpacing: eachSpacing
    };
}

function drawLineDataPoints(series, opts, config, context) {
    var process = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

    var _calYAxisData3 = calYAxisData(series, opts, config),
        ranges = _calYAxisData3.ranges;

    var _getXAxisPoints3 = getXAxisPoints(opts.categories, opts, config),
        xAxisPoints = _getXAxisPoints3.xAxisPoints,
        eachSpacing = _getXAxisPoints3.eachSpacing;

    var minRange = ranges.pop();
    var maxRange = ranges.shift();
    var calPoints = [];

    context.save();
    if (opts._scrollDistance_ && opts._scrollDistance_ !== 0 && opts.enableScroll === true) {
        context.translate(opts._scrollDistance_, 0);
    }

    if (opts.tooltip && opts.tooltip.textList && opts.tooltip.textList.length && process === 1) {
        drawToolTipSplitLine(opts.tooltip.offset.x, opts, config, context);
    }

    series.forEach(function (eachSeries, seriesIndex) {
        var data = eachSeries.data;
        var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
        calPoints.push(points);
        var splitPointList = splitPoints(points);

        splitPointList.forEach(function (points, index) {
            context.beginPath();
            context.setStrokeStyle(eachSeries.color);
            context.setLineWidth(2);
            if (points.length === 1) {
                context.moveTo(points[0].x, points[0].y);
                context.arc(points[0].x, points[0].y, 1, 0, 2 * Math.PI);
            } else {
                context.moveTo(points[0].x, points[0].y);
                if (opts.extra.lineStyle === 'curve') {
                    points.forEach(function (item, index) {
                        if (index > 0) {
                            var ctrlPoint = createCurveControlPoints(points, index - 1);
                            context.bezierCurveTo(ctrlPoint.ctrA.x, ctrlPoint.ctrA.y, ctrlPoint.ctrB.x, ctrlPoint.ctrB.y, item.x, item.y);
                        }
                    });
                } else {
                    points.forEach(function (item, index) {
                        if (index > 0) {
                            context.lineTo(item.x, item.y);
                        }
                    });
                }
                context.moveTo(points[0].x, points[0].y);
            }
            context.closePath();
            context.stroke();
        });

        if (opts.dataPointShape !== false) {
            var shape = config.dataPointShape[seriesIndex % config.dataPointShape.length];
            drawPointShape(points, eachSeries.color, shape, context);
        }
    });
    if (opts.dataLabel !== false && process === 1) {
        series.forEach(function (eachSeries, seriesIndex) {
            var data = eachSeries.data;
            var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
            drawPointText(points, eachSeries, config, context);
        });
    }

    context.restore();

    return {
        xAxisPoints: xAxisPoints,
        calPoints: calPoints,
        eachSpacing: eachSpacing
    };
}

function drawToolTipBridge(opts, config, context, process) {
    context.save();
    if (opts._scrollDistance_ && opts._scrollDistance_ !== 0 && opts.enableScroll === true) {
        context.translate(opts._scrollDistance_, 0);
    }
    if (opts.tooltip && opts.tooltip.textList && opts.tooltip.textList.length && process === 1) {
        drawToolTip(opts.tooltip.textList, opts.tooltip.offset, opts, config, context);
    }
    context.restore();
}

function drawXAxis(categories, opts, config, context) {
    var _getXAxisPoints4 = getXAxisPoints(categories, opts, config),
        xAxisPoints = _getXAxisPoints4.xAxisPoints,
        startX = _getXAxisPoints4.startX,
        endX = _getXAxisPoints4.endX,
        eachSpacing = _getXAxisPoints4.eachSpacing;

    var startY = opts.height - config.padding - config.xAxisHeight - config.legendHeight;
    var endY = startY + config.xAxisLineHeight;

    context.save();
    if (opts._scrollDistance_ && opts._scrollDistance_ !== 0) {
        context.translate(opts._scrollDistance_, 0);
    }

    context.beginPath();
    context.setStrokeStyle(opts.xAxis.gridColor || "#cccccc");

    if (opts.xAxis.disableGrid !== true) {
        if (opts.xAxis.type === 'calibration') {
            xAxisPoints.forEach(function (item, index) {
                if (index > 0) {
                    context.moveTo(item - eachSpacing / 2, startY);
                    context.lineTo(item - eachSpacing / 2, startY + 4);
                }
            });
        } else {
            xAxisPoints.forEach(function (item, index) {
                context.moveTo(item, startY);
                context.lineTo(item, endY);
            });
        }
    }
    context.closePath();
    context.stroke();

    // 对X轴列表做抽稀处理
    var validWidth = opts.width - 2 * config.padding - config.yAxisWidth - config.yAxisTitleWidth;
    var maxXAxisListLength = Math.min(categories.length, Math.ceil(validWidth / config.fontSize / 1.5));
    var ratio = Math.ceil(categories.length / maxXAxisListLength);

    categories = categories.map(function (item, index) {
        return index % ratio !== 0 ? '' : item;
    });

    if (config._xAxisTextAngle_ === 0) {
        context.beginPath();
        context.setFontSize(config.fontSize);
        context.setFillStyle(opts.xAxis.fontColor || '#666666');
        categories.forEach(function (item, index) {
            var offset = eachSpacing / 2 - measureText(item) / 2;
            context.fillText(item, xAxisPoints[index] + offset, startY + config.fontSize + 5);
        });
        context.closePath();
        context.stroke();
    } else {
        categories.forEach(function (item, index) {
            context.save();
            context.beginPath();
            context.setFontSize(config.fontSize);
            context.setFillStyle(opts.xAxis.fontColor || '#666666');
            var textWidth = measureText(item);
            var offset = eachSpacing / 2 - textWidth;

            var _calRotateTranslate = calRotateTranslate(xAxisPoints[index] + eachSpacing / 2, startY + config.fontSize / 2 + 5, opts.height),
                transX = _calRotateTranslate.transX,
                transY = _calRotateTranslate.transY;

            context.rotate(-1 * config._xAxisTextAngle_);
            context.translate(transX, transY);
            context.fillText(item, xAxisPoints[index] + offset, startY + config.fontSize + 5);
            context.closePath();
            context.stroke();
            context.restore();
        });
    }

    context.restore();
}

function drawYAxisGrid(opts, config, context) {
    var spacingValid = opts.height - 2 * config.padding - config.xAxisHeight - config.legendHeight;
    var eachSpacing = Math.floor(spacingValid / config.yAxisSplit);
    var yAxisTotalWidth = config.yAxisWidth + config.yAxisTitleWidth;
    var startX = config.padding + yAxisTotalWidth;
    var endX = opts.width - config.padding;

    var points = [];
    for (var i = 0; i < config.yAxisSplit; i++) {
        points.push(config.padding + eachSpacing * i);
    }
    points.push(config.padding + eachSpacing * config.yAxisSplit + 2);

    context.beginPath();
    context.setStrokeStyle(opts.yAxis.gridColor || "#cccccc");
    context.setLineWidth(1);
    points.forEach(function (item, index) {
        context.moveTo(startX, item);
        context.lineTo(endX, item);
    });
    context.closePath();
    context.stroke();
}

function drawYAxis(series, opts, config, context) {
    if (opts.yAxis.disabled === true) {
        return;
    }

    var _calYAxisData4 = calYAxisData(series, opts, config),
        rangesFormat = _calYAxisData4.rangesFormat;

    var yAxisTotalWidth = config.yAxisWidth + config.yAxisTitleWidth;

    var spacingValid = opts.height - 2 * config.padding - config.xAxisHeight - config.legendHeight;
    var eachSpacing = Math.floor(spacingValid / config.yAxisSplit);
    var startX = config.padding + yAxisTotalWidth;
    var endX = opts.width - config.padding;
    var endY = opts.height - config.padding - config.xAxisHeight - config.legendHeight;

    // set YAxis background
    context.setFillStyle(opts.background || '#ffffff');
    if (opts._scrollDistance_ < 0) {
        context.fillRect(0, 0, startX, endY + config.xAxisHeight + 5);
    }
    context.fillRect(endX, 0, opts.width, endY + config.xAxisHeight + 5);

    var points = [];
    for (var i = 0; i <= config.yAxisSplit; i++) {
        points.push(config.padding + eachSpacing * i);
    }

    context.stroke();
    context.beginPath();
    context.setFontSize(config.fontSize);
    context.setFillStyle(opts.yAxis.fontColor || '#666666');
    rangesFormat.forEach(function (item, index) {
        var pos = points[index] ? points[index] : endY;
        context.fillText(item, config.padding + config.yAxisTitleWidth, pos + config.fontSize / 2);
    });
    context.closePath();
    context.stroke();

    if (opts.yAxis.title) {
        drawYAxisTitle(opts.yAxis.title, opts, config, context);
    }
}

function drawLegend(series, opts, config, context) {
    if (!opts.legend) {
        return;
    }
    // each legend shape width 15px
    // the spacing between shape and text in each legend is the `padding`
    // each legend spacing is the `padding`
    // legend margin top `config.padding`

    var _calLegendData = calLegendData(series, opts, config),
        legendList = _calLegendData.legendList;

    var padding = 5;
    var marginTop = 8;
    var shapeWidth = 15;
    legendList.forEach(function (itemList, listIndex) {
        var width = 0;
        itemList.forEach(function (item) {
            item.name = item.name || 'undefined';
            width += 3 * padding + measureText(item.name) + shapeWidth;
        });
        var startX = (opts.width - width) / 2 + padding;
        var startY = opts.height - config.padding - config.legendHeight + listIndex * (config.fontSize + marginTop) + padding + marginTop;

        context.setFontSize(config.fontSize);
        itemList.forEach(function (item) {
            switch (opts.type) {
                case 'line':
                    context.beginPath();
                    context.setLineWidth(1);
                    context.setStrokeStyle(item.color);
                    context.moveTo(startX - 2, startY + 5);
                    context.lineTo(startX + 17, startY + 5);
                    context.stroke();
                    context.closePath();
                    context.beginPath();
                    context.setLineWidth(1);
                    context.setStrokeStyle('#ffffff');
                    context.setFillStyle(item.color);
                    context.moveTo(startX + 7.5, startY + 5);
                    context.arc(startX + 7.5, startY + 5, 4, 0, 2 * Math.PI);
                    context.fill();
                    context.stroke();
                    context.closePath();
                    break;
                case 'pie':
                case 'ring':
                    context.beginPath();
                    context.setFillStyle(item.color);
                    context.moveTo(startX + 7.5, startY + 5);
                    context.arc(startX + 7.5, startY + 5, 7, 0, 2 * Math.PI);
                    context.closePath();
                    context.fill();
                    break;
                default:
                    context.beginPath();
                    context.setFillStyle(item.color);
                    context.moveTo(startX, startY);
                    context.rect(startX, startY, 15, 10);
                    context.closePath();
                    context.fill();
            }
            startX += padding + shapeWidth;
            context.beginPath();
            context.setFillStyle(opts.extra.legendTextColor || '#333333');
            context.fillText(item.name, startX, startY + 9);
            context.closePath();
            context.stroke();
            startX += measureText(item.name) + 2 * padding;
        });
    });
}
function drawPieDataPoints(series, opts, config, context) {
    var process = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

    var pieOption = opts.extra.pie || {};
    series = getPieDataPoints(series, process);
    var centerPosition = {
        x: opts.width / 2,
        y: (opts.height - config.legendHeight) / 2
    };
    var radius = Math.min(centerPosition.x - config.pieChartLinePadding - config.pieChartTextPadding - config._pieTextMaxLength_, centerPosition.y - config.pieChartLinePadding - config.pieChartTextPadding);
    if (opts.dataLabel) {
        radius -= 10;
    } else {
        radius -= 2 * config.padding;
    }
    series = series.map(function (eachSeries) {
        eachSeries._start_ += (pieOption.offsetAngle || 0) * Math.PI / 180;
        return eachSeries;
    });
    series.forEach(function (eachSeries) {
        context.beginPath();
        context.setLineWidth(2);
        context.setStrokeStyle('#ffffff');
        context.setFillStyle(eachSeries.color);
        context.moveTo(centerPosition.x, centerPosition.y);
        context.arc(centerPosition.x, centerPosition.y, radius, eachSeries._start_, eachSeries._start_ + 2 * eachSeries._proportion_ * Math.PI);
        context.closePath();
        context.fill();
        if (opts.disablePieStroke !== true) {
            context.stroke();
        }
    });

    if (opts.type === 'ring') {
        var innerPieWidth = radius * 0.6;
        if (typeof opts.extra.ringWidth === 'number' && opts.extra.ringWidth > 0) {
            innerPieWidth = Math.max(0, radius - opts.extra.ringWidth);
        }
        context.beginPath();
        context.setFillStyle(opts.background || '#ffffff');
        context.moveTo(centerPosition.x, centerPosition.y);
        context.arc(centerPosition.x, centerPosition.y, innerPieWidth, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
    }

    if (opts.dataLabel !== false && process === 1) {
        // fix https://github.com/xiaolin3303/wx-charts/issues/132
        var valid = false;
        for (var i = 0, len = series.length; i < len; i++) {
            if (series[i].data > 0) {
                valid = true;
                break;
            }
        }

        if (valid) {
            drawPieText(series, opts, config, context, radius, centerPosition);
        }
    }

    if (process === 1 && opts.type === 'ring') {
        drawRingTitle(opts, config, context);
    }

    return {
        center: centerPosition,
        radius: radius,
        series: series
    };
}

function drawRadarDataPoints(series, opts, config, context) {
    var process = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

    var radarOption = opts.extra.radar || {};
    var coordinateAngle = getRadarCoordinateSeries(opts.categories.length);
    var centerPosition = {
        x: opts.width / 2,
        y: (opts.height - config.legendHeight) / 2
    };

    var radius = Math.min(centerPosition.x - (getMaxTextListLength(opts.categories) + config.radarLabelTextMargin), centerPosition.y - config.radarLabelTextMargin);

    radius -= config.padding;

    // draw grid
    context.beginPath();
    context.setLineWidth(1);
    context.setStrokeStyle(radarOption.gridColor || "#cccccc");
    coordinateAngle.forEach(function (angle) {
        var pos = convertCoordinateOrigin(radius * Math.cos(angle), radius * Math.sin(angle), centerPosition);
        context.moveTo(centerPosition.x, centerPosition.y);
        context.lineTo(pos.x, pos.y);
    });
    context.stroke();
    context.closePath();

    // draw split line grid

    var _loop = function _loop(i) {
        var startPos = {};
        context.beginPath();
        context.setLineWidth(1);
        context.setStrokeStyle(radarOption.gridColor || "#cccccc");
        coordinateAngle.forEach(function (angle, index) {
            var pos = convertCoordinateOrigin(radius / config.radarGridCount * i * Math.cos(angle), radius / config.radarGridCount * i * Math.sin(angle), centerPosition);
            if (index === 0) {
                startPos = pos;
                context.moveTo(pos.x, pos.y);
            } else {
                context.lineTo(pos.x, pos.y);
            }
        });
        context.lineTo(startPos.x, startPos.y);
        context.stroke();
        context.closePath();
    };

    for (var i = 1; i <= config.radarGridCount; i++) {
        _loop(i);
    }

    var radarDataPoints = getRadarDataPoints(coordinateAngle, centerPosition, radius, series, opts, process);
    radarDataPoints.forEach(function (eachSeries, seriesIndex) {
        // 绘制区域数据
        context.beginPath();
        context.setFillStyle(eachSeries.color);
        context.setGlobalAlpha(0.6);
        eachSeries.data.forEach(function (item, index) {
            if (index === 0) {
                context.moveTo(item.position.x, item.position.y);
            } else {
                context.lineTo(item.position.x, item.position.y);
            }
        });
        context.closePath();
        context.fill();
        context.setGlobalAlpha(1);

        if (opts.dataPointShape !== false) {
            var shape = config.dataPointShape[seriesIndex % config.dataPointShape.length];
            var points = eachSeries.data.map(function (item) {
                return item.position;
            });
            drawPointShape(points, eachSeries.color, shape, context);
        }
    });
    // draw label text
    drawRadarLabel(coordinateAngle, radius, centerPosition, opts, config, context);

    return {
        center: centerPosition,
        radius: radius,
        angleList: coordinateAngle
    };
}

function drawCanvas(opts, context) {
    context.draw();
}

var Timing = {
    easeIn: function easeIn(pos) {
        return Math.pow(pos, 3);
    },

    easeOut: function easeOut(pos) {
        return Math.pow(pos - 1, 3) + 1;
    },

    easeInOut: function easeInOut(pos) {
        if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(pos, 3);
        } else {
            return 0.5 * (Math.pow(pos - 2, 3) + 2);
        }
    },

    linear: function linear(pos) {
        return pos;
    }
};

function Animation(opts) {
    this.isStop = false;
    opts.duration = typeof opts.duration === 'undefined' ? 1000 : opts.duration;
    opts.timing = opts.timing || 'linear';

    var delay = 17;

    var createAnimationFrame = function createAnimationFrame() {
        if (typeof requestAnimationFrame !== 'undefined') {
            return requestAnimationFrame;
        } else if (typeof setTimeout !== 'undefined') {
            return function (step, delay) {
                setTimeout(function () {
                    var timeStamp = +new Date();
                    step(timeStamp);
                }, delay);
            };
        } else {
            return function (step) {
                step(null);
            };
        }
    };
    var animationFrame = createAnimationFrame();
    var startTimeStamp = null;
    var _step = function step(timestamp) {
        if (timestamp === null || this.isStop === true) {
            opts.onProcess && opts.onProcess(1);
            opts.onAnimationFinish && opts.onAnimationFinish();
            return;
        }
        if (startTimeStamp === null) {
            startTimeStamp = timestamp;
        }
        if (timestamp - startTimeStamp < opts.duration) {
            var process = (timestamp - startTimeStamp) / opts.duration;
            var timingFunction = Timing[opts.timing];
            process = timingFunction(process);
            opts.onProcess && opts.onProcess(process);
            animationFrame(_step, delay);
        } else {
            opts.onProcess && opts.onProcess(1);
            opts.onAnimationFinish && opts.onAnimationFinish();
        }
    };
    _step = _step.bind(this);

    animationFrame(_step, delay);
}

// stop animation immediately
// and tigger onAnimationFinish
Animation.prototype.stop = function () {
    this.isStop = true;
};

function drawCharts(type, opts, config, context) {
    var _this = this;

    var series = opts.series;
    var categories = opts.categories;
    series = fillSeriesColor(series, config);

    var _calLegendData = calLegendData(series, opts, config),
        legendHeight = _calLegendData.legendHeight;

    config.legendHeight = legendHeight;

    var _calYAxisData = calYAxisData(series, opts, config),
        yAxisWidth = _calYAxisData.yAxisWidth;

    config.yAxisWidth = yAxisWidth;
    if (categories && categories.length) {
        var _calCategoriesData = calCategoriesData(categories, opts, config),
            xAxisHeight = _calCategoriesData.xAxisHeight,
            angle = _calCategoriesData.angle;

        config.xAxisHeight = xAxisHeight;
        config._xAxisTextAngle_ = angle;
    }
    if (type === 'pie' || type === 'ring') {
        config._pieTextMaxLength_ = opts.dataLabel === false ? 0 : getPieTextMaxLength(series);
    }

    var duration = opts.animation ? 1000 : 0;
    this.animationInstance && this.animationInstance.stop();
    switch (type) {
        case 'line':
            this.animationInstance = new Animation({
                timing: 'easeIn',
                duration: duration,
                onProcess: function onProcess(process) {
                    drawYAxisGrid(opts, config, context);

                    var _drawLineDataPoints = drawLineDataPoints(series, opts, config, context, process),
                        xAxisPoints = _drawLineDataPoints.xAxisPoints,
                        calPoints = _drawLineDataPoints.calPoints,
                        eachSpacing = _drawLineDataPoints.eachSpacing;

                    _this.chartData.xAxisPoints = xAxisPoints;
                    _this.chartData.calPoints = calPoints;
                    _this.chartData.eachSpacing = eachSpacing;
                    drawXAxis(categories, opts, config, context);
                    drawLegend(opts.series, opts, config, context);
                    drawYAxis(series, opts, config, context);
                    drawToolTipBridge(opts, config, context, process);
                    drawCanvas(opts, context);
                },
                onAnimationFinish: function onAnimationFinish() {
                    _this.event.trigger('renderComplete');
                }
            });
            break;
        case 'column':
            this.animationInstance = new Animation({
                timing: 'easeIn',
                duration: duration,
                onProcess: function onProcess(process) {
                    drawYAxisGrid(opts, config, context);

                    var _drawColumnDataPoints = drawColumnDataPoints(series, opts, config, context, process),
                        xAxisPoints = _drawColumnDataPoints.xAxisPoints,
                        eachSpacing = _drawColumnDataPoints.eachSpacing;

                    _this.chartData.xAxisPoints = xAxisPoints;
                    _this.chartData.eachSpacing = eachSpacing;
                    drawXAxis(categories, opts, config, context);
                    drawLegend(opts.series, opts, config, context);
                    drawYAxis(series, opts, config, context);
                    drawCanvas(opts, context);
                },
                onAnimationFinish: function onAnimationFinish() {
                    _this.event.trigger('renderComplete');
                }
            });
            break;
        case 'area':
            this.animationInstance = new Animation({
                timing: 'easeIn',
                duration: duration,
                onProcess: function onProcess(process) {
                    drawYAxisGrid(opts, config, context);

                    var _drawAreaDataPoints = drawAreaDataPoints(series, opts, config, context, process),
                        xAxisPoints = _drawAreaDataPoints.xAxisPoints,
                        calPoints = _drawAreaDataPoints.calPoints,
                        eachSpacing = _drawAreaDataPoints.eachSpacing;

                    _this.chartData.xAxisPoints = xAxisPoints;
                    _this.chartData.calPoints = calPoints;
                    _this.chartData.eachSpacing = eachSpacing;
                    drawXAxis(categories, opts, config, context);
                    drawLegend(opts.series, opts, config, context);
                    drawYAxis(series, opts, config, context);
                    drawToolTipBridge(opts, config, context, process);
                    drawCanvas(opts, context);
                },
                onAnimationFinish: function onAnimationFinish() {
                    _this.event.trigger('renderComplete');
                }
            });
            break;
        case 'ring':
        case 'pie':
            this.animationInstance = new Animation({
                timing: 'easeInOut',
                duration: duration,
                onProcess: function onProcess(process) {
                    _this.chartData.pieData = drawPieDataPoints(series, opts, config, context, process);
                    drawLegend(opts.series, opts, config, context);
                    drawCanvas(opts, context);
                },
                onAnimationFinish: function onAnimationFinish() {
                    _this.event.trigger('renderComplete');
                }
            });
            break;
        case 'radar':
            this.animationInstance = new Animation({
                timing: 'easeInOut',
                duration: duration,
                onProcess: function onProcess(process) {
                    _this.chartData.radarData = drawRadarDataPoints(series, opts, config, context, process);
                    drawLegend(opts.series, opts, config, context);
                    drawCanvas(opts, context);
                },
                onAnimationFinish: function onAnimationFinish() {
                    _this.event.trigger('renderComplete');
                }
            });
            break;
    }
}

// simple event implement

function Event() {
    this.events = {};
}

Event.prototype.addEventListener = function (type, listener) {
    this.events[type] = this.events[type] || [];
    this.events[type].push(listener);
};

Event.prototype.trigger = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    var type = args[0];
    var params = args.slice(1);
    if (!!this.events[type]) {
        this.events[type].forEach(function (listener) {
            try {
                listener.apply(null, params);
            } catch (e) {
                console.error(e);
            }
        });
    }
};

var Charts = function Charts(opts) {
    opts.title = opts.title || {};
    opts.subtitle = opts.subtitle || {};
    opts.yAxis = opts.yAxis || {};
    opts.xAxis = opts.xAxis || {};
    opts.extra = opts.extra || {};
    opts.legend = opts.legend === false ? false : true;
    opts.animation = opts.animation === false ? false : true;
    var config$$1 = assign({}, config);
    config$$1.yAxisTitleWidth = opts.yAxis.disabled !== true && opts.yAxis.title ? config$$1.yAxisTitleWidth : 0;
    config$$1.pieChartLinePadding = opts.dataLabel === false ? 0 : config$$1.pieChartLinePadding;
    config$$1.pieChartTextPadding = opts.dataLabel === false ? 0 : config$$1.pieChartTextPadding;

    this.opts = opts;
    this.config = config$$1;
    this.context = wx.createCanvasContext(opts.canvasId);
    // store calcuated chart data
    // such as chart point coordinate
    this.chartData = {};
    this.event = new Event();
    this.scrollOption = {
        currentOffset: 0,
        startTouchX: 0,
        distance: 0
    };

    drawCharts.call(this, opts.type, opts, config$$1, this.context);
};

Charts.prototype.updateData = function () {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.opts.series = data.series || this.opts.series;
    this.opts.categories = data.categories || this.opts.categories;

    this.opts.title = assign({}, this.opts.title, data.title || {});
    this.opts.subtitle = assign({}, this.opts.subtitle, data.subtitle || {});

    drawCharts.call(this, this.opts.type, this.opts, this.config, this.context);
};

Charts.prototype.stopAnimation = function () {
    this.animationInstance && this.animationInstance.stop();
};

Charts.prototype.addEventListener = function (type, listener) {
    this.event.addEventListener(type, listener);
};

Charts.prototype.getCurrentDataIndex = function (e) {
    var touches = e.touches && e.touches.length ? e.touches : e.changedTouches;
    if (touches && touches.length) {
        var _touches$ = touches[0],
            x = _touches$.x,
            y = _touches$.y;

        if (this.opts.type === 'pie' || this.opts.type === 'ring') {
            return findPieChartCurrentIndex({ x: x, y: y }, this.chartData.pieData);
        } else if (this.opts.type === 'radar') {
            return findRadarChartCurrentIndex({ x: x, y: y }, this.chartData.radarData, this.opts.categories.length);
        } else {
            return findCurrentIndex({ x: x, y: y }, this.chartData.xAxisPoints, this.opts, this.config, Math.abs(this.scrollOption.currentOffset));
        }
    }
    return -1;
};

Charts.prototype.showToolTip = function (e) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (this.opts.type === 'line' || this.opts.type === 'area') {
        var index = this.getCurrentDataIndex(e);
        var currentOffset = this.scrollOption.currentOffset;

        var opts = assign({}, this.opts, {
            _scrollDistance_: currentOffset,
            animation: false
        });
        if (index > -1) {
            var seriesData = getSeriesDataItem(this.opts.series, index);
            if (seriesData.length !== 0) {
                var _getToolTipData = getToolTipData(seriesData, this.chartData.calPoints, index, this.opts.categories, option),
                    textList = _getToolTipData.textList,
                    offset = _getToolTipData.offset;

                opts.tooltip = {
                    textList: textList,
                    offset: offset,
                    option: option
                };
            }
        }
        drawCharts.call(this, opts.type, opts, this.config, this.context);
    }
};

Charts.prototype.scrollStart = function (e) {
    if (e.touches[0] && this.opts.enableScroll === true) {
        this.scrollOption.startTouchX = e.touches[0].x;
    }
};

Charts.prototype.scroll = function (e) {
    // TODO throtting...
    if (e.touches[0] && this.opts.enableScroll === true) {
        var _distance = e.touches[0].x - this.scrollOption.startTouchX;
        var currentOffset = this.scrollOption.currentOffset;

        var validDistance = calValidDistance(currentOffset + _distance, this.chartData, this.config, this.opts);

        this.scrollOption.distance = _distance = validDistance - currentOffset;
        var opts = assign({}, this.opts, {
            _scrollDistance_: currentOffset + _distance,
            animation: false
        });

        drawCharts.call(this, opts.type, opts, this.config, this.context);
    }
};

Charts.prototype.scrollEnd = function (e) {
    if (this.opts.enableScroll === true) {
        var _scrollOption = this.scrollOption,
            currentOffset = _scrollOption.currentOffset,
            distance = _scrollOption.distance;

        this.scrollOption.currentOffset = currentOffset + distance;
        this.scrollOption.distance = 0;
    }
};

module.exports = Charts;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInd4Y2hhcnQuanMiXSwibmFtZXMiOlsiY29uZmlnIiwieUF4aXNXaWR0aCIsInlBeGlzU3BsaXQiLCJ4QXhpc0hlaWdodCIsInhBeGlzTGluZUhlaWdodCIsImxlZ2VuZEhlaWdodCIsInlBeGlzVGl0bGVXaWR0aCIsInBhZGRpbmciLCJjb2x1bWVQYWRkaW5nIiwiZm9udFNpemUiLCJkYXRhUG9pbnRTaGFwZSIsImNvbG9ycyIsInBpZUNoYXJ0TGluZVBhZGRpbmciLCJwaWVDaGFydFRleHRQYWRkaW5nIiwieEF4aXNUZXh0UGFkZGluZyIsInRpdGxlQ29sb3IiLCJ0aXRsZUZvbnRTaXplIiwic3VidGl0bGVDb2xvciIsInN1YnRpdGxlRm9udFNpemUiLCJ0b29sVGlwUGFkZGluZyIsInRvb2xUaXBCYWNrZ3JvdW5kIiwidG9vbFRpcE9wYWNpdHkiLCJ0b29sVGlwTGluZUhlaWdodCIsInJhZGFyR3JpZENvdW50IiwicmFkYXJMYWJlbFRleHRNYXJnaW4iLCJhc3NpZ24iLCJ0YXJnZXQiLCJ2YXJBcmdzIiwiVHlwZUVycm9yIiwidG8iLCJPYmplY3QiLCJpbmRleCIsImFyZ3VtZW50cyIsImxlbmd0aCIsIm5leHRTb3VyY2UiLCJuZXh0S2V5IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwidXRpbCIsInRvRml4ZWQiLCJudW0iLCJsaW1pdCIsImlzRmxvYXQiLCJhcHByb3hpbWF0ZWx5RXF1YWwiLCJudW0xIiwibnVtMiIsIk1hdGgiLCJhYnMiLCJpc1NhbWVTaWduIiwiaXNTYW1lWENvb3JkaW5hdGVBcmVhIiwicDEiLCJwMiIsIngiLCJpc0NvbGxpc2lvbiIsIm9iajEiLCJvYmoyIiwiZW5kIiwic3RhcnQiLCJ3aWR0aCIsInkiLCJoZWlnaHQiLCJmbGFnIiwiZmluZFJhbmdlIiwidHlwZSIsImlzTmFOIiwiRXJyb3IiLCJtdWx0aXBsZSIsImNlaWwiLCJmbG9vciIsImNhbFZhbGlkRGlzdGFuY2UiLCJkaXN0YW5jZSIsImNoYXJ0RGF0YSIsIm9wdHMiLCJkYXRhQ2hhcnRBcmVhV2lkdGgiLCJ4QXhpc1BvaW50cyIsImRhdGFDaGFydFdpZHRoIiwiZWFjaFNwYWNpbmciLCJjYXRlZ29yaWVzIiwidmFsaWREaXN0YW5jZSIsImlzSW5BbmdsZVJhbmdlIiwiYW5nbGUiLCJzdGFydEFuZ2xlIiwiZW5kQW5nbGUiLCJhZGp1c3QiLCJQSSIsImNhbFJvdGF0ZVRyYW5zbGF0ZSIsImgiLCJ4diIsInl2IiwidHJhbnNYIiwic3FydCIsInRyYW5zWSIsImNyZWF0ZUN1cnZlQ29udHJvbFBvaW50cyIsInBvaW50cyIsImkiLCJpc05vdE1pZGRsZVBvaW50IiwibWF4IiwibWluIiwiYSIsImIiLCJwQXgiLCJwQXkiLCJwQngiLCJwQnkiLCJsYXN0IiwiY3RyQSIsImN0ckIiLCJjb252ZXJ0Q29vcmRpbmF0ZU9yaWdpbiIsImNlbnRlciIsImF2b2lkQ29sbGlzaW9uIiwib2JqIiwiZmlsbFNlcmllc0NvbG9yIiwic2VyaWVzIiwibWFwIiwiaXRlbSIsImNvbG9yIiwiZ2V0RGF0YVJhbmdlIiwibWluRGF0YSIsIm1heERhdGEiLCJyYW5nZSIsIm1pblJhbmdlIiwibWF4UmFuZ2UiLCJtZWFzdXJlVGV4dCIsInRleHQiLCJ1bmRlZmluZWQiLCJTdHJpbmciLCJzcGxpdCIsImZvckVhY2giLCJ0ZXN0IiwiZGF0YUNvbWJpbmUiLCJyZWR1Y2UiLCJkYXRhIiwiY29uY2F0IiwiZ2V0U2VyaWVzRGF0YUl0ZW0iLCJzZXJpZXNJdGVtIiwibmFtZSIsImZvcm1hdCIsInB1c2giLCJnZXRNYXhUZXh0TGlzdExlbmd0aCIsImxpc3QiLCJsZW5ndGhMaXN0IiwiYXBwbHkiLCJnZXRSYWRhckNvb3JkaW5hdGVTZXJpZXMiLCJlYWNoQW5nbGUiLCJDb29yZGluYXRlU2VyaWVzIiwiZ2V0VG9vbFRpcERhdGEiLCJzZXJpZXNEYXRhIiwiY2FsUG9pbnRzIiwib3B0aW9uIiwidGV4dExpc3QiLCJ2YWxpZENhbFBvaW50cyIsIm9mZnNldCIsInJvdW5kIiwiZmluZEN1cnJlbnRJbmRleCIsImN1cnJlbnRQb2ludHMiLCJjdXJyZW50SW5kZXgiLCJpc0luRXhhY3RDaGFydEFyZWEiLCJmaW5kUmFkYXJDaGFydEN1cnJlbnRJbmRleCIsInJhZGFyRGF0YSIsImNvdW50IiwiZWFjaEFuZ2xlQXJlYSIsImlzSW5FeGFjdFBpZUNoYXJ0QXJlYSIsInJhZGl1cyIsImZpeEFuZ2xlIiwiYXRhbjIiLCJhbmdsZUxpc3QiLCJyYW5nZVN0YXJ0IiwicmFuZ2VFbmQiLCJmaW5kUGllQ2hhcnRDdXJyZW50SW5kZXgiLCJwaWVEYXRhIiwibGVuIiwiX3N0YXJ0XyIsIl9wcm9wb3J0aW9uXyIsInBvdyIsInNwbGl0UG9pbnRzIiwibmV3UG9pbnRzIiwiaXRlbXMiLCJjYWxMZWdlbmREYXRhIiwibGVnZW5kIiwibGVnZW5kTGlzdCIsIm1hcmdpblRvcCIsInNoYXBlV2lkdGgiLCJ3aWR0aENvdW50IiwiY3VycmVudFJvdyIsIml0ZW1XaWR0aCIsImNhbENhdGVnb3JpZXNEYXRhIiwicmVzdWx0IiwiX2dldFhBeGlzUG9pbnRzIiwiZ2V0WEF4aXNQb2ludHMiLCJjYXRlZ29yaWVzVGV4dExlbnRoIiwibWF4VGV4dExlbmd0aCIsInNpbiIsImdldFJhZGFyRGF0YVBvaW50cyIsInByb2Nlc3MiLCJyYWRhck9wdGlvbiIsImV4dHJhIiwicmFkYXIiLCJlYWNoIiwibGlzdEl0ZW0iLCJ0bXAiLCJwcm9wb3J0aW9uIiwicG9zaXRpb24iLCJjb3MiLCJnZXRQaWVEYXRhUG9pbnRzIiwiZ2V0UGllVGV4dE1heExlbmd0aCIsIm1heExlbmd0aCIsImZpeENvbHVtZURhdGEiLCJjb2x1bW5MZW4iLCJjb2x1bW4iLCJ5QXhpc1RvdGFsV2lkdGgiLCJzcGFjaW5nVmFsaWQiLCJkYXRhQ291bnQiLCJlbmFibGVTY3JvbGwiLCJzdGFydFgiLCJlbmRYIiwiZ2V0RGF0YVBvaW50cyIsInZhbGlkSGVpZ2h0IiwicG9pbnQiLCJnZXRZQXhpc1RleHRMaXN0IiwiZmlsdGVyIiwieUF4aXMiLCJyYW5nZVNwYW4iLCJkYXRhUmFuZ2UiLCJlYWNoUmFuZ2UiLCJyZXZlcnNlIiwiY2FsWUF4aXNEYXRhIiwicmFuZ2VzIiwicmFuZ2VzRm9ybWF0IiwiTnVtYmVyIiwiZGlzYWJsZWQiLCJkcmF3UG9pbnRTaGFwZSIsInNoYXBlIiwiY29udGV4dCIsImJlZ2luUGF0aCIsInNldFN0cm9rZVN0eWxlIiwic2V0TGluZVdpZHRoIiwic2V0RmlsbFN0eWxlIiwibW92ZVRvIiwibGluZVRvIiwiYXJjIiwicmVjdCIsImNsb3NlUGF0aCIsImZpbGwiLCJzdHJva2UiLCJkcmF3UmluZ1RpdGxlIiwidGl0bGVmb250U2l6ZSIsInRpdGxlIiwic3VidGl0bGVmb250U2l6ZSIsInN1YnRpdGxlIiwidGl0bGVGb250Q29sb3IiLCJzdWJ0aXRsZUZvbnRDb2xvciIsInRpdGxlSGVpZ2h0Iiwic3VidGl0bGVIZWlnaHQiLCJtYXJnaW4iLCJ0ZXh0V2lkdGgiLCJvZmZzZXRYIiwic3RhcnRZIiwic2V0Rm9udFNpemUiLCJmaWxsVGV4dCIsIl90ZXh0V2lkdGgiLCJfc3RhcnRYIiwiX3N0YXJ0WSIsImRyYXdQb2ludFRleHQiLCJmb3JtYXRWYWwiLCJkcmF3UmFkYXJMYWJlbCIsImNlbnRlclBvc2l0aW9uIiwibGFiZWxDb2xvciIsInBvcyIsInBvc1JlbGF0aXZlQ2FudmFzIiwiZHJhd1BpZVRleHQiLCJsaW5lUmFkaXVzIiwidGV4dE9iamVjdENvbGxlY3Rpb24iLCJsYXN0VGV4dE9iamVjdCIsInNlcmllc0NvbnZlcnQiLCJvcmdpblgxIiwib3JnaW5ZMSIsIm9yZ2luWDIiLCJvcmdpblkyIiwib3JnaW5YMyIsIm9yZ2luWTMiLCJ0ZXh0T2JqZWN0IiwibGluZVN0YXJ0IiwibGluZUVuZCIsImxpbmVTdGFydFBvaXN0aW9uIiwibGluZUVuZFBvaXN0aW9uIiwidGV4dFBvc2l0aW9uIiwiY3VydmVTdGFydFgiLCJ0ZXh0U3RhcnRYIiwicXVhZHJhdGljQ3VydmVUbyIsImRyYXdUb29sVGlwU3BsaXRMaW5lIiwiZW5kWSIsImRyYXdUb29sVGlwIiwibGVnZW5kV2lkdGgiLCJsZWdlbmRNYXJnaW5SaWdodCIsImFycm93V2lkdGgiLCJpc092ZXJSaWdodEJvcmRlciIsInRvb2xUaXBXaWR0aCIsInRvb2xUaXBIZWlnaHQiLCJfc2Nyb2xsRGlzdGFuY2VfIiwidG9vbHRpcCIsImJhY2tncm91bmQiLCJzZXRHbG9iYWxBbHBoYSIsImZpbGxSZWN0IiwiZHJhd1lBeGlzVGl0bGUiLCJzYXZlIiwidHJhbnNsYXRlIiwicm90YXRlIiwicmVzdG9yZSIsImRyYXdDb2x1bW5EYXRhUG9pbnRzIiwiX2NhbFlBeGlzRGF0YSIsInBvcCIsInNoaWZ0IiwiZWFjaFNlcmllcyIsInNlcmllc0luZGV4IiwiZGF0YUxhYmVsIiwiZHJhd0FyZWFEYXRhUG9pbnRzIiwiX2NhbFlBeGlzRGF0YTIiLCJfZ2V0WEF4aXNQb2ludHMyIiwic3BsaXRQb2ludExpc3QiLCJmaXJzdFBvaW50IiwibGFzdFBvaW50IiwibGluZVN0eWxlIiwiY3RybFBvaW50IiwiYmV6aWVyQ3VydmVUbyIsImRyYXdMaW5lRGF0YVBvaW50cyIsIl9jYWxZQXhpc0RhdGEzIiwiX2dldFhBeGlzUG9pbnRzMyIsImRyYXdUb29sVGlwQnJpZGdlIiwiZHJhd1hBeGlzIiwiX2dldFhBeGlzUG9pbnRzNCIsInhBeGlzIiwiZ3JpZENvbG9yIiwiZGlzYWJsZUdyaWQiLCJ2YWxpZFdpZHRoIiwibWF4WEF4aXNMaXN0TGVuZ3RoIiwicmF0aW8iLCJfeEF4aXNUZXh0QW5nbGVfIiwiZm9udENvbG9yIiwiX2NhbFJvdGF0ZVRyYW5zbGF0ZSIsImRyYXdZQXhpc0dyaWQiLCJkcmF3WUF4aXMiLCJfY2FsWUF4aXNEYXRhNCIsImRyYXdMZWdlbmQiLCJfY2FsTGVnZW5kRGF0YSIsIml0ZW1MaXN0IiwibGlzdEluZGV4IiwibGVnZW5kVGV4dENvbG9yIiwiZHJhd1BpZURhdGFQb2ludHMiLCJwaWVPcHRpb24iLCJwaWUiLCJfcGllVGV4dE1heExlbmd0aF8iLCJvZmZzZXRBbmdsZSIsImRpc2FibGVQaWVTdHJva2UiLCJpbm5lclBpZVdpZHRoIiwicmluZ1dpZHRoIiwidmFsaWQiLCJkcmF3UmFkYXJEYXRhUG9pbnRzIiwiY29vcmRpbmF0ZUFuZ2xlIiwiX2xvb3AiLCJzdGFydFBvcyIsInJhZGFyRGF0YVBvaW50cyIsImRyYXdDYW52YXMiLCJkcmF3IiwiVGltaW5nIiwiZWFzZUluIiwiZWFzZU91dCIsImVhc2VJbk91dCIsImxpbmVhciIsIkFuaW1hdGlvbiIsImlzU3RvcCIsImR1cmF0aW9uIiwidGltaW5nIiwiZGVsYXkiLCJjcmVhdGVBbmltYXRpb25GcmFtZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInNldFRpbWVvdXQiLCJzdGVwIiwidGltZVN0YW1wIiwiRGF0ZSIsImFuaW1hdGlvbkZyYW1lIiwic3RhcnRUaW1lU3RhbXAiLCJfc3RlcCIsInRpbWVzdGFtcCIsIm9uUHJvY2VzcyIsIm9uQW5pbWF0aW9uRmluaXNoIiwidGltaW5nRnVuY3Rpb24iLCJiaW5kIiwic3RvcCIsImRyYXdDaGFydHMiLCJfdGhpcyIsIl9jYWxDYXRlZ29yaWVzRGF0YSIsImFuaW1hdGlvbiIsImFuaW1hdGlvbkluc3RhbmNlIiwiX2RyYXdMaW5lRGF0YVBvaW50cyIsImV2ZW50IiwidHJpZ2dlciIsIl9kcmF3Q29sdW1uRGF0YVBvaW50cyIsIl9kcmF3QXJlYURhdGFQb2ludHMiLCJFdmVudCIsImV2ZW50cyIsImFkZEV2ZW50TGlzdGVuZXIiLCJsaXN0ZW5lciIsIl9sZW4iLCJhcmdzIiwiQXJyYXkiLCJfa2V5IiwicGFyYW1zIiwic2xpY2UiLCJlIiwiY29uc29sZSIsImVycm9yIiwiQ2hhcnRzIiwiY29uZmlnJCQxIiwid3giLCJjcmVhdGVDYW52YXNDb250ZXh0IiwiY2FudmFzSWQiLCJzY3JvbGxPcHRpb24iLCJjdXJyZW50T2Zmc2V0Iiwic3RhcnRUb3VjaFgiLCJ1cGRhdGVEYXRhIiwic3RvcEFuaW1hdGlvbiIsImdldEN1cnJlbnREYXRhSW5kZXgiLCJ0b3VjaGVzIiwiY2hhbmdlZFRvdWNoZXMiLCJfdG91Y2hlcyQiLCJzaG93VG9vbFRpcCIsIl9nZXRUb29sVGlwRGF0YSIsInNjcm9sbFN0YXJ0Iiwic2Nyb2xsIiwiX2Rpc3RhbmNlIiwic2Nyb2xsRW5kIiwiX3Njcm9sbE9wdGlvbiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUFTQTs7QUFFQSxJQUFJQSxTQUFTO0FBQ1RDLGdCQUFZLEVBREg7QUFFVEMsZ0JBQVksQ0FGSDtBQUdUQyxpQkFBYSxFQUhKO0FBSVRDLHFCQUFpQixFQUpSO0FBS1RDLGtCQUFjLEVBTEw7QUFNVEMscUJBQWlCLEVBTlI7QUFPVEMsYUFBUyxFQVBBO0FBUVRDLG1CQUFlLENBUk47QUFTVEMsY0FBVSxFQVREO0FBVVRDLG9CQUFnQixDQUFDLFNBQUQsRUFBWSxRQUFaLEVBQXNCLFVBQXRCLEVBQWtDLE1BQWxDLENBVlA7QUFXVEMsWUFBUSxDQUFDLFNBQUQsRUFBWSxTQUFaLEVBQXVCLFNBQXZCLEVBQWtDLFNBQWxDLEVBQTZDLFNBQTdDLEVBQXdELFNBQXhELENBWEM7QUFZVEMseUJBQXFCLEVBWlo7QUFhVEMseUJBQXFCLEVBYlo7QUFjVEMsc0JBQWtCLENBZFQ7QUFlVEMsZ0JBQVksU0FmSDtBQWdCVEMsbUJBQWUsRUFoQk47QUFpQlRDLG1CQUFlLFNBakJOO0FBa0JUQyxzQkFBa0IsRUFsQlQ7QUFtQlRDLG9CQUFnQixDQW5CUDtBQW9CVEMsdUJBQW1CLFNBcEJWO0FBcUJUQyxvQkFBZ0IsR0FyQlA7QUFzQlRDLHVCQUFtQixFQXRCVjtBQXVCVEMsb0JBQWdCLENBdkJQO0FBd0JUQywwQkFBc0I7QUF4QmIsQ0FBYjs7QUEyQkE7QUFDQTtBQUNBLFNBQVNDLE1BQVQsQ0FBZ0JDLE1BQWhCLEVBQXdCQyxPQUF4QixFQUFpQztBQUM3QixRQUFJRCxVQUFVLElBQWQsRUFBb0I7QUFDaEI7QUFDQSxjQUFNLElBQUlFLFNBQUosQ0FBYyw0Q0FBZCxDQUFOO0FBQ0g7O0FBRUQsUUFBSUMsS0FBS0MsT0FBT0osTUFBUCxDQUFUOztBQUVBLFNB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WUFBTCxDQUFrQkMsYUFBdEM7O0FBRUEsWUFBSW5WLGdCQUFnQlQsaUJBQWlCNFYsZ0JBQWdCWSxTQUFqQyxFQUE0QyxLQUFLdFcsU0FBakQsRUFBNEQsS0FBS3hFLE1BQWpFLEVBQXlFLEtBQUt5RSxJQUE5RSxDQUFwQjs7QUFFQSxhQUFLd1YsWUFBTCxDQUFrQjFWLFFBQWxCLEdBQTZCdVcsWUFBWS9WLGdCQUFnQm1WLGFBQXpEO0FBQ0EsWUFBSXpWLE9BQU9oRCxPQUFPLEVBQVAsRUFBVyxLQUFLZ0QsSUFBaEIsRUFBc0I7QUFDN0JrTyw4QkFBa0J1SCxnQkFBZ0JZLFNBREw7QUFFN0J0Qyx1QkFBVztBQUZrQixTQUF0QixDQUFYOztBQUtBSCxtQkFBVy9WLElBQVgsQ0FBZ0IsSUFBaEIsRUFBc0JtQyxLQUFLVCxJQUEzQixFQUFpQ1MsSUFBakMsRUFBdUMsS0FBS3pFLE1BQTVDLEVBQW9ELEtBQUt5TyxPQUF6RDtBQUNIO0FBQ0osQ0FoQkQ7O0FBa0JBbUwsT0FBT3hYLFNBQVAsQ0FBaUIyWSxTQUFqQixHQUE2QixVQUFVdEIsQ0FBVixFQUFhO0FBQ3RDLFFBQUksS0FBS2hWLElBQUwsQ0FBVTRJLFlBQVYsS0FBMkIsSUFBL0IsRUFBcUM7QUFDakMsWUFBSTJOLGdCQUFnQixLQUFLZixZQUF6QjtBQUFBLFlBQ0lDLGdCQUFnQmMsY0FBY2QsYUFEbEM7QUFBQSxZQUVJM1YsV0FBV3lXLGNBQWN6VyxRQUY3Qjs7QUFJQSxhQUFLMFYsWUFBTCxDQUFrQkMsYUFBbEIsR0FBa0NBLGdCQUFnQjNWLFFBQWxEO0FBQ0EsYUFBSzBWLFlBQUwsQ0FBa0IxVixRQUFsQixHQUE2QixDQUE3QjtBQUNIO0FBQ0osQ0FURDs7QUFXQTBXLE9BQU9DLE9BQVAsR0FBaUJ0QixNQUFqQiIsImZpbGUiOiJ3eGNoYXJ0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogY2hhcnRzIGZvciBXZUNoYXQgc21hbGwgYXBwIHYxLjBcclxuICpcclxuICogaHR0cHM6Ly9naXRodWIuY29tL3hpYW9saW4zMzAzL3d4LWNoYXJ0c1xyXG4gKiAyMDE2LTExLTI4XHJcbiAqXHJcbiAqIERlc2lnbmVkIGFuZCBidWlsdCB3aXRoIGFsbCB0aGUgbG92ZSBvZiBXZWJcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG52YXIgY29uZmlnID0ge1xyXG4gICAgeUF4aXNXaWR0aDogMTUsXHJcbiAgICB5QXhpc1NwbGl0OiA1LFxyXG4gICAgeEF4aXNIZWlnaHQ6IDE1LFxyXG4gICAgeEF4aXNMaW5lSGVpZ2h0OiAxNSxcclxuICAgIGxlZ2VuZEhlaWdodDogMTUsXHJcbiAgICB5QXhpc1RpdGxlV2lkdGg6IDE1LFxyXG4gICAgcGFkZGluZzogMTIsXHJcbiAgICBjb2x1bWVQYWRkaW5nOiAzLFxyXG4gICAgZm9udFNpemU6IDEwLFxyXG4gICAgZGF0YVBvaW50U2hhcGU6IFsnZGlhbW9uZCcsICdjaXJjbGUnLCAndHJpYW5nbGUnLCAncmVjdCddLFxyXG4gICAgY29sb3JzOiBbJyM3Y2I1ZWMnLCAnI2Y3YTM1YycsICcjNDM0MzQ4JywgJyM5MGVkN2QnLCAnI2YxNWM4MCcsICcjODA4NWU5J10sXHJcbiAgICBwaWVDaGFydExpbmVQYWRkaW5nOiAyNSxcclxuICAgIHBpZUNoYXJ0VGV4dFBhZGRpbmc6IDE1LFxyXG4gICAgeEF4aXNUZXh0UGFkZGluZzogMyxcclxuICAgIHRpdGxlQ29sb3I6ICcjMzMzMzMzJyxcclxuICAgIHRpdGxlRm9udFNpemU6IDIwLFxyXG4gICAgc3VidGl0bGVDb2xvcjogJyM5OTk5OTknLFxyXG4gICAgc3VidGl0bGVGb250U2l6ZTogMTUsXHJcbiAgICB0b29sVGlwUGFkZGluZzogMyxcclxuICAgIHRvb2xUaXBCYWNrZ3JvdW5kOiAnIzAwMDAwMCcsXHJcbiAgICB0b29sVGlwT3BhY2l0eTogMC43LFxyXG4gICAgdG9vbFRpcExpbmVIZWlnaHQ6IDE0LFxyXG4gICAgcmFkYXJHcmlkQ291bnQ6IDMsXHJcbiAgICByYWRhckxhYmVsVGV4dE1hcmdpbjogMTVcclxufTtcclxuXHJcbi8vIE9iamVjdC5hc3NpZ24gcG9seWZpbGxcclxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2Fzc2lnblxyXG5mdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCB2YXJBcmdzKSB7XHJcbiAgICBpZiAodGFyZ2V0ID09IG51bGwpIHtcclxuICAgICAgICAvLyBUeXBlRXJyb3IgaWYgdW5kZWZpbmVkIG9yIG51bGxcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29udmVydCB1bmRlZmluZWQgb3IgbnVsbCB0byBvYmplY3QnKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdG8gPSBPYmplY3QodGFyZ2V0KTtcclxuXHJcbiAgICBmb3IgKHZhciBpbmRleCA9IDE7IGluZGV4IDwgYXJndW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgIHZhciBuZXh0U291cmNlID0gYXJndW1lbnRzW2luZGV4XTtcclxuXHJcbiAgICAgICAgaWYgKG5leHRTb3VyY2UgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAvLyBTa2lwIG92ZXIgaWYgdW5kZWZpbmVkIG9yIG51bGxcclxuICAgICAgICAgICAgZm9yICh2YXIgbmV4dEtleSBpbiBuZXh0U291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBBdm9pZCBidWdzIHdoZW4gaGFzT3duUHJvcGVydHkgaXMgc2hhZG93ZWRcclxuICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobmV4dFNvdXJjZSwgbmV4dEtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0b1tuZXh0S2V5XSA9IG5leHRTb3VyY2VbbmV4dEtleV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG87XHJcbn1cclxuXHJcbnZhciB1dGlsID0ge1xyXG4gICAgdG9GaXhlZDogZnVuY3Rpb24gdG9GaXhlZChudW0sIGxpbWl0KSB7XHJcbiAgICAgICAgbGltaXQgPSBsaW1pdCB8fCAyO1xyXG4gICAgICAgIGlmICh0aGlzLmlzRmxvYXQobnVtKSkge1xyXG4gICAgICAgICAgICBudW0gPSBudW0udG9GaXhlZChsaW1pdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudW07XHJcbiAgICB9LFxyXG4gICAgaXNGbG9hdDogZnVuY3Rpb24gaXNGbG9hdChudW0pIHtcclxuICAgICAgICByZXR1cm4gbnVtICUgMSAhPT0gMDtcclxuICAgIH0sXHJcbiAgICBhcHByb3hpbWF0ZWx5RXF1YWw6IGZ1bmN0aW9uIGFwcHJveGltYXRlbHlFcXVhbChudW0xLCBudW0yKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKG51bTEgLSBudW0yKSA8IDFlLTEwO1xyXG4gICAgfSxcclxuICAgIGlzU2FtZVNpZ246IGZ1bmN0aW9uIGlzU2FtZVNpZ24obnVtMSwgbnVtMikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFicyhudW0xKSA9PT0gbnVtMSAmJiBNYXRoLmFicyhudW0yKSA9PT0gbnVtMiB8fCBNYXRoLmFicyhudW0xKSAhPT0gbnVtMSAmJiBNYXRoLmFicyhudW0yKSAhPT0gbnVtMjtcclxuICAgIH0sXHJcbiAgICBpc1NhbWVYQ29vcmRpbmF0ZUFyZWE6IGZ1bmN0aW9uIGlzU2FtZVhDb29yZGluYXRlQXJlYShwMSwgcDIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pc1NhbWVTaWduKHAxLngsIHAyLngpO1xyXG4gICAgfSxcclxuICAgIGlzQ29sbGlzaW9uOiBmdW5jdGlvbiBpc0NvbGxpc2lvbihvYmoxLCBvYmoyKSB7XHJcbiAgICAgICAgb2JqMS5lbmQgPSB7fTtcclxuICAgICAgICBvYmoxLmVuZC54ID0gb2JqMS5zdGFydC54ICsgb2JqMS53aWR0aDtcclxuICAgICAgICBvYmoxLmVuZC55ID0gb2JqMS5zdGFydC55IC0gb2JqMS5oZWlnaHQ7XHJcbiAgICAgICAgb2JqMi5lbmQgPSB7fTtcclxuICAgICAgICBvYmoyLmVuZC54ID0gb2JqMi5zdGFydC54ICsgb2JqMi53aWR0aDtcclxuICAgICAgICBvYmoyLmVuZC55ID0gb2JqMi5zdGFydC55IC0gb2JqMi5oZWlnaHQ7XHJcbiAgICAgICAgdmFyIGZsYWcgPSBvYmoyLnN0YXJ0LnggPiBvYmoxLmVuZC54IHx8IG9iajIuZW5kLnggPCBvYmoxLnN0YXJ0LnggfHwgb2JqMi5lbmQueSA+IG9iajEuc3RhcnQueSB8fCBvYmoyLnN0YXJ0LnkgPCBvYmoxLmVuZC55O1xyXG5cclxuICAgICAgICByZXR1cm4gIWZsYWc7XHJcbiAgICB9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBmaW5kUmFuZ2UobnVtLCB0eXBlLCBsaW1pdCkge1xyXG4gICAgaWYgKGlzTmFOKG51bSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1t3eENoYXJ0c10gdW52YWxpZCBzZXJpZXMgZGF0YSEnKTtcclxuICAgIH1cclxuICAgIGxpbWl0ID0gbGltaXQgfHwgMTA7XHJcbiAgICB0eXBlID0gdHlwZSA/IHR5cGUgOiAndXBwZXInO1xyXG4gICAgdmFyIG11bHRpcGxlID0gMTtcclxuICAgIHdoaWxlIChsaW1pdCA8IDEpIHtcclxuICAgICAgICBsaW1pdCAqPSAxMDtcclxuICAgICAgICBtdWx0aXBsZSAqPSAxMDtcclxuICAgIH1cclxuICAgIGlmICh0eXBlID09PSAndXBwZXInKSB7XHJcbiAgICAgICAgbnVtID0gTWF0aC5jZWlsKG51bSAqIG11bHRpcGxlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbnVtID0gTWF0aC5mbG9vcihudW0gKiBtdWx0aXBsZSk7XHJcbiAgICB9XHJcbiAgICB3aGlsZSAobnVtICUgbGltaXQgIT09IDApIHtcclxuICAgICAgICBpZiAodHlwZSA9PT0gJ3VwcGVyJykge1xyXG4gICAgICAgICAgICBudW0rKztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBudW0tLTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bSAvIG11bHRpcGxlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjYWxWYWxpZERpc3RhbmNlKGRpc3RhbmNlLCBjaGFydERhdGEsIGNvbmZpZywgb3B0cykge1xyXG5cclxuICAgIHZhciBkYXRhQ2hhcnRBcmVhV2lkdGggPSBvcHRzLndpZHRoIC0gY29uZmlnLnBhZGRpbmcgLSBjaGFydERhdGEueEF4aXNQb2ludHNbMF07XHJcbiAgICB2YXIgZGF0YUNoYXJ0V2lkdGggPSBjaGFydERhdGEuZWFjaFNwYWNpbmcgKiBvcHRzLmNhdGVnb3JpZXMubGVuZ3RoO1xyXG4gICAgdmFyIHZhbGlkRGlzdGFuY2UgPSBkaXN0YW5jZTtcclxuICAgIGlmIChkaXN0YW5jZSA+PSAwKSB7XHJcbiAgICAgICAgdmFsaWREaXN0YW5jZSA9IDA7XHJcbiAgICB9IGVsc2UgaWYgKE1hdGguYWJzKGRpc3RhbmNlKSA+PSBkYXRhQ2hhcnRXaWR0aCAtIGRhdGFDaGFydEFyZWFXaWR0aCkge1xyXG4gICAgICAgIHZhbGlkRGlzdGFuY2UgPSBkYXRhQ2hhcnRBcmVhV2lkdGggLSBkYXRhQ2hhcnRXaWR0aDtcclxuICAgIH1cclxuICAgIHJldHVybiB2YWxpZERpc3RhbmNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0luQW5nbGVSYW5nZShhbmdsZSwgc3RhcnRBbmdsZSwgZW5kQW5nbGUpIHtcclxuICAgIGZ1bmN0aW9uIGFkanVzdChhbmdsZSkge1xyXG4gICAgICAgIHdoaWxlIChhbmdsZSA8IDApIHtcclxuICAgICAgICAgICAgYW5nbGUgKz0gMiAqIE1hdGguUEk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdoaWxlIChhbmdsZSA+IDIgKiBNYXRoLlBJKSB7XHJcbiAgICAgICAgICAgIGFuZ2xlIC09IDIgKiBNYXRoLlBJO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFuZ2xlO1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ2xlID0gYWRqdXN0KGFuZ2xlKTtcclxuICAgIHN0YXJ0QW5nbGUgPSBhZGp1c3Qoc3RhcnRBbmdsZSk7XHJcbiAgICBlbmRBbmdsZSA9IGFkanVzdChlbmRBbmdsZSk7XHJcbiAgICBpZiAoc3RhcnRBbmdsZSA+IGVuZEFuZ2xlKSB7XHJcbiAgICAgICAgZW5kQW5nbGUgKz0gMiAqIE1hdGguUEk7XHJcbiAgICAgICAgaWYgKGFuZ2xlIDwgc3RhcnRBbmdsZSkge1xyXG4gICAgICAgICAgICBhbmdsZSArPSAyICogTWF0aC5QSTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGFuZ2xlID49IHN0YXJ0QW5nbGUgJiYgYW5nbGUgPD0gZW5kQW5nbGU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNhbFJvdGF0ZVRyYW5zbGF0ZSh4LCB5LCBoKSB7XHJcbiAgICB2YXIgeHYgPSB4O1xyXG4gICAgdmFyIHl2ID0gaCAtIHk7XHJcblxyXG4gICAgdmFyIHRyYW5zWCA9IHh2ICsgKGggLSB5diAtIHh2KSAvIE1hdGguc3FydCgyKTtcclxuICAgIHRyYW5zWCAqPSAtMTtcclxuXHJcbiAgICB2YXIgdHJhbnNZID0gKGggLSB5dikgKiAoTWF0aC5zcXJ0KDIpIC0gMSkgLSAoaCAtIHl2IC0geHYpIC8gTWF0aC5zcXJ0KDIpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHJhbnNYOiB0cmFuc1gsXHJcbiAgICAgICAgdHJhbnNZOiB0cmFuc1lcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUN1cnZlQ29udHJvbFBvaW50cyhwb2ludHMsIGkpIHtcclxuXHJcbiAgICBmdW5jdGlvbiBpc05vdE1pZGRsZVBvaW50KHBvaW50cywgaSkge1xyXG4gICAgICAgIGlmIChwb2ludHNbaSAtIDFdICYmIHBvaW50c1tpICsgMV0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBvaW50c1tpXS55ID49IE1hdGgubWF4KHBvaW50c1tpIC0gMV0ueSwgcG9pbnRzW2kgKyAxXS55KSB8fCBwb2ludHNbaV0ueSA8PSBNYXRoLm1pbihwb2ludHNbaSAtIDFdLnksIHBvaW50c1tpICsgMV0ueSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgYSA9IDAuMjtcclxuICAgIHZhciBiID0gMC4yO1xyXG4gICAgdmFyIHBBeCA9IG51bGw7XHJcbiAgICB2YXIgcEF5ID0gbnVsbDtcclxuICAgIHZhciBwQnggPSBudWxsO1xyXG4gICAgdmFyIHBCeSA9IG51bGw7XHJcbiAgICBpZiAoaSA8IDEpIHtcclxuICAgICAgICBwQXggPSBwb2ludHNbMF0ueCArIChwb2ludHNbMV0ueCAtIHBvaW50c1swXS54KSAqIGE7XHJcbiAgICAgICAgcEF5ID0gcG9pbnRzWzBdLnkgKyAocG9pbnRzWzFdLnkgLSBwb2ludHNbMF0ueSkgKiBhO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBwQXggPSBwb2ludHNbaV0ueCArIChwb2ludHNbaSArIDFdLnggLSBwb2ludHNbaSAtIDFdLngpICogYTtcclxuICAgICAgICBwQXkgPSBwb2ludHNbaV0ueSArIChwb2ludHNbaSArIDFdLnkgLSBwb2ludHNbaSAtIDFdLnkpICogYTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaSA+IHBvaW50cy5sZW5ndGggLSAzKSB7XHJcbiAgICAgICAgdmFyIGxhc3QgPSBwb2ludHMubGVuZ3RoIC0gMTtcclxuICAgICAgICBwQnggPSBwb2ludHNbbGFzdF0ueCAtIChwb2ludHNbbGFzdF0ueCAtIHBvaW50c1tsYXN0IC0gMV0ueCkgKiBiO1xyXG4gICAgICAgIHBCeSA9IHBvaW50c1tsYXN0XS55IC0gKHBvaW50c1tsYXN0XS55IC0gcG9pbnRzW2xhc3QgLSAxXS55KSAqIGI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHBCeCA9IHBvaW50c1tpICsgMV0ueCAtIChwb2ludHNbaSArIDJdLnggLSBwb2ludHNbaV0ueCkgKiBiO1xyXG4gICAgICAgIHBCeSA9IHBvaW50c1tpICsgMV0ueSAtIChwb2ludHNbaSArIDJdLnkgLSBwb2ludHNbaV0ueSkgKiBiO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGZpeCBpc3N1ZSBodHRwczovL2dpdGh1Yi5jb20veGlhb2xpbjMzMDMvd3gtY2hhcnRzL2lzc3Vlcy83OVxyXG4gICAgaWYgKGlzTm90TWlkZGxlUG9pbnQocG9pbnRzLCBpICsgMSkpIHtcclxuICAgICAgICBwQnkgPSBwb2ludHNbaSArIDFdLnk7XHJcbiAgICB9XHJcbiAgICBpZiAoaXNOb3RNaWRkbGVQb2ludChwb2ludHMsIGkpKSB7XHJcbiAgICAgICAgcEF5ID0gcG9pbnRzW2ldLnk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjdHJBOiB7IHg6IHBBeCwgeTogcEF5IH0sXHJcbiAgICAgICAgY3RyQjogeyB4OiBwQngsIHk6IHBCeSB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjb252ZXJ0Q29vcmRpbmF0ZU9yaWdpbih4LCB5LCBjZW50ZXIpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgeDogY2VudGVyLnggKyB4LFxyXG4gICAgICAgIHk6IGNlbnRlci55IC0geVxyXG4gICAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gYXZvaWRDb2xsaXNpb24ob2JqLCB0YXJnZXQpIHtcclxuICAgIGlmICh0YXJnZXQpIHtcclxuICAgICAgICAvLyBpcyBjb2xsaXNpb24gdGVzdFxyXG4gICAgICAgIHdoaWxlICh1dGlsLmlzQ29sbGlzaW9uKG9iaiwgdGFyZ2V0KSkge1xyXG4gICAgICAgICAgICBpZiAob2JqLnN0YXJ0LnggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBvYmouc3RhcnQueS0tO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9iai5zdGFydC54IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgb2JqLnN0YXJ0LnkrKztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChvYmouc3RhcnQueSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmouc3RhcnQueSsrO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmouc3RhcnQueS0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9iajtcclxufVxyXG5cclxuZnVuY3Rpb24gZmlsbFNlcmllc0NvbG9yKHNlcmllcywgY29uZmlnKSB7XHJcbiAgICB2YXIgaW5kZXggPSAwO1xyXG4gICAgcmV0dXJuIHNlcmllcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICBpZiAoIWl0ZW0uY29sb3IpIHtcclxuICAgICAgICAgICAgaXRlbS5jb2xvciA9IGNvbmZpZy5jb2xvcnNbaW5kZXhdO1xyXG4gICAgICAgICAgICBpbmRleCA9IChpbmRleCArIDEpICUgY29uZmlnLmNvbG9ycy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERhdGFSYW5nZShtaW5EYXRhLCBtYXhEYXRhKSB7XHJcbiAgICB2YXIgbGltaXQgPSAwO1xyXG4gICAgdmFyIHJhbmdlID0gbWF4RGF0YSAtIG1pbkRhdGE7XHJcbiAgICBpZiAocmFuZ2UgPj0gMTAwMDApIHtcclxuICAgICAgICBsaW1pdCA9IDEwMDA7XHJcbiAgICB9IGVsc2UgaWYgKHJhbmdlID49IDEwMDApIHtcclxuICAgICAgICBsaW1pdCA9IDEwMDtcclxuICAgIH0gZWxzZSBpZiAocmFuZ2UgPj0gMTAwKSB7XHJcbiAgICAgICAgbGltaXQgPSAxMDtcclxuICAgIH0gZWxzZSBpZiAocmFuZ2UgPj0gMTApIHtcclxuICAgICAgICBsaW1pdCA9IDU7XHJcbiAgICB9IGVsc2UgaWYgKHJhbmdlID49IDEpIHtcclxuICAgICAgICBsaW1pdCA9IDE7XHJcbiAgICB9IGVsc2UgaWYgKHJhbmdlID49IDAuMSkge1xyXG4gICAgICAgIGxpbWl0ID0gMC4xO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBsaW1pdCA9IDAuMDE7XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG1pblJhbmdlOiBmaW5kUmFuZ2UobWluRGF0YSwgJ2xvd2VyJywgbGltaXQpLFxyXG4gICAgICAgIG1heFJhbmdlOiBmaW5kUmFuZ2UobWF4RGF0YSwgJ3VwcGVyJywgbGltaXQpXHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBtZWFzdXJlVGV4dCh0ZXh0KSB7XHJcbiAgICB2YXIgZm9udFNpemUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDEwO1xyXG5cclxuICAgIC8vIHd4IGNhbnZhcyDmnKrlrp7njrBtZWFzdXJlVGV4dOaWueazlSwg5q2k5aSE6Ieq6KGM5a6e546wXHJcbiAgICB0ZXh0ID0gU3RyaW5nKHRleHQpO1xyXG4gICAgdmFyIHRleHQgPSB0ZXh0LnNwbGl0KCcnKTtcclxuICAgIHZhciB3aWR0aCA9IDA7XHJcbiAgICB0ZXh0LmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICBpZiAoL1thLXpBLVpdLy50ZXN0KGl0ZW0pKSB7XHJcbiAgICAgICAgICAgIHdpZHRoICs9IDc7XHJcbiAgICAgICAgfSBlbHNlIGlmICgvWzAtOV0vLnRlc3QoaXRlbSkpIHtcclxuICAgICAgICAgICAgd2lkdGggKz0gNS41O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoL1xcLi8udGVzdChpdGVtKSkge1xyXG4gICAgICAgICAgICB3aWR0aCArPSAyLjc7XHJcbiAgICAgICAgfSBlbHNlIGlmICgvLS8udGVzdChpdGVtKSkge1xyXG4gICAgICAgICAgICB3aWR0aCArPSAzLjI1O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoL1tcXHU0ZTAwLVxcdTlmYTVdLy50ZXN0KGl0ZW0pKSB7XHJcbiAgICAgICAgICAgIHdpZHRoICs9IDEwO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoL1xcKHxcXCkvLnRlc3QoaXRlbSkpIHtcclxuICAgICAgICAgICAgd2lkdGggKz0gMy43MztcclxuICAgICAgICB9IGVsc2UgaWYgKC9cXHMvLnRlc3QoaXRlbSkpIHtcclxuICAgICAgICAgICAgd2lkdGggKz0gMi41O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoLyUvLnRlc3QoaXRlbSkpIHtcclxuICAgICAgICAgICAgd2lkdGggKz0gODtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB3aWR0aCArPSAxMDtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiB3aWR0aCAqIGZvbnRTaXplIC8gMTA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRhdGFDb21iaW5lKHNlcmllcykge1xyXG4gICAgcmV0dXJuIHNlcmllcy5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICByZXR1cm4gKGEuZGF0YSA/IGEuZGF0YSA6IGEpLmNvbmNhdChiLmRhdGEpO1xyXG4gICAgfSwgW10pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTZXJpZXNEYXRhSXRlbShzZXJpZXMsIGluZGV4KSB7XHJcbiAgICB2YXIgZGF0YSA9IFtdO1xyXG4gICAgc2VyaWVzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICBpZiAoaXRlbS5kYXRhW2luZGV4XSAhPT0gbnVsbCAmJiB0eXBlb2YgaXRlbS5kYXRhW2luZGV4XSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgdmFyIHNlcmllc0l0ZW0gPSB7fTtcclxuICAgICAgICAgICAgc2VyaWVzSXRlbS5jb2xvciA9IGl0ZW0uY29sb3I7XHJcbiAgICAgICAgICAgIHNlcmllc0l0ZW0ubmFtZSA9IGl0ZW0ubmFtZTtcclxuICAgICAgICAgICAgc2VyaWVzSXRlbS5kYXRhID0gaXRlbS5mb3JtYXQgPyBpdGVtLmZvcm1hdChpdGVtLmRhdGFbaW5kZXhdKSA6IGl0ZW0uZGF0YVtpbmRleF07XHJcbiAgICAgICAgICAgIGRhdGEucHVzaChzZXJpZXNJdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRNYXhUZXh0TGlzdExlbmd0aChsaXN0KSB7XHJcbiAgICB2YXIgbGVuZ3RoTGlzdCA9IGxpc3QubWFwKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIG1lYXN1cmVUZXh0KGl0ZW0pO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkobnVsbCwgbGVuZ3RoTGlzdCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFJhZGFyQ29vcmRpbmF0ZVNlcmllcyhsZW5ndGgpIHtcclxuICAgIHZhciBlYWNoQW5nbGUgPSAyICogTWF0aC5QSSAvIGxlbmd0aDtcclxuICAgIHZhciBDb29yZGluYXRlU2VyaWVzID0gW107XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgQ29vcmRpbmF0ZVNlcmllcy5wdXNoKGVhY2hBbmdsZSAqIGkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBDb29yZGluYXRlU2VyaWVzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHJldHVybiAtMSAqIGl0ZW0gKyBNYXRoLlBJIC8gMjtcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRUb29sVGlwRGF0YShzZXJpZXNEYXRhLCBjYWxQb2ludHMsIGluZGV4LCBjYXRlZ29yaWVzKSB7XHJcbiAgICB2YXIgb3B0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDQgJiYgYXJndW1lbnRzWzRdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNF0gOiB7fTtcclxuXHJcbiAgICB2YXIgdGV4dExpc3QgPSBzZXJpZXNEYXRhLm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHRleHQ6IG9wdGlvbi5mb3JtYXQgPyBvcHRpb24uZm9ybWF0KGl0ZW0sIGNhdGVnb3JpZXNbaW5kZXhdKSA6IGl0ZW0ubmFtZSArICc6ICcgKyBpdGVtLmRhdGEsXHJcbiAgICAgICAgICAgIGNvbG9yOiBpdGVtLmNvbG9yXHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG4gICAgdmFyIHZhbGlkQ2FsUG9pbnRzID0gW107XHJcbiAgICB2YXIgb2Zmc2V0ID0ge1xyXG4gICAgICAgIHg6IDAsXHJcbiAgICAgICAgeTogMFxyXG4gICAgfTtcclxuICAgIGNhbFBvaW50cy5mb3JFYWNoKGZ1bmN0aW9uIChwb2ludHMpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHBvaW50c1tpbmRleF0gIT09ICd1bmRlZmluZWQnICYmIHBvaW50c1tpbmRleF0gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdmFsaWRDYWxQb2ludHMucHVzaChwb2ludHNbaW5kZXhdKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHZhbGlkQ2FsUG9pbnRzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICBvZmZzZXQueCA9IE1hdGgucm91bmQoaXRlbS54KTtcclxuICAgICAgICBvZmZzZXQueSArPSBpdGVtLnk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBvZmZzZXQueSAvPSB2YWxpZENhbFBvaW50cy5sZW5ndGg7XHJcbiAgICByZXR1cm4geyB0ZXh0TGlzdDogdGV4dExpc3QsIG9mZnNldDogb2Zmc2V0IH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbmRDdXJyZW50SW5kZXgoY3VycmVudFBvaW50cywgeEF4aXNQb2ludHMsIG9wdHMsIGNvbmZpZykge1xyXG4gICAgdmFyIG9mZnNldCA9IGFyZ3VtZW50cy5sZW5ndGggPiA0ICYmIGFyZ3VtZW50c1s0XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzRdIDogMDtcclxuXHJcbiAgICB2YXIgY3VycmVudEluZGV4ID0gLTE7XHJcbiAgICBpZiAoaXNJbkV4YWN0Q2hhcnRBcmVhKGN1cnJlbnRQb2ludHMsIG9wdHMsIGNvbmZpZykpIHtcclxuICAgICAgICB4QXhpc1BvaW50cy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudFBvaW50cy54ICsgb2Zmc2V0ID4gaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY3VycmVudEluZGV4O1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0luRXhhY3RDaGFydEFyZWEoY3VycmVudFBvaW50cywgb3B0cywgY29uZmlnKSB7XHJcbiAgICByZXR1cm4gY3VycmVudFBvaW50cy54IDwgb3B0cy53aWR0aCAtIGNvbmZpZy5wYWRkaW5nICYmIGN1cnJlbnRQb2ludHMueCA+IGNvbmZpZy5wYWRkaW5nICsgY29uZmlnLnlBeGlzV2lkdGggKyBjb25maWcueUF4aXNUaXRsZVdpZHRoICYmIGN1cnJlbnRQb2ludHMueSA+IGNvbmZpZy5wYWRkaW5nICYmIGN1cnJlbnRQb2ludHMueSA8IG9wdHMuaGVpZ2h0IC0gY29uZmlnLmxlZ2VuZEhlaWdodCAtIGNvbmZpZy54QXhpc0hlaWdodCAtIGNvbmZpZy5wYWRkaW5nO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5kUmFkYXJDaGFydEN1cnJlbnRJbmRleChjdXJyZW50UG9pbnRzLCByYWRhckRhdGEsIGNvdW50KSB7XHJcbiAgICB2YXIgZWFjaEFuZ2xlQXJlYSA9IDIgKiBNYXRoLlBJIC8gY291bnQ7XHJcbiAgICB2YXIgY3VycmVudEluZGV4ID0gLTE7XHJcbiAgICBpZiAoaXNJbkV4YWN0UGllQ2hhcnRBcmVhKGN1cnJlbnRQb2ludHMsIHJhZGFyRGF0YS5jZW50ZXIsIHJhZGFyRGF0YS5yYWRpdXMpKSB7XHJcbiAgICAgICAgdmFyIGZpeEFuZ2xlID0gZnVuY3Rpb24gZml4QW5nbGUoYW5nbGUpIHtcclxuICAgICAgICAgICAgaWYgKGFuZ2xlIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgYW5nbGUgKz0gMiAqIE1hdGguUEk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGFuZ2xlID4gMiAqIE1hdGguUEkpIHtcclxuICAgICAgICAgICAgICAgIGFuZ2xlIC09IDIgKiBNYXRoLlBJO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhbmdsZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgYW5nbGUgPSBNYXRoLmF0YW4yKHJhZGFyRGF0YS5jZW50ZXIueSAtIGN1cnJlbnRQb2ludHMueSwgY3VycmVudFBvaW50cy54IC0gcmFkYXJEYXRhLmNlbnRlci54KTtcclxuICAgICAgICBhbmdsZSA9IC0xICogYW5nbGU7XHJcbiAgICAgICAgaWYgKGFuZ2xlIDwgMCkge1xyXG4gICAgICAgICAgICBhbmdsZSArPSAyICogTWF0aC5QSTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBhbmdsZUxpc3QgPSByYWRhckRhdGEuYW5nbGVMaXN0Lm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBpdGVtID0gZml4QW5nbGUoLTEgKiBpdGVtKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhbmdsZUxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgdmFyIHJhbmdlU3RhcnQgPSBmaXhBbmdsZShpdGVtIC0gZWFjaEFuZ2xlQXJlYSAvIDIpO1xyXG4gICAgICAgICAgICB2YXIgcmFuZ2VFbmQgPSBmaXhBbmdsZShpdGVtICsgZWFjaEFuZ2xlQXJlYSAvIDIpO1xyXG4gICAgICAgICAgICBpZiAocmFuZ2VFbmQgPCByYW5nZVN0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICByYW5nZUVuZCArPSAyICogTWF0aC5QSTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoYW5nbGUgPj0gcmFuZ2VTdGFydCAmJiBhbmdsZSA8PSByYW5nZUVuZCB8fCBhbmdsZSArIDIgKiBNYXRoLlBJID49IHJhbmdlU3RhcnQgJiYgYW5nbGUgKyAyICogTWF0aC5QSSA8PSByYW5nZUVuZCkge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY3VycmVudEluZGV4O1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5kUGllQ2hhcnRDdXJyZW50SW5kZXgoY3VycmVudFBvaW50cywgcGllRGF0YSkge1xyXG4gICAgdmFyIGN1cnJlbnRJbmRleCA9IC0xO1xyXG4gICAgaWYgKGlzSW5FeGFjdFBpZUNoYXJ0QXJlYShjdXJyZW50UG9pbnRzLCBwaWVEYXRhLmNlbnRlciwgcGllRGF0YS5yYWRpdXMpKSB7XHJcbiAgICAgICAgdmFyIGFuZ2xlID0gTWF0aC5hdGFuMihwaWVEYXRhLmNlbnRlci55IC0gY3VycmVudFBvaW50cy55LCBjdXJyZW50UG9pbnRzLnggLSBwaWVEYXRhLmNlbnRlci54KTtcclxuICAgICAgICBhbmdsZSA9IC1hbmdsZTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gcGllRGF0YS5zZXJpZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBwaWVEYXRhLnNlcmllc1tpXTtcclxuICAgICAgICAgICAgaWYgKGlzSW5BbmdsZVJhbmdlKGFuZ2xlLCBpdGVtLl9zdGFydF8sIGl0ZW0uX3N0YXJ0XyArIGl0ZW0uX3Byb3BvcnRpb25fICogMiAqIE1hdGguUEkpKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50SW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGN1cnJlbnRJbmRleDtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNJbkV4YWN0UGllQ2hhcnRBcmVhKGN1cnJlbnRQb2ludHMsIGNlbnRlciwgcmFkaXVzKSB7XHJcbiAgICByZXR1cm4gTWF0aC5wb3coY3VycmVudFBvaW50cy54IC0gY2VudGVyLngsIDIpICsgTWF0aC5wb3coY3VycmVudFBvaW50cy55IC0gY2VudGVyLnksIDIpIDw9IE1hdGgucG93KHJhZGl1cywgMik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNwbGl0UG9pbnRzKHBvaW50cykge1xyXG4gICAgdmFyIG5ld1BvaW50cyA9IFtdO1xyXG4gICAgdmFyIGl0ZW1zID0gW107XHJcbiAgICBwb2ludHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICBpZiAoaXRlbSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIG5ld1BvaW50cy5wdXNoKGl0ZW1zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpdGVtcyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgaWYgKGl0ZW1zLmxlbmd0aCkge1xyXG4gICAgICAgIG5ld1BvaW50cy5wdXNoKGl0ZW1zKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3UG9pbnRzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjYWxMZWdlbmREYXRhKHNlcmllcywgb3B0cywgY29uZmlnKSB7XHJcbiAgICBpZiAob3B0cy5sZWdlbmQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbGVnZW5kTGlzdDogW10sXHJcbiAgICAgICAgICAgIGxlZ2VuZEhlaWdodDogMFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICB2YXIgcGFkZGluZyA9IDU7XHJcbiAgICB2YXIgbWFyZ2luVG9wID0gODtcclxuICAgIHZhciBzaGFwZVdpZHRoID0gMTU7XHJcbiAgICB2YXIgbGVnZW5kTGlzdCA9IFtdO1xyXG4gICAgdmFyIHdpZHRoQ291bnQgPSAwO1xyXG4gICAgdmFyIGN1cnJlbnRSb3cgPSBbXTtcclxuICAgIHNlcmllcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgdmFyIGl0ZW1XaWR0aCA9IDMgKiBwYWRkaW5nICsgc2hhcGVXaWR0aCArIG1lYXN1cmVUZXh0KGl0ZW0ubmFtZSB8fCAndW5kZWZpbmVkJyk7XHJcbiAgICAgICAgaWYgKHdpZHRoQ291bnQgKyBpdGVtV2lkdGggPiBvcHRzLndpZHRoKSB7XHJcbiAgICAgICAgICAgIGxlZ2VuZExpc3QucHVzaChjdXJyZW50Um93KTtcclxuICAgICAgICAgICAgd2lkdGhDb3VudCA9IGl0ZW1XaWR0aDtcclxuICAgICAgICAgICAgY3VycmVudFJvdyA9IFtpdGVtXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB3aWR0aENvdW50ICs9IGl0ZW1XaWR0aDtcclxuICAgICAgICAgICAgY3VycmVudFJvdy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgaWYgKGN1cnJlbnRSb3cubGVuZ3RoKSB7XHJcbiAgICAgICAgbGVnZW5kTGlzdC5wdXNoKGN1cnJlbnRSb3cpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbGVnZW5kTGlzdDogbGVnZW5kTGlzdCxcclxuICAgICAgICBsZWdlbmRIZWlnaHQ6IGxlZ2VuZExpc3QubGVuZ3RoICogKGNvbmZpZy5mb250U2l6ZSArIG1hcmdpblRvcCkgKyBwYWRkaW5nXHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjYWxDYXRlZ29yaWVzRGF0YShjYXRlZ29yaWVzLCBvcHRzLCBjb25maWcpIHtcclxuICAgIHZhciByZXN1bHQgPSB7XHJcbiAgICAgICAgYW5nbGU6IDAsXHJcbiAgICAgICAgeEF4aXNIZWlnaHQ6IGNvbmZpZy54QXhpc0hlaWdodFxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgX2dldFhBeGlzUG9pbnRzID0gZ2V0WEF4aXNQb2ludHMoY2F0ZWdvcmllcywgb3B0cywgY29uZmlnKSxcclxuICAgICAgICBlYWNoU3BhY2luZyA9IF9nZXRYQXhpc1BvaW50cy5lYWNoU3BhY2luZztcclxuXHJcbiAgICAvLyBnZXQgbWF4IGxlbmd0aCBvZiBjYXRlZ29yaWVzIHRleHRcclxuXHJcblxyXG4gICAgdmFyIGNhdGVnb3JpZXNUZXh0TGVudGggPSBjYXRlZ29yaWVzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHJldHVybiBtZWFzdXJlVGV4dChpdGVtKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHZhciBtYXhUZXh0TGVuZ3RoID0gTWF0aC5tYXguYXBwbHkodGhpcywgY2F0ZWdvcmllc1RleHRMZW50aCk7XHJcblxyXG4gICAgaWYgKG1heFRleHRMZW5ndGggKyAyICogY29uZmlnLnhBeGlzVGV4dFBhZGRpbmcgPiBlYWNoU3BhY2luZykge1xyXG4gICAgICAgIHJlc3VsdC5hbmdsZSA9IDQ1ICogTWF0aC5QSSAvIDE4MDtcclxuICAgICAgICByZXN1bHQueEF4aXNIZWlnaHQgPSAyICogY29uZmlnLnhBeGlzVGV4dFBhZGRpbmcgKyBtYXhUZXh0TGVuZ3RoICogTWF0aC5zaW4ocmVzdWx0LmFuZ2xlKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRSYWRhckRhdGFQb2ludHMoYW5nbGVMaXN0LCBjZW50ZXIsIHJhZGl1cywgc2VyaWVzLCBvcHRzKSB7XHJcbiAgICB2YXIgcHJvY2VzcyA9IGFyZ3VtZW50cy5sZW5ndGggPiA1ICYmIGFyZ3VtZW50c1s1XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzVdIDogMTtcclxuXHJcbiAgICB2YXIgcmFkYXJPcHRpb24gPSBvcHRzLmV4dHJhLnJhZGFyIHx8IHt9O1xyXG4gICAgcmFkYXJPcHRpb24ubWF4ID0gcmFkYXJPcHRpb24ubWF4IHx8IDA7XHJcbiAgICB2YXIgbWF4RGF0YSA9IE1hdGgubWF4KHJhZGFyT3B0aW9uLm1heCwgTWF0aC5tYXguYXBwbHkobnVsbCwgZGF0YUNvbWJpbmUoc2VyaWVzKSkpO1xyXG5cclxuICAgIHZhciBkYXRhID0gW107XHJcbiAgICBzZXJpZXMuZm9yRWFjaChmdW5jdGlvbiAoZWFjaCkge1xyXG4gICAgICAgIHZhciBsaXN0SXRlbSA9IHt9O1xyXG4gICAgICAgIGxpc3RJdGVtLmNvbG9yID0gZWFjaC5jb2xvcjtcclxuICAgICAgICBsaXN0SXRlbS5kYXRhID0gW107XHJcbiAgICAgICAgZWFjaC5kYXRhLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgICAgIHZhciB0bXAgPSB7fTtcclxuICAgICAgICAgICAgdG1wLmFuZ2xlID0gYW5nbGVMaXN0W2luZGV4XTtcclxuXHJcbiAgICAgICAgICAgIHRtcC5wcm9wb3J0aW9uID0gaXRlbSAvIG1heERhdGE7XHJcbiAgICAgICAgICAgIHRtcC5wb3NpdGlvbiA9IGNvbnZlcnRDb29yZGluYXRlT3JpZ2luKHJhZGl1cyAqIHRtcC5wcm9wb3J0aW9uICogcHJvY2VzcyAqIE1hdGguY29zKHRtcC5hbmdsZSksIHJhZGl1cyAqIHRtcC5wcm9wb3J0aW9uICogcHJvY2VzcyAqIE1hdGguc2luKHRtcC5hbmdsZSksIGNlbnRlcik7XHJcbiAgICAgICAgICAgIGxpc3RJdGVtLmRhdGEucHVzaCh0bXApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkYXRhLnB1c2gobGlzdEl0ZW0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFBpZURhdGFQb2ludHMoc2VyaWVzKSB7XHJcbiAgICB2YXIgcHJvY2VzcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMTtcclxuXHJcbiAgICB2YXIgY291bnQgPSAwO1xyXG4gICAgdmFyIF9zdGFydF8gPSAwO1xyXG4gICAgc2VyaWVzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICBpdGVtLmRhdGEgPSBpdGVtLmRhdGEgPT09IG51bGwgPyAwIDogaXRlbS5kYXRhO1xyXG4gICAgICAgIGNvdW50ICs9IGl0ZW0uZGF0YTtcclxuICAgIH0pO1xyXG4gICAgc2VyaWVzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICBpdGVtLmRhdGEgPSBpdGVtLmRhdGEgPT09IG51bGwgPyAwIDogaXRlbS5kYXRhO1xyXG4gICAgICAgIGl0ZW0uX3Byb3BvcnRpb25fID0gaXRlbS5kYXRhIC8gY291bnQgKiBwcm9jZXNzO1xyXG4gICAgfSk7XHJcbiAgICBzZXJpZXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIGl0ZW0uX3N0YXJ0XyA9IF9zdGFydF87XHJcbiAgICAgICAgX3N0YXJ0XyArPSAyICogaXRlbS5fcHJvcG9ydGlvbl8gKiBNYXRoLlBJO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHNlcmllcztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UGllVGV4dE1heExlbmd0aChzZXJpZXMpIHtcclxuICAgIHNlcmllcyA9IGdldFBpZURhdGFQb2ludHMoc2VyaWVzKTtcclxuICAgIHZhciBtYXhMZW5ndGggPSAwO1xyXG4gICAgc2VyaWVzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICB2YXIgdGV4dCA9IGl0ZW0uZm9ybWF0ID8gaXRlbS5mb3JtYXQoK2l0ZW0uX3Byb3BvcnRpb25fLnRvRml4ZWQoMikpIDogdXRpbC50b0ZpeGVkKGl0ZW0uX3Byb3BvcnRpb25fICogMTAwKSArICclJztcclxuICAgICAgICBtYXhMZW5ndGggPSBNYXRoLm1heChtYXhMZW5ndGgsIG1lYXN1cmVUZXh0KHRleHQpKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBtYXhMZW5ndGg7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpeENvbHVtZURhdGEocG9pbnRzLCBlYWNoU3BhY2luZywgY29sdW1uTGVuLCBpbmRleCwgY29uZmlnLCBvcHRzKSB7XHJcbiAgICByZXR1cm4gcG9pbnRzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIGlmIChpdGVtID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpdGVtLndpZHRoID0gKGVhY2hTcGFjaW5nIC0gMiAqIGNvbmZpZy5jb2x1bWVQYWRkaW5nKSAvIGNvbHVtbkxlbjtcclxuXHJcbiAgICAgICAgaWYgKG9wdHMuZXh0cmEuY29sdW1uICYmIG9wdHMuZXh0cmEuY29sdW1uLndpZHRoICYmICtvcHRzLmV4dHJhLmNvbHVtbi53aWR0aCA+IDApIHtcclxuICAgICAgICAgICAgLy8gY3VzdG9tZXIgY29sdW1uIHdpZHRoXHJcbiAgICAgICAgICAgIGl0ZW0ud2lkdGggPSBNYXRoLm1pbihpdGVtLndpZHRoLCArb3B0cy5leHRyYS5jb2x1bW4ud2lkdGgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGRlZmF1bHQgd2lkdGggc2hvdWxkIGxlc3MgdHJhbiAyNXB4XHJcbiAgICAgICAgICAgIC8vIGRvbid0IGFzayBtZSB3aHksIEkgZG9uJ3Qga25vd1xyXG4gICAgICAgICAgICBpdGVtLndpZHRoID0gTWF0aC5taW4oaXRlbS53aWR0aCwgMjUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpdGVtLnggKz0gKGluZGV4ICsgMC41IC0gY29sdW1uTGVuIC8gMikgKiBpdGVtLndpZHRoO1xyXG5cclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRYQXhpc1BvaW50cyhjYXRlZ29yaWVzLCBvcHRzLCBjb25maWcpIHtcclxuICAgIHZhciB5QXhpc1RvdGFsV2lkdGggPSBjb25maWcueUF4aXNXaWR0aCArIGNvbmZpZy55QXhpc1RpdGxlV2lkdGg7XHJcbiAgICB2YXIgc3BhY2luZ1ZhbGlkID0gb3B0cy53aWR0aCAtIDIgKiBjb25maWcucGFkZGluZyAtIHlBeGlzVG90YWxXaWR0aDtcclxuICAgIHZhciBkYXRhQ291bnQgPSBvcHRzLmVuYWJsZVNjcm9sbCA/IE1hdGgubWluKDUsIGNhdGVnb3JpZXMubGVuZ3RoKSA6IGNhdGVnb3JpZXMubGVuZ3RoO1xyXG4gICAgdmFyIGVhY2hTcGFjaW5nID0gc3BhY2luZ1ZhbGlkIC8gZGF0YUNvdW50O1xyXG5cclxuICAgIHZhciB4QXhpc1BvaW50cyA9IFtdO1xyXG4gICAgdmFyIHN0YXJ0WCA9IGNvbmZpZy5wYWRkaW5nICsgeUF4aXNUb3RhbFdpZHRoO1xyXG4gICAgdmFyIGVuZFggPSBvcHRzLndpZHRoIC0gY29uZmlnLnBhZGRpbmc7XHJcbiAgICBjYXRlZ29yaWVzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgeEF4aXNQb2ludHMucHVzaChzdGFydFggKyBpbmRleCAqIGVhY2hTcGFjaW5nKTtcclxuICAgIH0pO1xyXG4gICAgaWYgKG9wdHMuZW5hYmxlU2Nyb2xsID09PSB0cnVlKSB7XHJcbiAgICAgICAgeEF4aXNQb2ludHMucHVzaChzdGFydFggKyBjYXRlZ29yaWVzLmxlbmd0aCAqIGVhY2hTcGFjaW5nKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgeEF4aXNQb2ludHMucHVzaChlbmRYKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geyB4QXhpc1BvaW50czogeEF4aXNQb2ludHMsIHN0YXJ0WDogc3RhcnRYLCBlbmRYOiBlbmRYLCBlYWNoU3BhY2luZzogZWFjaFNwYWNpbmcgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RGF0YVBvaW50cyhkYXRhLCBtaW5SYW5nZSwgbWF4UmFuZ2UsIHhBeGlzUG9pbnRzLCBlYWNoU3BhY2luZywgb3B0cywgY29uZmlnKSB7XHJcbiAgICB2YXIgcHJvY2VzcyA9IGFyZ3VtZW50cy5sZW5ndGggPiA3ICYmIGFyZ3VtZW50c1s3XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzddIDogMTtcclxuXHJcbiAgICB2YXIgcG9pbnRzID0gW107XHJcbiAgICB2YXIgdmFsaWRIZWlnaHQgPSBvcHRzLmhlaWdodCAtIDIgKiBjb25maWcucGFkZGluZyAtIGNvbmZpZy54QXhpc0hlaWdodCAtIGNvbmZpZy5sZWdlbmRIZWlnaHQ7XHJcbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgaWYgKGl0ZW0gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2gobnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHBvaW50ID0ge307XHJcbiAgICAgICAgICAgIHBvaW50LnggPSB4QXhpc1BvaW50c1tpbmRleF0gKyBNYXRoLnJvdW5kKGVhY2hTcGFjaW5nIC8gMik7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSB2YWxpZEhlaWdodCAqIChpdGVtIC0gbWluUmFuZ2UpIC8gKG1heFJhbmdlIC0gbWluUmFuZ2UpO1xyXG4gICAgICAgICAgICBoZWlnaHQgKj0gcHJvY2VzcztcclxuICAgICAgICAgICAgcG9pbnQueSA9IG9wdHMuaGVpZ2h0IC0gY29uZmlnLnhBeGlzSGVpZ2h0IC0gY29uZmlnLmxlZ2VuZEhlaWdodCAtIE1hdGgucm91bmQoaGVpZ2h0KSAtIGNvbmZpZy5wYWRkaW5nO1xyXG4gICAgICAgICAgICBwb2ludHMucHVzaChwb2ludCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHBvaW50cztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0WUF4aXNUZXh0TGlzdChzZXJpZXMsIG9wdHMsIGNvbmZpZykge1xyXG4gICAgdmFyIGRhdGEgPSBkYXRhQ29tYmluZShzZXJpZXMpO1xyXG4gICAgLy8gcmVtb3ZlIG51bGwgZnJvbSBkYXRhXHJcbiAgICBkYXRhID0gZGF0YS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICByZXR1cm4gaXRlbSAhPT0gbnVsbDtcclxuICAgIH0pO1xyXG4gICAgdmFyIG1pbkRhdGEgPSBNYXRoLm1pbi5hcHBseSh0aGlzLCBkYXRhKTtcclxuICAgIHZhciBtYXhEYXRhID0gTWF0aC5tYXguYXBwbHkodGhpcywgZGF0YSk7XHJcbiAgICBpZiAodHlwZW9mIG9wdHMueUF4aXMubWluID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgIG1pbkRhdGEgPSBNYXRoLm1pbihvcHRzLnlBeGlzLm1pbiwgbWluRGF0YSk7XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIG9wdHMueUF4aXMubWF4ID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgIG1heERhdGEgPSBNYXRoLm1heChvcHRzLnlBeGlzLm1heCwgbWF4RGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZml4IGlzc3VlIGh0dHBzOi8vZ2l0aHViLmNvbS94aWFvbGluMzMwMy93eC1jaGFydHMvaXNzdWVzLzlcclxuICAgIGlmIChtaW5EYXRhID09PSBtYXhEYXRhKSB7XHJcbiAgICAgICAgdmFyIHJhbmdlU3BhbiA9IG1heERhdGEgfHwgMTtcclxuICAgICAgICBtaW5EYXRhIC09IHJhbmdlU3BhbjtcclxuICAgICAgICBtYXhEYXRhICs9IHJhbmdlU3BhbjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZGF0YVJhbmdlID0gZ2V0RGF0YVJhbmdlKG1pbkRhdGEsIG1heERhdGEpO1xyXG4gICAgdmFyIG1pblJhbmdlID0gZGF0YVJhbmdlLm1pblJhbmdlO1xyXG4gICAgdmFyIG1heFJhbmdlID0gZGF0YVJhbmdlLm1heFJhbmdlO1xyXG5cclxuICAgIHZhciByYW5nZSA9IFtdO1xyXG4gICAgdmFyIGVhY2hSYW5nZSA9IChtYXhSYW5nZSAtIG1pblJhbmdlKSAvIGNvbmZpZy55QXhpc1NwbGl0O1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IGNvbmZpZy55QXhpc1NwbGl0OyBpKyspIHtcclxuICAgICAgICByYW5nZS5wdXNoKG1pblJhbmdlICsgZWFjaFJhbmdlICogaSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmFuZ2UucmV2ZXJzZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjYWxZQXhpc0RhdGEoc2VyaWVzLCBvcHRzLCBjb25maWcpIHtcclxuXHJcbiAgICB2YXIgcmFuZ2VzID0gZ2V0WUF4aXNUZXh0TGlzdChzZXJpZXMsIG9wdHMsIGNvbmZpZyk7XHJcbiAgICB2YXIgeUF4aXNXaWR0aCA9IGNvbmZpZy55QXhpc1dpZHRoO1xyXG4gICAgdmFyIHJhbmdlc0Zvcm1hdCA9IHJhbmdlcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICBpdGVtID0gdXRpbC50b0ZpeGVkKGl0ZW0sIDIpO1xyXG4gICAgICAgIGl0ZW0gPSBvcHRzLnlBeGlzLmZvcm1hdCA/IG9wdHMueUF4aXMuZm9ybWF0KE51bWJlcihpdGVtKSkgOiBpdGVtO1xyXG4gICAgICAgIHlBeGlzV2lkdGggPSBNYXRoLm1heCh5QXhpc1dpZHRoLCBtZWFzdXJlVGV4dChpdGVtKSArIDUpO1xyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfSk7XHJcbiAgICBpZiAob3B0cy55QXhpcy5kaXNhYmxlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHlBeGlzV2lkdGggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7IHJhbmdlc0Zvcm1hdDogcmFuZ2VzRm9ybWF0LCByYW5nZXM6IHJhbmdlcywgeUF4aXNXaWR0aDogeUF4aXNXaWR0aCB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3UG9pbnRTaGFwZShwb2ludHMsIGNvbG9yLCBzaGFwZSwgY29udGV4dCkge1xyXG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgIGNvbnRleHQuc2V0U3Ryb2tlU3R5bGUoXCIjZmZmZmZmXCIpO1xyXG4gICAgY29udGV4dC5zZXRMaW5lV2lkdGgoMSk7XHJcbiAgICBjb250ZXh0LnNldEZpbGxTdHlsZShjb2xvcik7XHJcblxyXG4gICAgaWYgKHNoYXBlID09PSAnZGlhbW9uZCcpIHtcclxuICAgICAgICBwb2ludHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQubW92ZVRvKGl0ZW0ueCwgaXRlbS55IC0gNC41KTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVRvKGl0ZW0ueCAtIDQuNSwgaXRlbS55KTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVRvKGl0ZW0ueCwgaXRlbS55ICsgNC41KTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVRvKGl0ZW0ueCArIDQuNSwgaXRlbS55KTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVRvKGl0ZW0ueCwgaXRlbS55IC0gNC41KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChzaGFwZSA9PT0gJ2NpcmNsZScpIHtcclxuICAgICAgICBwb2ludHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQubW92ZVRvKGl0ZW0ueCArIDMuNSwgaXRlbS55KTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuYXJjKGl0ZW0ueCwgaXRlbS55LCA0LCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHNoYXBlID09PSAncmVjdCcpIHtcclxuICAgICAgICBwb2ludHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQubW92ZVRvKGl0ZW0ueCAtIDMuNSwgaXRlbS55IC0gMy41KTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQucmVjdChpdGVtLnggLSAzLjUsIGl0ZW0ueSAtIDMuNSwgNywgNyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoc2hhcGUgPT09ICd0cmlhbmdsZScpIHtcclxuICAgICAgICBwb2ludHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQubW92ZVRvKGl0ZW0ueCwgaXRlbS55IC0gNC41KTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVRvKGl0ZW0ueCAtIDQuNSwgaXRlbS55ICsgNC41KTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVRvKGl0ZW0ueCArIDQuNSwgaXRlbS55ICsgNC41KTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVRvKGl0ZW0ueCwgaXRlbS55IC0gNC41KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgY29udGV4dC5zdHJva2UoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd1JpbmdUaXRsZShvcHRzLCBjb25maWcsIGNvbnRleHQpIHtcclxuICAgIHZhciB0aXRsZWZvbnRTaXplID0gb3B0cy50aXRsZS5mb250U2l6ZSB8fCBjb25maWcudGl0bGVGb250U2l6ZTtcclxuICAgIHZhciBzdWJ0aXRsZWZvbnRTaXplID0gb3B0cy5zdWJ0aXRsZS5mb250U2l6ZSB8fCBjb25maWcuc3VidGl0bGVGb250U2l6ZTtcclxuICAgIHZhciB0aXRsZSA9IG9wdHMudGl0bGUubmFtZSB8fCAnJztcclxuICAgIHZhciBzdWJ0aXRsZSA9IG9wdHMuc3VidGl0bGUubmFtZSB8fCAnJztcclxuICAgIHZhciB0aXRsZUZvbnRDb2xvciA9IG9wdHMudGl0bGUuY29sb3IgfHwgY29uZmlnLnRpdGxlQ29sb3I7XHJcbiAgICB2YXIgc3VidGl0bGVGb250Q29sb3IgPSBvcHRzLnN1YnRpdGxlLmNvbG9yIHx8IGNvbmZpZy5zdWJ0aXRsZUNvbG9yO1xyXG4gICAgdmFyIHRpdGxlSGVpZ2h0ID0gdGl0bGUgPyB0aXRsZWZvbnRTaXplIDogMDtcclxuICAgIHZhciBzdWJ0aXRsZUhlaWdodCA9IHN1YnRpdGxlID8gc3VidGl0bGVmb250U2l6ZSA6IDA7XHJcbiAgICB2YXIgbWFyZ2luID0gNTtcclxuICAgIGlmIChzdWJ0aXRsZSkge1xyXG4gICAgICAgIHZhciB0ZXh0V2lkdGggPSBtZWFzdXJlVGV4dChzdWJ0aXRsZSwgc3VidGl0bGVmb250U2l6ZSk7XHJcbiAgICAgICAgdmFyIHN0YXJ0WCA9IChvcHRzLndpZHRoIC0gdGV4dFdpZHRoKSAvIDIgKyAob3B0cy5zdWJ0aXRsZS5vZmZzZXRYIHx8IDApO1xyXG4gICAgICAgIHZhciBzdGFydFkgPSAob3B0cy5oZWlnaHQgLSBjb25maWcubGVnZW5kSGVpZ2h0ICsgc3VidGl0bGVmb250U2l6ZSkgLyAyO1xyXG4gICAgICAgIGlmICh0aXRsZSkge1xyXG4gICAgICAgICAgICBzdGFydFkgLT0gKHRpdGxlSGVpZ2h0ICsgbWFyZ2luKSAvIDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC5zZXRGb250U2l6ZShzdWJ0aXRsZWZvbnRTaXplKTtcclxuICAgICAgICBjb250ZXh0LnNldEZpbGxTdHlsZShzdWJ0aXRsZUZvbnRDb2xvcik7XHJcbiAgICAgICAgY29udGV4dC5maWxsVGV4dChzdWJ0aXRsZSwgc3RhcnRYLCBzdGFydFkpO1xyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgIH1cclxuICAgIGlmICh0aXRsZSkge1xyXG4gICAgICAgIHZhciBfdGV4dFdpZHRoID0gbWVhc3VyZVRleHQodGl0bGUsIHRpdGxlZm9udFNpemUpO1xyXG4gICAgICAgIHZhciBfc3RhcnRYID0gKG9wdHMud2lkdGggLSBfdGV4dFdpZHRoKSAvIDIgKyAob3B0cy50aXRsZS5vZmZzZXRYIHx8IDApO1xyXG4gICAgICAgIHZhciBfc3RhcnRZID0gKG9wdHMuaGVpZ2h0IC0gY29uZmlnLmxlZ2VuZEhlaWdodCArIHRpdGxlZm9udFNpemUpIC8gMjtcclxuICAgICAgICBpZiAoc3VidGl0bGUpIHtcclxuICAgICAgICAgICAgX3N0YXJ0WSArPSAoc3VidGl0bGVIZWlnaHQgKyBtYXJnaW4pIC8gMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjb250ZXh0LnNldEZvbnRTaXplKHRpdGxlZm9udFNpemUpO1xyXG4gICAgICAgIGNvbnRleHQuc2V0RmlsbFN0eWxlKHRpdGxlRm9udENvbG9yKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxUZXh0KHRpdGxlLCBfc3RhcnRYLCBfc3RhcnRZKTtcclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdQb2ludFRleHQocG9pbnRzLCBzZXJpZXMsIGNvbmZpZywgY29udGV4dCkge1xyXG4gICAgLy8g57uY5Yi25pWw5o2u5paH5qGIXHJcbiAgICB2YXIgZGF0YSA9IHNlcmllcy5kYXRhO1xyXG5cclxuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICBjb250ZXh0LnNldEZvbnRTaXplKGNvbmZpZy5mb250U2l6ZSk7XHJcbiAgICBjb250ZXh0LnNldEZpbGxTdHlsZSgnIzY2NjY2NicpO1xyXG4gICAgcG9pbnRzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgaWYgKGl0ZW0gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyIGZvcm1hdFZhbCA9IHNlcmllcy5mb3JtYXQgPyBzZXJpZXMuZm9ybWF0KGRhdGFbaW5kZXhdKSA6IGRhdGFbaW5kZXhdO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxUZXh0KGZvcm1hdFZhbCwgaXRlbS54IC0gbWVhc3VyZVRleHQoZm9ybWF0VmFsKSAvIDIsIGl0ZW0ueSAtIDIpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdSYWRhckxhYmVsKGFuZ2xlTGlzdCwgcmFkaXVzLCBjZW50ZXJQb3NpdGlvbiwgb3B0cywgY29uZmlnLCBjb250ZXh0KSB7XHJcbiAgICB2YXIgcmFkYXJPcHRpb24gPSBvcHRzLmV4dHJhLnJhZGFyIHx8IHt9O1xyXG4gICAgcmFkaXVzICs9IGNvbmZpZy5yYWRhckxhYmVsVGV4dE1hcmdpbjtcclxuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICBjb250ZXh0LnNldEZvbnRTaXplKGNvbmZpZy5mb250U2l6ZSk7XHJcbiAgICBjb250ZXh0LnNldEZpbGxTdHlsZShyYWRhck9wdGlvbi5sYWJlbENvbG9yIHx8ICcjNjY2NjY2Jyk7XHJcbiAgICBhbmdsZUxpc3QuZm9yRWFjaChmdW5jdGlvbiAoYW5nbGUsIGluZGV4KSB7XHJcbiAgICAgICAgdmFyIHBvcyA9IHtcclxuICAgICAgICAgICAgeDogcmFkaXVzICogTWF0aC5jb3MoYW5nbGUpLFxyXG4gICAgICAgICAgICB5OiByYWRpdXMgKiBNYXRoLnNpbihhbmdsZSlcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciBwb3NSZWxhdGl2ZUNhbnZhcyA9IGNvbnZlcnRDb29yZGluYXRlT3JpZ2luKHBvcy54LCBwb3MueSwgY2VudGVyUG9zaXRpb24pO1xyXG4gICAgICAgIHZhciBzdGFydFggPSBwb3NSZWxhdGl2ZUNhbnZhcy54O1xyXG4gICAgICAgIHZhciBzdGFydFkgPSBwb3NSZWxhdGl2ZUNhbnZhcy55O1xyXG4gICAgICAgIGlmICh1dGlsLmFwcHJveGltYXRlbHlFcXVhbChwb3MueCwgMCkpIHtcclxuICAgICAgICAgICAgc3RhcnRYIC09IG1lYXN1cmVUZXh0KG9wdHMuY2F0ZWdvcmllc1tpbmRleF0gfHwgJycpIC8gMjtcclxuICAgICAgICB9IGVsc2UgaWYgKHBvcy54IDwgMCkge1xyXG4gICAgICAgICAgICBzdGFydFggLT0gbWVhc3VyZVRleHQob3B0cy5jYXRlZ29yaWVzW2luZGV4XSB8fCAnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRleHQuZmlsbFRleHQob3B0cy5jYXRlZ29yaWVzW2luZGV4XSB8fCAnJywgc3RhcnRYLCBzdGFydFkgKyBjb25maWcuZm9udFNpemUgLyAyKTtcclxuICAgIH0pO1xyXG4gICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdQaWVUZXh0KHNlcmllcywgb3B0cywgY29uZmlnLCBjb250ZXh0LCByYWRpdXMsIGNlbnRlcikge1xyXG4gICAgdmFyIGxpbmVSYWRpdXMgPSByYWRpdXMgKyBjb25maWcucGllQ2hhcnRMaW5lUGFkZGluZztcclxuICAgIHZhciB0ZXh0T2JqZWN0Q29sbGVjdGlvbiA9IFtdO1xyXG4gICAgdmFyIGxhc3RUZXh0T2JqZWN0ID0gbnVsbDtcclxuXHJcbiAgICB2YXIgc2VyaWVzQ29udmVydCA9IHNlcmllcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICB2YXIgYXJjID0gMiAqIE1hdGguUEkgLSAoaXRlbS5fc3RhcnRfICsgMiAqIE1hdGguUEkgKiBpdGVtLl9wcm9wb3J0aW9uXyAvIDIpO1xyXG4gICAgICAgIHZhciB0ZXh0ID0gaXRlbS5mb3JtYXQgPyBpdGVtLmZvcm1hdCgraXRlbS5fcHJvcG9ydGlvbl8udG9GaXhlZCgyKSkgOiB1dGlsLnRvRml4ZWQoaXRlbS5fcHJvcG9ydGlvbl8gKiAxMDApICsgJyUnO1xyXG4gICAgICAgIHZhciBjb2xvciA9IGl0ZW0uY29sb3I7XHJcbiAgICAgICAgcmV0dXJuIHsgYXJjOiBhcmMsIHRleHQ6IHRleHQsIGNvbG9yOiBjb2xvciB9O1xyXG4gICAgfSk7XHJcbiAgICBzZXJpZXNDb252ZXJ0LmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAvLyBsaW5lIGVuZFxyXG4gICAgICAgIHZhciBvcmdpblgxID0gTWF0aC5jb3MoaXRlbS5hcmMpICogbGluZVJhZGl1cztcclxuICAgICAgICB2YXIgb3JnaW5ZMSA9IE1hdGguc2luKGl0ZW0uYXJjKSAqIGxpbmVSYWRpdXM7XHJcblxyXG4gICAgICAgIC8vIGxpbmUgc3RhcnRcclxuICAgICAgICB2YXIgb3JnaW5YMiA9IE1hdGguY29zKGl0ZW0uYXJjKSAqIHJhZGl1cztcclxuICAgICAgICB2YXIgb3JnaW5ZMiA9IE1hdGguc2luKGl0ZW0uYXJjKSAqIHJhZGl1cztcclxuXHJcbiAgICAgICAgLy8gdGV4dCBzdGFydFxyXG4gICAgICAgIHZhciBvcmdpblgzID0gb3JnaW5YMSA+PSAwID8gb3JnaW5YMSArIGNvbmZpZy5waWVDaGFydFRleHRQYWRkaW5nIDogb3JnaW5YMSAtIGNvbmZpZy5waWVDaGFydFRleHRQYWRkaW5nO1xyXG4gICAgICAgIHZhciBvcmdpblkzID0gb3JnaW5ZMTtcclxuXHJcbiAgICAgICAgdmFyIHRleHRXaWR0aCA9IG1lYXN1cmVUZXh0KGl0ZW0udGV4dCk7XHJcbiAgICAgICAgdmFyIHN0YXJ0WSA9IG9yZ2luWTM7XHJcblxyXG4gICAgICAgIGlmIChsYXN0VGV4dE9iamVjdCAmJiB1dGlsLmlzU2FtZVhDb29yZGluYXRlQXJlYShsYXN0VGV4dE9iamVjdC5zdGFydCwgeyB4OiBvcmdpblgzIH0pKSB7XHJcbiAgICAgICAgICAgIGlmIChvcmdpblgzID4gMCkge1xyXG4gICAgICAgICAgICAgICAgc3RhcnRZID0gTWF0aC5taW4ob3JnaW5ZMywgbGFzdFRleHRPYmplY3Quc3RhcnQueSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3JnaW5YMSA8IDApIHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0WSA9IE1hdGgubWF4KG9yZ2luWTMsIGxhc3RUZXh0T2JqZWN0LnN0YXJ0LnkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9yZ2luWTMgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRZID0gTWF0aC5tYXgob3JnaW5ZMywgbGFzdFRleHRPYmplY3Quc3RhcnQueSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0WSA9IE1hdGgubWluKG9yZ2luWTMsIGxhc3RUZXh0T2JqZWN0LnN0YXJ0LnkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3JnaW5YMyA8IDApIHtcclxuICAgICAgICAgICAgb3JnaW5YMyAtPSB0ZXh0V2lkdGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdGV4dE9iamVjdCA9IHtcclxuICAgICAgICAgICAgbGluZVN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICB4OiBvcmdpblgyLFxyXG4gICAgICAgICAgICAgICAgeTogb3JnaW5ZMlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsaW5lRW5kOiB7XHJcbiAgICAgICAgICAgICAgICB4OiBvcmdpblgxLFxyXG4gICAgICAgICAgICAgICAgeTogb3JnaW5ZMVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdGFydDoge1xyXG4gICAgICAgICAgICAgICAgeDogb3JnaW5YMyxcclxuICAgICAgICAgICAgICAgIHk6IHN0YXJ0WVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB3aWR0aDogdGV4dFdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IGNvbmZpZy5mb250U2l6ZSxcclxuICAgICAgICAgICAgdGV4dDogaXRlbS50ZXh0LFxyXG4gICAgICAgICAgICBjb2xvcjogaXRlbS5jb2xvclxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxhc3RUZXh0T2JqZWN0ID0gYXZvaWRDb2xsaXNpb24odGV4dE9iamVjdCwgbGFzdFRleHRPYmplY3QpO1xyXG4gICAgICAgIHRleHRPYmplY3RDb2xsZWN0aW9uLnB1c2gobGFzdFRleHRPYmplY3QpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGV4dE9iamVjdENvbGxlY3Rpb24uZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHZhciBsaW5lU3RhcnRQb2lzdGlvbiA9IGNvbnZlcnRDb29yZGluYXRlT3JpZ2luKGl0ZW0ubGluZVN0YXJ0LngsIGl0ZW0ubGluZVN0YXJ0LnksIGNlbnRlcik7XHJcbiAgICAgICAgdmFyIGxpbmVFbmRQb2lzdGlvbiA9IGNvbnZlcnRDb29yZGluYXRlT3JpZ2luKGl0ZW0ubGluZUVuZC54LCBpdGVtLmxpbmVFbmQueSwgY2VudGVyKTtcclxuICAgICAgICB2YXIgdGV4dFBvc2l0aW9uID0gY29udmVydENvb3JkaW5hdGVPcmlnaW4oaXRlbS5zdGFydC54LCBpdGVtLnN0YXJ0LnksIGNlbnRlcik7XHJcbiAgICAgICAgY29udGV4dC5zZXRMaW5lV2lkdGgoMSk7XHJcbiAgICAgICAgY29udGV4dC5zZXRGb250U2l6ZShjb25maWcuZm9udFNpemUpO1xyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC5zZXRTdHJva2VTdHlsZShpdGVtLmNvbG9yKTtcclxuICAgICAgICBjb250ZXh0LnNldEZpbGxTdHlsZShpdGVtLmNvbG9yKTtcclxuICAgICAgICBjb250ZXh0Lm1vdmVUbyhsaW5lU3RhcnRQb2lzdGlvbi54LCBsaW5lU3RhcnRQb2lzdGlvbi55KTtcclxuICAgICAgICB2YXIgY3VydmVTdGFydFggPSBpdGVtLnN0YXJ0LnggPCAwID8gdGV4dFBvc2l0aW9uLnggKyBpdGVtLndpZHRoIDogdGV4dFBvc2l0aW9uLng7XHJcbiAgICAgICAgdmFyIHRleHRTdGFydFggPSBpdGVtLnN0YXJ0LnggPCAwID8gdGV4dFBvc2l0aW9uLnggLSA1IDogdGV4dFBvc2l0aW9uLnggKyA1O1xyXG4gICAgICAgIGNvbnRleHQucXVhZHJhdGljQ3VydmVUbyhsaW5lRW5kUG9pc3Rpb24ueCwgbGluZUVuZFBvaXN0aW9uLnksIGN1cnZlU3RhcnRYLCB0ZXh0UG9zaXRpb24ueSk7XHJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8obGluZVN0YXJ0UG9pc3Rpb24ueCwgbGluZVN0YXJ0UG9pc3Rpb24ueSk7XHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8odGV4dFBvc2l0aW9uLnggKyBpdGVtLndpZHRoLCB0ZXh0UG9zaXRpb24ueSk7XHJcbiAgICAgICAgY29udGV4dC5hcmMoY3VydmVTdGFydFgsIHRleHRQb3NpdGlvbi55LCAyLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQuc2V0RmlsbFN0eWxlKCcjNjY2NjY2Jyk7XHJcbiAgICAgICAgY29udGV4dC5maWxsVGV4dChpdGVtLnRleHQsIHRleHRTdGFydFgsIHRleHRQb3NpdGlvbi55ICsgMyk7XHJcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdUb29sVGlwU3BsaXRMaW5lKG9mZnNldFgsIG9wdHMsIGNvbmZpZywgY29udGV4dCkge1xyXG4gICAgdmFyIHN0YXJ0WSA9IGNvbmZpZy5wYWRkaW5nO1xyXG4gICAgdmFyIGVuZFkgPSBvcHRzLmhlaWdodCAtIGNvbmZpZy5wYWRkaW5nIC0gY29uZmlnLnhBeGlzSGVpZ2h0IC0gY29uZmlnLmxlZ2VuZEhlaWdodDtcclxuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICBjb250ZXh0LnNldFN0cm9rZVN0eWxlKCcjY2NjY2NjJyk7XHJcbiAgICBjb250ZXh0LnNldExpbmVXaWR0aCgxKTtcclxuICAgIGNvbnRleHQubW92ZVRvKG9mZnNldFgsIHN0YXJ0WSk7XHJcbiAgICBjb250ZXh0LmxpbmVUbyhvZmZzZXRYLCBlbmRZKTtcclxuICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3VG9vbFRpcCh0ZXh0TGlzdCwgb2Zmc2V0LCBvcHRzLCBjb25maWcsIGNvbnRleHQpIHtcclxuICAgIHZhciBsZWdlbmRXaWR0aCA9IDQ7XHJcbiAgICB2YXIgbGVnZW5kTWFyZ2luUmlnaHQgPSA1O1xyXG4gICAgdmFyIGFycm93V2lkdGggPSA4O1xyXG4gICAgdmFyIGlzT3ZlclJpZ2h0Qm9yZGVyID0gZmFsc2U7XHJcbiAgICBvZmZzZXQgPSBhc3NpZ24oe1xyXG4gICAgICAgIHg6IDAsXHJcbiAgICAgICAgeTogMFxyXG4gICAgfSwgb2Zmc2V0KTtcclxuICAgIG9mZnNldC55IC09IDg7XHJcbiAgICB2YXIgdGV4dFdpZHRoID0gdGV4dExpc3QubWFwKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIG1lYXN1cmVUZXh0KGl0ZW0udGV4dCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgdG9vbFRpcFdpZHRoID0gbGVnZW5kV2lkdGggKyBsZWdlbmRNYXJnaW5SaWdodCArIDQgKiBjb25maWcudG9vbFRpcFBhZGRpbmcgKyBNYXRoLm1heC5hcHBseShudWxsLCB0ZXh0V2lkdGgpO1xyXG4gICAgdmFyIHRvb2xUaXBIZWlnaHQgPSAyICogY29uZmlnLnRvb2xUaXBQYWRkaW5nICsgdGV4dExpc3QubGVuZ3RoICogY29uZmlnLnRvb2xUaXBMaW5lSGVpZ2h0O1xyXG5cclxuICAgIC8vIGlmIGJleW9uZCB0aGUgcmlnaHQgYm9yZGVyXHJcbiAgICBpZiAob2Zmc2V0LnggLSBNYXRoLmFicyhvcHRzLl9zY3JvbGxEaXN0YW5jZV8pICsgYXJyb3dXaWR0aCArIHRvb2xUaXBXaWR0aCA+IG9wdHMud2lkdGgpIHtcclxuICAgICAgICBpc092ZXJSaWdodEJvcmRlciA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZHJhdyBiYWNrZ3JvdW5kIHJlY3RcclxuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICBjb250ZXh0LnNldEZpbGxTdHlsZShvcHRzLnRvb2x0aXAub3B0aW9uLmJhY2tncm91bmQgfHwgY29uZmlnLnRvb2xUaXBCYWNrZ3JvdW5kKTtcclxuICAgIGNvbnRleHQuc2V0R2xvYmFsQWxwaGEoY29uZmlnLnRvb2xUaXBPcGFjaXR5KTtcclxuICAgIGlmIChpc092ZXJSaWdodEJvcmRlcikge1xyXG4gICAgICAgIGNvbnRleHQubW92ZVRvKG9mZnNldC54LCBvZmZzZXQueSArIDEwKTtcclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhvZmZzZXQueCAtIGFycm93V2lkdGgsIG9mZnNldC55ICsgMTAgLSA1KTtcclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhvZmZzZXQueCAtIGFycm93V2lkdGgsIG9mZnNldC55ICsgMTAgKyA1KTtcclxuICAgICAgICBjb250ZXh0Lm1vdmVUbyhvZmZzZXQueCwgb2Zmc2V0LnkgKyAxMCk7XHJcbiAgICAgICAgY29udGV4dC5maWxsUmVjdChvZmZzZXQueCAtIHRvb2xUaXBXaWR0aCAtIGFycm93V2lkdGgsIG9mZnNldC55LCB0b29sVGlwV2lkdGgsIHRvb2xUaXBIZWlnaHQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb250ZXh0Lm1vdmVUbyhvZmZzZXQueCwgb2Zmc2V0LnkgKyAxMCk7XHJcbiAgICAgICAgY29udGV4dC5saW5lVG8ob2Zmc2V0LnggKyBhcnJvd1dpZHRoLCBvZmZzZXQueSArIDEwIC0gNSk7XHJcbiAgICAgICAgY29udGV4dC5saW5lVG8ob2Zmc2V0LnggKyBhcnJvd1dpZHRoLCBvZmZzZXQueSArIDEwICsgNSk7XHJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8ob2Zmc2V0LngsIG9mZnNldC55ICsgMTApO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFJlY3Qob2Zmc2V0LnggKyBhcnJvd1dpZHRoLCBvZmZzZXQueSwgdG9vbFRpcFdpZHRoLCB0b29sVGlwSGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgY29udGV4dC5maWxsKCk7XHJcbiAgICBjb250ZXh0LnNldEdsb2JhbEFscGhhKDEpO1xyXG5cclxuICAgIC8vIGRyYXcgbGVnZW5kXHJcbiAgICB0ZXh0TGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC5zZXRGaWxsU3R5bGUoaXRlbS5jb2xvcik7XHJcbiAgICAgICAgdmFyIHN0YXJ0WCA9IG9mZnNldC54ICsgYXJyb3dXaWR0aCArIDIgKiBjb25maWcudG9vbFRpcFBhZGRpbmc7XHJcbiAgICAgICAgdmFyIHN0YXJ0WSA9IG9mZnNldC55ICsgKGNvbmZpZy50b29sVGlwTGluZUhlaWdodCAtIGNvbmZpZy5mb250U2l6ZSkgLyAyICsgY29uZmlnLnRvb2xUaXBMaW5lSGVpZ2h0ICogaW5kZXggKyBjb25maWcudG9vbFRpcFBhZGRpbmc7XHJcbiAgICAgICAgaWYgKGlzT3ZlclJpZ2h0Qm9yZGVyKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0WCA9IG9mZnNldC54IC0gdG9vbFRpcFdpZHRoIC0gYXJyb3dXaWR0aCArIDIgKiBjb25maWcudG9vbFRpcFBhZGRpbmc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRleHQuZmlsbFJlY3Qoc3RhcnRYLCBzdGFydFksIGxlZ2VuZFdpZHRoLCBjb25maWcuZm9udFNpemUpO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBkcmF3IHRleHQgbGlzdFxyXG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgIGNvbnRleHQuc2V0Rm9udFNpemUoY29uZmlnLmZvbnRTaXplKTtcclxuICAgIGNvbnRleHQuc2V0RmlsbFN0eWxlKCcjZmZmZmZmJyk7XHJcbiAgICB0ZXh0TGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xyXG4gICAgICAgIHZhciBzdGFydFggPSBvZmZzZXQueCArIGFycm93V2lkdGggKyAyICogY29uZmlnLnRvb2xUaXBQYWRkaW5nICsgbGVnZW5kV2lkdGggKyBsZWdlbmRNYXJnaW5SaWdodDtcclxuICAgICAgICBpZiAoaXNPdmVyUmlnaHRCb3JkZXIpIHtcclxuICAgICAgICAgICAgc3RhcnRYID0gb2Zmc2V0LnggLSB0b29sVGlwV2lkdGggLSBhcnJvd1dpZHRoICsgMiAqIGNvbmZpZy50b29sVGlwUGFkZGluZyArICtsZWdlbmRXaWR0aCArIGxlZ2VuZE1hcmdpblJpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc3RhcnRZID0gb2Zmc2V0LnkgKyAoY29uZmlnLnRvb2xUaXBMaW5lSGVpZ2h0IC0gY29uZmlnLmZvbnRTaXplKSAvIDIgKyBjb25maWcudG9vbFRpcExpbmVIZWlnaHQgKiBpbmRleCArIGNvbmZpZy50b29sVGlwUGFkZGluZztcclxuICAgICAgICBjb250ZXh0LmZpbGxUZXh0KGl0ZW0udGV4dCwgc3RhcnRYLCBzdGFydFkgKyBjb25maWcuZm9udFNpemUpO1xyXG4gICAgfSk7XHJcbiAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd1lBeGlzVGl0bGUodGl0bGUsIG9wdHMsIGNvbmZpZywgY29udGV4dCkge1xyXG4gICAgdmFyIHN0YXJ0WCA9IGNvbmZpZy54QXhpc0hlaWdodCArIChvcHRzLmhlaWdodCAtIGNvbmZpZy54QXhpc0hlaWdodCAtIG1lYXN1cmVUZXh0KHRpdGxlKSkgLyAyO1xyXG4gICAgY29udGV4dC5zYXZlKCk7XHJcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgY29udGV4dC5zZXRGb250U2l6ZShjb25maWcuZm9udFNpemUpO1xyXG4gICAgY29udGV4dC5zZXRGaWxsU3R5bGUob3B0cy55QXhpcy50aXRsZUZvbnRDb2xvciB8fCAnIzMzMzMzMycpO1xyXG4gICAgY29udGV4dC50cmFuc2xhdGUoMCwgb3B0cy5oZWlnaHQpO1xyXG4gICAgY29udGV4dC5yb3RhdGUoLTkwICogTWF0aC5QSSAvIDE4MCk7XHJcbiAgICBjb250ZXh0LmZpbGxUZXh0KHRpdGxlLCBzdGFydFgsIGNvbmZpZy5wYWRkaW5nICsgMC41ICogY29uZmlnLmZvbnRTaXplKTtcclxuICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgY29udGV4dC5yZXN0b3JlKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdDb2x1bW5EYXRhUG9pbnRzKHNlcmllcywgb3B0cywgY29uZmlnLCBjb250ZXh0KSB7XHJcbiAgICB2YXIgcHJvY2VzcyA9IGFyZ3VtZW50cy5sZW5ndGggPiA0ICYmIGFyZ3VtZW50c1s0XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzRdIDogMTtcclxuXHJcbiAgICB2YXIgX2NhbFlBeGlzRGF0YSA9IGNhbFlBeGlzRGF0YShzZXJpZXMsIG9wdHMsIGNvbmZpZyksXHJcbiAgICAgICAgcmFuZ2VzID0gX2NhbFlBeGlzRGF0YS5yYW5nZXM7XHJcblxyXG4gICAgdmFyIF9nZXRYQXhpc1BvaW50cyA9IGdldFhBeGlzUG9pbnRzKG9wdHMuY2F0ZWdvcmllcywgb3B0cywgY29uZmlnKSxcclxuICAgICAgICB4QXhpc1BvaW50cyA9IF9nZXRYQXhpc1BvaW50cy54QXhpc1BvaW50cyxcclxuICAgICAgICBlYWNoU3BhY2luZyA9IF9nZXRYQXhpc1BvaW50cy5lYWNoU3BhY2luZztcclxuXHJcbiAgICB2YXIgbWluUmFuZ2UgPSByYW5nZXMucG9wKCk7XHJcbiAgICB2YXIgbWF4UmFuZ2UgPSByYW5nZXMuc2hpZnQoKTtcclxuICAgIGNvbnRleHQuc2F2ZSgpO1xyXG4gICAgaWYgKG9wdHMuX3Njcm9sbERpc3RhbmNlXyAmJiBvcHRzLl9zY3JvbGxEaXN0YW5jZV8gIT09IDAgJiYgb3B0cy5lbmFibGVTY3JvbGwgPT09IHRydWUpIHtcclxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZShvcHRzLl9zY3JvbGxEaXN0YW5jZV8sIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHNlcmllcy5mb3JFYWNoKGZ1bmN0aW9uIChlYWNoU2VyaWVzLCBzZXJpZXNJbmRleCkge1xyXG4gICAgICAgIHZhciBkYXRhID0gZWFjaFNlcmllcy5kYXRhO1xyXG4gICAgICAgIHZhciBwb2ludHMgPSBnZXREYXRhUG9pbnRzKGRhdGEsIG1pblJhbmdlLCBtYXhSYW5nZSwgeEF4aXNQb2ludHMsIGVhY2hTcGFjaW5nLCBvcHRzLCBjb25maWcsIHByb2Nlc3MpO1xyXG4gICAgICAgIHBvaW50cyA9IGZpeENvbHVtZURhdGEocG9pbnRzLCBlYWNoU3BhY2luZywgc2VyaWVzLmxlbmd0aCwgc2VyaWVzSW5kZXgsIGNvbmZpZywgb3B0cyk7XHJcblxyXG4gICAgICAgIC8vIOe7mOWItuafseeKtuaVsOaNruWbvlxyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC5zZXRGaWxsU3R5bGUoZWFjaFNlcmllcy5jb2xvcik7XHJcbiAgICAgICAgcG9pbnRzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3RhcnRYID0gaXRlbS54IC0gaXRlbS53aWR0aCAvIDIgKyAxO1xyXG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IG9wdHMuaGVpZ2h0IC0gaXRlbS55IC0gY29uZmlnLnBhZGRpbmcgLSBjb25maWcueEF4aXNIZWlnaHQgLSBjb25maWcubGVnZW5kSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8oc3RhcnRYLCBpdGVtLnkpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5yZWN0KHN0YXJ0WCwgaXRlbS55LCBpdGVtLndpZHRoIC0gMiwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICB9KTtcclxuICAgIHNlcmllcy5mb3JFYWNoKGZ1bmN0aW9uIChlYWNoU2VyaWVzLCBzZXJpZXNJbmRleCkge1xyXG4gICAgICAgIHZhciBkYXRhID0gZWFjaFNlcmllcy5kYXRhO1xyXG4gICAgICAgIHZhciBwb2ludHMgPSBnZXREYXRhUG9pbnRzKGRhdGEsIG1pblJhbmdlLCBtYXhSYW5nZSwgeEF4aXNQb2ludHMsIGVhY2hTcGFjaW5nLCBvcHRzLCBjb25maWcsIHByb2Nlc3MpO1xyXG4gICAgICAgIHBvaW50cyA9IGZpeENvbHVtZURhdGEocG9pbnRzLCBlYWNoU3BhY2luZywgc2VyaWVzLmxlbmd0aCwgc2VyaWVzSW5kZXgsIGNvbmZpZywgb3B0cyk7XHJcbiAgICAgICAgaWYgKG9wdHMuZGF0YUxhYmVsICE9PSBmYWxzZSAmJiBwcm9jZXNzID09PSAxKSB7XHJcbiAgICAgICAgICAgIGRyYXdQb2ludFRleHQocG9pbnRzLCBlYWNoU2VyaWVzLCBjb25maWcsIGNvbnRleHQpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgY29udGV4dC5yZXN0b3JlKCk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHhBeGlzUG9pbnRzOiB4QXhpc1BvaW50cyxcclxuICAgICAgICBlYWNoU3BhY2luZzogZWFjaFNwYWNpbmdcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdBcmVhRGF0YVBvaW50cyhzZXJpZXMsIG9wdHMsIGNvbmZpZywgY29udGV4dCkge1xyXG4gICAgdmFyIHByb2Nlc3MgPSBhcmd1bWVudHMubGVuZ3RoID4gNCAmJiBhcmd1bWVudHNbNF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s0XSA6IDE7XHJcblxyXG4gICAgdmFyIF9jYWxZQXhpc0RhdGEyID0gY2FsWUF4aXNEYXRhKHNlcmllcywgb3B0cywgY29uZmlnKSxcclxuICAgICAgICByYW5nZXMgPSBfY2FsWUF4aXNEYXRhMi5yYW5nZXM7XHJcblxyXG4gICAgdmFyIF9nZXRYQXhpc1BvaW50czIgPSBnZXRYQXhpc1BvaW50cyhvcHRzLmNhdGVnb3JpZXMsIG9wdHMsIGNvbmZpZyksXHJcbiAgICAgICAgeEF4aXNQb2ludHMgPSBfZ2V0WEF4aXNQb2ludHMyLnhBeGlzUG9pbnRzLFxyXG4gICAgICAgIGVhY2hTcGFjaW5nID0gX2dldFhBeGlzUG9pbnRzMi5lYWNoU3BhY2luZztcclxuXHJcbiAgICB2YXIgbWluUmFuZ2UgPSByYW5nZXMucG9wKCk7XHJcbiAgICB2YXIgbWF4UmFuZ2UgPSByYW5nZXMuc2hpZnQoKTtcclxuICAgIHZhciBlbmRZID0gb3B0cy5oZWlnaHQgLSBjb25maWcucGFkZGluZyAtIGNvbmZpZy54QXhpc0hlaWdodCAtIGNvbmZpZy5sZWdlbmRIZWlnaHQ7XHJcbiAgICB2YXIgY2FsUG9pbnRzID0gW107XHJcblxyXG4gICAgY29udGV4dC5zYXZlKCk7XHJcbiAgICBpZiAob3B0cy5fc2Nyb2xsRGlzdGFuY2VfICYmIG9wdHMuX3Njcm9sbERpc3RhbmNlXyAhPT0gMCAmJiBvcHRzLmVuYWJsZVNjcm9sbCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKG9wdHMuX3Njcm9sbERpc3RhbmNlXywgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9wdHMudG9vbHRpcCAmJiBvcHRzLnRvb2x0aXAudGV4dExpc3QgJiYgb3B0cy50b29sdGlwLnRleHRMaXN0Lmxlbmd0aCAmJiBwcm9jZXNzID09PSAxKSB7XHJcbiAgICAgICAgZHJhd1Rvb2xUaXBTcGxpdExpbmUob3B0cy50b29sdGlwLm9mZnNldC54LCBvcHRzLCBjb25maWcsIGNvbnRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlcmllcy5mb3JFYWNoKGZ1bmN0aW9uIChlYWNoU2VyaWVzLCBzZXJpZXNJbmRleCkge1xyXG4gICAgICAgIHZhciBkYXRhID0gZWFjaFNlcmllcy5kYXRhO1xyXG4gICAgICAgIHZhciBwb2ludHMgPSBnZXREYXRhUG9pbnRzKGRhdGEsIG1pblJhbmdlLCBtYXhSYW5nZSwgeEF4aXNQb2ludHMsIGVhY2hTcGFjaW5nLCBvcHRzLCBjb25maWcsIHByb2Nlc3MpO1xyXG4gICAgICAgIGNhbFBvaW50cy5wdXNoKHBvaW50cyk7XHJcblxyXG4gICAgICAgIHZhciBzcGxpdFBvaW50TGlzdCA9IHNwbGl0UG9pbnRzKHBvaW50cyk7XHJcblxyXG4gICAgICAgIHNwbGl0UG9pbnRMaXN0LmZvckVhY2goZnVuY3Rpb24gKHBvaW50cykge1xyXG4gICAgICAgICAgICAvLyDnu5jliLbljLrln5/mlbDmja5cclxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY29udGV4dC5zZXRTdHJva2VTdHlsZShlYWNoU2VyaWVzLmNvbG9yKTtcclxuICAgICAgICAgICAgY29udGV4dC5zZXRGaWxsU3R5bGUoZWFjaFNlcmllcy5jb2xvcik7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc2V0R2xvYmFsQWxwaGEoMC42KTtcclxuICAgICAgICAgICAgY29udGV4dC5zZXRMaW5lV2lkdGgoMik7XHJcbiAgICAgICAgICAgIGlmIChwb2ludHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGZpcnN0UG9pbnQgPSBwb2ludHNbMF07XHJcbiAgICAgICAgICAgICAgICB2YXIgbGFzdFBvaW50ID0gcG9pbnRzW3BvaW50cy5sZW5ndGggLSAxXTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1vdmVUbyhmaXJzdFBvaW50LngsIGZpcnN0UG9pbnQueSk7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0cy5leHRyYS5saW5lU3R5bGUgPT09ICdjdXJ2ZScpIHtcclxuICAgICAgICAgICAgICAgICAgICBwb2ludHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGN0cmxQb2ludCA9IGNyZWF0ZUN1cnZlQ29udHJvbFBvaW50cyhwb2ludHMsIGluZGV4IC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmJlemllckN1cnZlVG8oY3RybFBvaW50LmN0ckEueCwgY3RybFBvaW50LmN0ckEueSwgY3RybFBvaW50LmN0ckIueCwgY3RybFBvaW50LmN0ckIueSwgaXRlbS54LCBpdGVtLnkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50cy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbyhpdGVtLngsIGl0ZW0ueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbyhsYXN0UG9pbnQueCwgZW5kWSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbyhmaXJzdFBvaW50LngsIGVuZFkpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5saW5lVG8oZmlyc3RQb2ludC54LCBmaXJzdFBvaW50LnkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBwb2ludHNbMF07XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1vdmVUbyhpdGVtLnggLSBlYWNoU3BhY2luZyAvIDIsIGl0ZW0ueSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbyhpdGVtLnggKyBlYWNoU3BhY2luZyAvIDIsIGl0ZW0ueSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbyhpdGVtLnggKyBlYWNoU3BhY2luZyAvIDIsIGVuZFkpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5saW5lVG8oaXRlbS54IC0gZWFjaFNwYWNpbmcgLyAyLCBlbmRZKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQubW92ZVRvKGl0ZW0ueCAtIGVhY2hTcGFjaW5nIC8gMiwgaXRlbS55KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgICAgICAgY29udGV4dC5zZXRHbG9iYWxBbHBoYSgxKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKG9wdHMuZGF0YVBvaW50U2hhcGUgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHZhciBzaGFwZSA9IGNvbmZpZy5kYXRhUG9pbnRTaGFwZVtzZXJpZXNJbmRleCAlIGNvbmZpZy5kYXRhUG9pbnRTaGFwZS5sZW5ndGhdO1xyXG4gICAgICAgICAgICBkcmF3UG9pbnRTaGFwZShwb2ludHMsIGVhY2hTZXJpZXMuY29sb3IsIHNoYXBlLCBjb250ZXh0KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGlmIChvcHRzLmRhdGFMYWJlbCAhPT0gZmFsc2UgJiYgcHJvY2VzcyA9PT0gMSkge1xyXG4gICAgICAgIHNlcmllcy5mb3JFYWNoKGZ1bmN0aW9uIChlYWNoU2VyaWVzLCBzZXJpZXNJbmRleCkge1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IGVhY2hTZXJpZXMuZGF0YTtcclxuICAgICAgICAgICAgdmFyIHBvaW50cyA9IGdldERhdGFQb2ludHMoZGF0YSwgbWluUmFuZ2UsIG1heFJhbmdlLCB4QXhpc1BvaW50cywgZWFjaFNwYWNpbmcsIG9wdHMsIGNvbmZpZywgcHJvY2Vzcyk7XHJcbiAgICAgICAgICAgIGRyYXdQb2ludFRleHQocG9pbnRzLCBlYWNoU2VyaWVzLCBjb25maWcsIGNvbnRleHQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnRleHQucmVzdG9yZSgpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgeEF4aXNQb2ludHM6IHhBeGlzUG9pbnRzLFxyXG4gICAgICAgIGNhbFBvaW50czogY2FsUG9pbnRzLFxyXG4gICAgICAgIGVhY2hTcGFjaW5nOiBlYWNoU3BhY2luZ1xyXG4gICAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd0xpbmVEYXRhUG9pbnRzKHNlcmllcywgb3B0cywgY29uZmlnLCBjb250ZXh0KSB7XHJcbiAgICB2YXIgcHJvY2VzcyA9IGFyZ3VtZW50cy5sZW5ndGggPiA0ICYmIGFyZ3VtZW50c1s0XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzRdIDogMTtcclxuXHJcbiAgICB2YXIgX2NhbFlBeGlzRGF0YTMgPSBjYWxZQXhpc0RhdGEoc2VyaWVzLCBvcHRzLCBjb25maWcpLFxyXG4gICAgICAgIHJhbmdlcyA9IF9jYWxZQXhpc0RhdGEzLnJhbmdlcztcclxuXHJcbiAgICB2YXIgX2dldFhBeGlzUG9pbnRzMyA9IGdldFhBeGlzUG9pbnRzKG9wdHMuY2F0ZWdvcmllcywgb3B0cywgY29uZmlnKSxcclxuICAgICAgICB4QXhpc1BvaW50cyA9IF9nZXRYQXhpc1BvaW50czMueEF4aXNQb2ludHMsXHJcbiAgICAgICAgZWFjaFNwYWNpbmcgPSBfZ2V0WEF4aXNQb2ludHMzLmVhY2hTcGFjaW5nO1xyXG5cclxuICAgIHZhciBtaW5SYW5nZSA9IHJhbmdlcy5wb3AoKTtcclxuICAgIHZhciBtYXhSYW5nZSA9IHJhbmdlcy5zaGlmdCgpO1xyXG4gICAgdmFyIGNhbFBvaW50cyA9IFtdO1xyXG5cclxuICAgIGNvbnRleHQuc2F2ZSgpO1xyXG4gICAgaWYgKG9wdHMuX3Njcm9sbERpc3RhbmNlXyAmJiBvcHRzLl9zY3JvbGxEaXN0YW5jZV8gIT09IDAgJiYgb3B0cy5lbmFibGVTY3JvbGwgPT09IHRydWUpIHtcclxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZShvcHRzLl9zY3JvbGxEaXN0YW5jZV8sIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRzLnRvb2x0aXAgJiYgb3B0cy50b29sdGlwLnRleHRMaXN0ICYmIG9wdHMudG9vbHRpcC50ZXh0TGlzdC5sZW5ndGggJiYgcHJvY2VzcyA9PT0gMSkge1xyXG4gICAgICAgIGRyYXdUb29sVGlwU3BsaXRMaW5lKG9wdHMudG9vbHRpcC5vZmZzZXQueCwgb3B0cywgY29uZmlnLCBjb250ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzZXJpZXMuZm9yRWFjaChmdW5jdGlvbiAoZWFjaFNlcmllcywgc2VyaWVzSW5kZXgpIHtcclxuICAgICAgICB2YXIgZGF0YSA9IGVhY2hTZXJpZXMuZGF0YTtcclxuICAgICAgICB2YXIgcG9pbnRzID0gZ2V0RGF0YVBvaW50cyhkYXRhLCBtaW5SYW5nZSwgbWF4UmFuZ2UsIHhBeGlzUG9pbnRzLCBlYWNoU3BhY2luZywgb3B0cywgY29uZmlnLCBwcm9jZXNzKTtcclxuICAgICAgICBjYWxQb2ludHMucHVzaChwb2ludHMpO1xyXG4gICAgICAgIHZhciBzcGxpdFBvaW50TGlzdCA9IHNwbGl0UG9pbnRzKHBvaW50cyk7XHJcblxyXG4gICAgICAgIHNwbGl0UG9pbnRMaXN0LmZvckVhY2goZnVuY3Rpb24gKHBvaW50cywgaW5kZXgpIHtcclxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY29udGV4dC5zZXRTdHJva2VTdHlsZShlYWNoU2VyaWVzLmNvbG9yKTtcclxuICAgICAgICAgICAgY29udGV4dC5zZXRMaW5lV2lkdGgoMik7XHJcbiAgICAgICAgICAgIGlmIChwb2ludHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1vdmVUbyhwb2ludHNbMF0ueCwgcG9pbnRzWzBdLnkpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5hcmMocG9pbnRzWzBdLngsIHBvaW50c1swXS55LCAxLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1vdmVUbyhwb2ludHNbMF0ueCwgcG9pbnRzWzBdLnkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMuZXh0cmEubGluZVN0eWxlID09PSAnY3VydmUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjdHJsUG9pbnQgPSBjcmVhdGVDdXJ2ZUNvbnRyb2xQb2ludHMocG9pbnRzLCBpbmRleCAtIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5iZXppZXJDdXJ2ZVRvKGN0cmxQb2ludC5jdHJBLngsIGN0cmxQb2ludC5jdHJBLnksIGN0cmxQb2ludC5jdHJCLngsIGN0cmxQb2ludC5jdHJCLnksIGl0ZW0ueCwgaXRlbS55KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwb2ludHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5saW5lVG8oaXRlbS54LCBpdGVtLnkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1vdmVUbyhwb2ludHNbMF0ueCwgcG9pbnRzWzBdLnkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChvcHRzLmRhdGFQb2ludFNoYXBlICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICB2YXIgc2hhcGUgPSBjb25maWcuZGF0YVBvaW50U2hhcGVbc2VyaWVzSW5kZXggJSBjb25maWcuZGF0YVBvaW50U2hhcGUubGVuZ3RoXTtcclxuICAgICAgICAgICAgZHJhd1BvaW50U2hhcGUocG9pbnRzLCBlYWNoU2VyaWVzLmNvbG9yLCBzaGFwZSwgY29udGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBpZiAob3B0cy5kYXRhTGFiZWwgIT09IGZhbHNlICYmIHByb2Nlc3MgPT09IDEpIHtcclxuICAgICAgICBzZXJpZXMuZm9yRWFjaChmdW5jdGlvbiAoZWFjaFNlcmllcywgc2VyaWVzSW5kZXgpIHtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSBlYWNoU2VyaWVzLmRhdGE7XHJcbiAgICAgICAgICAgIHZhciBwb2ludHMgPSBnZXREYXRhUG9pbnRzKGRhdGEsIG1pblJhbmdlLCBtYXhSYW5nZSwgeEF4aXNQb2ludHMsIGVhY2hTcGFjaW5nLCBvcHRzLCBjb25maWcsIHByb2Nlc3MpO1xyXG4gICAgICAgICAgICBkcmF3UG9pbnRUZXh0KHBvaW50cywgZWFjaFNlcmllcywgY29uZmlnLCBjb250ZXh0KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb250ZXh0LnJlc3RvcmUoKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHhBeGlzUG9pbnRzOiB4QXhpc1BvaW50cyxcclxuICAgICAgICBjYWxQb2ludHM6IGNhbFBvaW50cyxcclxuICAgICAgICBlYWNoU3BhY2luZzogZWFjaFNwYWNpbmdcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdUb29sVGlwQnJpZGdlKG9wdHMsIGNvbmZpZywgY29udGV4dCwgcHJvY2Vzcykge1xyXG4gICAgY29udGV4dC5zYXZlKCk7XHJcbiAgICBpZiAob3B0cy5fc2Nyb2xsRGlzdGFuY2VfICYmIG9wdHMuX3Njcm9sbERpc3RhbmNlXyAhPT0gMCAmJiBvcHRzLmVuYWJsZVNjcm9sbCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKG9wdHMuX3Njcm9sbERpc3RhbmNlXywgMCk7XHJcbiAgICB9XHJcbiAgICBpZiAob3B0cy50b29sdGlwICYmIG9wdHMudG9vbHRpcC50ZXh0TGlzdCAmJiBvcHRzLnRvb2x0aXAudGV4dExpc3QubGVuZ3RoICYmIHByb2Nlc3MgPT09IDEpIHtcclxuICAgICAgICBkcmF3VG9vbFRpcChvcHRzLnRvb2x0aXAudGV4dExpc3QsIG9wdHMudG9vbHRpcC5vZmZzZXQsIG9wdHMsIGNvbmZpZywgY29udGV4dCk7XHJcbiAgICB9XHJcbiAgICBjb250ZXh0LnJlc3RvcmUoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd1hBeGlzKGNhdGVnb3JpZXMsIG9wdHMsIGNvbmZpZywgY29udGV4dCkge1xyXG4gICAgdmFyIF9nZXRYQXhpc1BvaW50czQgPSBnZXRYQXhpc1BvaW50cyhjYXRlZ29yaWVzLCBvcHRzLCBjb25maWcpLFxyXG4gICAgICAgIHhBeGlzUG9pbnRzID0gX2dldFhBeGlzUG9pbnRzNC54QXhpc1BvaW50cyxcclxuICAgICAgICBzdGFydFggPSBfZ2V0WEF4aXNQb2ludHM0LnN0YXJ0WCxcclxuICAgICAgICBlbmRYID0gX2dldFhBeGlzUG9pbnRzNC5lbmRYLFxyXG4gICAgICAgIGVhY2hTcGFjaW5nID0gX2dldFhBeGlzUG9pbnRzNC5lYWNoU3BhY2luZztcclxuXHJcbiAgICB2YXIgc3RhcnRZID0gb3B0cy5oZWlnaHQgLSBjb25maWcucGFkZGluZyAtIGNvbmZpZy54QXhpc0hlaWdodCAtIGNvbmZpZy5sZWdlbmRIZWlnaHQ7XHJcbiAgICB2YXIgZW5kWSA9IHN0YXJ0WSArIGNvbmZpZy54QXhpc0xpbmVIZWlnaHQ7XHJcblxyXG4gICAgY29udGV4dC5zYXZlKCk7XHJcbiAgICBpZiAob3B0cy5fc2Nyb2xsRGlzdGFuY2VfICYmIG9wdHMuX3Njcm9sbERpc3RhbmNlXyAhPT0gMCkge1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKG9wdHMuX3Njcm9sbERpc3RhbmNlXywgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgIGNvbnRleHQuc2V0U3Ryb2tlU3R5bGUob3B0cy54QXhpcy5ncmlkQ29sb3IgfHwgXCIjY2NjY2NjXCIpO1xyXG5cclxuICAgIGlmIChvcHRzLnhBeGlzLmRpc2FibGVHcmlkICE9PSB0cnVlKSB7XHJcbiAgICAgICAgaWYgKG9wdHMueEF4aXMudHlwZSA9PT0gJ2NhbGlicmF0aW9uJykge1xyXG4gICAgICAgICAgICB4QXhpc1BvaW50cy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQubW92ZVRvKGl0ZW0gLSBlYWNoU3BhY2luZyAvIDIsIHN0YXJ0WSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5saW5lVG8oaXRlbSAtIGVhY2hTcGFjaW5nIC8gMiwgc3RhcnRZICsgNCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHhBeGlzUG9pbnRzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1vdmVUbyhpdGVtLCBzdGFydFkpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5saW5lVG8oaXRlbSwgZW5kWSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG5cclxuICAgIC8vIOWvuVjovbTliJfooajlgZrmir3nqIDlpITnkIZcclxuICAgIHZhciB2YWxpZFdpZHRoID0gb3B0cy53aWR0aCAtIDIgKiBjb25maWcucGFkZGluZyAtIGNvbmZpZy55QXhpc1dpZHRoIC0gY29uZmlnLnlBeGlzVGl0bGVXaWR0aDtcclxuICAgIHZhciBtYXhYQXhpc0xpc3RMZW5ndGggPSBNYXRoLm1pbihjYXRlZ29yaWVzLmxlbmd0aCwgTWF0aC5jZWlsKHZhbGlkV2lkdGggLyBjb25maWcuZm9udFNpemUgLyAxLjUpKTtcclxuICAgIHZhciByYXRpbyA9IE1hdGguY2VpbChjYXRlZ29yaWVzLmxlbmd0aCAvIG1heFhBeGlzTGlzdExlbmd0aCk7XHJcblxyXG4gICAgY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXMubWFwKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xyXG4gICAgICAgIHJldHVybiBpbmRleCAlIHJhdGlvICE9PSAwID8gJycgOiBpdGVtO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKGNvbmZpZy5feEF4aXNUZXh0QW5nbGVfID09PSAwKSB7XHJcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjb250ZXh0LnNldEZvbnRTaXplKGNvbmZpZy5mb250U2l6ZSk7XHJcbiAgICAgICAgY29udGV4dC5zZXRGaWxsU3R5bGUob3B0cy54QXhpcy5mb250Q29sb3IgfHwgJyM2NjY2NjYnKTtcclxuICAgICAgICBjYXRlZ29yaWVzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBlYWNoU3BhY2luZyAvIDIgLSBtZWFzdXJlVGV4dChpdGVtKSAvIDI7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFRleHQoaXRlbSwgeEF4aXNQb2ludHNbaW5kZXhdICsgb2Zmc2V0LCBzdGFydFkgKyBjb25maWcuZm9udFNpemUgKyA1KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhdGVnb3JpZXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgY29udGV4dC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc2V0Rm9udFNpemUoY29uZmlnLmZvbnRTaXplKTtcclxuICAgICAgICAgICAgY29udGV4dC5zZXRGaWxsU3R5bGUob3B0cy54QXhpcy5mb250Q29sb3IgfHwgJyM2NjY2NjYnKTtcclxuICAgICAgICAgICAgdmFyIHRleHRXaWR0aCA9IG1lYXN1cmVUZXh0KGl0ZW0pO1xyXG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gZWFjaFNwYWNpbmcgLyAyIC0gdGV4dFdpZHRoO1xyXG5cclxuICAgICAgICAgICAgdmFyIF9jYWxSb3RhdGVUcmFuc2xhdGUgPSBjYWxSb3RhdGVUcmFuc2xhdGUoeEF4aXNQb2ludHNbaW5kZXhdICsgZWFjaFNwYWNpbmcgLyAyLCBzdGFydFkgKyBjb25maWcuZm9udFNpemUgLyAyICsgNSwgb3B0cy5oZWlnaHQpLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNYID0gX2NhbFJvdGF0ZVRyYW5zbGF0ZS50cmFuc1gsXHJcbiAgICAgICAgICAgICAgICB0cmFuc1kgPSBfY2FsUm90YXRlVHJhbnNsYXRlLnRyYW5zWTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQucm90YXRlKC0xICogY29uZmlnLl94QXhpc1RleHRBbmdsZV8pO1xyXG4gICAgICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSh0cmFuc1gsIHRyYW5zWSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFRleHQoaXRlbSwgeEF4aXNQb2ludHNbaW5kZXhdICsgb2Zmc2V0LCBzdGFydFkgKyBjb25maWcuZm9udFNpemUgKyA1KTtcclxuICAgICAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICAgICAgY29udGV4dC5yZXN0b3JlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29udGV4dC5yZXN0b3JlKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdZQXhpc0dyaWQob3B0cywgY29uZmlnLCBjb250ZXh0KSB7XHJcbiAgICB2YXIgc3BhY2luZ1ZhbGlkID0gb3B0cy5oZWlnaHQgLSAyICogY29uZmlnLnBhZGRpbmcgLSBjb25maWcueEF4aXNIZWlnaHQgLSBjb25maWcubGVnZW5kSGVpZ2h0O1xyXG4gICAgdmFyIGVhY2hTcGFjaW5nID0gTWF0aC5mbG9vcihzcGFjaW5nVmFsaWQgLyBjb25maWcueUF4aXNTcGxpdCk7XHJcbiAgICB2YXIgeUF4aXNUb3RhbFdpZHRoID0gY29uZmlnLnlBeGlzV2lkdGggKyBjb25maWcueUF4aXNUaXRsZVdpZHRoO1xyXG4gICAgdmFyIHN0YXJ0WCA9IGNvbmZpZy5wYWRkaW5nICsgeUF4aXNUb3RhbFdpZHRoO1xyXG4gICAgdmFyIGVuZFggPSBvcHRzLndpZHRoIC0gY29uZmlnLnBhZGRpbmc7XHJcblxyXG4gICAgdmFyIHBvaW50cyA9IFtdO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb25maWcueUF4aXNTcGxpdDsgaSsrKSB7XHJcbiAgICAgICAgcG9pbnRzLnB1c2goY29uZmlnLnBhZGRpbmcgKyBlYWNoU3BhY2luZyAqIGkpO1xyXG4gICAgfVxyXG4gICAgcG9pbnRzLnB1c2goY29uZmlnLnBhZGRpbmcgKyBlYWNoU3BhY2luZyAqIGNvbmZpZy55QXhpc1NwbGl0ICsgMik7XHJcblxyXG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgIGNvbnRleHQuc2V0U3Ryb2tlU3R5bGUob3B0cy55QXhpcy5ncmlkQ29sb3IgfHwgXCIjY2NjY2NjXCIpO1xyXG4gICAgY29udGV4dC5zZXRMaW5lV2lkdGgoMSk7XHJcbiAgICBwb2ludHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICBjb250ZXh0Lm1vdmVUbyhzdGFydFgsIGl0ZW0pO1xyXG4gICAgICAgIGNvbnRleHQubGluZVRvKGVuZFgsIGl0ZW0pO1xyXG4gICAgfSk7XHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgY29udGV4dC5zdHJva2UoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd1lBeGlzKHNlcmllcywgb3B0cywgY29uZmlnLCBjb250ZXh0KSB7XHJcbiAgICBpZiAob3B0cy55QXhpcy5kaXNhYmxlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgX2NhbFlBeGlzRGF0YTQgPSBjYWxZQXhpc0RhdGEoc2VyaWVzLCBvcHRzLCBjb25maWcpLFxyXG4gICAgICAgIHJhbmdlc0Zvcm1hdCA9IF9jYWxZQXhpc0RhdGE0LnJhbmdlc0Zvcm1hdDtcclxuXHJcbiAgICB2YXIgeUF4aXNUb3RhbFdpZHRoID0gY29uZmlnLnlBeGlzV2lkdGggKyBjb25maWcueUF4aXNUaXRsZVdpZHRoO1xyXG5cclxuICAgIHZhciBzcGFjaW5nVmFsaWQgPSBvcHRzLmhlaWdodCAtIDIgKiBjb25maWcucGFkZGluZyAtIGNvbmZpZy54QXhpc0hlaWdodCAtIGNvbmZpZy5sZWdlbmRIZWlnaHQ7XHJcbiAgICB2YXIgZWFjaFNwYWNpbmcgPSBNYXRoLmZsb29yKHNwYWNpbmdWYWxpZCAvIGNvbmZpZy55QXhpc1NwbGl0KTtcclxuICAgIHZhciBzdGFydFggPSBjb25maWcucGFkZGluZyArIHlBeGlzVG90YWxXaWR0aDtcclxuICAgIHZhciBlbmRYID0gb3B0cy53aWR0aCAtIGNvbmZpZy5wYWRkaW5nO1xyXG4gICAgdmFyIGVuZFkgPSBvcHRzLmhlaWdodCAtIGNvbmZpZy5wYWRkaW5nIC0gY29uZmlnLnhBeGlzSGVpZ2h0IC0gY29uZmlnLmxlZ2VuZEhlaWdodDtcclxuXHJcbiAgICAvLyBzZXQgWUF4aXMgYmFja2dyb3VuZFxyXG4gICAgY29udGV4dC5zZXRGaWxsU3R5bGUob3B0cy5iYWNrZ3JvdW5kIHx8ICcjZmZmZmZmJyk7XHJcbiAgICBpZiAob3B0cy5fc2Nyb2xsRGlzdGFuY2VfIDwgMCkge1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgc3RhcnRYLCBlbmRZICsgY29uZmlnLnhBeGlzSGVpZ2h0ICsgNSk7XHJcbiAgICB9XHJcbiAgICBjb250ZXh0LmZpbGxSZWN0KGVuZFgsIDAsIG9wdHMud2lkdGgsIGVuZFkgKyBjb25maWcueEF4aXNIZWlnaHQgKyA1KTtcclxuXHJcbiAgICB2YXIgcG9pbnRzID0gW107XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8PSBjb25maWcueUF4aXNTcGxpdDsgaSsrKSB7XHJcbiAgICAgICAgcG9pbnRzLnB1c2goY29uZmlnLnBhZGRpbmcgKyBlYWNoU3BhY2luZyAqIGkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgY29udGV4dC5zZXRGb250U2l6ZShjb25maWcuZm9udFNpemUpO1xyXG4gICAgY29udGV4dC5zZXRGaWxsU3R5bGUob3B0cy55QXhpcy5mb250Q29sb3IgfHwgJyM2NjY2NjYnKTtcclxuICAgIHJhbmdlc0Zvcm1hdC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xyXG4gICAgICAgIHZhciBwb3MgPSBwb2ludHNbaW5kZXhdID8gcG9pbnRzW2luZGV4XSA6IGVuZFk7XHJcbiAgICAgICAgY29udGV4dC5maWxsVGV4dChpdGVtLCBjb25maWcucGFkZGluZyArIGNvbmZpZy55QXhpc1RpdGxlV2lkdGgsIHBvcyArIGNvbmZpZy5mb250U2l6ZSAvIDIpO1xyXG4gICAgfSk7XHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICBpZiAob3B0cy55QXhpcy50aXRsZSkge1xyXG4gICAgICAgIGRyYXdZQXhpc1RpdGxlKG9wdHMueUF4aXMudGl0bGUsIG9wdHMsIGNvbmZpZywgY29udGV4dCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdMZWdlbmQoc2VyaWVzLCBvcHRzLCBjb25maWcsIGNvbnRleHQpIHtcclxuICAgIGlmICghb3B0cy5sZWdlbmQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvLyBlYWNoIGxlZ2VuZCBzaGFwZSB3aWR0aCAxNXB4XHJcbiAgICAvLyB0aGUgc3BhY2luZyBiZXR3ZWVuIHNoYXBlIGFuZCB0ZXh0IGluIGVhY2ggbGVnZW5kIGlzIHRoZSBgcGFkZGluZ2BcclxuICAgIC8vIGVhY2ggbGVnZW5kIHNwYWNpbmcgaXMgdGhlIGBwYWRkaW5nYFxyXG4gICAgLy8gbGVnZW5kIG1hcmdpbiB0b3AgYGNvbmZpZy5wYWRkaW5nYFxyXG5cclxuICAgIHZhciBfY2FsTGVnZW5kRGF0YSA9IGNhbExlZ2VuZERhdGEoc2VyaWVzLCBvcHRzLCBjb25maWcpLFxyXG4gICAgICAgIGxlZ2VuZExpc3QgPSBfY2FsTGVnZW5kRGF0YS5sZWdlbmRMaXN0O1xyXG5cclxuICAgIHZhciBwYWRkaW5nID0gNTtcclxuICAgIHZhciBtYXJnaW5Ub3AgPSA4O1xyXG4gICAgdmFyIHNoYXBlV2lkdGggPSAxNTtcclxuICAgIGxlZ2VuZExpc3QuZm9yRWFjaChmdW5jdGlvbiAoaXRlbUxpc3QsIGxpc3RJbmRleCkge1xyXG4gICAgICAgIHZhciB3aWR0aCA9IDA7XHJcbiAgICAgICAgaXRlbUxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBpdGVtLm5hbWUgPSBpdGVtLm5hbWUgfHwgJ3VuZGVmaW5lZCc7XHJcbiAgICAgICAgICAgIHdpZHRoICs9IDMgKiBwYWRkaW5nICsgbWVhc3VyZVRleHQoaXRlbS5uYW1lKSArIHNoYXBlV2lkdGg7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIHN0YXJ0WCA9IChvcHRzLndpZHRoIC0gd2lkdGgpIC8gMiArIHBhZGRpbmc7XHJcbiAgICAgICAgdmFyIHN0YXJ0WSA9IG9wdHMuaGVpZ2h0IC0gY29uZmlnLnBhZGRpbmcgLSBjb25maWcubGVnZW5kSGVpZ2h0ICsgbGlzdEluZGV4ICogKGNvbmZpZy5mb250U2l6ZSArIG1hcmdpblRvcCkgKyBwYWRkaW5nICsgbWFyZ2luVG9wO1xyXG5cclxuICAgICAgICBjb250ZXh0LnNldEZvbnRTaXplKGNvbmZpZy5mb250U2l6ZSk7XHJcbiAgICAgICAgaXRlbUxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wdHMudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnbGluZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnNldExpbmVXaWR0aCgxKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnNldFN0cm9rZVN0eWxlKGl0ZW0uY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQubW92ZVRvKHN0YXJ0WCAtIDIsIHN0YXJ0WSArIDUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVRvKHN0YXJ0WCArIDE3LCBzdGFydFkgKyA1KTtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnNldExpbmVXaWR0aCgxKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnNldFN0cm9rZVN0eWxlKCcjZmZmZmZmJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5zZXRGaWxsU3R5bGUoaXRlbS5jb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8oc3RhcnRYICsgNy41LCBzdGFydFkgKyA1KTtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmFyYyhzdGFydFggKyA3LjUsIHN0YXJ0WSArIDUsIDQsIDAsIDIgKiBNYXRoLlBJKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdwaWUnOlxyXG4gICAgICAgICAgICAgICAgY2FzZSAncmluZyc6XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnNldEZpbGxTdHlsZShpdGVtLmNvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0Lm1vdmVUbyhzdGFydFggKyA3LjUsIHN0YXJ0WSArIDUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuYXJjKHN0YXJ0WCArIDcuNSwgc3RhcnRZICsgNSwgNywgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5zZXRGaWxsU3R5bGUoaXRlbS5jb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8oc3RhcnRYLCBzdGFydFkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQucmVjdChzdGFydFgsIHN0YXJ0WSwgMTUsIDEwKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN0YXJ0WCArPSBwYWRkaW5nICsgc2hhcGVXaWR0aDtcclxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY29udGV4dC5zZXRGaWxsU3R5bGUob3B0cy5leHRyYS5sZWdlbmRUZXh0Q29sb3IgfHwgJyMzMzMzMzMnKTtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsVGV4dChpdGVtLm5hbWUsIHN0YXJ0WCwgc3RhcnRZICsgOSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIHN0YXJ0WCArPSBtZWFzdXJlVGV4dChpdGVtLm5hbWUpICsgMiAqIHBhZGRpbmc7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBkcmF3UGllRGF0YVBvaW50cyhzZXJpZXMsIG9wdHMsIGNvbmZpZywgY29udGV4dCkge1xyXG4gICAgdmFyIHByb2Nlc3MgPSBhcmd1bWVudHMubGVuZ3RoID4gNCAmJiBhcmd1bWVudHNbNF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s0XSA6IDE7XHJcblxyXG4gICAgdmFyIHBpZU9wdGlvbiA9IG9wdHMuZXh0cmEucGllIHx8IHt9O1xyXG4gICAgc2VyaWVzID0gZ2V0UGllRGF0YVBvaW50cyhzZXJpZXMsIHByb2Nlc3MpO1xyXG4gICAgdmFyIGNlbnRlclBvc2l0aW9uID0ge1xyXG4gICAgICAgIHg6IG9wdHMud2lkdGggLyAyLFxyXG4gICAgICAgIHk6IChvcHRzLmhlaWdodCAtIGNvbmZpZy5sZWdlbmRIZWlnaHQpIC8gMlxyXG4gICAgfTtcclxuICAgIHZhciByYWRpdXMgPSBNYXRoLm1pbihjZW50ZXJQb3NpdGlvbi54IC0gY29uZmlnLnBpZUNoYXJ0TGluZVBhZGRpbmcgLSBjb25maWcucGllQ2hhcnRUZXh0UGFkZGluZyAtIGNvbmZpZy5fcGllVGV4dE1heExlbmd0aF8sIGNlbnRlclBvc2l0aW9uLnkgLSBjb25maWcucGllQ2hhcnRMaW5lUGFkZGluZyAtIGNvbmZpZy5waWVDaGFydFRleHRQYWRkaW5nKTtcclxuICAgIGlmIChvcHRzLmRhdGFMYWJlbCkge1xyXG4gICAgICAgIHJhZGl1cyAtPSAxMDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmFkaXVzIC09IDIgKiBjb25maWcucGFkZGluZztcclxuICAgIH1cclxuICAgIHNlcmllcyA9IHNlcmllcy5tYXAoZnVuY3Rpb24gKGVhY2hTZXJpZXMpIHtcclxuICAgICAgICBlYWNoU2VyaWVzLl9zdGFydF8gKz0gKHBpZU9wdGlvbi5vZmZzZXRBbmdsZSB8fCAwKSAqIE1hdGguUEkgLyAxODA7XHJcbiAgICAgICAgcmV0dXJuIGVhY2hTZXJpZXM7XHJcbiAgICB9KTtcclxuICAgIHNlcmllcy5mb3JFYWNoKGZ1bmN0aW9uIChlYWNoU2VyaWVzKSB7XHJcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjb250ZXh0LnNldExpbmVXaWR0aCgyKTtcclxuICAgICAgICBjb250ZXh0LnNldFN0cm9rZVN0eWxlKCcjZmZmZmZmJyk7XHJcbiAgICAgICAgY29udGV4dC5zZXRGaWxsU3R5bGUoZWFjaFNlcmllcy5jb2xvcik7XHJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8oY2VudGVyUG9zaXRpb24ueCwgY2VudGVyUG9zaXRpb24ueSk7XHJcbiAgICAgICAgY29udGV4dC5hcmMoY2VudGVyUG9zaXRpb24ueCwgY2VudGVyUG9zaXRpb24ueSwgcmFkaXVzLCBlYWNoU2VyaWVzLl9zdGFydF8sIGVhY2hTZXJpZXMuX3N0YXJ0XyArIDIgKiBlYWNoU2VyaWVzLl9wcm9wb3J0aW9uXyAqIE1hdGguUEkpO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgICAgaWYgKG9wdHMuZGlzYWJsZVBpZVN0cm9rZSAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChvcHRzLnR5cGUgPT09ICdyaW5nJykge1xyXG4gICAgICAgIHZhciBpbm5lclBpZVdpZHRoID0gcmFkaXVzICogMC42O1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0cy5leHRyYS5yaW5nV2lkdGggPT09ICdudW1iZXInICYmIG9wdHMuZXh0cmEucmluZ1dpZHRoID4gMCkge1xyXG4gICAgICAgICAgICBpbm5lclBpZVdpZHRoID0gTWF0aC5tYXgoMCwgcmFkaXVzIC0gb3B0cy5leHRyYS5yaW5nV2lkdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQuc2V0RmlsbFN0eWxlKG9wdHMuYmFja2dyb3VuZCB8fCAnI2ZmZmZmZicpO1xyXG4gICAgICAgIGNvbnRleHQubW92ZVRvKGNlbnRlclBvc2l0aW9uLngsIGNlbnRlclBvc2l0aW9uLnkpO1xyXG4gICAgICAgIGNvbnRleHQuYXJjKGNlbnRlclBvc2l0aW9uLngsIGNlbnRlclBvc2l0aW9uLnksIGlubmVyUGllV2lkdGgsIDAsIDIgKiBNYXRoLlBJKTtcclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRzLmRhdGFMYWJlbCAhPT0gZmFsc2UgJiYgcHJvY2VzcyA9PT0gMSkge1xyXG4gICAgICAgIC8vIGZpeCBodHRwczovL2dpdGh1Yi5jb20veGlhb2xpbjMzMDMvd3gtY2hhcnRzL2lzc3Vlcy8xMzJcclxuICAgICAgICB2YXIgdmFsaWQgPSBmYWxzZTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc2VyaWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChzZXJpZXNbaV0uZGF0YSA+IDApIHtcclxuICAgICAgICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodmFsaWQpIHtcclxuICAgICAgICAgICAgZHJhd1BpZVRleHQoc2VyaWVzLCBvcHRzLCBjb25maWcsIGNvbnRleHQsIHJhZGl1cywgY2VudGVyUG9zaXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAocHJvY2VzcyA9PT0gMSAmJiBvcHRzLnR5cGUgPT09ICdyaW5nJykge1xyXG4gICAgICAgIGRyYXdSaW5nVGl0bGUob3B0cywgY29uZmlnLCBjb250ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNlbnRlcjogY2VudGVyUG9zaXRpb24sXHJcbiAgICAgICAgcmFkaXVzOiByYWRpdXMsXHJcbiAgICAgICAgc2VyaWVzOiBzZXJpZXNcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdSYWRhckRhdGFQb2ludHMoc2VyaWVzLCBvcHRzLCBjb25maWcsIGNvbnRleHQpIHtcclxuICAgIHZhciBwcm9jZXNzID0gYXJndW1lbnRzLmxlbmd0aCA+IDQgJiYgYXJndW1lbnRzWzRdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNF0gOiAxO1xyXG5cclxuICAgIHZhciByYWRhck9wdGlvbiA9IG9wdHMuZXh0cmEucmFkYXIgfHwge307XHJcbiAgICB2YXIgY29vcmRpbmF0ZUFuZ2xlID0gZ2V0UmFkYXJDb29yZGluYXRlU2VyaWVzKG9wdHMuY2F0ZWdvcmllcy5sZW5ndGgpO1xyXG4gICAgdmFyIGNlbnRlclBvc2l0aW9uID0ge1xyXG4gICAgICAgIHg6IG9wdHMud2lkdGggLyAyLFxyXG4gICAgICAgIHk6IChvcHRzLmhlaWdodCAtIGNvbmZpZy5sZWdlbmRIZWlnaHQpIC8gMlxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgcmFkaXVzID0gTWF0aC5taW4oY2VudGVyUG9zaXRpb24ueCAtIChnZXRNYXhUZXh0TGlzdExlbmd0aChvcHRzLmNhdGVnb3JpZXMpICsgY29uZmlnLnJhZGFyTGFiZWxUZXh0TWFyZ2luKSwgY2VudGVyUG9zaXRpb24ueSAtIGNvbmZpZy5yYWRhckxhYmVsVGV4dE1hcmdpbik7XHJcblxyXG4gICAgcmFkaXVzIC09IGNvbmZpZy5wYWRkaW5nO1xyXG5cclxuICAgIC8vIGRyYXcgZ3JpZFxyXG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgIGNvbnRleHQuc2V0TGluZVdpZHRoKDEpO1xyXG4gICAgY29udGV4dC5zZXRTdHJva2VTdHlsZShyYWRhck9wdGlvbi5ncmlkQ29sb3IgfHwgXCIjY2NjY2NjXCIpO1xyXG4gICAgY29vcmRpbmF0ZUFuZ2xlLmZvckVhY2goZnVuY3Rpb24gKGFuZ2xlKSB7XHJcbiAgICAgICAgdmFyIHBvcyA9IGNvbnZlcnRDb29yZGluYXRlT3JpZ2luKHJhZGl1cyAqIE1hdGguY29zKGFuZ2xlKSwgcmFkaXVzICogTWF0aC5zaW4oYW5nbGUpLCBjZW50ZXJQb3NpdGlvbik7XHJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8oY2VudGVyUG9zaXRpb24ueCwgY2VudGVyUG9zaXRpb24ueSk7XHJcbiAgICAgICAgY29udGV4dC5saW5lVG8ocG9zLngsIHBvcy55KTtcclxuICAgIH0pO1xyXG4gICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcblxyXG4gICAgLy8gZHJhdyBzcGxpdCBsaW5lIGdyaWRcclxuXHJcbiAgICB2YXIgX2xvb3AgPSBmdW5jdGlvbiBfbG9vcChpKSB7XHJcbiAgICAgICAgdmFyIHN0YXJ0UG9zID0ge307XHJcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjb250ZXh0LnNldExpbmVXaWR0aCgxKTtcclxuICAgICAgICBjb250ZXh0LnNldFN0cm9rZVN0eWxlKHJhZGFyT3B0aW9uLmdyaWRDb2xvciB8fCBcIiNjY2NjY2NcIik7XHJcbiAgICAgICAgY29vcmRpbmF0ZUFuZ2xlLmZvckVhY2goZnVuY3Rpb24gKGFuZ2xlLCBpbmRleCkge1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gY29udmVydENvb3JkaW5hdGVPcmlnaW4ocmFkaXVzIC8gY29uZmlnLnJhZGFyR3JpZENvdW50ICogaSAqIE1hdGguY29zKGFuZ2xlKSwgcmFkaXVzIC8gY29uZmlnLnJhZGFyR3JpZENvdW50ICogaSAqIE1hdGguc2luKGFuZ2xlKSwgY2VudGVyUG9zaXRpb24pO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0UG9zID0gcG9zO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8ocG9zLngsIHBvcy55KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVRvKHBvcy54LCBwb3MueSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhzdGFydFBvcy54LCBzdGFydFBvcy55KTtcclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IGNvbmZpZy5yYWRhckdyaWRDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgX2xvb3AoaSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHJhZGFyRGF0YVBvaW50cyA9IGdldFJhZGFyRGF0YVBvaW50cyhjb29yZGluYXRlQW5nbGUsIGNlbnRlclBvc2l0aW9uLCByYWRpdXMsIHNlcmllcywgb3B0cywgcHJvY2Vzcyk7XHJcbiAgICByYWRhckRhdGFQb2ludHMuZm9yRWFjaChmdW5jdGlvbiAoZWFjaFNlcmllcywgc2VyaWVzSW5kZXgpIHtcclxuICAgICAgICAvLyDnu5jliLbljLrln5/mlbDmja5cclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQuc2V0RmlsbFN0eWxlKGVhY2hTZXJpZXMuY29sb3IpO1xyXG4gICAgICAgIGNvbnRleHQuc2V0R2xvYmFsQWxwaGEoMC42KTtcclxuICAgICAgICBlYWNoU2VyaWVzLmRhdGEuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1vdmVUbyhpdGVtLnBvc2l0aW9uLngsIGl0ZW0ucG9zaXRpb24ueSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbyhpdGVtLnBvc2l0aW9uLngsIGl0ZW0ucG9zaXRpb24ueSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgICAgIGNvbnRleHQuc2V0R2xvYmFsQWxwaGEoMSk7XHJcblxyXG4gICAgICAgIGlmIChvcHRzLmRhdGFQb2ludFNoYXBlICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICB2YXIgc2hhcGUgPSBjb25maWcuZGF0YVBvaW50U2hhcGVbc2VyaWVzSW5kZXggJSBjb25maWcuZGF0YVBvaW50U2hhcGUubGVuZ3RoXTtcclxuICAgICAgICAgICAgdmFyIHBvaW50cyA9IGVhY2hTZXJpZXMuZGF0YS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZHJhd1BvaW50U2hhcGUocG9pbnRzLCBlYWNoU2VyaWVzLmNvbG9yLCBzaGFwZSwgY29udGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAvLyBkcmF3IGxhYmVsIHRleHRcclxuICAgIGRyYXdSYWRhckxhYmVsKGNvb3JkaW5hdGVBbmdsZSwgcmFkaXVzLCBjZW50ZXJQb3NpdGlvbiwgb3B0cywgY29uZmlnLCBjb250ZXh0KTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNlbnRlcjogY2VudGVyUG9zaXRpb24sXHJcbiAgICAgICAgcmFkaXVzOiByYWRpdXMsXHJcbiAgICAgICAgYW5nbGVMaXN0OiBjb29yZGluYXRlQW5nbGVcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdDYW52YXMob3B0cywgY29udGV4dCkge1xyXG4gICAgY29udGV4dC5kcmF3KCk7XHJcbn1cclxuXHJcbnZhciBUaW1pbmcgPSB7XHJcbiAgICBlYXNlSW46IGZ1bmN0aW9uIGVhc2VJbihwb3MpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5wb3cocG9zLCAzKTtcclxuICAgIH0sXHJcblxyXG4gICAgZWFzZU91dDogZnVuY3Rpb24gZWFzZU91dChwb3MpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5wb3cocG9zIC0gMSwgMykgKyAxO1xyXG4gICAgfSxcclxuXHJcbiAgICBlYXNlSW5PdXQ6IGZ1bmN0aW9uIGVhc2VJbk91dChwb3MpIHtcclxuICAgICAgICBpZiAoKHBvcyAvPSAwLjUpIDwgMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMC41ICogTWF0aC5wb3cocG9zLCAzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gMC41ICogKE1hdGgucG93KHBvcyAtIDIsIDMpICsgMik7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBsaW5lYXI6IGZ1bmN0aW9uIGxpbmVhcihwb3MpIHtcclxuICAgICAgICByZXR1cm4gcG9zO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZnVuY3Rpb24gQW5pbWF0aW9uKG9wdHMpIHtcclxuICAgIHRoaXMuaXNTdG9wID0gZmFsc2U7XHJcbiAgICBvcHRzLmR1cmF0aW9uID0gdHlwZW9mIG9wdHMuZHVyYXRpb24gPT09ICd1bmRlZmluZWQnID8gMTAwMCA6IG9wdHMuZHVyYXRpb247XHJcbiAgICBvcHRzLnRpbWluZyA9IG9wdHMudGltaW5nIHx8ICdsaW5lYXInO1xyXG5cclxuICAgIHZhciBkZWxheSA9IDE3O1xyXG5cclxuICAgIHZhciBjcmVhdGVBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIGNyZWF0ZUFuaW1hdGlvbkZyYW1lKCkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHNldFRpbWVvdXQgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoc3RlcCwgZGVsYXkpIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aW1lU3RhbXAgPSArbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBzdGVwKHRpbWVTdGFtcCk7XHJcbiAgICAgICAgICAgICAgICB9LCBkZWxheSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChzdGVwKSB7XHJcbiAgICAgICAgICAgICAgICBzdGVwKG51bGwpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB2YXIgYW5pbWF0aW9uRnJhbWUgPSBjcmVhdGVBbmltYXRpb25GcmFtZSgpO1xyXG4gICAgdmFyIHN0YXJ0VGltZVN0YW1wID0gbnVsbDtcclxuICAgIHZhciBfc3RlcCA9IGZ1bmN0aW9uIHN0ZXAodGltZXN0YW1wKSB7XHJcbiAgICAgICAgaWYgKHRpbWVzdGFtcCA9PT0gbnVsbCB8fCB0aGlzLmlzU3RvcCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBvcHRzLm9uUHJvY2VzcyAmJiBvcHRzLm9uUHJvY2VzcygxKTtcclxuICAgICAgICAgICAgb3B0cy5vbkFuaW1hdGlvbkZpbmlzaCAmJiBvcHRzLm9uQW5pbWF0aW9uRmluaXNoKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHN0YXJ0VGltZVN0YW1wID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0VGltZVN0YW1wID0gdGltZXN0YW1wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGltZXN0YW1wIC0gc3RhcnRUaW1lU3RhbXAgPCBvcHRzLmR1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9jZXNzID0gKHRpbWVzdGFtcCAtIHN0YXJ0VGltZVN0YW1wKSAvIG9wdHMuZHVyYXRpb247XHJcbiAgICAgICAgICAgIHZhciB0aW1pbmdGdW5jdGlvbiA9IFRpbWluZ1tvcHRzLnRpbWluZ107XHJcbiAgICAgICAgICAgIHByb2Nlc3MgPSB0aW1pbmdGdW5jdGlvbihwcm9jZXNzKTtcclxuICAgICAgICAgICAgb3B0cy5vblByb2Nlc3MgJiYgb3B0cy5vblByb2Nlc3MocHJvY2Vzcyk7XHJcbiAgICAgICAgICAgIGFuaW1hdGlvbkZyYW1lKF9zdGVwLCBkZWxheSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb3B0cy5vblByb2Nlc3MgJiYgb3B0cy5vblByb2Nlc3MoMSk7XHJcbiAgICAgICAgICAgIG9wdHMub25BbmltYXRpb25GaW5pc2ggJiYgb3B0cy5vbkFuaW1hdGlvbkZpbmlzaCgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBfc3RlcCA9IF9zdGVwLmJpbmQodGhpcyk7XHJcblxyXG4gICAgYW5pbWF0aW9uRnJhbWUoX3N0ZXAsIGRlbGF5KTtcclxufVxyXG5cclxuLy8gc3RvcCBhbmltYXRpb24gaW1tZWRpYXRlbHlcclxuLy8gYW5kIHRpZ2dlciBvbkFuaW1hdGlvbkZpbmlzaFxyXG5BbmltYXRpb24ucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmlzU3RvcCA9IHRydWU7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBkcmF3Q2hhcnRzKHR5cGUsIG9wdHMsIGNvbmZpZywgY29udGV4dCkge1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuXHJcbiAgICB2YXIgc2VyaWVzID0gb3B0cy5zZXJpZXM7XHJcbiAgICB2YXIgY2F0ZWdvcmllcyA9IG9wdHMuY2F0ZWdvcmllcztcclxuICAgIHNlcmllcyA9IGZpbGxTZXJpZXNDb2xvcihzZXJpZXMsIGNvbmZpZyk7XHJcblxyXG4gICAgdmFyIF9jYWxMZWdlbmREYXRhID0gY2FsTGVnZW5kRGF0YShzZXJpZXMsIG9wdHMsIGNvbmZpZyksXHJcbiAgICAgICAgbGVnZW5kSGVpZ2h0ID0gX2NhbExlZ2VuZERhdGEubGVnZW5kSGVpZ2h0O1xyXG5cclxuICAgIGNvbmZpZy5sZWdlbmRIZWlnaHQgPSBsZWdlbmRIZWlnaHQ7XHJcblxyXG4gICAgdmFyIF9jYWxZQXhpc0RhdGEgPSBjYWxZQXhpc0RhdGEoc2VyaWVzLCBvcHRzLCBjb25maWcpLFxyXG4gICAgICAgIHlBeGlzV2lkdGggPSBfY2FsWUF4aXNEYXRhLnlBeGlzV2lkdGg7XHJcblxyXG4gICAgY29uZmlnLnlBeGlzV2lkdGggPSB5QXhpc1dpZHRoO1xyXG4gICAgaWYgKGNhdGVnb3JpZXMgJiYgY2F0ZWdvcmllcy5sZW5ndGgpIHtcclxuICAgICAgICB2YXIgX2NhbENhdGVnb3JpZXNEYXRhID0gY2FsQ2F0ZWdvcmllc0RhdGEoY2F0ZWdvcmllcywgb3B0cywgY29uZmlnKSxcclxuICAgICAgICAgICAgeEF4aXNIZWlnaHQgPSBfY2FsQ2F0ZWdvcmllc0RhdGEueEF4aXNIZWlnaHQsXHJcbiAgICAgICAgICAgIGFuZ2xlID0gX2NhbENhdGVnb3JpZXNEYXRhLmFuZ2xlO1xyXG5cclxuICAgICAgICBjb25maWcueEF4aXNIZWlnaHQgPSB4QXhpc0hlaWdodDtcclxuICAgICAgICBjb25maWcuX3hBeGlzVGV4dEFuZ2xlXyA9IGFuZ2xlO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGUgPT09ICdwaWUnIHx8IHR5cGUgPT09ICdyaW5nJykge1xyXG4gICAgICAgIGNvbmZpZy5fcGllVGV4dE1heExlbmd0aF8gPSBvcHRzLmRhdGFMYWJlbCA9PT0gZmFsc2UgPyAwIDogZ2V0UGllVGV4dE1heExlbmd0aChzZXJpZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBkdXJhdGlvbiA9IG9wdHMuYW5pbWF0aW9uID8gMTAwMCA6IDA7XHJcbiAgICB0aGlzLmFuaW1hdGlvbkluc3RhbmNlICYmIHRoaXMuYW5pbWF0aW9uSW5zdGFuY2Uuc3RvcCgpO1xyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgY2FzZSAnbGluZSc6XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uSW5zdGFuY2UgPSBuZXcgQW5pbWF0aW9uKHtcclxuICAgICAgICAgICAgICAgIHRpbWluZzogJ2Vhc2VJbicsXHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXHJcbiAgICAgICAgICAgICAgICBvblByb2Nlc3M6IGZ1bmN0aW9uIG9uUHJvY2Vzcyhwcm9jZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZHJhd1lBeGlzR3JpZChvcHRzLCBjb25maWcsIGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgX2RyYXdMaW5lRGF0YVBvaW50cyA9IGRyYXdMaW5lRGF0YVBvaW50cyhzZXJpZXMsIG9wdHMsIGNvbmZpZywgY29udGV4dCwgcHJvY2VzcyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhBeGlzUG9pbnRzID0gX2RyYXdMaW5lRGF0YVBvaW50cy54QXhpc1BvaW50cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsUG9pbnRzID0gX2RyYXdMaW5lRGF0YVBvaW50cy5jYWxQb2ludHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhY2hTcGFjaW5nID0gX2RyYXdMaW5lRGF0YVBvaW50cy5lYWNoU3BhY2luZztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuY2hhcnREYXRhLnhBeGlzUG9pbnRzID0geEF4aXNQb2ludHM7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuY2hhcnREYXRhLmNhbFBvaW50cyA9IGNhbFBvaW50cztcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5jaGFydERhdGEuZWFjaFNwYWNpbmcgPSBlYWNoU3BhY2luZztcclxuICAgICAgICAgICAgICAgICAgICBkcmF3WEF4aXMoY2F0ZWdvcmllcywgb3B0cywgY29uZmlnLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICBkcmF3TGVnZW5kKG9wdHMuc2VyaWVzLCBvcHRzLCBjb25maWcsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRyYXdZQXhpcyhzZXJpZXMsIG9wdHMsIGNvbmZpZywgY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZHJhd1Rvb2xUaXBCcmlkZ2Uob3B0cywgY29uZmlnLCBjb250ZXh0LCBwcm9jZXNzKTtcclxuICAgICAgICAgICAgICAgICAgICBkcmF3Q2FudmFzKG9wdHMsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG9uQW5pbWF0aW9uRmluaXNoOiBmdW5jdGlvbiBvbkFuaW1hdGlvbkZpbmlzaCgpIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5ldmVudC50cmlnZ2VyKCdyZW5kZXJDb21wbGV0ZScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnY29sdW1uJzpcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25JbnN0YW5jZSA9IG5ldyBBbmltYXRpb24oe1xyXG4gICAgICAgICAgICAgICAgdGltaW5nOiAnZWFzZUluJyxcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcclxuICAgICAgICAgICAgICAgIG9uUHJvY2VzczogZnVuY3Rpb24gb25Qcm9jZXNzKHByb2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBkcmF3WUF4aXNHcmlkKG9wdHMsIGNvbmZpZywgY29udGV4dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBfZHJhd0NvbHVtbkRhdGFQb2ludHMgPSBkcmF3Q29sdW1uRGF0YVBvaW50cyhzZXJpZXMsIG9wdHMsIGNvbmZpZywgY29udGV4dCwgcHJvY2VzcyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhBeGlzUG9pbnRzID0gX2RyYXdDb2x1bW5EYXRhUG9pbnRzLnhBeGlzUG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlYWNoU3BhY2luZyA9IF9kcmF3Q29sdW1uRGF0YVBvaW50cy5lYWNoU3BhY2luZztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuY2hhcnREYXRhLnhBeGlzUG9pbnRzID0geEF4aXNQb2ludHM7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuY2hhcnREYXRhLmVhY2hTcGFjaW5nID0gZWFjaFNwYWNpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgZHJhd1hBeGlzKGNhdGVnb3JpZXMsIG9wdHMsIGNvbmZpZywgY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZHJhd0xlZ2VuZChvcHRzLnNlcmllcywgb3B0cywgY29uZmlnLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICBkcmF3WUF4aXMoc2VyaWVzLCBvcHRzLCBjb25maWcsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRyYXdDYW52YXMob3B0cywgY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgb25BbmltYXRpb25GaW5pc2g6IGZ1bmN0aW9uIG9uQW5pbWF0aW9uRmluaXNoKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmV2ZW50LnRyaWdnZXIoJ3JlbmRlckNvbXBsZXRlJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdhcmVhJzpcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25JbnN0YW5jZSA9IG5ldyBBbmltYXRpb24oe1xyXG4gICAgICAgICAgICAgICAgdGltaW5nOiAnZWFzZUluJyxcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcclxuICAgICAgICAgICAgICAgIG9uUHJvY2VzczogZnVuY3Rpb24gb25Qcm9jZXNzKHByb2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBkcmF3WUF4aXNHcmlkKG9wdHMsIGNvbmZpZywgY29udGV4dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBfZHJhd0FyZWFEYXRhUG9pbnRzID0gZHJhd0FyZWFEYXRhUG9pbnRzKHNlcmllcywgb3B0cywgY29uZmlnLCBjb250ZXh0LCBwcm9jZXNzKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeEF4aXNQb2ludHMgPSBfZHJhd0FyZWFEYXRhUG9pbnRzLnhBeGlzUG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxQb2ludHMgPSBfZHJhd0FyZWFEYXRhUG9pbnRzLmNhbFBvaW50cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWFjaFNwYWNpbmcgPSBfZHJhd0FyZWFEYXRhUG9pbnRzLmVhY2hTcGFjaW5nO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5jaGFydERhdGEueEF4aXNQb2ludHMgPSB4QXhpc1BvaW50cztcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5jaGFydERhdGEuY2FsUG9pbnRzID0gY2FsUG9pbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmNoYXJ0RGF0YS5lYWNoU3BhY2luZyA9IGVhY2hTcGFjaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIGRyYXdYQXhpcyhjYXRlZ29yaWVzLCBvcHRzLCBjb25maWcsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRyYXdMZWdlbmQob3B0cy5zZXJpZXMsIG9wdHMsIGNvbmZpZywgY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZHJhd1lBeGlzKHNlcmllcywgb3B0cywgY29uZmlnLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICBkcmF3VG9vbFRpcEJyaWRnZShvcHRzLCBjb25maWcsIGNvbnRleHQsIHByb2Nlc3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRyYXdDYW52YXMob3B0cywgY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgb25BbmltYXRpb25GaW5pc2g6IGZ1bmN0aW9uIG9uQW5pbWF0aW9uRmluaXNoKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmV2ZW50LnRyaWdnZXIoJ3JlbmRlckNvbXBsZXRlJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdyaW5nJzpcclxuICAgICAgICBjYXNlICdwaWUnOlxyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbkluc3RhbmNlID0gbmV3IEFuaW1hdGlvbih7XHJcbiAgICAgICAgICAgICAgICB0aW1pbmc6ICdlYXNlSW5PdXQnLFxyXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxyXG4gICAgICAgICAgICAgICAgb25Qcm9jZXNzOiBmdW5jdGlvbiBvblByb2Nlc3MocHJvY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmNoYXJ0RGF0YS5waWVEYXRhID0gZHJhd1BpZURhdGFQb2ludHMoc2VyaWVzLCBvcHRzLCBjb25maWcsIGNvbnRleHQsIHByb2Nlc3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRyYXdMZWdlbmQob3B0cy5zZXJpZXMsIG9wdHMsIGNvbmZpZywgY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZHJhd0NhbnZhcyhvcHRzLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBvbkFuaW1hdGlvbkZpbmlzaDogZnVuY3Rpb24gb25BbmltYXRpb25GaW5pc2goKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZXZlbnQudHJpZ2dlcigncmVuZGVyQ29tcGxldGUnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3JhZGFyJzpcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25JbnN0YW5jZSA9IG5ldyBBbmltYXRpb24oe1xyXG4gICAgICAgICAgICAgICAgdGltaW5nOiAnZWFzZUluT3V0JyxcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcclxuICAgICAgICAgICAgICAgIG9uUHJvY2VzczogZnVuY3Rpb24gb25Qcm9jZXNzKHByb2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5jaGFydERhdGEucmFkYXJEYXRhID0gZHJhd1JhZGFyRGF0YVBvaW50cyhzZXJpZXMsIG9wdHMsIGNvbmZpZywgY29udGV4dCwgcHJvY2Vzcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZHJhd0xlZ2VuZChvcHRzLnNlcmllcywgb3B0cywgY29uZmlnLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICBkcmF3Q2FudmFzKG9wdHMsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG9uQW5pbWF0aW9uRmluaXNoOiBmdW5jdGlvbiBvbkFuaW1hdGlvbkZpbmlzaCgpIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5ldmVudC50cmlnZ2VyKCdyZW5kZXJDb21wbGV0ZScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIHNpbXBsZSBldmVudCBpbXBsZW1lbnRcclxuXHJcbmZ1bmN0aW9uIEV2ZW50KCkge1xyXG5cdHRoaXMuZXZlbnRzID0ge307XHJcbn1cclxuXHJcbkV2ZW50LnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24gKHR5cGUsIGxpc3RlbmVyKSB7XHJcblx0dGhpcy5ldmVudHNbdHlwZV0gPSB0aGlzLmV2ZW50c1t0eXBlXSB8fCBbXTtcclxuXHR0aGlzLmV2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcclxufTtcclxuXHJcbkV2ZW50LnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24gKCkge1xyXG5cdGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XHJcblx0XHRhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xyXG5cdH1cclxuXHJcblx0dmFyIHR5cGUgPSBhcmdzWzBdO1xyXG5cdHZhciBwYXJhbXMgPSBhcmdzLnNsaWNlKDEpO1xyXG5cdGlmICghIXRoaXMuZXZlbnRzW3R5cGVdKSB7XHJcblx0XHR0aGlzLmV2ZW50c1t0eXBlXS5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdGxpc3RlbmVyLmFwcGx5KG51bGwsIHBhcmFtcyk7XHJcblx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcbn07XHJcblxyXG52YXIgQ2hhcnRzID0gZnVuY3Rpb24gQ2hhcnRzKG9wdHMpIHtcclxuICAgIG9wdHMudGl0bGUgPSBvcHRzLnRpdGxlIHx8IHt9O1xyXG4gICAgb3B0cy5zdWJ0aXRsZSA9IG9wdHMuc3VidGl0bGUgfHwge307XHJcbiAgICBvcHRzLnlBeGlzID0gb3B0cy55QXhpcyB8fCB7fTtcclxuICAgIG9wdHMueEF4aXMgPSBvcHRzLnhBeGlzIHx8IHt9O1xyXG4gICAgb3B0cy5leHRyYSA9IG9wdHMuZXh0cmEgfHwge307XHJcbiAgICBvcHRzLmxlZ2VuZCA9IG9wdHMubGVnZW5kID09PSBmYWxzZSA/IGZhbHNlIDogdHJ1ZTtcclxuICAgIG9wdHMuYW5pbWF0aW9uID0gb3B0cy5hbmltYXRpb24gPT09IGZhbHNlID8gZmFsc2UgOiB0cnVlO1xyXG4gICAgdmFyIGNvbmZpZyQkMSA9IGFzc2lnbih7fSwgY29uZmlnKTtcclxuICAgIGNvbmZpZyQkMS55QXhpc1RpdGxlV2lkdGggPSBvcHRzLnlBeGlzLmRpc2FibGVkICE9PSB0cnVlICYmIG9wdHMueUF4aXMudGl0bGUgPyBjb25maWckJDEueUF4aXNUaXRsZVdpZHRoIDogMDtcclxuICAgIGNvbmZpZyQkMS5waWVDaGFydExpbmVQYWRkaW5nID0gb3B0cy5kYXRhTGFiZWwgPT09IGZhbHNlID8gMCA6IGNvbmZpZyQkMS5waWVDaGFydExpbmVQYWRkaW5nO1xyXG4gICAgY29uZmlnJCQxLnBpZUNoYXJ0VGV4dFBhZGRpbmcgPSBvcHRzLmRhdGFMYWJlbCA9PT0gZmFsc2UgPyAwIDogY29uZmlnJCQxLnBpZUNoYXJ0VGV4dFBhZGRpbmc7XHJcblxyXG4gICAgdGhpcy5vcHRzID0gb3B0cztcclxuICAgIHRoaXMuY29uZmlnID0gY29uZmlnJCQxO1xyXG4gICAgdGhpcy5jb250ZXh0ID0gd3guY3JlYXRlQ2FudmFzQ29udGV4dChvcHRzLmNhbnZhc0lkKTtcclxuICAgIC8vIHN0b3JlIGNhbGN1YXRlZCBjaGFydCBkYXRhXHJcbiAgICAvLyBzdWNoIGFzIGNoYXJ0IHBvaW50IGNvb3JkaW5hdGVcclxuICAgIHRoaXMuY2hhcnREYXRhID0ge307XHJcbiAgICB0aGlzLmV2ZW50ID0gbmV3IEV2ZW50KCk7XHJcbiAgICB0aGlzLnNjcm9sbE9wdGlvbiA9IHtcclxuICAgICAgICBjdXJyZW50T2Zmc2V0OiAwLFxyXG4gICAgICAgIHN0YXJ0VG91Y2hYOiAwLFxyXG4gICAgICAgIGRpc3RhbmNlOiAwXHJcbiAgICB9O1xyXG5cclxuICAgIGRyYXdDaGFydHMuY2FsbCh0aGlzLCBvcHRzLnR5cGUsIG9wdHMsIGNvbmZpZyQkMSwgdGhpcy5jb250ZXh0KTtcclxufTtcclxuXHJcbkNoYXJ0cy5wcm90b3R5cGUudXBkYXRlRGF0YSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBkYXRhID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcclxuXHJcbiAgICB0aGlzLm9wdHMuc2VyaWVzID0gZGF0YS5zZXJpZXMgfHwgdGhpcy5vcHRzLnNlcmllcztcclxuICAgIHRoaXMub3B0cy5jYXRlZ29yaWVzID0gZGF0YS5jYXRlZ29yaWVzIHx8IHRoaXMub3B0cy5jYXRlZ29yaWVzO1xyXG5cclxuICAgIHRoaXMub3B0cy50aXRsZSA9IGFzc2lnbih7fSwgdGhpcy5vcHRzLnRpdGxlLCBkYXRhLnRpdGxlIHx8IHt9KTtcclxuICAgIHRoaXMub3B0cy5zdWJ0aXRsZSA9IGFzc2lnbih7fSwgdGhpcy5vcHRzLnN1YnRpdGxlLCBkYXRhLnN1YnRpdGxlIHx8IHt9KTtcclxuXHJcbiAgICBkcmF3Q2hhcnRzLmNhbGwodGhpcywgdGhpcy5vcHRzLnR5cGUsIHRoaXMub3B0cywgdGhpcy5jb25maWcsIHRoaXMuY29udGV4dCk7XHJcbn07XHJcblxyXG5DaGFydHMucHJvdG90eXBlLnN0b3BBbmltYXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmFuaW1hdGlvbkluc3RhbmNlICYmIHRoaXMuYW5pbWF0aW9uSW5zdGFuY2Uuc3RvcCgpO1xyXG59O1xyXG5cclxuQ2hhcnRzLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24gKHR5cGUsIGxpc3RlbmVyKSB7XHJcbiAgICB0aGlzLmV2ZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpO1xyXG59O1xyXG5cclxuQ2hhcnRzLnByb3RvdHlwZS5nZXRDdXJyZW50RGF0YUluZGV4ID0gZnVuY3Rpb24gKGUpIHtcclxuICAgIHZhciB0b3VjaGVzID0gZS50b3VjaGVzICYmIGUudG91Y2hlcy5sZW5ndGggPyBlLnRvdWNoZXMgOiBlLmNoYW5nZWRUb3VjaGVzO1xyXG4gICAgaWYgKHRvdWNoZXMgJiYgdG91Y2hlcy5sZW5ndGgpIHtcclxuICAgICAgICB2YXIgX3RvdWNoZXMkID0gdG91Y2hlc1swXSxcclxuICAgICAgICAgICAgeCA9IF90b3VjaGVzJC54LFxyXG4gICAgICAgICAgICB5ID0gX3RvdWNoZXMkLnk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9wdHMudHlwZSA9PT0gJ3BpZScgfHwgdGhpcy5vcHRzLnR5cGUgPT09ICdyaW5nJykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmluZFBpZUNoYXJ0Q3VycmVudEluZGV4KHsgeDogeCwgeTogeSB9LCB0aGlzLmNoYXJ0RGF0YS5waWVEYXRhKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3B0cy50eXBlID09PSAncmFkYXInKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmaW5kUmFkYXJDaGFydEN1cnJlbnRJbmRleCh7IHg6IHgsIHk6IHkgfSwgdGhpcy5jaGFydERhdGEucmFkYXJEYXRhLCB0aGlzLm9wdHMuY2F0ZWdvcmllcy5sZW5ndGgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmaW5kQ3VycmVudEluZGV4KHsgeDogeCwgeTogeSB9LCB0aGlzLmNoYXJ0RGF0YS54QXhpc1BvaW50cywgdGhpcy5vcHRzLCB0aGlzLmNvbmZpZywgTWF0aC5hYnModGhpcy5zY3JvbGxPcHRpb24uY3VycmVudE9mZnNldCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiAtMTtcclxufTtcclxuXHJcbkNoYXJ0cy5wcm90b3R5cGUuc2hvd1Rvb2xUaXAgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgdmFyIG9wdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XHJcblxyXG4gICAgaWYgKHRoaXMub3B0cy50eXBlID09PSAnbGluZScgfHwgdGhpcy5vcHRzLnR5cGUgPT09ICdhcmVhJykge1xyXG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuZ2V0Q3VycmVudERhdGFJbmRleChlKTtcclxuICAgICAgICB2YXIgY3VycmVudE9mZnNldCA9IHRoaXMuc2Nyb2xsT3B0aW9uLmN1cnJlbnRPZmZzZXQ7XHJcblxyXG4gICAgICAgIHZhciBvcHRzID0gYXNzaWduKHt9LCB0aGlzLm9wdHMsIHtcclxuICAgICAgICAgICAgX3Njcm9sbERpc3RhbmNlXzogY3VycmVudE9mZnNldCxcclxuICAgICAgICAgICAgYW5pbWF0aW9uOiBmYWxzZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIHZhciBzZXJpZXNEYXRhID0gZ2V0U2VyaWVzRGF0YUl0ZW0odGhpcy5vcHRzLnNlcmllcywgaW5kZXgpO1xyXG4gICAgICAgICAgICBpZiAoc2VyaWVzRGF0YS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHZhciBfZ2V0VG9vbFRpcERhdGEgPSBnZXRUb29sVGlwRGF0YShzZXJpZXNEYXRhLCB0aGlzLmNoYXJ0RGF0YS5jYWxQb2ludHMsIGluZGV4LCB0aGlzLm9wdHMuY2F0ZWdvcmllcywgb3B0aW9uKSxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0TGlzdCA9IF9nZXRUb29sVGlwRGF0YS50ZXh0TGlzdCxcclxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgPSBfZ2V0VG9vbFRpcERhdGEub2Zmc2V0O1xyXG5cclxuICAgICAgICAgICAgICAgIG9wdHMudG9vbHRpcCA9IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0TGlzdDogdGV4dExpc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiBvZmZzZXQsXHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uOiBvcHRpb25cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZHJhd0NoYXJ0cy5jYWxsKHRoaXMsIG9wdHMudHlwZSwgb3B0cywgdGhpcy5jb25maWcsIHRoaXMuY29udGV4dCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5DaGFydHMucHJvdG90eXBlLnNjcm9sbFN0YXJ0ID0gZnVuY3Rpb24gKGUpIHtcclxuICAgIGlmIChlLnRvdWNoZXNbMF0gJiYgdGhpcy5vcHRzLmVuYWJsZVNjcm9sbCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsT3B0aW9uLnN0YXJ0VG91Y2hYID0gZS50b3VjaGVzWzBdLng7XHJcbiAgICB9XHJcbn07XHJcblxyXG5DaGFydHMucHJvdG90eXBlLnNjcm9sbCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAvLyBUT0RPIHRocm90dGluZy4uLlxyXG4gICAgaWYgKGUudG91Y2hlc1swXSAmJiB0aGlzLm9wdHMuZW5hYmxlU2Nyb2xsID09PSB0cnVlKSB7XHJcbiAgICAgICAgdmFyIF9kaXN0YW5jZSA9IGUudG91Y2hlc1swXS54IC0gdGhpcy5zY3JvbGxPcHRpb24uc3RhcnRUb3VjaFg7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRPZmZzZXQgPSB0aGlzLnNjcm9sbE9wdGlvbi5jdXJyZW50T2Zmc2V0O1xyXG5cclxuICAgICAgICB2YXIgdmFsaWREaXN0YW5jZSA9IGNhbFZhbGlkRGlzdGFuY2UoY3VycmVudE9mZnNldCArIF9kaXN0YW5jZSwgdGhpcy5jaGFydERhdGEsIHRoaXMuY29uZmlnLCB0aGlzLm9wdHMpO1xyXG5cclxuICAgICAgICB0aGlzLnNjcm9sbE9wdGlvbi5kaXN0YW5jZSA9IF9kaXN0YW5jZSA9IHZhbGlkRGlzdGFuY2UgLSBjdXJyZW50T2Zmc2V0O1xyXG4gICAgICAgIHZhciBvcHRzID0gYXNzaWduKHt9LCB0aGlzLm9wdHMsIHtcclxuICAgICAgICAgICAgX3Njcm9sbERpc3RhbmNlXzogY3VycmVudE9mZnNldCArIF9kaXN0YW5jZSxcclxuICAgICAgICAgICAgYW5pbWF0aW9uOiBmYWxzZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkcmF3Q2hhcnRzLmNhbGwodGhpcywgb3B0cy50eXBlLCBvcHRzLCB0aGlzLmNvbmZpZywgdGhpcy5jb250ZXh0KTtcclxuICAgIH1cclxufTtcclxuXHJcbkNoYXJ0cy5wcm90b3R5cGUuc2Nyb2xsRW5kID0gZnVuY3Rpb24gKGUpIHtcclxuICAgIGlmICh0aGlzLm9wdHMuZW5hYmxlU2Nyb2xsID09PSB0cnVlKSB7XHJcbiAgICAgICAgdmFyIF9zY3JvbGxPcHRpb24gPSB0aGlzLnNjcm9sbE9wdGlvbixcclxuICAgICAgICAgICAgY3VycmVudE9mZnNldCA9IF9zY3JvbGxPcHRpb24uY3VycmVudE9mZnNldCxcclxuICAgICAgICAgICAgZGlzdGFuY2UgPSBfc2Nyb2xsT3B0aW9uLmRpc3RhbmNlO1xyXG5cclxuICAgICAgICB0aGlzLnNjcm9sbE9wdGlvbi5jdXJyZW50T2Zmc2V0ID0gY3VycmVudE9mZnNldCArIGRpc3RhbmNlO1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsT3B0aW9uLmRpc3RhbmNlID0gMDtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2hhcnRzO1xyXG4iXX0=