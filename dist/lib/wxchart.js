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
    type = type || 'upper';
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
    context.setStrokeStyle('#ffffff');
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
    context.setStrokeStyle(opts.xAxis.gridColor || '#cccccc');

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
    context.setStrokeStyle(opts.yAxis.gridColor || '#cccccc');
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
    context.setStrokeStyle(radarOption.gridColor || '#cccccc');
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
        context.setStrokeStyle(radarOption.gridColor || '#cccccc');
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
    if (this.events[type]) {
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
    opts.legend = opts.legend !== false;
    opts.animation = opts.animation !== false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInd4Y2hhcnQuanMiXSwibmFtZXMiOlsiY29uZmlnIiwieUF4aXNXaWR0aCIsInlBeGlzU3BsaXQiLCJ4QXhpc0hlaWdodCIsInhBeGlzTGluZUhlaWdodCIsImxlZ2VuZEhlaWdodCIsInlBeGlzVGl0bGVXaWR0aCIsInBhZGRpbmciLCJjb2x1bWVQYWRkaW5nIiwiZm9udFNpemUiLCJkYXRhUG9pbnRTaGFwZSIsImNvbG9ycyIsInBpZUNoYXJ0TGluZVBhZGRpbmciLCJwaWVDaGFydFRleHRQYWRkaW5nIiwieEF4aXNUZXh0UGFkZGluZyIsInRpdGxlQ29sb3IiLCJ0aXRsZUZvbnRTaXplIiwic3VidGl0bGVDb2xvciIsInN1YnRpdGxlRm9udFNpemUiLCJ0b29sVGlwUGFkZGluZyIsInRvb2xUaXBCYWNrZ3JvdW5kIiwidG9vbFRpcE9wYWNpdHkiLCJ0b29sVGlwTGluZUhlaWdodCIsInJhZGFyR3JpZENvdW50IiwicmFkYXJMYWJlbFRleHRNYXJnaW4iLCJhc3NpZ24iLCJ0YXJnZXQiLCJ2YXJBcmdzIiwiVHlwZUVycm9yIiwidG8iLCJPYmplY3QiLCJpbmRleCIsImFyZ3VtZW50cyIsImxlbmd0aCIsIm5leHRTb3VyY2UiLCJuZXh0S2V5IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwidXRpbCIsInRvRml4ZWQiLCJudW0iLCJsaW1pdCIsImlzRmxvYXQiLCJhcHByb3hpbWF0ZWx5RXF1YWwiLCJudW0xIiwibnVtMiIsIk1hdGgiLCJhYnMiLCJpc1NhbWVTaWduIiwiaXNTYW1lWENvb3JkaW5hdGVBcmVhIiwicDEiLCJwMiIsIngiLCJpc0NvbGxpc2lvbiIsIm9iajEiLCJvYmoyIiwiZW5kIiwic3RhcnQiLCJ3aWR0aCIsInkiLCJoZWlnaHQiLCJmbGFnIiwiZmluZFJhbmdlIiwidHlwZSIsImlzTmFOIiwiRXJyb3IiLCJtdWx0aXBsZSIsImNlaWwiLCJmbG9vciIsImNhbFZhbGlkRGlzdGFuY2UiLCJkaXN0YW5jZSIsImNoYXJ0RGF0YSIsIm9wdHMiLCJkYXRhQ2hhcnRBcmVhV2lkdGgiLCJ4QXhpc1BvaW50cyIsImRhdGFDaGFydFdpZHRoIiwiZWFjaFNwYWNpbmciLCJjYXRlZ29yaWVzIiwidmFsaWREaXN0YW5jZSIsImlzSW5BbmdsZVJhbmdlIiwiYW5nbGUiLCJzdGFydEFuZ2xlIiwiZW5kQW5nbGUiLCJhZGp1c3QiLCJQSSIsImNhbFJvdGF0ZVRyYW5zbGF0ZSIsImgiLCJ4diIsInl2IiwidHJhbnNYIiwic3FydCIsInRyYW5zWSIsImNyZWF0ZUN1cnZlQ29udHJvbFBvaW50cyIsInBvaW50cyIsImkiLCJpc05vdE1pZGRsZVBvaW50IiwibWF4IiwibWluIiwiYSIsImIiLCJwQXgiLCJwQXkiLCJwQngiLCJwQnkiLCJsYXN0IiwiY3RyQSIsImN0ckIiLCJjb252ZXJ0Q29vcmRpbmF0ZU9yaWdpbiIsImNlbnRlciIsImF2b2lkQ29sbGlzaW9uIiwib2JqIiwiZmlsbFNlcmllc0NvbG9yIiwic2VyaWVzIiwibWFwIiwiaXRlbSIsImNvbG9yIiwiZ2V0RGF0YVJhbmdlIiwibWluRGF0YSIsIm1heERhdGEiLCJyYW5nZSIsIm1pblJhbmdlIiwibWF4UmFuZ2UiLCJtZWFzdXJlVGV4dCIsInRleHQiLCJ1bmRlZmluZWQiLCJTdHJpbmciLCJzcGxpdCIsImZvckVhY2giLCJ0ZXN0IiwiZGF0YUNvbWJpbmUiLCJyZWR1Y2UiLCJkYXRhIiwiY29uY2F0IiwiZ2V0U2VyaWVzRGF0YUl0ZW0iLCJzZXJpZXNJdGVtIiwibmFtZSIsImZvcm1hdCIsInB1c2giLCJnZXRNYXhUZXh0TGlzdExlbmd0aCIsImxpc3QiLCJsZW5ndGhMaXN0IiwiYXBwbHkiLCJnZXRSYWRhckNvb3JkaW5hdGVTZXJpZXMiLCJlYWNoQW5nbGUiLCJDb29yZGluYXRlU2VyaWVzIiwiZ2V0VG9vbFRpcERhdGEiLCJzZXJpZXNEYXRhIiwiY2FsUG9pbnRzIiwib3B0aW9uIiwidGV4dExpc3QiLCJ2YWxpZENhbFBvaW50cyIsIm9mZnNldCIsInJvdW5kIiwiZmluZEN1cnJlbnRJbmRleCIsImN1cnJlbnRQb2ludHMiLCJjdXJyZW50SW5kZXgiLCJpc0luRXhhY3RDaGFydEFyZWEiLCJmaW5kUmFkYXJDaGFydEN1cnJlbnRJbmRleCIsInJhZGFyRGF0YSIsImNvdW50IiwiZWFjaEFuZ2xlQXJlYSIsImlzSW5FeGFjdFBpZUNoYXJ0QXJlYSIsInJhZGl1cyIsImZpeEFuZ2xlIiwiYXRhbjIiLCJhbmdsZUxpc3QiLCJyYW5nZVN0YXJ0IiwicmFuZ2VFbmQiLCJmaW5kUGllQ2hhcnRDdXJyZW50SW5kZXgiLCJwaWVEYXRhIiwibGVuIiwiX3N0YXJ0XyIsIl9wcm9wb3J0aW9uXyIsInBvdyIsInNwbGl0UG9pbnRzIiwibmV3UG9pbnRzIiwiaXRlbXMiLCJjYWxMZWdlbmREYXRhIiwibGVnZW5kIiwibGVnZW5kTGlzdCIsIm1hcmdpblRvcCIsInNoYXBlV2lkdGgiLCJ3aWR0aENvdW50IiwiY3VycmVudFJvdyIsIml0ZW1XaWR0aCIsImNhbENhdGVnb3JpZXNEYXRhIiwicmVzdWx0IiwiX2dldFhBeGlzUG9pbnRzIiwiZ2V0WEF4aXNQb2ludHMiLCJjYXRlZ29yaWVzVGV4dExlbnRoIiwibWF4VGV4dExlbmd0aCIsInNpbiIsImdldFJhZGFyRGF0YVBvaW50cyIsInByb2Nlc3MiLCJyYWRhck9wdGlvbiIsImV4dHJhIiwicmFkYXIiLCJlYWNoIiwibGlzdEl0ZW0iLCJ0bXAiLCJwcm9wb3J0aW9uIiwicG9zaXRpb24iLCJjb3MiLCJnZXRQaWVEYXRhUG9pbnRzIiwiZ2V0UGllVGV4dE1heExlbmd0aCIsIm1heExlbmd0aCIsImZpeENvbHVtZURhdGEiLCJjb2x1bW5MZW4iLCJjb2x1bW4iLCJ5QXhpc1RvdGFsV2lkdGgiLCJzcGFjaW5nVmFsaWQiLCJkYXRhQ291bnQiLCJlbmFibGVTY3JvbGwiLCJzdGFydFgiLCJlbmRYIiwiZ2V0RGF0YVBvaW50cyIsInZhbGlkSGVpZ2h0IiwicG9pbnQiLCJnZXRZQXhpc1RleHRMaXN0IiwiZmlsdGVyIiwieUF4aXMiLCJyYW5nZVNwYW4iLCJkYXRhUmFuZ2UiLCJlYWNoUmFuZ2UiLCJyZXZlcnNlIiwiY2FsWUF4aXNEYXRhIiwicmFuZ2VzIiwicmFuZ2VzRm9ybWF0IiwiTnVtYmVyIiwiZGlzYWJsZWQiLCJkcmF3UG9pbnRTaGFwZSIsInNoYXBlIiwiY29udGV4dCIsImJlZ2luUGF0aCIsInNldFN0cm9rZVN0eWxlIiwic2V0TGluZVdpZHRoIiwic2V0RmlsbFN0eWxlIiwibW92ZVRvIiwibGluZVRvIiwiYXJjIiwicmVjdCIsImNsb3NlUGF0aCIsImZpbGwiLCJzdHJva2UiLCJkcmF3UmluZ1RpdGxlIiwidGl0bGVmb250U2l6ZSIsInRpdGxlIiwic3VidGl0bGVmb250U2l6ZSIsInN1YnRpdGxlIiwidGl0bGVGb250Q29sb3IiLCJzdWJ0aXRsZUZvbnRDb2xvciIsInRpdGxlSGVpZ2h0Iiwic3VidGl0bGVIZWlnaHQiLCJtYXJnaW4iLCJ0ZXh0V2lkdGgiLCJvZmZzZXRYIiwic3RhcnRZIiwic2V0Rm9udFNpemUiLCJmaWxsVGV4dCIsIl90ZXh0V2lkdGgiLCJfc3RhcnRYIiwiX3N0YXJ0WSIsImRyYXdQb2ludFRleHQiLCJmb3JtYXRWYWwiLCJkcmF3UmFkYXJMYWJlbCIsImNlbnRlclBvc2l0aW9uIiwibGFiZWxDb2xvciIsInBvcyIsInBvc1JlbGF0aXZlQ2FudmFzIiwiZHJhd1BpZVRleHQiLCJsaW5lUmFkaXVzIiwidGV4dE9iamVjdENvbGxlY3Rpb24iLCJsYXN0VGV4dE9iamVjdCIsInNlcmllc0NvbnZlcnQiLCJvcmdpblgxIiwib3JnaW5ZMSIsIm9yZ2luWDIiLCJvcmdpblkyIiwib3JnaW5YMyIsIm9yZ2luWTMiLCJ0ZXh0T2JqZWN0IiwibGluZVN0YXJ0IiwibGluZUVuZCIsImxpbmVTdGFydFBvaXN0aW9uIiwibGluZUVuZFBvaXN0aW9uIiwidGV4dFBvc2l0aW9uIiwiY3VydmVTdGFydFgiLCJ0ZXh0U3RhcnRYIiwicXVhZHJhdGljQ3VydmVUbyIsImRyYXdUb29sVGlwU3BsaXRMaW5lIiwiZW5kWSIsImRyYXdUb29sVGlwIiwibGVnZW5kV2lkdGgiLCJsZWdlbmRNYXJnaW5SaWdodCIsImFycm93V2lkdGgiLCJpc092ZXJSaWdodEJvcmRlciIsInRvb2xUaXBXaWR0aCIsInRvb2xUaXBIZWlnaHQiLCJfc2Nyb2xsRGlzdGFuY2VfIiwidG9vbHRpcCIsImJhY2tncm91bmQiLCJzZXRHbG9iYWxBbHBoYSIsImZpbGxSZWN0IiwiZHJhd1lBeGlzVGl0bGUiLCJzYXZlIiwidHJhbnNsYXRlIiwicm90YXRlIiwicmVzdG9yZSIsImRyYXdDb2x1bW5EYXRhUG9pbnRzIiwiX2NhbFlBeGlzRGF0YSIsInBvcCIsInNoaWZ0IiwiZWFjaFNlcmllcyIsInNlcmllc0luZGV4IiwiZGF0YUxhYmVsIiwiZHJhd0FyZWFEYXRhUG9pbnRzIiwiX2NhbFlBeGlzRGF0YTIiLCJfZ2V0WEF4aXNQb2ludHMyIiwic3BsaXRQb2ludExpc3QiLCJmaXJzdFBvaW50IiwibGFzdFBvaW50IiwibGluZVN0eWxlIiwiY3RybFBvaW50IiwiYmV6aWVyQ3VydmVUbyIsImRyYXdMaW5lRGF0YVBvaW50cyIsIl9jYWxZQXhpc0RhdGEzIiwiX2dldFhBeGlzUG9pbnRzMyIsImRyYXdUb29sVGlwQnJpZGdlIiwiZHJhd1hBeGlzIiwiX2dldFhBeGlzUG9pbnRzNCIsInhBeGlzIiwiZ3JpZENvbG9yIiwiZGlzYWJsZUdyaWQiLCJ2YWxpZFdpZHRoIiwibWF4WEF4aXNMaXN0TGVuZ3RoIiwicmF0aW8iLCJfeEF4aXNUZXh0QW5nbGVfIiwiZm9udENvbG9yIiwiX2NhbFJvdGF0ZVRyYW5zbGF0ZSIsImRyYXdZQXhpc0dyaWQiLCJkcmF3WUF4aXMiLCJfY2FsWUF4aXNEYXRhNCIsImRyYXdMZWdlbmQiLCJfY2FsTGVnZW5kRGF0YSIsIml0ZW1MaXN0IiwibGlzdEluZGV4IiwibGVnZW5kVGV4dENvbG9yIiwiZHJhd1BpZURhdGFQb2ludHMiLCJwaWVPcHRpb24iLCJwaWUiLCJfcGllVGV4dE1heExlbmd0aF8iLCJvZmZzZXRBbmdsZSIsImRpc2FibGVQaWVTdHJva2UiLCJpbm5lclBpZVdpZHRoIiwicmluZ1dpZHRoIiwidmFsaWQiLCJkcmF3UmFkYXJEYXRhUG9pbnRzIiwiY29vcmRpbmF0ZUFuZ2xlIiwiX2xvb3AiLCJzdGFydFBvcyIsInJhZGFyRGF0YVBvaW50cyIsImRyYXdDYW52YXMiLCJkcmF3IiwiVGltaW5nIiwiZWFzZUluIiwiZWFzZU91dCIsImVhc2VJbk91dCIsImxpbmVhciIsIkFuaW1hdGlvbiIsImlzU3RvcCIsImR1cmF0aW9uIiwidGltaW5nIiwiZGVsYXkiLCJjcmVhdGVBbmltYXRpb25GcmFtZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInNldFRpbWVvdXQiLCJzdGVwIiwidGltZVN0YW1wIiwiRGF0ZSIsImFuaW1hdGlvbkZyYW1lIiwic3RhcnRUaW1lU3RhbXAiLCJfc3RlcCIsInRpbWVzdGFtcCIsIm9uUHJvY2VzcyIsIm9uQW5pbWF0aW9uRmluaXNoIiwidGltaW5nRnVuY3Rpb24iLCJiaW5kIiwic3RvcCIsImRyYXdDaGFydHMiLCJfdGhpcyIsIl9jYWxDYXRlZ29yaWVzRGF0YSIsImFuaW1hdGlvbiIsImFuaW1hdGlvbkluc3RhbmNlIiwiX2RyYXdMaW5lRGF0YVBvaW50cyIsImV2ZW50IiwidHJpZ2dlciIsIl9kcmF3Q29sdW1uRGF0YVBvaW50cyIsIl9kcmF3QXJlYURhdGFQb2ludHMiLCJFdmVudCIsImV2ZW50cyIsImFkZEV2ZW50TGlzdGVuZXIiLCJsaXN0ZW5lciIsIl9sZW4iLCJhcmdzIiwiQXJyYXkiLCJfa2V5IiwicGFyYW1zIiwic2xpY2UiLCJlIiwiY29uc29sZSIsImVycm9yIiwiQ2hhcnRzIiwiY29uZmlnJCQxIiwid3giLCJjcmVhdGVDYW52YXNDb250ZXh0IiwiY2FudmFzSWQiLCJzY3JvbGxPcHRpb24iLCJjdXJyZW50T2Zmc2V0Iiwic3RhcnRUb3VjaFgiLCJ1cGRhdGVEYXRhIiwic3RvcEFuaW1hdGlvbiIsImdldEN1cnJlbnREYXRhSW5kZXgiLCJ0b3VjaGVzIiwiY2hhbmdlZFRvdWNoZXMiLCJfdG91Y2hlcyQiLCJzaG93VG9vbFRpcCIsIl9nZXRUb29sVGlwRGF0YSIsInNjcm9sbFN0YXJ0Iiwic2Nyb2xsIiwiX2Rpc3RhbmNlIiwic2Nyb2xsRW5kIiwiX3Njcm9sbE9wdGlvbiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUFTQTs7QUFFQSxJQUFJQSxTQUFTO0FBQ1RDLGdCQUFZLEVBREg7QUFFVEMsZ0JBQVksQ0FGSDtBQUdUQyxpQkFBYSxFQUhKO0FBSVRDLHFCQUFpQixFQUpSO0FBS1RDLGtCQUFjLEVBTEw7QUFNVEMscUJBQWlCLEVBTlI7QUFPVEMsYUFBUyxFQVBBO0FBUVRDLG1CQUFlLENBUk47QUFTVEMsY0FBVSxFQVREO0FBVVRDLG9CQUFnQixDQUFDLFNBQUQsRUFBWSxRQUFaLEVBQXNCLFVBQXRCLEVBQWtDLE1BQWxDLENBVlA7QUFXVEMsWUFBUSxDQUFDLFNBQUQsRUFBWSxTQUFaLEVBQXVCLFNBQXZCLEVBQWtDLFNBQWxDLEVBQTZDLFNBQTdDLEVBQXdELFNBQXhELENBWEM7QUFZVEMseUJBQXFCLEVBWlo7QUFhVEMseUJBQXFCLEVBYlo7QUFjVEMsc0JBQWtCLENBZFQ7QUFlVEMsZ0JBQVksU0FmSDtBQWdCVEMsbUJBQWUsRUFoQk47QUFpQlRDLG1CQUFlLFNBakJOO0FBa0JUQyxzQkFBa0IsRUFsQlQ7QUFtQlRDLG9CQUFnQixDQW5CUDtBQW9CVEMsdUJBQW1CLFNBcEJWO0FBcUJUQyxvQkFBZ0IsR0FyQlA7QUFzQlRDLHVCQUFtQixFQXRCVjtBQXVCVEMsb0JBQWdCLENBdkJQO0FBd0JUQywwQkFBc0I7QUF4QmIsQ0FBYjs7QUEyQkE7QUFDQTtBQUNBLFNBQVNDLE1BQVQsQ0FBZ0JDLE1BQWhCLEVBQXdCQyxPQUF4QixFQUFpQztBQUM3QixRQUFJRCxVQUFVLElBQWQsRUFBb0I7QUFDaEI7QUFDQSxjQUFNLElBQUlFLFNBQUosQ0FBYyw0Q0FBZCxDQUFOO0FBQ0g7O0FBRUQsUUFBSUMsS0FBS0MsT0FBT0osTUFBUCxDQUFUOztBQUVBLFNB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dFcsU0FBakQsRUFBNEQsS0FBS3hFLE1BQWpFLEVBQXlFLEtBQUt5RSxJQUE5RSxDQUFwQjs7QUFFQSxhQUFLd1YsWUFBTCxDQUFrQjFWLFFBQWxCLEdBQTZCdVcsWUFBWS9WLGdCQUFnQm1WLGFBQXpEO0FBQ0EsWUFBSXpWLE9BQU9oRCxPQUFPLEVBQVAsRUFBVyxLQUFLZ0QsSUFBaEIsRUFBc0I7QUFDN0JrTyw4QkFBa0J1SCxnQkFBZ0JZLFNBREw7QUFFN0J0Qyx1QkFBVztBQUZrQixTQUF0QixDQUFYOztBQUtBSCxtQkFBVy9WLElBQVgsQ0FBZ0IsSUFBaEIsRUFBc0JtQyxLQUFLVCxJQUEzQixFQUFpQ1MsSUFBakMsRUFBdUMsS0FBS3pFLE1BQTVDLEVBQW9ELEtBQUt5TyxPQUF6RDtBQUNIO0FBQ0osQ0FoQkQ7O0FBa0JBbUwsT0FBT3hYLFNBQVAsQ0FBaUIyWSxTQUFqQixHQUE2QixVQUFVdEIsQ0FBVixFQUFhO0FBQ3RDLFFBQUksS0FBS2hWLElBQUwsQ0FBVTRJLFlBQVYsS0FBMkIsSUFBL0IsRUFBcUM7QUFDakMsWUFBSTJOLGdCQUFnQixLQUFLZixZQUF6QjtBQUFBLFlBQ0lDLGdCQUFnQmMsY0FBY2QsYUFEbEM7QUFBQSxZQUVJM1YsV0FBV3lXLGNBQWN6VyxRQUY3Qjs7QUFJQSxhQUFLMFYsWUFBTCxDQUFrQkMsYUFBbEIsR0FBa0NBLGdCQUFnQjNWLFFBQWxEO0FBQ0EsYUFBSzBWLFlBQUwsQ0FBa0IxVixRQUFsQixHQUE2QixDQUE3QjtBQUNIO0FBQ0osQ0FURDs7QUFXQTBXLE9BQU9DLE9BQVAsR0FBaUJ0QixNQUFqQiIsImZpbGUiOiJ3eGNoYXJ0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogY2hhcnRzIGZvciBXZUNoYXQgc21hbGwgYXBwIHYxLjBcclxuICpcclxuICogaHR0cHM6Ly9naXRodWIuY29tL3hpYW9saW4zMzAzL3d4LWNoYXJ0c1xyXG4gKiAyMDE2LTExLTI4XHJcbiAqXHJcbiAqIERlc2lnbmVkIGFuZCBidWlsdCB3aXRoIGFsbCB0aGUgbG92ZSBvZiBXZWJcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG52YXIgY29uZmlnID0ge1xyXG4gICAgeUF4aXNXaWR0aDogMTUsXHJcbiAgICB5QXhpc1NwbGl0OiA1LFxyXG4gICAgeEF4aXNIZWlnaHQ6IDE1LFxyXG4gICAgeEF4aXNMaW5lSGVpZ2h0OiAxNSxcclxuICAgIGxlZ2VuZEhlaWdodDogMTUsXHJcbiAgICB5QXhpc1RpdGxlV2lkdGg6IDE1LFxyXG4gICAgcGFkZGluZzogMTIsXHJcbiAgICBjb2x1bWVQYWRkaW5nOiAzLFxyXG4gICAgZm9udFNpemU6IDEwLFxyXG4gICAgZGF0YVBvaW50U2hhcGU6IFsnZGlhbW9uZCcsICdjaXJjbGUnLCAndHJpYW5nbGUnLCAncmVjdCddLFxyXG4gICAgY29sb3JzOiBbJyM3Y2I1ZWMnLCAnI2Y3YTM1YycsICcjNDM0MzQ4JywgJyM5MGVkN2QnLCAnI2YxNWM4MCcsICcjODA4NWU5J10sXHJcbiAgICBwaWVDaGFydExpbmVQYWRkaW5nOiAyNSxcclxuICAgIHBpZUNoYXJ0VGV4dFBhZGRpbmc6IDE1LFxyXG4gICAgeEF4aXNUZXh0UGFkZGluZzogMyxcclxuICAgIHRpdGxlQ29sb3I6ICcjMzMzMzMzJyxcclxuICAgIHRpdGxlRm9udFNpemU6IDIwLFxyXG4gICAgc3VidGl0bGVDb2xvcjogJyM5OTk5OTknLFxyXG4gICAgc3VidGl0bGVGb250U2l6ZTogMTUsXHJcbiAgICB0b29sVGlwUGFkZGluZzogMyxcclxuICAgIHRvb2xUaXBCYWNrZ3JvdW5kOiAnIzAwMDAwMCcsXHJcbiAgICB0b29sVGlwT3BhY2l0eTogMC43LFxyXG4gICAgdG9vbFRpcExpbmVIZWlnaHQ6IDE0LFxyXG4gICAgcmFkYXJHcmlkQ291bnQ6IDMsXHJcbiAgICByYWRhckxhYmVsVGV4dE1hcmdpbjogMTVcclxufTtcclxuXHJcbi8vIE9iamVjdC5hc3NpZ24gcG9seWZpbGxcclxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2Fzc2lnblxyXG5mdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCB2YXJBcmdzKSB7XHJcbiAgICBpZiAodGFyZ2V0ID09IG51bGwpIHtcclxuICAgICAgICAvLyBUeXBlRXJyb3IgaWYgdW5kZWZpbmVkIG9yIG51bGxcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29udmVydCB1bmRlZmluZWQgb3IgbnVsbCB0byBvYmplY3QnKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdG8gPSBPYmplY3QodGFyZ2V0KTtcclxuXHJcbiAgICBmb3IgKHZhciBpbmRleCA9IDE7IGluZGV4IDwgYXJndW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgIHZhciBuZXh0U291cmNlID0gYXJndW1lbnRzW2luZGV4XTtcclxuXHJcbiAgICAgICAgaWYgKG5leHRTb3VyY2UgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAvLyBTa2lwIG92ZXIgaWYgdW5kZWZpbmVkIG9yIG51bGxcclxuICAgICAgICAgICAgZm9yICh2YXIgbmV4dEtleSBpbiBuZXh0U291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBBdm9pZCBidWdzIHdoZW4gaGFzT3duUHJvcGVydHkgaXMgc2hhZG93ZWRcclxuICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobmV4dFNvdXJjZSwgbmV4dEtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0b1tuZXh0S2V5XSA9IG5leHRTb3VyY2VbbmV4dEtleV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG87XHJcbn1cclxuXHJcbnZhciB1dGlsID0ge1xyXG4gICAgdG9GaXhlZDogZnVuY3Rpb24gdG9GaXhlZChudW0sIGxpbWl0KSB7XHJcbiAgICAgICAgbGltaXQgPSBsaW1pdCB8fCAyO1xyXG4gICAgICAgIGlmICh0aGlzLmlzRmxvYXQobnVtKSkge1xyXG4gICAgICAgICAgICBudW0gPSBudW0udG9GaXhlZChsaW1pdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudW07XHJcbiAgICB9LFxyXG4gICAgaXNGbG9hdDogZnVuY3Rpb24gaXNGbG9hdChudW0pIHtcclxuICAgICAgICByZXR1cm4gbnVtICUgMSAhPT0gMDtcclxuICAgIH0sXHJcbiAgICBhcHByb3hpbWF0ZWx5RXF1YWw6IGZ1bmN0aW9uIGFwcHJveGltYXRlbHlFcXVhbChudW0xLCBudW0yKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKG51bTEgLSBudW0yKSA8IDFlLTEwO1xyXG4gICAgfSxcclxuICAgIGlzU2FtZVNpZ246IGZ1bmN0aW9uIGlzU2FtZVNpZ24obnVtMSwgbnVtMikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFicyhudW0xKSA9PT0gbnVtMSAmJiBNYXRoLmFicyhudW0yKSA9PT0gbnVtMiB8fCBNYXRoLmFicyhudW0xKSAhPT0gbnVtMSAmJiBNYXRoLmFicyhudW0yKSAhPT0gbnVtMjtcclxuICAgIH0sXHJcbiAgICBpc1NhbWVYQ29vcmRpbmF0ZUFyZWE6IGZ1bmN0aW9uIGlzU2FtZVhDb29yZGluYXRlQXJlYShwMSwgcDIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pc1NhbWVTaWduKHAxLngsIHAyLngpO1xyXG4gICAgfSxcclxuICAgIGlzQ29sbGlzaW9uOiBmdW5jdGlvbiBpc0NvbGxpc2lvbihvYmoxLCBvYmoyKSB7XHJcbiAgICAgICAgb2JqMS5lbmQgPSB7fTtcclxuICAgICAgICBvYmoxLmVuZC54ID0gb2JqMS5zdGFydC54ICsgb2JqMS53aWR0aDtcclxuICAgICAgICBvYmoxLmVuZC55ID0gb2JqMS5zdGFydC55IC0gb2JqMS5oZWlnaHQ7XHJcbiAgICAgICAgb2JqMi5lbmQgPSB7fTtcclxuICAgICAgICBvYmoyLmVuZC54ID0gb2JqMi5zdGFydC54ICsgb2JqMi53aWR0aDtcclxuICAgICAgICBvYmoyLmVuZC55ID0gb2JqMi5zdGFydC55IC0gb2JqMi5oZWlnaHQ7XHJcbiAgICAgICAgdmFyIGZsYWcgPSBvYmoyLnN0YXJ0LnggPiBvYmoxLmVuZC54IHx8IG9iajIuZW5kLnggPCBvYmoxLnN0YXJ0LnggfHwgb2JqMi5lbmQueSA+IG9iajEuc3RhcnQueSB8fCBvYmoyLnN0YXJ0LnkgPCBvYmoxLmVuZC55O1xyXG5cclxuICAgICAgICByZXR1cm4gIWZsYWc7XHJcbiAgICB9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBmaW5kUmFuZ2UobnVtLCB0eXBlLCBsaW1pdCkge1xyXG4gICAgaWYgKGlzTmFOKG51bSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1t3eENoYXJ0c10gdW52YWxpZCBzZXJpZXMgZGF0YSEnKTtcclxuICAgIH1cclxuICAgIGxpbWl0ID0gbGltaXQgfHwgMTA7XHJcbiAgICB0eXBlID0gdHlwZSB8fCAndXBwZXInO1xyXG4gICAgdmFyIG11bHRpcGxlID0gMTtcclxuICAgIHdoaWxlIChsaW1pdCA8IDEpIHtcclxuICAgICAgICBsaW1pdCAqPSAxMDtcclxuICAgICAgICBtdWx0aXBsZSAqPSAxMDtcclxuICAgIH1cclxuICAgIGlmICh0eXBlID09PSAndXBwZXInKSB7XHJcbiAgICAgICAgbnVtID0gTWF0aC5jZWlsKG51bSAqIG11bHRpcGxlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbnVtID0gTWF0aC5mbG9vcihudW0gKiBtdWx0aXBsZSk7XHJcbiAgICB9XHJcbiAgICB3aGlsZSAobnVtICUgbGltaXQgIT09IDApIHtcclxuICAgICAgICBpZiAodHlwZSA9PT0gJ3VwcGVyJykge1xyXG4gICAgICAgICAgICBudW0rKztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBudW0tLTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bSAvIG11bHRpcGxlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjYWxWYWxpZERpc3RhbmNlKGRpc3RhbmNlLCBjaGFydERhdGEsIGNvbmZpZywgb3B0cykge1xyXG5cclxuICAgIHZhciBkYXRhQ2hhcnRBcmVhV2lkdGggPSBvcHRzLndpZHRoIC0gY29uZmlnLnBhZGRpbmcgLSBjaGFydERhdGEueEF4aXNQb2ludHNbMF07XHJcbiAgICB2YXIgZGF0YUNoYXJ0V2lkdGggPSBjaGFydERhdGEuZWFjaFNwYWNpbmcgKiBvcHRzLmNhdGVnb3JpZXMubGVuZ3RoO1xyXG4gICAgdmFyIHZhbGlkRGlzdGFuY2UgPSBkaXN0YW5jZTtcclxuICAgIGlmIChkaXN0YW5jZSA+PSAwKSB7XHJcbiAgICAgICAgdmFsaWREaXN0YW5jZSA9IDA7XHJcbiAgICB9IGVsc2UgaWYgKE1hdGguYWJzKGRpc3RhbmNlKSA+PSBkYXRhQ2hhcnRXaWR0aCAtIGRhdGFDaGFydEFyZWFXaWR0aCkge1xyXG4gICAgICAgIHZhbGlkRGlzdGFuY2UgPSBkYXRhQ2hhcnRBcmVhV2lkdGggLSBkYXRhQ2hhcnRXaWR0aDtcclxuICAgIH1cclxuICAgIHJldHVybiB2YWxpZERpc3RhbmNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0luQW5nbGVSYW5nZShhbmdsZSwgc3RhcnRBbmdsZSwgZW5kQW5nbGUpIHtcclxuICAgIGZ1bmN0aW9uIGFkanVzdChhbmdsZSkge1xyXG4gICAgICAgIHdoaWxlIChhbmdsZSA8IDApIHtcclxuICAgICAgICAgICAgYW5nbGUgKz0gMiAqIE1hdGguUEk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdoaWxlIChhbmdsZSA+IDIgKiBNYXRoLlBJKSB7XHJcbiAgICAgICAgICAgIGFuZ2xlIC09IDIgKiBNYXRoLlBJO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFuZ2xlO1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ2xlID0gYWRqdXN0KGFuZ2xlKTtcclxuICAgIHN0YXJ0QW5nbGUgPSBhZGp1c3Qoc3RhcnRBbmdsZSk7XHJcbiAgICBlbmRBbmdsZSA9IGFkanVzdChlbmRBbmdsZSk7XHJcbiAgICBpZiAoc3RhcnRBbmdsZSA+IGVuZEFuZ2xlKSB7XHJcbiAgICAgICAgZW5kQW5nbGUgKz0gMiAqIE1hdGguUEk7XHJcbiAgICAgICAgaWYgKGFuZ2xlIDwgc3RhcnRBbmdsZSkge1xyXG4gICAgICAgICAgICBhbmdsZSArPSAyICogTWF0aC5QSTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGFuZ2xlID49IHN0YXJ0QW5nbGUgJiYgYW5nbGUgPD0gZW5kQW5nbGU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNhbFJvdGF0ZVRyYW5zbGF0ZSh4LCB5LCBoKSB7XHJcbiAgICB2YXIgeHYgPSB4O1xyXG4gICAgdmFyIHl2ID0gaCAtIHk7XHJcblxyXG4gICAgdmFyIHRyYW5zWCA9IHh2ICsgKGggLSB5diAtIHh2KSAvIE1hdGguc3FydCgyKTtcclxuICAgIHRyYW5zWCAqPSAtMTtcclxuXHJcbiAgICB2YXIgdHJhbnNZID0gKGggLSB5dikgKiAoTWF0aC5zcXJ0KDIpIC0gMSkgLSAoaCAtIHl2IC0geHYpIC8gTWF0aC5zcXJ0KDIpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHJhbnNYOiB0cmFuc1gsXHJcbiAgICAgICAgdHJhbnNZOiB0cmFuc1lcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUN1cnZlQ29udHJvbFBvaW50cyhwb2ludHMsIGkpIHtcclxuXHJcbiAgICBmdW5jdGlvbiBpc05vdE1pZGRsZVBvaW50KHBvaW50cywgaSkge1xyXG4gICAgICAgIGlmIChwb2ludHNbaSAtIDFdICYmIHBvaW50c1tpICsgMV0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBvaW50c1tpXS55ID49IE1hdGgubWF4KHBvaW50c1tpIC0gMV0ueSwgcG9pbnRzW2kgKyAxXS55KSB8fCBwb2ludHNbaV0ueSA8PSBNYXRoLm1pbihwb2ludHNbaSAtIDFdLnksIHBvaW50c1tpICsgMV0ueSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgYSA9IDAuMjtcclxuICAgIHZhciBiID0gMC4yO1xyXG4gICAgdmFyIHBBeCA9IG51bGw7XHJcbiAgICB2YXIgcEF5ID0gbnVsbDtcclxuICAgIHZhciBwQnggPSBudWxsO1xyXG4gICAgdmFyIHBCeSA9IG51bGw7XHJcbiAgICBpZiAoaSA8IDEpIHtcclxuICAgICAgICBwQXggPSBwb2ludHNbMF0ueCArIChwb2ludHNbMV0ueCAtIHBvaW50c1swXS54KSAqIGE7XHJcbiAgICAgICAgcEF5ID0gcG9pbnRzWzBdLnkgKyAocG9pbnRzWzFdLnkgLSBwb2ludHNbMF0ueSkgKiBhO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBwQXggPSBwb2ludHNbaV0ueCArIChwb2ludHNbaSArIDFdLnggLSBwb2ludHNbaSAtIDFdLngpICogYTtcclxuICAgICAgICBwQXkgPSBwb2ludHNbaV0ueSArIChwb2ludHNbaSArIDFdLnkgLSBwb2ludHNbaSAtIDFdLnkpICogYTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaSA+IHBvaW50cy5sZW5ndGggLSAzKSB7XHJcbiAgICAgICAgdmFyIGxhc3QgPSBwb2ludHMubGVuZ3RoIC0gMTtcclxuICAgICAgICBwQnggPSBwb2ludHNbbGFzdF0ueCAtIChwb2ludHNbbGFzdF0ueCAtIHBvaW50c1tsYXN0IC0gMV0ueCkgKiBiO1xyXG4gICAgICAgIHBCeSA9IHBvaW50c1tsYXN0XS55IC0gKHBvaW50c1tsYXN0XS55IC0gcG9pbnRzW2xhc3QgLSAxXS55KSAqIGI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHBCeCA9IHBvaW50c1tpICsgMV0ueCAtIChwb2ludHNbaSArIDJdLnggLSBwb2ludHNbaV0ueCkgKiBiO1xyXG4gICAgICAgIHBCeSA9IHBvaW50c1tpICsgMV0ueSAtIChwb2ludHNbaSArIDJdLnkgLSBwb2ludHNbaV0ueSkgKiBiO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGZpeCBpc3N1ZSBodHRwczovL2dpdGh1Yi5jb20veGlhb2xpbjMzMDMvd3gtY2hhcnRzL2lzc3Vlcy83OVxyXG4gICAgaWYgKGlzTm90TWlkZGxlUG9pbnQocG9pbnRzLCBpICsgMSkpIHtcclxuICAgICAgICBwQnkgPSBwb2ludHNbaSArIDFdLnk7XHJcbiAgICB9XHJcbiAgICBpZiAoaXNOb3RNaWRkbGVQb2ludChwb2ludHMsIGkpKSB7XHJcbiAgICAgICAgcEF5ID0gcG9pbnRzW2ldLnk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjdHJBOiB7IHg6IHBBeCwgeTogcEF5IH0sXHJcbiAgICAgICAgY3RyQjogeyB4OiBwQngsIHk6IHBCeSB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjb252ZXJ0Q29vcmRpbmF0ZU9yaWdpbih4LCB5LCBjZW50ZXIpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgeDogY2VudGVyLnggKyB4LFxyXG4gICAgICAgIHk6IGNlbnRlci55IC0geVxyXG4gICAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gYXZvaWRDb2xsaXNpb24ob2JqLCB0YXJnZXQpIHtcclxuICAgIGlmICh0YXJnZXQpIHtcclxuICAgICAgICAvLyBpcyBjb2xsaXNpb24gdGVzdFxyXG4gICAgICAgIHdoaWxlICh1dGlsLmlzQ29sbGlzaW9uKG9iaiwgdGFyZ2V0KSkge1xyXG4gICAgICAgICAgICBpZiAob2JqLnN0YXJ0LnggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBvYmouc3RhcnQueS0tO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9iai5zdGFydC54IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgb2JqLnN0YXJ0LnkrKztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChvYmouc3RhcnQueSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmouc3RhcnQueSsrO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmouc3RhcnQueS0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9iajtcclxufVxyXG5cclxuZnVuY3Rpb24gZmlsbFNlcmllc0NvbG9yKHNlcmllcywgY29uZmlnKSB7XHJcbiAgICB2YXIgaW5kZXggPSAwO1xyXG4gICAgcmV0dXJuIHNlcmllcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICBpZiAoIWl0ZW0uY29sb3IpIHtcclxuICAgICAgICAgICAgaXRlbS5jb2xvciA9IGNvbmZpZy5jb2xvcnNbaW5kZXhdO1xyXG4gICAgICAgICAgICBpbmRleCA9IChpbmRleCArIDEpICUgY29uZmlnLmNvbG9ycy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERhdGFSYW5nZShtaW5EYXRhLCBtYXhEYXRhKSB7XHJcbiAgICB2YXIgbGltaXQgPSAwO1xyXG4gICAgdmFyIHJhbmdlID0gbWF4RGF0YSAtIG1pbkRhdGE7XHJcbiAgICBpZiAocmFuZ2UgPj0gMTAwMDApIHtcclxuICAgICAgICBsaW1pdCA9IDEwMDA7XHJcbiAgICB9IGVsc2UgaWYgKHJhbmdlID49IDEwMDApIHtcclxuICAgICAgICBsaW1pdCA9IDEwMDtcclxuICAgIH0gZWxzZSBpZiAocmFuZ2UgPj0gMTAwKSB7XHJcbiAgICAgICAgbGltaXQgPSAxMDtcclxuICAgIH0gZWxzZSBpZiAocmFuZ2UgPj0gMTApIHtcclxuICAgICAgICBsaW1pdCA9IDU7XHJcbiAgICB9IGVsc2UgaWYgKHJhbmdlID49IDEpIHtcclxuICAgICAgICBsaW1pdCA9IDE7XHJcbiAgICB9IGVsc2UgaWYgKHJhbmdlID49IDAuMSkge1xyXG4gICAgICAgIGxpbWl0ID0gMC4xO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBsaW1pdCA9IDAuMDE7XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG1pblJhbmdlOiBmaW5kUmFuZ2UobWluRGF0YSwgJ2xvd2VyJywgbGltaXQpLFxyXG4gICAgICAgIG1heFJhbmdlOiBmaW5kUmFuZ2UobWF4RGF0YSwgJ3VwcGVyJywgbGltaXQpXHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBtZWFzdXJlVGV4dCh0ZXh0KSB7XHJcbiAgICB2YXIgZm9udFNpemUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDEwO1xyXG5cclxuICAgIC8vIHd4IGNhbnZhcyDmnKrlrp7njrBtZWFzdXJlVGV4dOaWueazlSwg5q2k5aSE6Ieq6KGM5a6e546wXHJcbiAgICB0ZXh0ID0gU3RyaW5nKHRleHQpO1xyXG4gICAgdmFyIHRleHQgPSB0ZXh0LnNwbGl0KCcnKTtcclxuICAgIHZhciB3aWR0aCA9IDA7XHJcbiAgICB0ZXh0LmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICBpZiAoL1thLXpBLVpdLy50ZXN0KGl0ZW0pKSB7XHJcbiAgICAgICAgICAgIHdpZHRoICs9IDc7XHJcbiAgICAgICAgfSBlbHNlIGlmICgvWzAtOV0vLnRlc3QoaXRlbSkpIHtcclxuICAgICAgICAgICAgd2lkdGggKz0gNS41O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoL1xcLi8udGVzdChpdGVtKSkge1xyXG4gICAgICAgICAgICB3aWR0aCArPSAyLjc7XHJcbiAgICAgICAgfSBlbHNlIGlmICgvLS8udGVzdChpdGVtKSkge1xyXG4gICAgICAgICAgICB3aWR0aCArPSAzLjI1O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoL1tcXHU0ZTAwLVxcdTlmYTVdLy50ZXN0KGl0ZW0pKSB7XHJcbiAgICAgICAgICAgIHdpZHRoICs9IDEwO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoL1xcKHxcXCkvLnRlc3QoaXRlbSkpIHtcclxuICAgICAgICAgICAgd2lkdGggKz0gMy43MztcclxuICAgICAgICB9IGVsc2UgaWYgKC9cXHMvLnRlc3QoaXRlbSkpIHtcclxuICAgICAgICAgICAgd2lkdGggKz0gMi41O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoLyUvLnRlc3QoaXRlbSkpIHtcclxuICAgICAgICAgICAgd2lkdGggKz0gODtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB3aWR0aCArPSAxMDtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiB3aWR0aCAqIGZvbnRTaXplIC8gMTA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRhdGFDb21iaW5lKHNlcmllcykge1xyXG4gICAgcmV0dXJuIHNlcmllcy5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICByZXR1cm4gKGEuZGF0YSA/IGEuZGF0YSA6IGEpLmNvbmNhdChiLmRhdGEpO1xyXG4gICAgfSwgW10pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTZXJpZXNEYXRhSXRlbShzZXJpZXMsIGluZGV4KSB7XHJcbiAgICB2YXIgZGF0YSA9IFtdO1xyXG4gICAgc2VyaWVzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICBpZiAoaXRlbS5kYXRhW2luZGV4XSAhPT0gbnVsbCAmJiB0eXBlb2YgaXRlbS5kYXRhW2luZGV4XSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgdmFyIHNlcmllc0l0ZW0gPSB7fTtcclxuICAgICAgICAgICAgc2VyaWVzSXRlbS5jb2xvciA9IGl0ZW0uY29sb3I7XHJcbiAgICAgICAgICAgIHNlcmllc0l0ZW0ubmFtZSA9IGl0ZW0ubmFtZTtcclxuICAgICAgICAgICAgc2VyaWVzSXRlbS5kYXRhID0gaXRlbS5mb3JtYXQgPyBpdGVtLmZvcm1hdChpdGVtLmRhdGFbaW5kZXhdKSA6IGl0ZW0uZGF0YVtpbmRleF07XHJcbiAgICAgICAgICAgIGRhdGEucHVzaChzZXJpZXNJdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TWF4VGV4dExpc3RMZW5ndGgobGlzdCkge1xyXG4gICAgdmFyIGxlbmd0aExpc3QgPSBsaXN0Lm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHJldHVybiBtZWFzdXJlVGV4dChpdGVtKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIE1hdGgubWF4LmFwcGx5KG51bGwsIGxlbmd0aExpc3QpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRSYWRhckNvb3JkaW5hdGVTZXJpZXMobGVuZ3RoKSB7XHJcbiAgICB2YXIgZWFjaEFuZ2xlID0gMiAqIE1hdGguUEkgLyBsZW5ndGg7XHJcbiAgICB2YXIgQ29vcmRpbmF0ZVNlcmllcyA9IFtdO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgIENvb3JkaW5hdGVTZXJpZXMucHVzaChlYWNoQW5nbGUgKiBpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gQ29vcmRpbmF0ZVNlcmllcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICByZXR1cm4gLTEgKiBpdGVtICsgTWF0aC5QSSAvIDI7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VG9vbFRpcERhdGEoc2VyaWVzRGF0YSwgY2FsUG9pbnRzLCBpbmRleCwgY2F0ZWdvcmllcykge1xyXG4gICAgdmFyIG9wdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiA0ICYmIGFyZ3VtZW50c1s0XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzRdIDoge307XHJcblxyXG4gICAgdmFyIHRleHRMaXN0ID0gc2VyaWVzRGF0YS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0ZXh0OiBvcHRpb24uZm9ybWF0ID8gb3B0aW9uLmZvcm1hdChpdGVtLCBjYXRlZ29yaWVzW2luZGV4XSkgOiBpdGVtLm5hbWUgKyAnOiAnICsgaXRlbS5kYXRhLFxyXG4gICAgICAgICAgICBjb2xvcjogaXRlbS5jb2xvclxyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxuICAgIHZhciB2YWxpZENhbFBvaW50cyA9IFtdO1xyXG4gICAgdmFyIG9mZnNldCA9IHtcclxuICAgICAgICB4OiAwLFxyXG4gICAgICAgIHk6IDBcclxuICAgIH07XHJcbiAgICBjYWxQb2ludHMuZm9yRWFjaChmdW5jdGlvbiAocG9pbnRzKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBwb2ludHNbaW5kZXhdICE9PSAndW5kZWZpbmVkJyAmJiBwb2ludHNbaW5kZXhdICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHZhbGlkQ2FsUG9pbnRzLnB1c2gocG9pbnRzW2luZGV4XSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB2YWxpZENhbFBvaW50cy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgb2Zmc2V0LnggPSBNYXRoLnJvdW5kKGl0ZW0ueCk7XHJcbiAgICAgICAgb2Zmc2V0LnkgKz0gaXRlbS55O1xyXG4gICAgfSk7XHJcblxyXG4gICAgb2Zmc2V0LnkgLz0gdmFsaWRDYWxQb2ludHMubGVuZ3RoO1xyXG4gICAgcmV0dXJuIHsgdGV4dExpc3Q6IHRleHRMaXN0LCBvZmZzZXQ6IG9mZnNldCB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5kQ3VycmVudEluZGV4KGN1cnJlbnRQb2ludHMsIHhBeGlzUG9pbnRzLCBvcHRzLCBjb25maWcpIHtcclxuICAgIHZhciBvZmZzZXQgPSBhcmd1bWVudHMubGVuZ3RoID4gNCAmJiBhcmd1bWVudHNbNF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s0XSA6IDA7XHJcblxyXG4gICAgdmFyIGN1cnJlbnRJbmRleCA9IC0xO1xyXG4gICAgaWYgKGlzSW5FeGFjdENoYXJ0QXJlYShjdXJyZW50UG9pbnRzLCBvcHRzLCBjb25maWcpKSB7XHJcbiAgICAgICAgeEF4aXNQb2ludHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRQb2ludHMueCArIG9mZnNldCA+IGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGN1cnJlbnRJbmRleDtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNJbkV4YWN0Q2hhcnRBcmVhKGN1cnJlbnRQb2ludHMsIG9wdHMsIGNvbmZpZykge1xyXG4gICAgcmV0dXJuIGN1cnJlbnRQb2ludHMueCA8IG9wdHMud2lkdGggLSBjb25maWcucGFkZGluZyAmJiBjdXJyZW50UG9pbnRzLnggPiBjb25maWcucGFkZGluZyArIGNvbmZpZy55QXhpc1dpZHRoICsgY29uZmlnLnlBeGlzVGl0bGVXaWR0aCAmJiBjdXJyZW50UG9pbnRzLnkgPiBjb25maWcucGFkZGluZyAmJiBjdXJyZW50UG9pbnRzLnkgPCBvcHRzLmhlaWdodCAtIGNvbmZpZy5sZWdlbmRIZWlnaHQgLSBjb25maWcueEF4aXNIZWlnaHQgLSBjb25maWcucGFkZGluZztcclxufVxyXG5cclxuZnVuY3Rpb24gZmluZFJhZGFyQ2hhcnRDdXJyZW50SW5kZXgoY3VycmVudFBvaW50cywgcmFkYXJEYXRhLCBjb3VudCkge1xyXG4gICAgdmFyIGVhY2hBbmdsZUFyZWEgPSAyICogTWF0aC5QSSAvIGNvdW50O1xyXG4gICAgdmFyIGN1cnJlbnRJbmRleCA9IC0xO1xyXG4gICAgaWYgKGlzSW5FeGFjdFBpZUNoYXJ0QXJlYShjdXJyZW50UG9pbnRzLCByYWRhckRhdGEuY2VudGVyLCByYWRhckRhdGEucmFkaXVzKSkge1xyXG4gICAgICAgIHZhciBmaXhBbmdsZSA9IGZ1bmN0aW9uIGZpeEFuZ2xlKGFuZ2xlKSB7XHJcbiAgICAgICAgICAgIGlmIChhbmdsZSA8IDApIHtcclxuICAgICAgICAgICAgICAgIGFuZ2xlICs9IDIgKiBNYXRoLlBJO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChhbmdsZSA+IDIgKiBNYXRoLlBJKSB7XHJcbiAgICAgICAgICAgICAgICBhbmdsZSAtPSAyICogTWF0aC5QSTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYW5nbGU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGFuZ2xlID0gTWF0aC5hdGFuMihyYWRhckRhdGEuY2VudGVyLnkgLSBjdXJyZW50UG9pbnRzLnksIGN1cnJlbnRQb2ludHMueCAtIHJhZGFyRGF0YS5jZW50ZXIueCk7XHJcbiAgICAgICAgYW5nbGUgPSAtMSAqIGFuZ2xlO1xyXG4gICAgICAgIGlmIChhbmdsZSA8IDApIHtcclxuICAgICAgICAgICAgYW5nbGUgKz0gMiAqIE1hdGguUEk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgYW5nbGVMaXN0ID0gcmFkYXJEYXRhLmFuZ2xlTGlzdC5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgaXRlbSA9IGZpeEFuZ2xlKC0xICogaXRlbSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYW5nbGVMaXN0LmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgICAgIHZhciByYW5nZVN0YXJ0ID0gZml4QW5nbGUoaXRlbSAtIGVhY2hBbmdsZUFyZWEgLyAyKTtcclxuICAgICAgICAgICAgdmFyIHJhbmdlRW5kID0gZml4QW5nbGUoaXRlbSArIGVhY2hBbmdsZUFyZWEgLyAyKTtcclxuICAgICAgICAgICAgaWYgKHJhbmdlRW5kIDwgcmFuZ2VTdGFydCkge1xyXG4gICAgICAgICAgICAgICAgcmFuZ2VFbmQgKz0gMiAqIE1hdGguUEk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGFuZ2xlID49IHJhbmdlU3RhcnQgJiYgYW5nbGUgPD0gcmFuZ2VFbmQgfHwgYW5nbGUgKyAyICogTWF0aC5QSSA+PSByYW5nZVN0YXJ0ICYmIGFuZ2xlICsgMiAqIE1hdGguUEkgPD0gcmFuZ2VFbmQpIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGN1cnJlbnRJbmRleDtcclxufVxyXG5cclxuZnVuY3Rpb24gZmluZFBpZUNoYXJ0Q3VycmVudEluZGV4KGN1cnJlbnRQb2ludHMsIHBpZURhdGEpIHtcclxuICAgIHZhciBjdXJyZW50SW5kZXggPSAtMTtcclxuICAgIGlmIChpc0luRXhhY3RQaWVDaGFydEFyZWEoY3VycmVudFBvaW50cywgcGllRGF0YS5jZW50ZXIsIHBpZURhdGEucmFkaXVzKSkge1xyXG4gICAgICAgIHZhciBhbmdsZSA9IE1hdGguYXRhbjIocGllRGF0YS5jZW50ZXIueSAtIGN1cnJlbnRQb2ludHMueSwgY3VycmVudFBvaW50cy54IC0gcGllRGF0YS5jZW50ZXIueCk7XHJcbiAgICAgICAgYW5nbGUgPSAtYW5nbGU7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHBpZURhdGEuc2VyaWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gcGllRGF0YS5zZXJpZXNbaV07XHJcbiAgICAgICAgICAgIGlmIChpc0luQW5nbGVSYW5nZShhbmdsZSwgaXRlbS5fc3RhcnRfLCBpdGVtLl9zdGFydF8gKyBpdGVtLl9wcm9wb3J0aW9uXyAqIDIgKiBNYXRoLlBJKSkge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjdXJyZW50SW5kZXg7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzSW5FeGFjdFBpZUNoYXJ0QXJlYShjdXJyZW50UG9pbnRzLCBjZW50ZXIsIHJhZGl1cykge1xyXG4gICAgcmV0dXJuIE1hdGgucG93KGN1cnJlbnRQb2ludHMueCAtIGNlbnRlci54LCAyKSArIE1hdGgucG93KGN1cnJlbnRQb2ludHMueSAtIGNlbnRlci55LCAyKSA8PSBNYXRoLnBvdyhyYWRpdXMsIDIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzcGxpdFBvaW50cyhwb2ludHMpIHtcclxuICAgIHZhciBuZXdQb2ludHMgPSBbXTtcclxuICAgIHZhciBpdGVtcyA9IFtdO1xyXG4gICAgcG9pbnRzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgaWYgKGl0ZW0gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgaXRlbXMucHVzaChpdGVtKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoaXRlbXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb2ludHMucHVzaChpdGVtcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaXRlbXMgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGlmIChpdGVtcy5sZW5ndGgpIHtcclxuICAgICAgICBuZXdQb2ludHMucHVzaChpdGVtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ld1BvaW50cztcclxufVxyXG5cclxuZnVuY3Rpb24gY2FsTGVnZW5kRGF0YShzZXJpZXMsIG9wdHMsIGNvbmZpZykge1xyXG4gICAgaWYgKG9wdHMubGVnZW5kID09PSBmYWxzZSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGxlZ2VuZExpc3Q6IFtdLFxyXG4gICAgICAgICAgICBsZWdlbmRIZWlnaHQ6IDBcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgdmFyIHBhZGRpbmcgPSA1O1xyXG4gICAgdmFyIG1hcmdpblRvcCA9IDg7XHJcbiAgICB2YXIgc2hhcGVXaWR0aCA9IDE1O1xyXG4gICAgdmFyIGxlZ2VuZExpc3QgPSBbXTtcclxuICAgIHZhciB3aWR0aENvdW50ID0gMDtcclxuICAgIHZhciBjdXJyZW50Um93ID0gW107XHJcbiAgICBzZXJpZXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHZhciBpdGVtV2lkdGggPSAzICogcGFkZGluZyArIHNoYXBlV2lkdGggKyBtZWFzdXJlVGV4dChpdGVtLm5hbWUgfHwgJ3VuZGVmaW5lZCcpO1xyXG4gICAgICAgIGlmICh3aWR0aENvdW50ICsgaXRlbVdpZHRoID4gb3B0cy53aWR0aCkge1xyXG4gICAgICAgICAgICBsZWdlbmRMaXN0LnB1c2goY3VycmVudFJvdyk7XHJcbiAgICAgICAgICAgIHdpZHRoQ291bnQgPSBpdGVtV2lkdGg7XHJcbiAgICAgICAgICAgIGN1cnJlbnRSb3cgPSBbaXRlbV07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgd2lkdGhDb3VudCArPSBpdGVtV2lkdGg7XHJcbiAgICAgICAgICAgIGN1cnJlbnRSb3cucHVzaChpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGlmIChjdXJyZW50Um93Lmxlbmd0aCkge1xyXG4gICAgICAgIGxlZ2VuZExpc3QucHVzaChjdXJyZW50Um93KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGxlZ2VuZExpc3Q6IGxlZ2VuZExpc3QsXHJcbiAgICAgICAgbGVnZW5kSGVpZ2h0OiBsZWdlbmRMaXN0Lmxlbmd0aCAqIChjb25maWcuZm9udFNpemUgKyBtYXJnaW5Ub3ApICsgcGFkZGluZ1xyXG4gICAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2FsQ2F0ZWdvcmllc0RhdGEoY2F0ZWdvcmllcywgb3B0cywgY29uZmlnKSB7XHJcbiAgICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgICAgIGFuZ2xlOiAwLFxyXG4gICAgICAgIHhBeGlzSGVpZ2h0OiBjb25maWcueEF4aXNIZWlnaHRcclxuICAgIH07XHJcblxyXG4gICAgdmFyIF9nZXRYQXhpc1BvaW50cyA9IGdldFhBeGlzUG9pbnRzKGNhdGVnb3JpZXMsIG9wdHMsIGNvbmZpZyksXHJcbiAgICAgICAgZWFjaFNwYWNpbmcgPSBfZ2V0WEF4aXNQb2ludHMuZWFjaFNwYWNpbmc7XHJcblxyXG4gICAgLy8gZ2V0IG1heCBsZW5ndGggb2YgY2F0ZWdvcmllcyB0ZXh0XHJcblxyXG4gICAgdmFyIGNhdGVnb3JpZXNUZXh0TGVudGggPSBjYXRlZ29yaWVzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHJldHVybiBtZWFzdXJlVGV4dChpdGVtKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHZhciBtYXhUZXh0TGVuZ3RoID0gTWF0aC5tYXguYXBwbHkodGhpcywgY2F0ZWdvcmllc1RleHRMZW50aCk7XHJcblxyXG4gICAgaWYgKG1heFRleHRMZW5ndGggKyAyICogY29uZmlnLnhBeGlzVGV4dFBhZGRpbmcgPiBlYWNoU3BhY2luZykge1xyXG4gICAgICAgIHJlc3VsdC5hbmdsZSA9IDQ1ICogTWF0aC5QSSAvIDE4MDtcclxuICAgICAgICByZXN1bHQueEF4aXNIZWlnaHQgPSAyICogY29uZmlnLnhBeGlzVGV4dFBhZGRpbmcgKyBtYXhUZXh0TGVuZ3RoICogTWF0aC5zaW4ocmVzdWx0LmFuZ2xlKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRSYWRhckRhdGFQb2ludHMoYW5nbGVMaXN0LCBjZW50ZXIsIHJhZGl1cywgc2VyaWVzLCBvcHRzKSB7XHJcbiAgICB2YXIgcHJvY2VzcyA9IGFyZ3VtZW50cy5sZW5ndGggPiA1ICYmIGFyZ3VtZW50c1s1XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzVdIDogMTtcclxuXHJcbiAgICB2YXIgcmFkYXJPcHRpb24gPSBvcHRzLmV4dHJhLnJhZGFyIHx8IHt9O1xyXG4gICAgcmFkYXJPcHRpb24ubWF4ID0gcmFkYXJPcHRpb24ubWF4IHx8IDA7XHJcbiAgICB2YXIgbWF4RGF0YSA9IE1hdGgubWF4KHJhZGFyT3B0aW9uLm1heCwgTWF0aC5tYXguYXBwbHkobnVsbCwgZGF0YUNvbWJpbmUoc2VyaWVzKSkpO1xyXG5cclxuICAgIHZhciBkYXRhID0gW107XHJcbiAgICBzZXJpZXMuZm9yRWFjaChmdW5jdGlvbiAoZWFjaCkge1xyXG4gICAgICAgIHZhciBsaXN0SXRlbSA9IHt9O1xyXG4gICAgICAgIGxpc3RJdGVtLmNvbG9yID0gZWFjaC5jb2xvcjtcclxuICAgICAgICBsaXN0SXRlbS5kYXRhID0gW107XHJcbiAgICAgICAgZWFjaC5kYXRhLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgICAgIHZhciB0bXAgPSB7fTtcclxuICAgICAgICAgICAgdG1wLmFuZ2xlID0gYW5nbGVMaXN0W2luZGV4XTtcclxuXHJcbiAgICAgICAgICAgIHRtcC5wcm9wb3J0aW9uID0gaXRlbSAvIG1heERhdGE7XHJcbiAgICAgICAgICAgIHRtcC5wb3NpdGlvbiA9IGNvbnZlcnRDb29yZGluYXRlT3JpZ2luKHJhZGl1cyAqIHRtcC5wcm9wb3J0aW9uICogcHJvY2VzcyAqIE1hdGguY29zKHRtcC5hbmdsZSksIHJhZGl1cyAqIHRtcC5wcm9wb3J0aW9uICogcHJvY2VzcyAqIE1hdGguc2luKHRtcC5hbmdsZSksIGNlbnRlcik7XHJcbiAgICAgICAgICAgIGxpc3RJdGVtLmRhdGEucHVzaCh0bXApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkYXRhLnB1c2gobGlzdEl0ZW0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFBpZURhdGFQb2ludHMoc2VyaWVzKSB7XHJcbiAgICB2YXIgcHJvY2VzcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMTtcclxuXHJcbiAgICB2YXIgY291bnQgPSAwO1xyXG4gICAgdmFyIF9zdGFydF8gPSAwO1xyXG4gICAgc2VyaWVzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICBpdGVtLmRhdGEgPSBpdGVtLmRhdGEgPT09IG51bGwgPyAwIDogaXRlbS5kYXRhO1xyXG4gICAgICAgIGNvdW50ICs9IGl0ZW0uZGF0YTtcclxuICAgIH0pO1xyXG4gICAgc2VyaWVzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICBpdGVtLmRhdGEgPSBpdGVtLmRhdGEgPT09IG51bGwgPyAwIDogaXRlbS5kYXRhO1xyXG4gICAgICAgIGl0ZW0uX3Byb3BvcnRpb25fID0gaXRlbS5kYXRhIC8gY291bnQgKiBwcm9jZXNzO1xyXG4gICAgfSk7XHJcbiAgICBzZXJpZXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIGl0ZW0uX3N0YXJ0XyA9IF9zdGFydF87XHJcbiAgICAgICAgX3N0YXJ0XyArPSAyICogaXRlbS5fcHJvcG9ydGlvbl8gKiBNYXRoLlBJO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHNlcmllcztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UGllVGV4dE1heExlbmd0aChzZXJpZXMpIHtcclxuICAgIHNlcmllcyA9IGdldFBpZURhdGFQb2ludHMoc2VyaWVzKTtcclxuICAgIHZhciBtYXhMZW5ndGggPSAwO1xyXG4gICAgc2VyaWVzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICB2YXIgdGV4dCA9IGl0ZW0uZm9ybWF0ID8gaXRlbS5mb3JtYXQoK2l0ZW0uX3Byb3BvcnRpb25fLnRvRml4ZWQoMikpIDogdXRpbC50b0ZpeGVkKGl0ZW0uX3Byb3BvcnRpb25fICogMTAwKSArICclJztcclxuICAgICAgICBtYXhMZW5ndGggPSBNYXRoLm1heChtYXhMZW5ndGgsIG1lYXN1cmVUZXh0KHRleHQpKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBtYXhMZW5ndGg7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpeENvbHVtZURhdGEocG9pbnRzLCBlYWNoU3BhY2luZywgY29sdW1uTGVuLCBpbmRleCwgY29uZmlnLCBvcHRzKSB7XHJcbiAgICByZXR1cm4gcG9pbnRzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIGlmIChpdGVtID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpdGVtLndpZHRoID0gKGVhY2hTcGFjaW5nIC0gMiAqIGNvbmZpZy5jb2x1bWVQYWRkaW5nKSAvIGNvbHVtbkxlbjtcclxuXHJcbiAgICAgICAgaWYgKG9wdHMuZXh0cmEuY29sdW1uICYmIG9wdHMuZXh0cmEuY29sdW1uLndpZHRoICYmICtvcHRzLmV4dHJhLmNvbHVtbi53aWR0aCA+IDApIHtcclxuICAgICAgICAgICAgLy8gY3VzdG9tZXIgY29sdW1uIHdpZHRoXHJcbiAgICAgICAgICAgIGl0ZW0ud2lkdGggPSBNYXRoLm1pbihpdGVtLndpZHRoLCArb3B0cy5leHRyYS5jb2x1bW4ud2lkdGgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGRlZmF1bHQgd2lkdGggc2hvdWxkIGxlc3MgdHJhbiAyNXB4XHJcbiAgICAgICAgICAgIC8vIGRvbid0IGFzayBtZSB3aHksIEkgZG9uJ3Qga25vd1xyXG4gICAgICAgICAgICBpdGVtLndpZHRoID0gTWF0aC5taW4oaXRlbS53aWR0aCwgMjUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpdGVtLnggKz0gKGluZGV4ICsgMC41IC0gY29sdW1uTGVuIC8gMikgKiBpdGVtLndpZHRoO1xyXG5cclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRYQXhpc1BvaW50cyhjYXRlZ29yaWVzLCBvcHRzLCBjb25maWcpIHtcclxuICAgIHZhciB5QXhpc1RvdGFsV2lkdGggPSBjb25maWcueUF4aXNXaWR0aCArIGNvbmZpZy55QXhpc1RpdGxlV2lkdGg7XHJcbiAgICB2YXIgc3BhY2luZ1ZhbGlkID0gb3B0cy53aWR0aCAtIDIgKiBjb25maWcucGFkZGluZyAtIHlBeGlzVG90YWxXaWR0aDtcclxuICAgIHZhciBkYXRhQ291bnQgPSBvcHRzLmVuYWJsZVNjcm9sbCA/IE1hdGgubWluKDUsIGNhdGVnb3JpZXMubGVuZ3RoKSA6IGNhdGVnb3JpZXMubGVuZ3RoO1xyXG4gICAgdmFyIGVhY2hTcGFjaW5nID0gc3BhY2luZ1ZhbGlkIC8gZGF0YUNvdW50O1xyXG5cclxuICAgIHZhciB4QXhpc1BvaW50cyA9IFtdO1xyXG4gICAgdmFyIHN0YXJ0WCA9IGNvbmZpZy5wYWRkaW5nICsgeUF4aXNUb3RhbFdpZHRoO1xyXG4gICAgdmFyIGVuZFggPSBvcHRzLndpZHRoIC0gY29uZmlnLnBhZGRpbmc7XHJcbiAgICBjYXRlZ29yaWVzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgeEF4aXNQb2ludHMucHVzaChzdGFydFggKyBpbmRleCAqIGVhY2hTcGFjaW5nKTtcclxuICAgIH0pO1xyXG4gICAgaWYgKG9wdHMuZW5hYmxlU2Nyb2xsID09PSB0cnVlKSB7XHJcbiAgICAgICAgeEF4aXNQb2ludHMucHVzaChzdGFydFggKyBjYXRlZ29yaWVzLmxlbmd0aCAqIGVhY2hTcGFjaW5nKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgeEF4aXNQb2ludHMucHVzaChlbmRYKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geyB4QXhpc1BvaW50czogeEF4aXNQb2ludHMsIHN0YXJ0WDogc3RhcnRYLCBlbmRYOiBlbmRYLCBlYWNoU3BhY2luZzogZWFjaFNwYWNpbmcgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RGF0YVBvaW50cyhkYXRhLCBtaW5SYW5nZSwgbWF4UmFuZ2UsIHhBeGlzUG9pbnRzLCBlYWNoU3BhY2luZywgb3B0cywgY29uZmlnKSB7XHJcbiAgICB2YXIgcHJvY2VzcyA9IGFyZ3VtZW50cy5sZW5ndGggPiA3ICYmIGFyZ3VtZW50c1s3XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzddIDogMTtcclxuXHJcbiAgICB2YXIgcG9pbnRzID0gW107XHJcbiAgICB2YXIgdmFsaWRIZWlnaHQgPSBvcHRzLmhlaWdodCAtIDIgKiBjb25maWcucGFkZGluZyAtIGNvbmZpZy54QXhpc0hlaWdodCAtIGNvbmZpZy5sZWdlbmRIZWlnaHQ7XHJcbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgaWYgKGl0ZW0gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2gobnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHBvaW50ID0ge307XHJcbiAgICAgICAgICAgIHBvaW50LnggPSB4QXhpc1BvaW50c1tpbmRleF0gKyBNYXRoLnJvdW5kKGVhY2hTcGFjaW5nIC8gMik7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSB2YWxpZEhlaWdodCAqIChpdGVtIC0gbWluUmFuZ2UpIC8gKG1heFJhbmdlIC0gbWluUmFuZ2UpO1xyXG4gICAgICAgICAgICBoZWlnaHQgKj0gcHJvY2VzcztcclxuICAgICAgICAgICAgcG9pbnQueSA9IG9wdHMuaGVpZ2h0IC0gY29uZmlnLnhBeGlzSGVpZ2h0IC0gY29uZmlnLmxlZ2VuZEhlaWdodCAtIE1hdGgucm91bmQoaGVpZ2h0KSAtIGNvbmZpZy5wYWRkaW5nO1xyXG4gICAgICAgICAgICBwb2ludHMucHVzaChwb2ludCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHBvaW50cztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0WUF4aXNUZXh0TGlzdChzZXJpZXMsIG9wdHMsIGNvbmZpZykge1xyXG4gICAgdmFyIGRhdGEgPSBkYXRhQ29tYmluZShzZXJpZXMpO1xyXG4gICAgLy8gcmVtb3ZlIG51bGwgZnJvbSBkYXRhXHJcbiAgICBkYXRhID0gZGF0YS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICByZXR1cm4gaXRlbSAhPT0gbnVsbDtcclxuICAgIH0pO1xyXG4gICAgdmFyIG1pbkRhdGEgPSBNYXRoLm1pbi5hcHBseSh0aGlzLCBkYXRhKTtcclxuICAgIHZhciBtYXhEYXRhID0gTWF0aC5tYXguYXBwbHkodGhpcywgZGF0YSk7XHJcbiAgICBpZiAodHlwZW9mIG9wdHMueUF4aXMubWluID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgIG1pbkRhdGEgPSBNYXRoLm1pbihvcHRzLnlBeGlzLm1pbiwgbWluRGF0YSk7XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIG9wdHMueUF4aXMubWF4ID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgIG1heERhdGEgPSBNYXRoLm1heChvcHRzLnlBeGlzLm1heCwgbWF4RGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZml4IGlzc3VlIGh0dHBzOi8vZ2l0aHViLmNvbS94aWFvbGluMzMwMy93eC1jaGFydHMvaXNzdWVzLzlcclxuICAgIGlmIChtaW5EYXRhID09PSBtYXhEYXRhKSB7XHJcbiAgICAgICAgdmFyIHJhbmdlU3BhbiA9IG1heERhdGEgfHwgMTtcclxuICAgICAgICBtaW5EYXRhIC09IHJhbmdlU3BhbjtcclxuICAgICAgICBtYXhEYXRhICs9IHJhbmdlU3BhbjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZGF0YVJhbmdlID0gZ2V0RGF0YVJhbmdlKG1pbkRhdGEsIG1heERhdGEpO1xyXG4gICAgdmFyIG1pblJhbmdlID0gZGF0YVJhbmdlLm1pblJhbmdlO1xyXG4gICAgdmFyIG1heFJhbmdlID0gZGF0YVJhbmdlLm1heFJhbmdlO1xyXG5cclxuICAgIHZhciByYW5nZSA9IFtdO1xyXG4gICAgdmFyIGVhY2hSYW5nZSA9IChtYXhSYW5nZSAtIG1pblJhbmdlKSAvIGNvbmZpZy55QXhpc1NwbGl0O1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IGNvbmZpZy55QXhpc1NwbGl0OyBpKyspIHtcclxuICAgICAgICByYW5nZS5wdXNoKG1pblJhbmdlICsgZWFjaFJhbmdlICogaSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmFuZ2UucmV2ZXJzZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjYWxZQXhpc0RhdGEoc2VyaWVzLCBvcHRzLCBjb25maWcpIHtcclxuXHJcbiAgICB2YXIgcmFuZ2VzID0gZ2V0WUF4aXNUZXh0TGlzdChzZXJpZXMsIG9wdHMsIGNvbmZpZyk7XHJcbiAgICB2YXIgeUF4aXNXaWR0aCA9IGNvbmZpZy55QXhpc1dpZHRoO1xyXG4gICAgdmFyIHJhbmdlc0Zvcm1hdCA9IHJhbmdlcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICBpdGVtID0gdXRpbC50b0ZpeGVkKGl0ZW0sIDIpO1xyXG4gICAgICAgIGl0ZW0gPSBvcHRzLnlBeGlzLmZvcm1hdCA/IG9wdHMueUF4aXMuZm9ybWF0KE51bWJlcihpdGVtKSkgOiBpdGVtO1xyXG4gICAgICAgIHlBeGlzV2lkdGggPSBNYXRoLm1heCh5QXhpc1dpZHRoLCBtZWFzdXJlVGV4dChpdGVtKSArIDUpO1xyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfSk7XHJcbiAgICBpZiAob3B0cy55QXhpcy5kaXNhYmxlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHlBeGlzV2lkdGggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7IHJhbmdlc0Zvcm1hdDogcmFuZ2VzRm9ybWF0LCByYW5nZXM6IHJhbmdlcywgeUF4aXNXaWR0aDogeUF4aXNXaWR0aCB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3UG9pbnRTaGFwZShwb2ludHMsIGNvbG9yLCBzaGFwZSwgY29udGV4dCkge1xyXG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgIGNvbnRleHQuc2V0U3Ryb2tlU3R5bGUoJyNmZmZmZmYnKTtcclxuICAgIGNvbnRleHQuc2V0TGluZVdpZHRoKDEpO1xyXG4gICAgY29udGV4dC5zZXRGaWxsU3R5bGUoY29sb3IpO1xyXG5cclxuICAgIGlmIChzaGFwZSA9PT0gJ2RpYW1vbmQnKSB7XHJcbiAgICAgICAgcG9pbnRzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1vdmVUbyhpdGVtLngsIGl0ZW0ueSAtIDQuNSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbyhpdGVtLnggLSA0LjUsIGl0ZW0ueSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbyhpdGVtLngsIGl0ZW0ueSArIDQuNSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbyhpdGVtLnggKyA0LjUsIGl0ZW0ueSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbyhpdGVtLngsIGl0ZW0ueSAtIDQuNSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoc2hhcGUgPT09ICdjaXJjbGUnKSB7XHJcbiAgICAgICAgcG9pbnRzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1vdmVUbyhpdGVtLnggKyAzLjUsIGl0ZW0ueSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmFyYyhpdGVtLngsIGl0ZW0ueSwgNCwgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChzaGFwZSA9PT0gJ3JlY3QnKSB7XHJcbiAgICAgICAgcG9pbnRzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1vdmVUbyhpdGVtLnggLSAzLjUsIGl0ZW0ueSAtIDMuNSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LnJlY3QoaXRlbS54IC0gMy41LCBpdGVtLnkgLSAzLjUsIDcsIDcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHNoYXBlID09PSAndHJpYW5nbGUnKSB7XHJcbiAgICAgICAgcG9pbnRzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1vdmVUbyhpdGVtLngsIGl0ZW0ueSAtIDQuNSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbyhpdGVtLnggLSA0LjUsIGl0ZW0ueSArIDQuNSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbyhpdGVtLnggKyA0LjUsIGl0ZW0ueSArIDQuNSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbyhpdGVtLngsIGl0ZW0ueSAtIDQuNSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdSaW5nVGl0bGUob3B0cywgY29uZmlnLCBjb250ZXh0KSB7XHJcbiAgICB2YXIgdGl0bGVmb250U2l6ZSA9IG9wdHMudGl0bGUuZm9udFNpemUgfHwgY29uZmlnLnRpdGxlRm9udFNpemU7XHJcbiAgICB2YXIgc3VidGl0bGVmb250U2l6ZSA9IG9wdHMuc3VidGl0bGUuZm9udFNpemUgfHwgY29uZmlnLnN1YnRpdGxlRm9udFNpemU7XHJcbiAgICB2YXIgdGl0bGUgPSBvcHRzLnRpdGxlLm5hbWUgfHwgJyc7XHJcbiAgICB2YXIgc3VidGl0bGUgPSBvcHRzLnN1YnRpdGxlLm5hbWUgfHwgJyc7XHJcbiAgICB2YXIgdGl0bGVGb250Q29sb3IgPSBvcHRzLnRpdGxlLmNvbG9yIHx8IGNvbmZpZy50aXRsZUNvbG9yO1xyXG4gICAgdmFyIHN1YnRpdGxlRm9udENvbG9yID0gb3B0cy5zdWJ0aXRsZS5jb2xvciB8fCBjb25maWcuc3VidGl0bGVDb2xvcjtcclxuICAgIHZhciB0aXRsZUhlaWdodCA9IHRpdGxlID8gdGl0bGVmb250U2l6ZSA6IDA7XHJcbiAgICB2YXIgc3VidGl0bGVIZWlnaHQgPSBzdWJ0aXRsZSA/IHN1YnRpdGxlZm9udFNpemUgOiAwO1xyXG4gICAgdmFyIG1hcmdpbiA9IDU7XHJcbiAgICBpZiAoc3VidGl0bGUpIHtcclxuICAgICAgICB2YXIgdGV4dFdpZHRoID0gbWVhc3VyZVRleHQoc3VidGl0bGUsIHN1YnRpdGxlZm9udFNpemUpO1xyXG4gICAgICAgIHZhciBzdGFydFggPSAob3B0cy53aWR0aCAtIHRleHRXaWR0aCkgLyAyICsgKG9wdHMuc3VidGl0bGUub2Zmc2V0WCB8fCAwKTtcclxuICAgICAgICB2YXIgc3RhcnRZID0gKG9wdHMuaGVpZ2h0IC0gY29uZmlnLmxlZ2VuZEhlaWdodCArIHN1YnRpdGxlZm9udFNpemUpIC8gMjtcclxuICAgICAgICBpZiAodGl0bGUpIHtcclxuICAgICAgICAgICAgc3RhcnRZIC09ICh0aXRsZUhlaWdodCArIG1hcmdpbikgLyAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQuc2V0Rm9udFNpemUoc3VidGl0bGVmb250U2l6ZSk7XHJcbiAgICAgICAgY29udGV4dC5zZXRGaWxsU3R5bGUoc3VidGl0bGVGb250Q29sb3IpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFRleHQoc3VidGl0bGUsIHN0YXJ0WCwgc3RhcnRZKTtcclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICB9XHJcbiAgICBpZiAodGl0bGUpIHtcclxuICAgICAgICB2YXIgX3RleHRXaWR0aCA9IG1lYXN1cmVUZXh0KHRpdGxlLCB0aXRsZWZvbnRTaXplKTtcclxuICAgICAgICB2YXIgX3N0YXJ0WCA9IChvcHRzLndpZHRoIC0gX3RleHRXaWR0aCkgLyAyICsgKG9wdHMudGl0bGUub2Zmc2V0WCB8fCAwKTtcclxuICAgICAgICB2YXIgX3N0YXJ0WSA9IChvcHRzLmhlaWdodCAtIGNvbmZpZy5sZWdlbmRIZWlnaHQgKyB0aXRsZWZvbnRTaXplKSAvIDI7XHJcbiAgICAgICAgaWYgKHN1YnRpdGxlKSB7XHJcbiAgICAgICAgICAgIF9zdGFydFkgKz0gKHN1YnRpdGxlSGVpZ2h0ICsgbWFyZ2luKSAvIDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC5zZXRGb250U2l6ZSh0aXRsZWZvbnRTaXplKTtcclxuICAgICAgICBjb250ZXh0LnNldEZpbGxTdHlsZSh0aXRsZUZvbnRDb2xvcik7XHJcbiAgICAgICAgY29udGV4dC5maWxsVGV4dCh0aXRsZSwgX3N0YXJ0WCwgX3N0YXJ0WSk7XHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3UG9pbnRUZXh0KHBvaW50cywgc2VyaWVzLCBjb25maWcsIGNvbnRleHQpIHtcclxuICAgIC8vIOe7mOWItuaVsOaNruaWh+ahiFxyXG4gICAgdmFyIGRhdGEgPSBzZXJpZXMuZGF0YTtcclxuXHJcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgY29udGV4dC5zZXRGb250U2l6ZShjb25maWcuZm9udFNpemUpO1xyXG4gICAgY29udGV4dC5zZXRGaWxsU3R5bGUoJyM2NjY2NjYnKTtcclxuICAgIHBvaW50cy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xyXG4gICAgICAgIGlmIChpdGVtICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHZhciBmb3JtYXRWYWwgPSBzZXJpZXMuZm9ybWF0ID8gc2VyaWVzLmZvcm1hdChkYXRhW2luZGV4XSkgOiBkYXRhW2luZGV4XTtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsVGV4dChmb3JtYXRWYWwsIGl0ZW0ueCAtIG1lYXN1cmVUZXh0KGZvcm1hdFZhbCkgLyAyLCBpdGVtLnkgLSAyKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3UmFkYXJMYWJlbChhbmdsZUxpc3QsIHJhZGl1cywgY2VudGVyUG9zaXRpb24sIG9wdHMsIGNvbmZpZywgY29udGV4dCkge1xyXG4gICAgdmFyIHJhZGFyT3B0aW9uID0gb3B0cy5leHRyYS5yYWRhciB8fCB7fTtcclxuICAgIHJhZGl1cyArPSBjb25maWcucmFkYXJMYWJlbFRleHRNYXJnaW47XHJcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgY29udGV4dC5zZXRGb250U2l6ZShjb25maWcuZm9udFNpemUpO1xyXG4gICAgY29udGV4dC5zZXRGaWxsU3R5bGUocmFkYXJPcHRpb24ubGFiZWxDb2xvciB8fCAnIzY2NjY2NicpO1xyXG4gICAgYW5nbGVMaXN0LmZvckVhY2goZnVuY3Rpb24gKGFuZ2xlLCBpbmRleCkge1xyXG4gICAgICAgIHZhciBwb3MgPSB7XHJcbiAgICAgICAgICAgIHg6IHJhZGl1cyAqIE1hdGguY29zKGFuZ2xlKSxcclxuICAgICAgICAgICAgeTogcmFkaXVzICogTWF0aC5zaW4oYW5nbGUpXHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgcG9zUmVsYXRpdmVDYW52YXMgPSBjb252ZXJ0Q29vcmRpbmF0ZU9yaWdpbihwb3MueCwgcG9zLnksIGNlbnRlclBvc2l0aW9uKTtcclxuICAgICAgICB2YXIgc3RhcnRYID0gcG9zUmVsYXRpdmVDYW52YXMueDtcclxuICAgICAgICB2YXIgc3RhcnRZID0gcG9zUmVsYXRpdmVDYW52YXMueTtcclxuICAgICAgICBpZiAodXRpbC5hcHByb3hpbWF0ZWx5RXF1YWwocG9zLngsIDApKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0WCAtPSBtZWFzdXJlVGV4dChvcHRzLmNhdGVnb3JpZXNbaW5kZXhdIHx8ICcnKSAvIDI7XHJcbiAgICAgICAgfSBlbHNlIGlmIChwb3MueCA8IDApIHtcclxuICAgICAgICAgICAgc3RhcnRYIC09IG1lYXN1cmVUZXh0KG9wdHMuY2F0ZWdvcmllc1tpbmRleF0gfHwgJycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250ZXh0LmZpbGxUZXh0KG9wdHMuY2F0ZWdvcmllc1tpbmRleF0gfHwgJycsIHN0YXJ0WCwgc3RhcnRZICsgY29uZmlnLmZvbnRTaXplIC8gMik7XHJcbiAgICB9KTtcclxuICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3UGllVGV4dChzZXJpZXMsIG9wdHMsIGNvbmZpZywgY29udGV4dCwgcmFkaXVzLCBjZW50ZXIpIHtcclxuICAgIHZhciBsaW5lUmFkaXVzID0gcmFkaXVzICsgY29uZmlnLnBpZUNoYXJ0TGluZVBhZGRpbmc7XHJcbiAgICB2YXIgdGV4dE9iamVjdENvbGxlY3Rpb24gPSBbXTtcclxuICAgIHZhciBsYXN0VGV4dE9iamVjdCA9IG51bGw7XHJcblxyXG4gICAgdmFyIHNlcmllc0NvbnZlcnQgPSBzZXJpZXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgdmFyIGFyYyA9IDIgKiBNYXRoLlBJIC0gKGl0ZW0uX3N0YXJ0XyArIDIgKiBNYXRoLlBJICogaXRlbS5fcHJvcG9ydGlvbl8gLyAyKTtcclxuICAgICAgICB2YXIgdGV4dCA9IGl0ZW0uZm9ybWF0ID8gaXRlbS5mb3JtYXQoK2l0ZW0uX3Byb3BvcnRpb25fLnRvRml4ZWQoMikpIDogdXRpbC50b0ZpeGVkKGl0ZW0uX3Byb3BvcnRpb25fICogMTAwKSArICclJztcclxuICAgICAgICB2YXIgY29sb3IgPSBpdGVtLmNvbG9yO1xyXG4gICAgICAgIHJldHVybiB7IGFyYzogYXJjLCB0ZXh0OiB0ZXh0LCBjb2xvcjogY29sb3IgfTtcclxuICAgIH0pO1xyXG4gICAgc2VyaWVzQ29udmVydC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgLy8gbGluZSBlbmRcclxuICAgICAgICB2YXIgb3JnaW5YMSA9IE1hdGguY29zKGl0ZW0uYXJjKSAqIGxpbmVSYWRpdXM7XHJcbiAgICAgICAgdmFyIG9yZ2luWTEgPSBNYXRoLnNpbihpdGVtLmFyYykgKiBsaW5lUmFkaXVzO1xyXG5cclxuICAgICAgICAvLyBsaW5lIHN0YXJ0XHJcbiAgICAgICAgdmFyIG9yZ2luWDIgPSBNYXRoLmNvcyhpdGVtLmFyYykgKiByYWRpdXM7XHJcbiAgICAgICAgdmFyIG9yZ2luWTIgPSBNYXRoLnNpbihpdGVtLmFyYykgKiByYWRpdXM7XHJcblxyXG4gICAgICAgIC8vIHRleHQgc3RhcnRcclxuICAgICAgICB2YXIgb3JnaW5YMyA9IG9yZ2luWDEgPj0gMCA/IG9yZ2luWDEgKyBjb25maWcucGllQ2hhcnRUZXh0UGFkZGluZyA6IG9yZ2luWDEgLSBjb25maWcucGllQ2hhcnRUZXh0UGFkZGluZztcclxuICAgICAgICB2YXIgb3JnaW5ZMyA9IG9yZ2luWTE7XHJcblxyXG4gICAgICAgIHZhciB0ZXh0V2lkdGggPSBtZWFzdXJlVGV4dChpdGVtLnRleHQpO1xyXG4gICAgICAgIHZhciBzdGFydFkgPSBvcmdpblkzO1xyXG5cclxuICAgICAgICBpZiAobGFzdFRleHRPYmplY3QgJiYgdXRpbC5pc1NhbWVYQ29vcmRpbmF0ZUFyZWEobGFzdFRleHRPYmplY3Quc3RhcnQsIHsgeDogb3JnaW5YMyB9KSkge1xyXG4gICAgICAgICAgICBpZiAob3JnaW5YMyA+IDApIHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0WSA9IE1hdGgubWluKG9yZ2luWTMsIGxhc3RUZXh0T2JqZWN0LnN0YXJ0LnkpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9yZ2luWDEgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBzdGFydFkgPSBNYXRoLm1heChvcmdpblkzLCBsYXN0VGV4dE9iamVjdC5zdGFydC55KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcmdpblkzID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0WSA9IE1hdGgubWF4KG9yZ2luWTMsIGxhc3RUZXh0T2JqZWN0LnN0YXJ0LnkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydFkgPSBNYXRoLm1pbihvcmdpblkzLCBsYXN0VGV4dE9iamVjdC5zdGFydC55KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9yZ2luWDMgPCAwKSB7XHJcbiAgICAgICAgICAgIG9yZ2luWDMgLT0gdGV4dFdpZHRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHRleHRPYmplY3QgPSB7XHJcbiAgICAgICAgICAgIGxpbmVTdGFydDoge1xyXG4gICAgICAgICAgICAgICAgeDogb3JnaW5YMixcclxuICAgICAgICAgICAgICAgIHk6IG9yZ2luWTJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGluZUVuZDoge1xyXG4gICAgICAgICAgICAgICAgeDogb3JnaW5YMSxcclxuICAgICAgICAgICAgICAgIHk6IG9yZ2luWTFcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgIHg6IG9yZ2luWDMsXHJcbiAgICAgICAgICAgICAgICB5OiBzdGFydFlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgd2lkdGg6IHRleHRXaWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiBjb25maWcuZm9udFNpemUsXHJcbiAgICAgICAgICAgIHRleHQ6IGl0ZW0udGV4dCxcclxuICAgICAgICAgICAgY29sb3I6IGl0ZW0uY29sb3JcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsYXN0VGV4dE9iamVjdCA9IGF2b2lkQ29sbGlzaW9uKHRleHRPYmplY3QsIGxhc3RUZXh0T2JqZWN0KTtcclxuICAgICAgICB0ZXh0T2JqZWN0Q29sbGVjdGlvbi5wdXNoKGxhc3RUZXh0T2JqZWN0KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRleHRPYmplY3RDb2xsZWN0aW9uLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICB2YXIgbGluZVN0YXJ0UG9pc3Rpb24gPSBjb252ZXJ0Q29vcmRpbmF0ZU9yaWdpbihpdGVtLmxpbmVTdGFydC54LCBpdGVtLmxpbmVTdGFydC55LCBjZW50ZXIpO1xyXG4gICAgICAgIHZhciBsaW5lRW5kUG9pc3Rpb24gPSBjb252ZXJ0Q29vcmRpbmF0ZU9yaWdpbihpdGVtLmxpbmVFbmQueCwgaXRlbS5saW5lRW5kLnksIGNlbnRlcik7XHJcbiAgICAgICAgdmFyIHRleHRQb3NpdGlvbiA9IGNvbnZlcnRDb29yZGluYXRlT3JpZ2luKGl0ZW0uc3RhcnQueCwgaXRlbS5zdGFydC55LCBjZW50ZXIpO1xyXG4gICAgICAgIGNvbnRleHQuc2V0TGluZVdpZHRoKDEpO1xyXG4gICAgICAgIGNvbnRleHQuc2V0Rm9udFNpemUoY29uZmlnLmZvbnRTaXplKTtcclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQuc2V0U3Ryb2tlU3R5bGUoaXRlbS5jb2xvcik7XHJcbiAgICAgICAgY29udGV4dC5zZXRGaWxsU3R5bGUoaXRlbS5jb2xvcik7XHJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8obGluZVN0YXJ0UG9pc3Rpb24ueCwgbGluZVN0YXJ0UG9pc3Rpb24ueSk7XHJcbiAgICAgICAgdmFyIGN1cnZlU3RhcnRYID0gaXRlbS5zdGFydC54IDwgMCA/IHRleHRQb3NpdGlvbi54ICsgaXRlbS53aWR0aCA6IHRleHRQb3NpdGlvbi54O1xyXG4gICAgICAgIHZhciB0ZXh0U3RhcnRYID0gaXRlbS5zdGFydC54IDwgMCA/IHRleHRQb3NpdGlvbi54IC0gNSA6IHRleHRQb3NpdGlvbi54ICsgNTtcclxuICAgICAgICBjb250ZXh0LnF1YWRyYXRpY0N1cnZlVG8obGluZUVuZFBvaXN0aW9uLngsIGxpbmVFbmRQb2lzdGlvbi55LCBjdXJ2ZVN0YXJ0WCwgdGV4dFBvc2l0aW9uLnkpO1xyXG4gICAgICAgIGNvbnRleHQubW92ZVRvKGxpbmVTdGFydFBvaXN0aW9uLngsIGxpbmVTdGFydFBvaXN0aW9uLnkpO1xyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQubW92ZVRvKHRleHRQb3NpdGlvbi54ICsgaXRlbS53aWR0aCwgdGV4dFBvc2l0aW9uLnkpO1xyXG4gICAgICAgIGNvbnRleHQuYXJjKGN1cnZlU3RhcnRYLCB0ZXh0UG9zaXRpb24ueSwgMiwgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjb250ZXh0LnNldEZpbGxTdHlsZSgnIzY2NjY2NicpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFRleHQoaXRlbS50ZXh0LCB0ZXh0U3RhcnRYLCB0ZXh0UG9zaXRpb24ueSArIDMpO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3VG9vbFRpcFNwbGl0TGluZShvZmZzZXRYLCBvcHRzLCBjb25maWcsIGNvbnRleHQpIHtcclxuICAgIHZhciBzdGFydFkgPSBjb25maWcucGFkZGluZztcclxuICAgIHZhciBlbmRZID0gb3B0cy5oZWlnaHQgLSBjb25maWcucGFkZGluZyAtIGNvbmZpZy54QXhpc0hlaWdodCAtIGNvbmZpZy5sZWdlbmRIZWlnaHQ7XHJcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgY29udGV4dC5zZXRTdHJva2VTdHlsZSgnI2NjY2NjYycpO1xyXG4gICAgY29udGV4dC5zZXRMaW5lV2lkdGgoMSk7XHJcbiAgICBjb250ZXh0Lm1vdmVUbyhvZmZzZXRYLCBzdGFydFkpO1xyXG4gICAgY29udGV4dC5saW5lVG8ob2Zmc2V0WCwgZW5kWSk7XHJcbiAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd1Rvb2xUaXAodGV4dExpc3QsIG9mZnNldCwgb3B0cywgY29uZmlnLCBjb250ZXh0KSB7XHJcbiAgICB2YXIgbGVnZW5kV2lkdGggPSA0O1xyXG4gICAgdmFyIGxlZ2VuZE1hcmdpblJpZ2h0ID0gNTtcclxuICAgIHZhciBhcnJvd1dpZHRoID0gODtcclxuICAgIHZhciBpc092ZXJSaWdodEJvcmRlciA9IGZhbHNlO1xyXG4gICAgb2Zmc2V0ID0gYXNzaWduKHtcclxuICAgICAgICB4OiAwLFxyXG4gICAgICAgIHk6IDBcclxuICAgIH0sIG9mZnNldCk7XHJcbiAgICBvZmZzZXQueSAtPSA4O1xyXG4gICAgdmFyIHRleHRXaWR0aCA9IHRleHRMaXN0Lm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHJldHVybiBtZWFzdXJlVGV4dChpdGVtLnRleHQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIHRvb2xUaXBXaWR0aCA9IGxlZ2VuZFdpZHRoICsgbGVnZW5kTWFyZ2luUmlnaHQgKyA0ICogY29uZmlnLnRvb2xUaXBQYWRkaW5nICsgTWF0aC5tYXguYXBwbHkobnVsbCwgdGV4dFdpZHRoKTtcclxuICAgIHZhciB0b29sVGlwSGVpZ2h0ID0gMiAqIGNvbmZpZy50b29sVGlwUGFkZGluZyArIHRleHRMaXN0Lmxlbmd0aCAqIGNvbmZpZy50b29sVGlwTGluZUhlaWdodDtcclxuXHJcbiAgICAvLyBpZiBiZXlvbmQgdGhlIHJpZ2h0IGJvcmRlclxyXG4gICAgaWYgKG9mZnNldC54IC0gTWF0aC5hYnMob3B0cy5fc2Nyb2xsRGlzdGFuY2VfKSArIGFycm93V2lkdGggKyB0b29sVGlwV2lkdGggPiBvcHRzLndpZHRoKSB7XHJcbiAgICAgICAgaXNPdmVyUmlnaHRCb3JkZXIgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGRyYXcgYmFja2dyb3VuZCByZWN0XHJcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgY29udGV4dC5zZXRGaWxsU3R5bGUob3B0cy50b29sdGlwLm9wdGlvbi5iYWNrZ3JvdW5kIHx8IGNvbmZpZy50b29sVGlwQmFja2dyb3VuZCk7XHJcbiAgICBjb250ZXh0LnNldEdsb2JhbEFscGhhKGNvbmZpZy50b29sVGlwT3BhY2l0eSk7XHJcbiAgICBpZiAoaXNPdmVyUmlnaHRCb3JkZXIpIHtcclxuICAgICAgICBjb250ZXh0Lm1vdmVUbyhvZmZzZXQueCwgb2Zmc2V0LnkgKyAxMCk7XHJcbiAgICAgICAgY29udGV4dC5saW5lVG8ob2Zmc2V0LnggLSBhcnJvd1dpZHRoLCBvZmZzZXQueSArIDEwIC0gNSk7XHJcbiAgICAgICAgY29udGV4dC5saW5lVG8ob2Zmc2V0LnggLSBhcnJvd1dpZHRoLCBvZmZzZXQueSArIDEwICsgNSk7XHJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8ob2Zmc2V0LngsIG9mZnNldC55ICsgMTApO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFJlY3Qob2Zmc2V0LnggLSB0b29sVGlwV2lkdGggLSBhcnJvd1dpZHRoLCBvZmZzZXQueSwgdG9vbFRpcFdpZHRoLCB0b29sVGlwSGVpZ2h0KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8ob2Zmc2V0LngsIG9mZnNldC55ICsgMTApO1xyXG4gICAgICAgIGNvbnRleHQubGluZVRvKG9mZnNldC54ICsgYXJyb3dXaWR0aCwgb2Zmc2V0LnkgKyAxMCAtIDUpO1xyXG4gICAgICAgIGNvbnRleHQubGluZVRvKG9mZnNldC54ICsgYXJyb3dXaWR0aCwgb2Zmc2V0LnkgKyAxMCArIDUpO1xyXG4gICAgICAgIGNvbnRleHQubW92ZVRvKG9mZnNldC54LCBvZmZzZXQueSArIDEwKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KG9mZnNldC54ICsgYXJyb3dXaWR0aCwgb2Zmc2V0LnksIHRvb2xUaXBXaWR0aCwgdG9vbFRpcEhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgY29udGV4dC5zZXRHbG9iYWxBbHBoYSgxKTtcclxuXHJcbiAgICAvLyBkcmF3IGxlZ2VuZFxyXG4gICAgdGV4dExpc3QuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQuc2V0RmlsbFN0eWxlKGl0ZW0uY29sb3IpO1xyXG4gICAgICAgIHZhciBzdGFydFggPSBvZmZzZXQueCArIGFycm93V2lkdGggKyAyICogY29uZmlnLnRvb2xUaXBQYWRkaW5nO1xyXG4gICAgICAgIHZhciBzdGFydFkgPSBvZmZzZXQueSArIChjb25maWcudG9vbFRpcExpbmVIZWlnaHQgLSBjb25maWcuZm9udFNpemUpIC8gMiArIGNvbmZpZy50b29sVGlwTGluZUhlaWdodCAqIGluZGV4ICsgY29uZmlnLnRvb2xUaXBQYWRkaW5nO1xyXG4gICAgICAgIGlmIChpc092ZXJSaWdodEJvcmRlcikge1xyXG4gICAgICAgICAgICBzdGFydFggPSBvZmZzZXQueCAtIHRvb2xUaXBXaWR0aCAtIGFycm93V2lkdGggKyAyICogY29uZmlnLnRvb2xUaXBQYWRkaW5nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KHN0YXJ0WCwgc3RhcnRZLCBsZWdlbmRXaWR0aCwgY29uZmlnLmZvbnRTaXplKTtcclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gZHJhdyB0ZXh0IGxpc3RcclxuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICBjb250ZXh0LnNldEZvbnRTaXplKGNvbmZpZy5mb250U2l6ZSk7XHJcbiAgICBjb250ZXh0LnNldEZpbGxTdHlsZSgnI2ZmZmZmZicpO1xyXG4gICAgdGV4dExpc3QuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICB2YXIgc3RhcnRYID0gb2Zmc2V0LnggKyBhcnJvd1dpZHRoICsgMiAqIGNvbmZpZy50b29sVGlwUGFkZGluZyArIGxlZ2VuZFdpZHRoICsgbGVnZW5kTWFyZ2luUmlnaHQ7XHJcbiAgICAgICAgaWYgKGlzT3ZlclJpZ2h0Qm9yZGVyKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0WCA9IG9mZnNldC54IC0gdG9vbFRpcFdpZHRoIC0gYXJyb3dXaWR0aCArIDIgKiBjb25maWcudG9vbFRpcFBhZGRpbmcgKyArbGVnZW5kV2lkdGggKyBsZWdlbmRNYXJnaW5SaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHN0YXJ0WSA9IG9mZnNldC55ICsgKGNvbmZpZy50b29sVGlwTGluZUhlaWdodCAtIGNvbmZpZy5mb250U2l6ZSkgLyAyICsgY29uZmlnLnRvb2xUaXBMaW5lSGVpZ2h0ICogaW5kZXggKyBjb25maWcudG9vbFRpcFBhZGRpbmc7XHJcbiAgICAgICAgY29udGV4dC5maWxsVGV4dChpdGVtLnRleHQsIHN0YXJ0WCwgc3RhcnRZICsgY29uZmlnLmZvbnRTaXplKTtcclxuICAgIH0pO1xyXG4gICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdZQXhpc1RpdGxlKHRpdGxlLCBvcHRzLCBjb25maWcsIGNvbnRleHQpIHtcclxuICAgIHZhciBzdGFydFggPSBjb25maWcueEF4aXNIZWlnaHQgKyAob3B0cy5oZWlnaHQgLSBjb25maWcueEF4aXNIZWlnaHQgLSBtZWFzdXJlVGV4dCh0aXRsZSkpIC8gMjtcclxuICAgIGNvbnRleHQuc2F2ZSgpO1xyXG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgIGNvbnRleHQuc2V0Rm9udFNpemUoY29uZmlnLmZvbnRTaXplKTtcclxuICAgIGNvbnRleHQuc2V0RmlsbFN0eWxlKG9wdHMueUF4aXMudGl0bGVGb250Q29sb3IgfHwgJyMzMzMzMzMnKTtcclxuICAgIGNvbnRleHQudHJhbnNsYXRlKDAsIG9wdHMuaGVpZ2h0KTtcclxuICAgIGNvbnRleHQucm90YXRlKC05MCAqIE1hdGguUEkgLyAxODApO1xyXG4gICAgY29udGV4dC5maWxsVGV4dCh0aXRsZSwgc3RhcnRYLCBjb25maWcucGFkZGluZyArIDAuNSAqIGNvbmZpZy5mb250U2l6ZSk7XHJcbiAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgIGNvbnRleHQucmVzdG9yZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3Q29sdW1uRGF0YVBvaW50cyhzZXJpZXMsIG9wdHMsIGNvbmZpZywgY29udGV4dCkge1xyXG4gICAgdmFyIHByb2Nlc3MgPSBhcmd1bWVudHMubGVuZ3RoID4gNCAmJiBhcmd1bWVudHNbNF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s0XSA6IDE7XHJcblxyXG4gICAgdmFyIF9jYWxZQXhpc0RhdGEgPSBjYWxZQXhpc0RhdGEoc2VyaWVzLCBvcHRzLCBjb25maWcpLFxyXG4gICAgICAgIHJhbmdlcyA9IF9jYWxZQXhpc0RhdGEucmFuZ2VzO1xyXG5cclxuICAgIHZhciBfZ2V0WEF4aXNQb2ludHMgPSBnZXRYQXhpc1BvaW50cyhvcHRzLmNhdGVnb3JpZXMsIG9wdHMsIGNvbmZpZyksXHJcbiAgICAgICAgeEF4aXNQb2ludHMgPSBfZ2V0WEF4aXNQb2ludHMueEF4aXNQb2ludHMsXHJcbiAgICAgICAgZWFjaFNwYWNpbmcgPSBfZ2V0WEF4aXNQb2ludHMuZWFjaFNwYWNpbmc7XHJcblxyXG4gICAgdmFyIG1pblJhbmdlID0gcmFuZ2VzLnBvcCgpO1xyXG4gICAgdmFyIG1heFJhbmdlID0gcmFuZ2VzLnNoaWZ0KCk7XHJcbiAgICBjb250ZXh0LnNhdmUoKTtcclxuICAgIGlmIChvcHRzLl9zY3JvbGxEaXN0YW5jZV8gJiYgb3B0cy5fc2Nyb2xsRGlzdGFuY2VfICE9PSAwICYmIG9wdHMuZW5hYmxlU2Nyb2xsID09PSB0cnVlKSB7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUob3B0cy5fc2Nyb2xsRGlzdGFuY2VfLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXJpZXMuZm9yRWFjaChmdW5jdGlvbiAoZWFjaFNlcmllcywgc2VyaWVzSW5kZXgpIHtcclxuICAgICAgICB2YXIgZGF0YSA9IGVhY2hTZXJpZXMuZGF0YTtcclxuICAgICAgICB2YXIgcG9pbnRzID0gZ2V0RGF0YVBvaW50cyhkYXRhLCBtaW5SYW5nZSwgbWF4UmFuZ2UsIHhBeGlzUG9pbnRzLCBlYWNoU3BhY2luZywgb3B0cywgY29uZmlnLCBwcm9jZXNzKTtcclxuICAgICAgICBwb2ludHMgPSBmaXhDb2x1bWVEYXRhKHBvaW50cywgZWFjaFNwYWNpbmcsIHNlcmllcy5sZW5ndGgsIHNlcmllc0luZGV4LCBjb25maWcsIG9wdHMpO1xyXG5cclxuICAgICAgICAvLyDnu5jliLbmn7HnirbmlbDmja7lm75cclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQuc2V0RmlsbFN0eWxlKGVhY2hTZXJpZXMuY29sb3IpO1xyXG4gICAgICAgIHBvaW50cy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xyXG4gICAgICAgICAgICBpZiAoaXRlbSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0YXJ0WCA9IGl0ZW0ueCAtIGl0ZW0ud2lkdGggLyAyICsgMTtcclxuICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSBvcHRzLmhlaWdodCAtIGl0ZW0ueSAtIGNvbmZpZy5wYWRkaW5nIC0gY29uZmlnLnhBeGlzSGVpZ2h0IC0gY29uZmlnLmxlZ2VuZEhlaWdodDtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQubW92ZVRvKHN0YXJ0WCwgaXRlbS55KTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQucmVjdChzdGFydFgsIGl0ZW0ueSwgaXRlbS53aWR0aCAtIDIsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgfSk7XHJcbiAgICBzZXJpZXMuZm9yRWFjaChmdW5jdGlvbiAoZWFjaFNlcmllcywgc2VyaWVzSW5kZXgpIHtcclxuICAgICAgICB2YXIgZGF0YSA9IGVhY2hTZXJpZXMuZGF0YTtcclxuICAgICAgICB2YXIgcG9pbnRzID0gZ2V0RGF0YVBvaW50cyhkYXRhLCBtaW5SYW5nZSwgbWF4UmFuZ2UsIHhBeGlzUG9pbnRzLCBlYWNoU3BhY2luZywgb3B0cywgY29uZmlnLCBwcm9jZXNzKTtcclxuICAgICAgICBwb2ludHMgPSBmaXhDb2x1bWVEYXRhKHBvaW50cywgZWFjaFNwYWNpbmcsIHNlcmllcy5sZW5ndGgsIHNlcmllc0luZGV4LCBjb25maWcsIG9wdHMpO1xyXG4gICAgICAgIGlmIChvcHRzLmRhdGFMYWJlbCAhPT0gZmFsc2UgJiYgcHJvY2VzcyA9PT0gMSkge1xyXG4gICAgICAgICAgICBkcmF3UG9pbnRUZXh0KHBvaW50cywgZWFjaFNlcmllcywgY29uZmlnLCBjb250ZXh0KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGNvbnRleHQucmVzdG9yZSgpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB4QXhpc1BvaW50czogeEF4aXNQb2ludHMsXHJcbiAgICAgICAgZWFjaFNwYWNpbmc6IGVhY2hTcGFjaW5nXHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3QXJlYURhdGFQb2ludHMoc2VyaWVzLCBvcHRzLCBjb25maWcsIGNvbnRleHQpIHtcclxuICAgIHZhciBwcm9jZXNzID0gYXJndW1lbnRzLmxlbmd0aCA+IDQgJiYgYXJndW1lbnRzWzRdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNF0gOiAxO1xyXG5cclxuICAgIHZhciBfY2FsWUF4aXNEYXRhMiA9IGNhbFlBeGlzRGF0YShzZXJpZXMsIG9wdHMsIGNvbmZpZyksXHJcbiAgICAgICAgcmFuZ2VzID0gX2NhbFlBeGlzRGF0YTIucmFuZ2VzO1xyXG5cclxuICAgIHZhciBfZ2V0WEF4aXNQb2ludHMyID0gZ2V0WEF4aXNQb2ludHMob3B0cy5jYXRlZ29yaWVzLCBvcHRzLCBjb25maWcpLFxyXG4gICAgICAgIHhBeGlzUG9pbnRzID0gX2dldFhBeGlzUG9pbnRzMi54QXhpc1BvaW50cyxcclxuICAgICAgICBlYWNoU3BhY2luZyA9IF9nZXRYQXhpc1BvaW50czIuZWFjaFNwYWNpbmc7XHJcblxyXG4gICAgdmFyIG1pblJhbmdlID0gcmFuZ2VzLnBvcCgpO1xyXG4gICAgdmFyIG1heFJhbmdlID0gcmFuZ2VzLnNoaWZ0KCk7XHJcbiAgICB2YXIgZW5kWSA9IG9wdHMuaGVpZ2h0IC0gY29uZmlnLnBhZGRpbmcgLSBjb25maWcueEF4aXNIZWlnaHQgLSBjb25maWcubGVnZW5kSGVpZ2h0O1xyXG4gICAgdmFyIGNhbFBvaW50cyA9IFtdO1xyXG5cclxuICAgIGNvbnRleHQuc2F2ZSgpO1xyXG4gICAgaWYgKG9wdHMuX3Njcm9sbERpc3RhbmNlXyAmJiBvcHRzLl9zY3JvbGxEaXN0YW5jZV8gIT09IDAgJiYgb3B0cy5lbmFibGVTY3JvbGwgPT09IHRydWUpIHtcclxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZShvcHRzLl9zY3JvbGxEaXN0YW5jZV8sIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRzLnRvb2x0aXAgJiYgb3B0cy50b29sdGlwLnRleHRMaXN0ICYmIG9wdHMudG9vbHRpcC50ZXh0TGlzdC5sZW5ndGggJiYgcHJvY2VzcyA9PT0gMSkge1xyXG4gICAgICAgIGRyYXdUb29sVGlwU3BsaXRMaW5lKG9wdHMudG9vbHRpcC5vZmZzZXQueCwgb3B0cywgY29uZmlnLCBjb250ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzZXJpZXMuZm9yRWFjaChmdW5jdGlvbiAoZWFjaFNlcmllcywgc2VyaWVzSW5kZXgpIHtcclxuICAgICAgICB2YXIgZGF0YSA9IGVhY2hTZXJpZXMuZGF0YTtcclxuICAgICAgICB2YXIgcG9pbnRzID0gZ2V0RGF0YVBvaW50cyhkYXRhLCBtaW5SYW5nZSwgbWF4UmFuZ2UsIHhBeGlzUG9pbnRzLCBlYWNoU3BhY2luZywgb3B0cywgY29uZmlnLCBwcm9jZXNzKTtcclxuICAgICAgICBjYWxQb2ludHMucHVzaChwb2ludHMpO1xyXG5cclxuICAgICAgICB2YXIgc3BsaXRQb2ludExpc3QgPSBzcGxpdFBvaW50cyhwb2ludHMpO1xyXG5cclxuICAgICAgICBzcGxpdFBvaW50TGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChwb2ludHMpIHtcclxuICAgICAgICAgICAgLy8g57uY5Yi25Yy65Z+f5pWw5o2uXHJcbiAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc2V0U3Ryb2tlU3R5bGUoZWFjaFNlcmllcy5jb2xvcik7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc2V0RmlsbFN0eWxlKGVhY2hTZXJpZXMuY29sb3IpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnNldEdsb2JhbEFscGhhKDAuNik7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc2V0TGluZVdpZHRoKDIpO1xyXG4gICAgICAgICAgICBpZiAocG9pbnRzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIHZhciBmaXJzdFBvaW50ID0gcG9pbnRzWzBdO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxhc3RQb2ludCA9IHBvaW50c1twb2ludHMubGVuZ3RoIC0gMV07XHJcblxyXG4gICAgICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8oZmlyc3RQb2ludC54LCBmaXJzdFBvaW50LnkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMuZXh0cmEubGluZVN0eWxlID09PSAnY3VydmUnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjdHJsUG9pbnQgPSBjcmVhdGVDdXJ2ZUNvbnRyb2xQb2ludHMocG9pbnRzLCBpbmRleCAtIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5iZXppZXJDdXJ2ZVRvKGN0cmxQb2ludC5jdHJBLngsIGN0cmxQb2ludC5jdHJBLnksIGN0cmxQb2ludC5jdHJCLngsIGN0cmxQb2ludC5jdHJCLnksIGl0ZW0ueCwgaXRlbS55KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwb2ludHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5saW5lVG8oaXRlbS54LCBpdGVtLnkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29udGV4dC5saW5lVG8obGFzdFBvaW50LngsIGVuZFkpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5saW5lVG8oZmlyc3RQb2ludC54LCBlbmRZKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVRvKGZpcnN0UG9pbnQueCwgZmlyc3RQb2ludC55KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gcG9pbnRzWzBdO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8oaXRlbS54IC0gZWFjaFNwYWNpbmcgLyAyLCBpdGVtLnkpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5saW5lVG8oaXRlbS54ICsgZWFjaFNwYWNpbmcgLyAyLCBpdGVtLnkpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5saW5lVG8oaXRlbS54ICsgZWFjaFNwYWNpbmcgLyAyLCBlbmRZKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVRvKGl0ZW0ueCAtIGVhY2hTcGFjaW5nIC8gMiwgZW5kWSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1vdmVUbyhpdGVtLnggLSBlYWNoU3BhY2luZyAvIDIsIGl0ZW0ueSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc2V0R2xvYmFsQWxwaGEoMSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChvcHRzLmRhdGFQb2ludFNoYXBlICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICB2YXIgc2hhcGUgPSBjb25maWcuZGF0YVBvaW50U2hhcGVbc2VyaWVzSW5kZXggJSBjb25maWcuZGF0YVBvaW50U2hhcGUubGVuZ3RoXTtcclxuICAgICAgICAgICAgZHJhd1BvaW50U2hhcGUocG9pbnRzLCBlYWNoU2VyaWVzLmNvbG9yLCBzaGFwZSwgY29udGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBpZiAob3B0cy5kYXRhTGFiZWwgIT09IGZhbHNlICYmIHByb2Nlc3MgPT09IDEpIHtcclxuICAgICAgICBzZXJpZXMuZm9yRWFjaChmdW5jdGlvbiAoZWFjaFNlcmllcywgc2VyaWVzSW5kZXgpIHtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSBlYWNoU2VyaWVzLmRhdGE7XHJcbiAgICAgICAgICAgIHZhciBwb2ludHMgPSBnZXREYXRhUG9pbnRzKGRhdGEsIG1pblJhbmdlLCBtYXhSYW5nZSwgeEF4aXNQb2ludHMsIGVhY2hTcGFjaW5nLCBvcHRzLCBjb25maWcsIHByb2Nlc3MpO1xyXG4gICAgICAgICAgICBkcmF3UG9pbnRUZXh0KHBvaW50cywgZWFjaFNlcmllcywgY29uZmlnLCBjb250ZXh0KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb250ZXh0LnJlc3RvcmUoKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHhBeGlzUG9pbnRzOiB4QXhpc1BvaW50cyxcclxuICAgICAgICBjYWxQb2ludHM6IGNhbFBvaW50cyxcclxuICAgICAgICBlYWNoU3BhY2luZzogZWFjaFNwYWNpbmdcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdMaW5lRGF0YVBvaW50cyhzZXJpZXMsIG9wdHMsIGNvbmZpZywgY29udGV4dCkge1xyXG4gICAgdmFyIHByb2Nlc3MgPSBhcmd1bWVudHMubGVuZ3RoID4gNCAmJiBhcmd1bWVudHNbNF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s0XSA6IDE7XHJcblxyXG4gICAgdmFyIF9jYWxZQXhpc0RhdGEzID0gY2FsWUF4aXNEYXRhKHNlcmllcywgb3B0cywgY29uZmlnKSxcclxuICAgICAgICByYW5nZXMgPSBfY2FsWUF4aXNEYXRhMy5yYW5nZXM7XHJcblxyXG4gICAgdmFyIF9nZXRYQXhpc1BvaW50czMgPSBnZXRYQXhpc1BvaW50cyhvcHRzLmNhdGVnb3JpZXMsIG9wdHMsIGNvbmZpZyksXHJcbiAgICAgICAgeEF4aXNQb2ludHMgPSBfZ2V0WEF4aXNQb2ludHMzLnhBeGlzUG9pbnRzLFxyXG4gICAgICAgIGVhY2hTcGFjaW5nID0gX2dldFhBeGlzUG9pbnRzMy5lYWNoU3BhY2luZztcclxuXHJcbiAgICB2YXIgbWluUmFuZ2UgPSByYW5nZXMucG9wKCk7XHJcbiAgICB2YXIgbWF4UmFuZ2UgPSByYW5nZXMuc2hpZnQoKTtcclxuICAgIHZhciBjYWxQb2ludHMgPSBbXTtcclxuXHJcbiAgICBjb250ZXh0LnNhdmUoKTtcclxuICAgIGlmIChvcHRzLl9zY3JvbGxEaXN0YW5jZV8gJiYgb3B0cy5fc2Nyb2xsRGlzdGFuY2VfICE9PSAwICYmIG9wdHMuZW5hYmxlU2Nyb2xsID09PSB0cnVlKSB7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUob3B0cy5fc2Nyb2xsRGlzdGFuY2VfLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAob3B0cy50b29sdGlwICYmIG9wdHMudG9vbHRpcC50ZXh0TGlzdCAmJiBvcHRzLnRvb2x0aXAudGV4dExpc3QubGVuZ3RoICYmIHByb2Nlc3MgPT09IDEpIHtcclxuICAgICAgICBkcmF3VG9vbFRpcFNwbGl0TGluZShvcHRzLnRvb2x0aXAub2Zmc2V0LngsIG9wdHMsIGNvbmZpZywgY29udGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VyaWVzLmZvckVhY2goZnVuY3Rpb24gKGVhY2hTZXJpZXMsIHNlcmllc0luZGV4KSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSBlYWNoU2VyaWVzLmRhdGE7XHJcbiAgICAgICAgdmFyIHBvaW50cyA9IGdldERhdGFQb2ludHMoZGF0YSwgbWluUmFuZ2UsIG1heFJhbmdlLCB4QXhpc1BvaW50cywgZWFjaFNwYWNpbmcsIG9wdHMsIGNvbmZpZywgcHJvY2Vzcyk7XHJcbiAgICAgICAgY2FsUG9pbnRzLnB1c2gocG9pbnRzKTtcclxuICAgICAgICB2YXIgc3BsaXRQb2ludExpc3QgPSBzcGxpdFBvaW50cyhwb2ludHMpO1xyXG5cclxuICAgICAgICBzcGxpdFBvaW50TGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChwb2ludHMsIGluZGV4KSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc2V0U3Ryb2tlU3R5bGUoZWFjaFNlcmllcy5jb2xvcik7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc2V0TGluZVdpZHRoKDIpO1xyXG4gICAgICAgICAgICBpZiAocG9pbnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8ocG9pbnRzWzBdLngsIHBvaW50c1swXS55KTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuYXJjKHBvaW50c1swXS54LCBwb2ludHNbMF0ueSwgMSwgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8ocG9pbnRzWzBdLngsIHBvaW50c1swXS55KTtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRzLmV4dHJhLmxpbmVTdHlsZSA9PT0gJ2N1cnZlJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50cy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3RybFBvaW50ID0gY3JlYXRlQ3VydmVDb250cm9sUG9pbnRzKHBvaW50cywgaW5kZXggLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuYmV6aWVyQ3VydmVUbyhjdHJsUG9pbnQuY3RyQS54LCBjdHJsUG9pbnQuY3RyQS55LCBjdHJsUG9pbnQuY3RyQi54LCBjdHJsUG9pbnQuY3RyQi55LCBpdGVtLngsIGl0ZW0ueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVRvKGl0ZW0ueCwgaXRlbS55KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8ocG9pbnRzWzBdLngsIHBvaW50c1swXS55KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAob3B0cy5kYXRhUG9pbnRTaGFwZSAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdmFyIHNoYXBlID0gY29uZmlnLmRhdGFQb2ludFNoYXBlW3Nlcmllc0luZGV4ICUgY29uZmlnLmRhdGFQb2ludFNoYXBlLmxlbmd0aF07XHJcbiAgICAgICAgICAgIGRyYXdQb2ludFNoYXBlKHBvaW50cywgZWFjaFNlcmllcy5jb2xvciwgc2hhcGUsIGNvbnRleHQpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgaWYgKG9wdHMuZGF0YUxhYmVsICE9PSBmYWxzZSAmJiBwcm9jZXNzID09PSAxKSB7XHJcbiAgICAgICAgc2VyaWVzLmZvckVhY2goZnVuY3Rpb24gKGVhY2hTZXJpZXMsIHNlcmllc0luZGV4KSB7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gZWFjaFNlcmllcy5kYXRhO1xyXG4gICAgICAgICAgICB2YXIgcG9pbnRzID0gZ2V0RGF0YVBvaW50cyhkYXRhLCBtaW5SYW5nZSwgbWF4UmFuZ2UsIHhBeGlzUG9pbnRzLCBlYWNoU3BhY2luZywgb3B0cywgY29uZmlnLCBwcm9jZXNzKTtcclxuICAgICAgICAgICAgZHJhd1BvaW50VGV4dChwb2ludHMsIGVhY2hTZXJpZXMsIGNvbmZpZywgY29udGV4dCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29udGV4dC5yZXN0b3JlKCk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB4QXhpc1BvaW50czogeEF4aXNQb2ludHMsXHJcbiAgICAgICAgY2FsUG9pbnRzOiBjYWxQb2ludHMsXHJcbiAgICAgICAgZWFjaFNwYWNpbmc6IGVhY2hTcGFjaW5nXHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3VG9vbFRpcEJyaWRnZShvcHRzLCBjb25maWcsIGNvbnRleHQsIHByb2Nlc3MpIHtcclxuICAgIGNvbnRleHQuc2F2ZSgpO1xyXG4gICAgaWYgKG9wdHMuX3Njcm9sbERpc3RhbmNlXyAmJiBvcHRzLl9zY3JvbGxEaXN0YW5jZV8gIT09IDAgJiYgb3B0cy5lbmFibGVTY3JvbGwgPT09IHRydWUpIHtcclxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZShvcHRzLl9zY3JvbGxEaXN0YW5jZV8sIDApO1xyXG4gICAgfVxyXG4gICAgaWYgKG9wdHMudG9vbHRpcCAmJiBvcHRzLnRvb2x0aXAudGV4dExpc3QgJiYgb3B0cy50b29sdGlwLnRleHRMaXN0Lmxlbmd0aCAmJiBwcm9jZXNzID09PSAxKSB7XHJcbiAgICAgICAgZHJhd1Rvb2xUaXAob3B0cy50b29sdGlwLnRleHRMaXN0LCBvcHRzLnRvb2x0aXAub2Zmc2V0LCBvcHRzLCBjb25maWcsIGNvbnRleHQpO1xyXG4gICAgfVxyXG4gICAgY29udGV4dC5yZXN0b3JlKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdYQXhpcyhjYXRlZ29yaWVzLCBvcHRzLCBjb25maWcsIGNvbnRleHQpIHtcclxuICAgIHZhciBfZ2V0WEF4aXNQb2ludHM0ID0gZ2V0WEF4aXNQb2ludHMoY2F0ZWdvcmllcywgb3B0cywgY29uZmlnKSxcclxuICAgICAgICB4QXhpc1BvaW50cyA9IF9nZXRYQXhpc1BvaW50czQueEF4aXNQb2ludHMsXHJcbiAgICAgICAgc3RhcnRYID0gX2dldFhBeGlzUG9pbnRzNC5zdGFydFgsXHJcbiAgICAgICAgZW5kWCA9IF9nZXRYQXhpc1BvaW50czQuZW5kWCxcclxuICAgICAgICBlYWNoU3BhY2luZyA9IF9nZXRYQXhpc1BvaW50czQuZWFjaFNwYWNpbmc7XHJcblxyXG4gICAgdmFyIHN0YXJ0WSA9IG9wdHMuaGVpZ2h0IC0gY29uZmlnLnBhZGRpbmcgLSBjb25maWcueEF4aXNIZWlnaHQgLSBjb25maWcubGVnZW5kSGVpZ2h0O1xyXG4gICAgdmFyIGVuZFkgPSBzdGFydFkgKyBjb25maWcueEF4aXNMaW5lSGVpZ2h0O1xyXG5cclxuICAgIGNvbnRleHQuc2F2ZSgpO1xyXG4gICAgaWYgKG9wdHMuX3Njcm9sbERpc3RhbmNlXyAmJiBvcHRzLl9zY3JvbGxEaXN0YW5jZV8gIT09IDApIHtcclxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZShvcHRzLl9zY3JvbGxEaXN0YW5jZV8sIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICBjb250ZXh0LnNldFN0cm9rZVN0eWxlKG9wdHMueEF4aXMuZ3JpZENvbG9yIHx8ICcjY2NjY2NjJyk7XHJcblxyXG4gICAgaWYgKG9wdHMueEF4aXMuZGlzYWJsZUdyaWQgIT09IHRydWUpIHtcclxuICAgICAgICBpZiAob3B0cy54QXhpcy50eXBlID09PSAnY2FsaWJyYXRpb24nKSB7XHJcbiAgICAgICAgICAgIHhBeGlzUG9pbnRzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8oaXRlbSAtIGVhY2hTcGFjaW5nIC8gMiwgc3RhcnRZKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbyhpdGVtIC0gZWFjaFNwYWNpbmcgLyAyLCBzdGFydFkgKyA0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeEF4aXNQb2ludHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQubW92ZVRvKGl0ZW0sIHN0YXJ0WSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbyhpdGVtLCBlbmRZKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcblxyXG4gICAgLy8g5a+5WOi9tOWIl+ihqOWBmuaKveeogOWkhOeQhlxyXG4gICAgdmFyIHZhbGlkV2lkdGggPSBvcHRzLndpZHRoIC0gMiAqIGNvbmZpZy5wYWRkaW5nIC0gY29uZmlnLnlBeGlzV2lkdGggLSBjb25maWcueUF4aXNUaXRsZVdpZHRoO1xyXG4gICAgdmFyIG1heFhBeGlzTGlzdExlbmd0aCA9IE1hdGgubWluKGNhdGVnb3JpZXMubGVuZ3RoLCBNYXRoLmNlaWwodmFsaWRXaWR0aCAvIGNvbmZpZy5mb250U2l6ZSAvIDEuNSkpO1xyXG4gICAgdmFyIHJhdGlvID0gTWF0aC5jZWlsKGNhdGVnb3JpZXMubGVuZ3RoIC8gbWF4WEF4aXNMaXN0TGVuZ3RoKTtcclxuXHJcbiAgICBjYXRlZ29yaWVzID0gY2F0ZWdvcmllcy5tYXAoZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgcmV0dXJuIGluZGV4ICUgcmF0aW8gIT09IDAgPyAnJyA6IGl0ZW07XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoY29uZmlnLl94QXhpc1RleHRBbmdsZV8gPT09IDApIHtcclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQuc2V0Rm9udFNpemUoY29uZmlnLmZvbnRTaXplKTtcclxuICAgICAgICBjb250ZXh0LnNldEZpbGxTdHlsZShvcHRzLnhBeGlzLmZvbnRDb2xvciB8fCAnIzY2NjY2NicpO1xyXG4gICAgICAgIGNhdGVnb3JpZXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgdmFyIG9mZnNldCA9IGVhY2hTcGFjaW5nIC8gMiAtIG1lYXN1cmVUZXh0KGl0ZW0pIC8gMjtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsVGV4dChpdGVtLCB4QXhpc1BvaW50c1tpbmRleF0gKyBvZmZzZXQsIHN0YXJ0WSArIGNvbmZpZy5mb250U2l6ZSArIDUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2F0ZWdvcmllcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xyXG4gICAgICAgICAgICBjb250ZXh0LnNhdmUoKTtcclxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY29udGV4dC5zZXRGb250U2l6ZShjb25maWcuZm9udFNpemUpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnNldEZpbGxTdHlsZShvcHRzLnhBeGlzLmZvbnRDb2xvciB8fCAnIzY2NjY2NicpO1xyXG4gICAgICAgICAgICB2YXIgdGV4dFdpZHRoID0gbWVhc3VyZVRleHQoaXRlbSk7XHJcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBlYWNoU3BhY2luZyAvIDIgLSB0ZXh0V2lkdGg7XHJcblxyXG4gICAgICAgICAgICB2YXIgX2NhbFJvdGF0ZVRyYW5zbGF0ZSA9IGNhbFJvdGF0ZVRyYW5zbGF0ZSh4QXhpc1BvaW50c1tpbmRleF0gKyBlYWNoU3BhY2luZyAvIDIsIHN0YXJ0WSArIGNvbmZpZy5mb250U2l6ZSAvIDIgKyA1LCBvcHRzLmhlaWdodCksXHJcbiAgICAgICAgICAgICAgICB0cmFuc1ggPSBfY2FsUm90YXRlVHJhbnNsYXRlLnRyYW5zWCxcclxuICAgICAgICAgICAgICAgIHRyYW5zWSA9IF9jYWxSb3RhdGVUcmFuc2xhdGUudHJhbnNZO1xyXG5cclxuICAgICAgICAgICAgY29udGV4dC5yb3RhdGUoLTEgKiBjb25maWcuX3hBeGlzVGV4dEFuZ2xlXyk7XHJcbiAgICAgICAgICAgIGNvbnRleHQudHJhbnNsYXRlKHRyYW5zWCwgdHJhbnNZKTtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsVGV4dChpdGVtLCB4QXhpc1BvaW50c1tpbmRleF0gKyBvZmZzZXQsIHN0YXJ0WSArIGNvbmZpZy5mb250U2l6ZSArIDUpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnJlc3RvcmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb250ZXh0LnJlc3RvcmUoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd1lBeGlzR3JpZChvcHRzLCBjb25maWcsIGNvbnRleHQpIHtcclxuICAgIHZhciBzcGFjaW5nVmFsaWQgPSBvcHRzLmhlaWdodCAtIDIgKiBjb25maWcucGFkZGluZyAtIGNvbmZpZy54QXhpc0hlaWdodCAtIGNvbmZpZy5sZWdlbmRIZWlnaHQ7XHJcbiAgICB2YXIgZWFjaFNwYWNpbmcgPSBNYXRoLmZsb29yKHNwYWNpbmdWYWxpZCAvIGNvbmZpZy55QXhpc1NwbGl0KTtcclxuICAgIHZhciB5QXhpc1RvdGFsV2lkdGggPSBjb25maWcueUF4aXNXaWR0aCArIGNvbmZpZy55QXhpc1RpdGxlV2lkdGg7XHJcbiAgICB2YXIgc3RhcnRYID0gY29uZmlnLnBhZGRpbmcgKyB5QXhpc1RvdGFsV2lkdGg7XHJcbiAgICB2YXIgZW5kWCA9IG9wdHMud2lkdGggLSBjb25maWcucGFkZGluZztcclxuXHJcbiAgICB2YXIgcG9pbnRzID0gW107XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbmZpZy55QXhpc1NwbGl0OyBpKyspIHtcclxuICAgICAgICBwb2ludHMucHVzaChjb25maWcucGFkZGluZyArIGVhY2hTcGFjaW5nICogaSk7XHJcbiAgICB9XHJcbiAgICBwb2ludHMucHVzaChjb25maWcucGFkZGluZyArIGVhY2hTcGFjaW5nICogY29uZmlnLnlBeGlzU3BsaXQgKyAyKTtcclxuXHJcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgY29udGV4dC5zZXRTdHJva2VTdHlsZShvcHRzLnlBeGlzLmdyaWRDb2xvciB8fCAnI2NjY2NjYycpO1xyXG4gICAgY29udGV4dC5zZXRMaW5lV2lkdGgoMSk7XHJcbiAgICBwb2ludHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICBjb250ZXh0Lm1vdmVUbyhzdGFydFgsIGl0ZW0pO1xyXG4gICAgICAgIGNvbnRleHQubGluZVRvKGVuZFgsIGl0ZW0pO1xyXG4gICAgfSk7XHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgY29udGV4dC5zdHJva2UoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd1lBeGlzKHNlcmllcywgb3B0cywgY29uZmlnLCBjb250ZXh0KSB7XHJcbiAgICBpZiAob3B0cy55QXhpcy5kaXNhYmxlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgX2NhbFlBeGlzRGF0YTQgPSBjYWxZQXhpc0RhdGEoc2VyaWVzLCBvcHRzLCBjb25maWcpLFxyXG4gICAgICAgIHJhbmdlc0Zvcm1hdCA9IF9jYWxZQXhpc0RhdGE0LnJhbmdlc0Zvcm1hdDtcclxuXHJcbiAgICB2YXIgeUF4aXNUb3RhbFdpZHRoID0gY29uZmlnLnlBeGlzV2lkdGggKyBjb25maWcueUF4aXNUaXRsZVdpZHRoO1xyXG5cclxuICAgIHZhciBzcGFjaW5nVmFsaWQgPSBvcHRzLmhlaWdodCAtIDIgKiBjb25maWcucGFkZGluZyAtIGNvbmZpZy54QXhpc0hlaWdodCAtIGNvbmZpZy5sZWdlbmRIZWlnaHQ7XHJcbiAgICB2YXIgZWFjaFNwYWNpbmcgPSBNYXRoLmZsb29yKHNwYWNpbmdWYWxpZCAvIGNvbmZpZy55QXhpc1NwbGl0KTtcclxuICAgIHZhciBzdGFydFggPSBjb25maWcucGFkZGluZyArIHlBeGlzVG90YWxXaWR0aDtcclxuICAgIHZhciBlbmRYID0gb3B0cy53aWR0aCAtIGNvbmZpZy5wYWRkaW5nO1xyXG4gICAgdmFyIGVuZFkgPSBvcHRzLmhlaWdodCAtIGNvbmZpZy5wYWRkaW5nIC0gY29uZmlnLnhBeGlzSGVpZ2h0IC0gY29uZmlnLmxlZ2VuZEhlaWdodDtcclxuXHJcbiAgICAvLyBzZXQgWUF4aXMgYmFja2dyb3VuZFxyXG4gICAgY29udGV4dC5zZXRGaWxsU3R5bGUob3B0cy5iYWNrZ3JvdW5kIHx8ICcjZmZmZmZmJyk7XHJcbiAgICBpZiAob3B0cy5fc2Nyb2xsRGlzdGFuY2VfIDwgMCkge1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgc3RhcnRYLCBlbmRZICsgY29uZmlnLnhBeGlzSGVpZ2h0ICsgNSk7XHJcbiAgICB9XHJcbiAgICBjb250ZXh0LmZpbGxSZWN0KGVuZFgsIDAsIG9wdHMud2lkdGgsIGVuZFkgKyBjb25maWcueEF4aXNIZWlnaHQgKyA1KTtcclxuXHJcbiAgICB2YXIgcG9pbnRzID0gW107XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8PSBjb25maWcueUF4aXNTcGxpdDsgaSsrKSB7XHJcbiAgICAgICAgcG9pbnRzLnB1c2goY29uZmlnLnBhZGRpbmcgKyBlYWNoU3BhY2luZyAqIGkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgY29udGV4dC5zZXRGb250U2l6ZShjb25maWcuZm9udFNpemUpO1xyXG4gICAgY29udGV4dC5zZXRGaWxsU3R5bGUob3B0cy55QXhpcy5mb250Q29sb3IgfHwgJyM2NjY2NjYnKTtcclxuICAgIHJhbmdlc0Zvcm1hdC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xyXG4gICAgICAgIHZhciBwb3MgPSBwb2ludHNbaW5kZXhdID8gcG9pbnRzW2luZGV4XSA6IGVuZFk7XHJcbiAgICAgICAgY29udGV4dC5maWxsVGV4dChpdGVtLCBjb25maWcucGFkZGluZyArIGNvbmZpZy55QXhpc1RpdGxlV2lkdGgsIHBvcyArIGNvbmZpZy5mb250U2l6ZSAvIDIpO1xyXG4gICAgfSk7XHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICBpZiAob3B0cy55QXhpcy50aXRsZSkge1xyXG4gICAgICAgIGRyYXdZQXhpc1RpdGxlKG9wdHMueUF4aXMudGl0bGUsIG9wdHMsIGNvbmZpZywgY29udGV4dCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdMZWdlbmQoc2VyaWVzLCBvcHRzLCBjb25maWcsIGNvbnRleHQpIHtcclxuICAgIGlmICghb3B0cy5sZWdlbmQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvLyBlYWNoIGxlZ2VuZCBzaGFwZSB3aWR0aCAxNXB4XHJcbiAgICAvLyB0aGUgc3BhY2luZyBiZXR3ZWVuIHNoYXBlIGFuZCB0ZXh0IGluIGVhY2ggbGVnZW5kIGlzIHRoZSBgcGFkZGluZ2BcclxuICAgIC8vIGVhY2ggbGVnZW5kIHNwYWNpbmcgaXMgdGhlIGBwYWRkaW5nYFxyXG4gICAgLy8gbGVnZW5kIG1hcmdpbiB0b3AgYGNvbmZpZy5wYWRkaW5nYFxyXG5cclxuICAgIHZhciBfY2FsTGVnZW5kRGF0YSA9IGNhbExlZ2VuZERhdGEoc2VyaWVzLCBvcHRzLCBjb25maWcpLFxyXG4gICAgICAgIGxlZ2VuZExpc3QgPSBfY2FsTGVnZW5kRGF0YS5sZWdlbmRMaXN0O1xyXG5cclxuICAgIHZhciBwYWRkaW5nID0gNTtcclxuICAgIHZhciBtYXJnaW5Ub3AgPSA4O1xyXG4gICAgdmFyIHNoYXBlV2lkdGggPSAxNTtcclxuICAgIGxlZ2VuZExpc3QuZm9yRWFjaChmdW5jdGlvbiAoaXRlbUxpc3QsIGxpc3RJbmRleCkge1xyXG4gICAgICAgIHZhciB3aWR0aCA9IDA7XHJcbiAgICAgICAgaXRlbUxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBpdGVtLm5hbWUgPSBpdGVtLm5hbWUgfHwgJ3VuZGVmaW5lZCc7XHJcbiAgICAgICAgICAgIHdpZHRoICs9IDMgKiBwYWRkaW5nICsgbWVhc3VyZVRleHQoaXRlbS5uYW1lKSArIHNoYXBlV2lkdGg7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIHN0YXJ0WCA9IChvcHRzLndpZHRoIC0gd2lkdGgpIC8gMiArIHBhZGRpbmc7XHJcbiAgICAgICAgdmFyIHN0YXJ0WSA9IG9wdHMuaGVpZ2h0IC0gY29uZmlnLnBhZGRpbmcgLSBjb25maWcubGVnZW5kSGVpZ2h0ICsgbGlzdEluZGV4ICogKGNvbmZpZy5mb250U2l6ZSArIG1hcmdpblRvcCkgKyBwYWRkaW5nICsgbWFyZ2luVG9wO1xyXG5cclxuICAgICAgICBjb250ZXh0LnNldEZvbnRTaXplKGNvbmZpZy5mb250U2l6ZSk7XHJcbiAgICAgICAgaXRlbUxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wdHMudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdsaW5lJzpcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LnNldExpbmVXaWR0aCgxKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuc2V0U3Ryb2tlU3R5bGUoaXRlbS5jb2xvcik7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1vdmVUbyhzdGFydFggLSAyLCBzdGFydFkgKyA1KTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVRvKHN0YXJ0WCArIDE3LCBzdGFydFkgKyA1KTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuc2V0TGluZVdpZHRoKDEpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5zZXRTdHJva2VTdHlsZSgnI2ZmZmZmZicpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5zZXRGaWxsU3R5bGUoaXRlbS5jb2xvcik7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1vdmVUbyhzdGFydFggKyA3LjUsIHN0YXJ0WSArIDUpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5hcmMoc3RhcnRYICsgNy41LCBzdGFydFkgKyA1LCA0LCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3BpZSc6XHJcbiAgICAgICAgICAgIGNhc2UgJ3JpbmcnOlxyXG4gICAgICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuc2V0RmlsbFN0eWxlKGl0ZW0uY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8oc3RhcnRYICsgNy41LCBzdGFydFkgKyA1KTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuYXJjKHN0YXJ0WCArIDcuNSwgc3RhcnRZICsgNSwgNywgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5zZXRGaWxsU3R5bGUoaXRlbS5jb2xvcik7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1vdmVUbyhzdGFydFgsIHN0YXJ0WSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LnJlY3Qoc3RhcnRYLCBzdGFydFksIDE1LCAxMCk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3RhcnRYICs9IHBhZGRpbmcgKyBzaGFwZVdpZHRoO1xyXG4gICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnNldEZpbGxTdHlsZShvcHRzLmV4dHJhLmxlZ2VuZFRleHRDb2xvciB8fCAnIzMzMzMzMycpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxUZXh0KGl0ZW0ubmFtZSwgc3RhcnRYLCBzdGFydFkgKyA5KTtcclxuICAgICAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICAgICAgc3RhcnRYICs9IG1lYXN1cmVUZXh0KGl0ZW0ubmFtZSkgKyAyICogcGFkZGluZztcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGRyYXdQaWVEYXRhUG9pbnRzKHNlcmllcywgb3B0cywgY29uZmlnLCBjb250ZXh0KSB7XHJcbiAgICB2YXIgcHJvY2VzcyA9IGFyZ3VtZW50cy5sZW5ndGggPiA0ICYmIGFyZ3VtZW50c1s0XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzRdIDogMTtcclxuXHJcbiAgICB2YXIgcGllT3B0aW9uID0gb3B0cy5leHRyYS5waWUgfHwge307XHJcbiAgICBzZXJpZXMgPSBnZXRQaWVEYXRhUG9pbnRzKHNlcmllcywgcHJvY2Vzcyk7XHJcbiAgICB2YXIgY2VudGVyUG9zaXRpb24gPSB7XHJcbiAgICAgICAgeDogb3B0cy53aWR0aCAvIDIsXHJcbiAgICAgICAgeTogKG9wdHMuaGVpZ2h0IC0gY29uZmlnLmxlZ2VuZEhlaWdodCkgLyAyXHJcbiAgICB9O1xyXG4gICAgdmFyIHJhZGl1cyA9IE1hdGgubWluKGNlbnRlclBvc2l0aW9uLnggLSBjb25maWcucGllQ2hhcnRMaW5lUGFkZGluZyAtIGNvbmZpZy5waWVDaGFydFRleHRQYWRkaW5nIC0gY29uZmlnLl9waWVUZXh0TWF4TGVuZ3RoXywgY2VudGVyUG9zaXRpb24ueSAtIGNvbmZpZy5waWVDaGFydExpbmVQYWRkaW5nIC0gY29uZmlnLnBpZUNoYXJ0VGV4dFBhZGRpbmcpO1xyXG4gICAgaWYgKG9wdHMuZGF0YUxhYmVsKSB7XHJcbiAgICAgICAgcmFkaXVzIC09IDEwO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByYWRpdXMgLT0gMiAqIGNvbmZpZy5wYWRkaW5nO1xyXG4gICAgfVxyXG4gICAgc2VyaWVzID0gc2VyaWVzLm1hcChmdW5jdGlvbiAoZWFjaFNlcmllcykge1xyXG4gICAgICAgIGVhY2hTZXJpZXMuX3N0YXJ0XyArPSAocGllT3B0aW9uLm9mZnNldEFuZ2xlIHx8IDApICogTWF0aC5QSSAvIDE4MDtcclxuICAgICAgICByZXR1cm4gZWFjaFNlcmllcztcclxuICAgIH0pO1xyXG4gICAgc2VyaWVzLmZvckVhY2goZnVuY3Rpb24gKGVhY2hTZXJpZXMpIHtcclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQuc2V0TGluZVdpZHRoKDIpO1xyXG4gICAgICAgIGNvbnRleHQuc2V0U3Ryb2tlU3R5bGUoJyNmZmZmZmYnKTtcclxuICAgICAgICBjb250ZXh0LnNldEZpbGxTdHlsZShlYWNoU2VyaWVzLmNvbG9yKTtcclxuICAgICAgICBjb250ZXh0Lm1vdmVUbyhjZW50ZXJQb3NpdGlvbi54LCBjZW50ZXJQb3NpdGlvbi55KTtcclxuICAgICAgICBjb250ZXh0LmFyYyhjZW50ZXJQb3NpdGlvbi54LCBjZW50ZXJQb3NpdGlvbi55LCByYWRpdXMsIGVhY2hTZXJpZXMuX3N0YXJ0XywgZWFjaFNlcmllcy5fc3RhcnRfICsgMiAqIGVhY2hTZXJpZXMuX3Byb3BvcnRpb25fICogTWF0aC5QSSk7XHJcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgICBpZiAob3B0cy5kaXNhYmxlUGllU3Ryb2tlICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKG9wdHMudHlwZSA9PT0gJ3JpbmcnKSB7XHJcbiAgICAgICAgdmFyIGlubmVyUGllV2lkdGggPSByYWRpdXMgKiAwLjY7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRzLmV4dHJhLnJpbmdXaWR0aCA9PT0gJ251bWJlcicgJiYgb3B0cy5leHRyYS5yaW5nV2lkdGggPiAwKSB7XHJcbiAgICAgICAgICAgIGlubmVyUGllV2lkdGggPSBNYXRoLm1heCgwLCByYWRpdXMgLSBvcHRzLmV4dHJhLnJpbmdXaWR0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC5zZXRGaWxsU3R5bGUob3B0cy5iYWNrZ3JvdW5kIHx8ICcjZmZmZmZmJyk7XHJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8oY2VudGVyUG9zaXRpb24ueCwgY2VudGVyUG9zaXRpb24ueSk7XHJcbiAgICAgICAgY29udGV4dC5hcmMoY2VudGVyUG9zaXRpb24ueCwgY2VudGVyUG9zaXRpb24ueSwgaW5uZXJQaWVXaWR0aCwgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9wdHMuZGF0YUxhYmVsICE9PSBmYWxzZSAmJiBwcm9jZXNzID09PSAxKSB7XHJcbiAgICAgICAgLy8gZml4IGh0dHBzOi8vZ2l0aHViLmNvbS94aWFvbGluMzMwMy93eC1jaGFydHMvaXNzdWVzLzEzMlxyXG4gICAgICAgIHZhciB2YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzZXJpZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHNlcmllc1tpXS5kYXRhID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFsaWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YWxpZCkge1xyXG4gICAgICAgICAgICBkcmF3UGllVGV4dChzZXJpZXMsIG9wdHMsIGNvbmZpZywgY29udGV4dCwgcmFkaXVzLCBjZW50ZXJQb3NpdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChwcm9jZXNzID09PSAxICYmIG9wdHMudHlwZSA9PT0gJ3JpbmcnKSB7XHJcbiAgICAgICAgZHJhd1JpbmdUaXRsZShvcHRzLCBjb25maWcsIGNvbnRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2VudGVyOiBjZW50ZXJQb3NpdGlvbixcclxuICAgICAgICByYWRpdXM6IHJhZGl1cyxcclxuICAgICAgICBzZXJpZXM6IHNlcmllc1xyXG4gICAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd1JhZGFyRGF0YVBvaW50cyhzZXJpZXMsIG9wdHMsIGNvbmZpZywgY29udGV4dCkge1xyXG4gICAgdmFyIHByb2Nlc3MgPSBhcmd1bWVudHMubGVuZ3RoID4gNCAmJiBhcmd1bWVudHNbNF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s0XSA6IDE7XHJcblxyXG4gICAgdmFyIHJhZGFyT3B0aW9uID0gb3B0cy5leHRyYS5yYWRhciB8fCB7fTtcclxuICAgIHZhciBjb29yZGluYXRlQW5nbGUgPSBnZXRSYWRhckNvb3JkaW5hdGVTZXJpZXMob3B0cy5jYXRlZ29yaWVzLmxlbmd0aCk7XHJcbiAgICB2YXIgY2VudGVyUG9zaXRpb24gPSB7XHJcbiAgICAgICAgeDogb3B0cy53aWR0aCAvIDIsXHJcbiAgICAgICAgeTogKG9wdHMuaGVpZ2h0IC0gY29uZmlnLmxlZ2VuZEhlaWdodCkgLyAyXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciByYWRpdXMgPSBNYXRoLm1pbihjZW50ZXJQb3NpdGlvbi54IC0gKGdldE1heFRleHRMaXN0TGVuZ3RoKG9wdHMuY2F0ZWdvcmllcykgKyBjb25maWcucmFkYXJMYWJlbFRleHRNYXJnaW4pLCBjZW50ZXJQb3NpdGlvbi55IC0gY29uZmlnLnJhZGFyTGFiZWxUZXh0TWFyZ2luKTtcclxuXHJcbiAgICByYWRpdXMgLT0gY29uZmlnLnBhZGRpbmc7XHJcblxyXG4gICAgLy8gZHJhdyBncmlkXHJcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgY29udGV4dC5zZXRMaW5lV2lkdGgoMSk7XHJcbiAgICBjb250ZXh0LnNldFN0cm9rZVN0eWxlKHJhZGFyT3B0aW9uLmdyaWRDb2xvciB8fCAnI2NjY2NjYycpO1xyXG4gICAgY29vcmRpbmF0ZUFuZ2xlLmZvckVhY2goZnVuY3Rpb24gKGFuZ2xlKSB7XHJcbiAgICAgICAgdmFyIHBvcyA9IGNvbnZlcnRDb29yZGluYXRlT3JpZ2luKHJhZGl1cyAqIE1hdGguY29zKGFuZ2xlKSwgcmFkaXVzICogTWF0aC5zaW4oYW5nbGUpLCBjZW50ZXJQb3NpdGlvbik7XHJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8oY2VudGVyUG9zaXRpb24ueCwgY2VudGVyUG9zaXRpb24ueSk7XHJcbiAgICAgICAgY29udGV4dC5saW5lVG8ocG9zLngsIHBvcy55KTtcclxuICAgIH0pO1xyXG4gICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcblxyXG4gICAgLy8gZHJhdyBzcGxpdCBsaW5lIGdyaWRcclxuXHJcbiAgICB2YXIgX2xvb3AgPSBmdW5jdGlvbiBfbG9vcChpKSB7XHJcbiAgICAgICAgdmFyIHN0YXJ0UG9zID0ge307XHJcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjb250ZXh0LnNldExpbmVXaWR0aCgxKTtcclxuICAgICAgICBjb250ZXh0LnNldFN0cm9rZVN0eWxlKHJhZGFyT3B0aW9uLmdyaWRDb2xvciB8fCAnI2NjY2NjYycpO1xyXG4gICAgICAgIGNvb3JkaW5hdGVBbmdsZS5mb3JFYWNoKGZ1bmN0aW9uIChhbmdsZSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgdmFyIHBvcyA9IGNvbnZlcnRDb29yZGluYXRlT3JpZ2luKHJhZGl1cyAvIGNvbmZpZy5yYWRhckdyaWRDb3VudCAqIGkgKiBNYXRoLmNvcyhhbmdsZSksIHJhZGl1cyAvIGNvbmZpZy5yYWRhckdyaWRDb3VudCAqIGkgKiBNYXRoLnNpbihhbmdsZSksIGNlbnRlclBvc2l0aW9uKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBzdGFydFBvcyA9IHBvcztcclxuICAgICAgICAgICAgICAgIGNvbnRleHQubW92ZVRvKHBvcy54LCBwb3MueSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbyhwb3MueCwgcG9zLnkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29udGV4dC5saW5lVG8oc3RhcnRQb3MueCwgc3RhcnRQb3MueSk7XHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8PSBjb25maWcucmFkYXJHcmlkQ291bnQ7IGkrKykge1xyXG4gICAgICAgIF9sb29wKGkpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciByYWRhckRhdGFQb2ludHMgPSBnZXRSYWRhckRhdGFQb2ludHMoY29vcmRpbmF0ZUFuZ2xlLCBjZW50ZXJQb3NpdGlvbiwgcmFkaXVzLCBzZXJpZXMsIG9wdHMsIHByb2Nlc3MpO1xyXG4gICAgcmFkYXJEYXRhUG9pbnRzLmZvckVhY2goZnVuY3Rpb24gKGVhY2hTZXJpZXMsIHNlcmllc0luZGV4KSB7XHJcbiAgICAgICAgLy8g57uY5Yi25Yy65Z+f5pWw5o2uXHJcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjb250ZXh0LnNldEZpbGxTdHlsZShlYWNoU2VyaWVzLmNvbG9yKTtcclxuICAgICAgICBjb250ZXh0LnNldEdsb2JhbEFscGhhKDAuNik7XHJcbiAgICAgICAgZWFjaFNlcmllcy5kYXRhLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8oaXRlbS5wb3NpdGlvbi54LCBpdGVtLnBvc2l0aW9uLnkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5saW5lVG8oaXRlbS5wb3NpdGlvbi54LCBpdGVtLnBvc2l0aW9uLnkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgICBjb250ZXh0LnNldEdsb2JhbEFscGhhKDEpO1xyXG5cclxuICAgICAgICBpZiAob3B0cy5kYXRhUG9pbnRTaGFwZSAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdmFyIHNoYXBlID0gY29uZmlnLmRhdGFQb2ludFNoYXBlW3Nlcmllc0luZGV4ICUgY29uZmlnLmRhdGFQb2ludFNoYXBlLmxlbmd0aF07XHJcbiAgICAgICAgICAgIHZhciBwb2ludHMgPSBlYWNoU2VyaWVzLmRhdGEubWFwKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5wb3NpdGlvbjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGRyYXdQb2ludFNoYXBlKHBvaW50cywgZWFjaFNlcmllcy5jb2xvciwgc2hhcGUsIGNvbnRleHQpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLy8gZHJhdyBsYWJlbCB0ZXh0XHJcbiAgICBkcmF3UmFkYXJMYWJlbChjb29yZGluYXRlQW5nbGUsIHJhZGl1cywgY2VudGVyUG9zaXRpb24sIG9wdHMsIGNvbmZpZywgY29udGV4dCk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjZW50ZXI6IGNlbnRlclBvc2l0aW9uLFxyXG4gICAgICAgIHJhZGl1czogcmFkaXVzLFxyXG4gICAgICAgIGFuZ2xlTGlzdDogY29vcmRpbmF0ZUFuZ2xlXHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3Q2FudmFzKG9wdHMsIGNvbnRleHQpIHtcclxuICAgIGNvbnRleHQuZHJhdygpO1xyXG59XHJcblxyXG52YXIgVGltaW5nID0ge1xyXG4gICAgZWFzZUluOiBmdW5jdGlvbiBlYXNlSW4ocG9zKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgucG93KHBvcywgMyk7XHJcbiAgICB9LFxyXG5cclxuICAgIGVhc2VPdXQ6IGZ1bmN0aW9uIGVhc2VPdXQocG9zKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgucG93KHBvcyAtIDEsIDMpICsgMTtcclxuICAgIH0sXHJcblxyXG4gICAgZWFzZUluT3V0OiBmdW5jdGlvbiBlYXNlSW5PdXQocG9zKSB7XHJcbiAgICAgICAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDAuNSAqIE1hdGgucG93KHBvcywgMyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIDAuNSAqIChNYXRoLnBvdyhwb3MgLSAyLCAzKSArIDIpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgbGluZWFyOiBmdW5jdGlvbiBsaW5lYXIocG9zKSB7XHJcbiAgICAgICAgcmV0dXJuIHBvcztcclxuICAgIH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIEFuaW1hdGlvbihvcHRzKSB7XHJcbiAgICB0aGlzLmlzU3RvcCA9IGZhbHNlO1xyXG4gICAgb3B0cy5kdXJhdGlvbiA9IHR5cGVvZiBvcHRzLmR1cmF0aW9uID09PSAndW5kZWZpbmVkJyA/IDEwMDAgOiBvcHRzLmR1cmF0aW9uO1xyXG4gICAgb3B0cy50aW1pbmcgPSBvcHRzLnRpbWluZyB8fCAnbGluZWFyJztcclxuXHJcbiAgICB2YXIgZGVsYXkgPSAxNztcclxuXHJcbiAgICB2YXIgY3JlYXRlQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiBjcmVhdGVBbmltYXRpb25GcmFtZSgpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3RBbmltYXRpb25GcmFtZTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHN0ZXAsIGRlbGF5KSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGltZVN0YW1wID0gK25ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RlcCh0aW1lU3RhbXApO1xyXG4gICAgICAgICAgICAgICAgfSwgZGVsYXkpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoc3RlcCkge1xyXG4gICAgICAgICAgICAgICAgc3RlcChudWxsKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdmFyIGFuaW1hdGlvbkZyYW1lID0gY3JlYXRlQW5pbWF0aW9uRnJhbWUoKTtcclxuICAgIHZhciBzdGFydFRpbWVTdGFtcCA9IG51bGw7XHJcbiAgICB2YXIgX3N0ZXAgPSBmdW5jdGlvbiBzdGVwKHRpbWVzdGFtcCkge1xyXG4gICAgICAgIGlmICh0aW1lc3RhbXAgPT09IG51bGwgfHwgdGhpcy5pc1N0b3AgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgb3B0cy5vblByb2Nlc3MgJiYgb3B0cy5vblByb2Nlc3MoMSk7XHJcbiAgICAgICAgICAgIG9wdHMub25BbmltYXRpb25GaW5pc2ggJiYgb3B0cy5vbkFuaW1hdGlvbkZpbmlzaCgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzdGFydFRpbWVTdGFtcCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBzdGFydFRpbWVTdGFtcCA9IHRpbWVzdGFtcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRpbWVzdGFtcCAtIHN0YXJ0VGltZVN0YW1wIDwgb3B0cy5kdXJhdGlvbikge1xyXG4gICAgICAgICAgICB2YXIgcHJvY2VzcyA9ICh0aW1lc3RhbXAgLSBzdGFydFRpbWVTdGFtcCkgLyBvcHRzLmR1cmF0aW9uO1xyXG4gICAgICAgICAgICB2YXIgdGltaW5nRnVuY3Rpb24gPSBUaW1pbmdbb3B0cy50aW1pbmddO1xyXG4gICAgICAgICAgICBwcm9jZXNzID0gdGltaW5nRnVuY3Rpb24ocHJvY2Vzcyk7XHJcbiAgICAgICAgICAgIG9wdHMub25Qcm9jZXNzICYmIG9wdHMub25Qcm9jZXNzKHByb2Nlc3MpO1xyXG4gICAgICAgICAgICBhbmltYXRpb25GcmFtZShfc3RlcCwgZGVsYXkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG9wdHMub25Qcm9jZXNzICYmIG9wdHMub25Qcm9jZXNzKDEpO1xyXG4gICAgICAgICAgICBvcHRzLm9uQW5pbWF0aW9uRmluaXNoICYmIG9wdHMub25BbmltYXRpb25GaW5pc2goKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgX3N0ZXAgPSBfc3RlcC5iaW5kKHRoaXMpO1xyXG5cclxuICAgIGFuaW1hdGlvbkZyYW1lKF9zdGVwLCBkZWxheSk7XHJcbn1cclxuXHJcbi8vIHN0b3AgYW5pbWF0aW9uIGltbWVkaWF0ZWx5XHJcbi8vIGFuZCB0aWdnZXIgb25BbmltYXRpb25GaW5pc2hcclxuQW5pbWF0aW9uLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5pc1N0b3AgPSB0cnVlO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gZHJhd0NoYXJ0cyh0eXBlLCBvcHRzLCBjb25maWcsIGNvbnRleHQpIHtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgdmFyIHNlcmllcyA9IG9wdHMuc2VyaWVzO1xyXG4gICAgdmFyIGNhdGVnb3JpZXMgPSBvcHRzLmNhdGVnb3JpZXM7XHJcbiAgICBzZXJpZXMgPSBmaWxsU2VyaWVzQ29sb3Ioc2VyaWVzLCBjb25maWcpO1xyXG5cclxuICAgIHZhciBfY2FsTGVnZW5kRGF0YSA9IGNhbExlZ2VuZERhdGEoc2VyaWVzLCBvcHRzLCBjb25maWcpLFxyXG4gICAgICAgIGxlZ2VuZEhlaWdodCA9IF9jYWxMZWdlbmREYXRhLmxlZ2VuZEhlaWdodDtcclxuXHJcbiAgICBjb25maWcubGVnZW5kSGVpZ2h0ID0gbGVnZW5kSGVpZ2h0O1xyXG5cclxuICAgIHZhciBfY2FsWUF4aXNEYXRhID0gY2FsWUF4aXNEYXRhKHNlcmllcywgb3B0cywgY29uZmlnKSxcclxuICAgICAgICB5QXhpc1dpZHRoID0gX2NhbFlBeGlzRGF0YS55QXhpc1dpZHRoO1xyXG5cclxuICAgIGNvbmZpZy55QXhpc1dpZHRoID0geUF4aXNXaWR0aDtcclxuICAgIGlmIChjYXRlZ29yaWVzICYmIGNhdGVnb3JpZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgdmFyIF9jYWxDYXRlZ29yaWVzRGF0YSA9IGNhbENhdGVnb3JpZXNEYXRhKGNhdGVnb3JpZXMsIG9wdHMsIGNvbmZpZyksXHJcbiAgICAgICAgICAgIHhBeGlzSGVpZ2h0ID0gX2NhbENhdGVnb3JpZXNEYXRhLnhBeGlzSGVpZ2h0LFxyXG4gICAgICAgICAgICBhbmdsZSA9IF9jYWxDYXRlZ29yaWVzRGF0YS5hbmdsZTtcclxuXHJcbiAgICAgICAgY29uZmlnLnhBeGlzSGVpZ2h0ID0geEF4aXNIZWlnaHQ7XHJcbiAgICAgICAgY29uZmlnLl94QXhpc1RleHRBbmdsZV8gPSBhbmdsZTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlID09PSAncGllJyB8fCB0eXBlID09PSAncmluZycpIHtcclxuICAgICAgICBjb25maWcuX3BpZVRleHRNYXhMZW5ndGhfID0gb3B0cy5kYXRhTGFiZWwgPT09IGZhbHNlID8gMCA6IGdldFBpZVRleHRNYXhMZW5ndGgoc2VyaWVzKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZHVyYXRpb24gPSBvcHRzLmFuaW1hdGlvbiA/IDEwMDAgOiAwO1xyXG4gICAgdGhpcy5hbmltYXRpb25JbnN0YW5jZSAmJiB0aGlzLmFuaW1hdGlvbkluc3RhbmNlLnN0b3AoKTtcclxuICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgY2FzZSAnbGluZSc6XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25JbnN0YW5jZSA9IG5ldyBBbmltYXRpb24oe1xyXG4gICAgICAgICAgICB0aW1pbmc6ICdlYXNlSW4nLFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXHJcbiAgICAgICAgICAgIG9uUHJvY2VzczogZnVuY3Rpb24gb25Qcm9jZXNzKHByb2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgIGRyYXdZQXhpc0dyaWQob3B0cywgY29uZmlnLCBjb250ZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgX2RyYXdMaW5lRGF0YVBvaW50cyA9IGRyYXdMaW5lRGF0YVBvaW50cyhzZXJpZXMsIG9wdHMsIGNvbmZpZywgY29udGV4dCwgcHJvY2VzcyksXHJcbiAgICAgICAgICAgICAgICAgICAgeEF4aXNQb2ludHMgPSBfZHJhd0xpbmVEYXRhUG9pbnRzLnhBeGlzUG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbFBvaW50cyA9IF9kcmF3TGluZURhdGFQb2ludHMuY2FsUG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgIGVhY2hTcGFjaW5nID0gX2RyYXdMaW5lRGF0YVBvaW50cy5lYWNoU3BhY2luZztcclxuXHJcbiAgICAgICAgICAgICAgICBfdGhpcy5jaGFydERhdGEueEF4aXNQb2ludHMgPSB4QXhpc1BvaW50cztcclxuICAgICAgICAgICAgICAgIF90aGlzLmNoYXJ0RGF0YS5jYWxQb2ludHMgPSBjYWxQb2ludHM7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5jaGFydERhdGEuZWFjaFNwYWNpbmcgPSBlYWNoU3BhY2luZztcclxuICAgICAgICAgICAgICAgIGRyYXdYQXhpcyhjYXRlZ29yaWVzLCBvcHRzLCBjb25maWcsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgZHJhd0xlZ2VuZChvcHRzLnNlcmllcywgb3B0cywgY29uZmlnLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIGRyYXdZQXhpcyhzZXJpZXMsIG9wdHMsIGNvbmZpZywgY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICBkcmF3VG9vbFRpcEJyaWRnZShvcHRzLCBjb25maWcsIGNvbnRleHQsIHByb2Nlc3MpO1xyXG4gICAgICAgICAgICAgICAgZHJhd0NhbnZhcyhvcHRzLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25BbmltYXRpb25GaW5pc2g6IGZ1bmN0aW9uIG9uQW5pbWF0aW9uRmluaXNoKCkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuZXZlbnQudHJpZ2dlcigncmVuZGVyQ29tcGxldGUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnY29sdW1uJzpcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbkluc3RhbmNlID0gbmV3IEFuaW1hdGlvbih7XHJcbiAgICAgICAgICAgIHRpbWluZzogJ2Vhc2VJbicsXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcclxuICAgICAgICAgICAgb25Qcm9jZXNzOiBmdW5jdGlvbiBvblByb2Nlc3MocHJvY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgZHJhd1lBeGlzR3JpZChvcHRzLCBjb25maWcsIGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBfZHJhd0NvbHVtbkRhdGFQb2ludHMgPSBkcmF3Q29sdW1uRGF0YVBvaW50cyhzZXJpZXMsIG9wdHMsIGNvbmZpZywgY29udGV4dCwgcHJvY2VzcyksXHJcbiAgICAgICAgICAgICAgICAgICAgeEF4aXNQb2ludHMgPSBfZHJhd0NvbHVtbkRhdGFQb2ludHMueEF4aXNQb2ludHMsXHJcbiAgICAgICAgICAgICAgICAgICAgZWFjaFNwYWNpbmcgPSBfZHJhd0NvbHVtbkRhdGFQb2ludHMuZWFjaFNwYWNpbmc7XHJcblxyXG4gICAgICAgICAgICAgICAgX3RoaXMuY2hhcnREYXRhLnhBeGlzUG9pbnRzID0geEF4aXNQb2ludHM7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5jaGFydERhdGEuZWFjaFNwYWNpbmcgPSBlYWNoU3BhY2luZztcclxuICAgICAgICAgICAgICAgIGRyYXdYQXhpcyhjYXRlZ29yaWVzLCBvcHRzLCBjb25maWcsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgZHJhd0xlZ2VuZChvcHRzLnNlcmllcywgb3B0cywgY29uZmlnLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIGRyYXdZQXhpcyhzZXJpZXMsIG9wdHMsIGNvbmZpZywgY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICBkcmF3Q2FudmFzKG9wdHMsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkFuaW1hdGlvbkZpbmlzaDogZnVuY3Rpb24gb25BbmltYXRpb25GaW5pc2goKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5ldmVudC50cmlnZ2VyKCdyZW5kZXJDb21wbGV0ZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdhcmVhJzpcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbkluc3RhbmNlID0gbmV3IEFuaW1hdGlvbih7XHJcbiAgICAgICAgICAgIHRpbWluZzogJ2Vhc2VJbicsXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcclxuICAgICAgICAgICAgb25Qcm9jZXNzOiBmdW5jdGlvbiBvblByb2Nlc3MocHJvY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgZHJhd1lBeGlzR3JpZChvcHRzLCBjb25maWcsIGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBfZHJhd0FyZWFEYXRhUG9pbnRzID0gZHJhd0FyZWFEYXRhUG9pbnRzKHNlcmllcywgb3B0cywgY29uZmlnLCBjb250ZXh0LCBwcm9jZXNzKSxcclxuICAgICAgICAgICAgICAgICAgICB4QXhpc1BvaW50cyA9IF9kcmF3QXJlYURhdGFQb2ludHMueEF4aXNQb2ludHMsXHJcbiAgICAgICAgICAgICAgICAgICAgY2FsUG9pbnRzID0gX2RyYXdBcmVhRGF0YVBvaW50cy5jYWxQb2ludHMsXHJcbiAgICAgICAgICAgICAgICAgICAgZWFjaFNwYWNpbmcgPSBfZHJhd0FyZWFEYXRhUG9pbnRzLmVhY2hTcGFjaW5nO1xyXG5cclxuICAgICAgICAgICAgICAgIF90aGlzLmNoYXJ0RGF0YS54QXhpc1BvaW50cyA9IHhBeGlzUG9pbnRzO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuY2hhcnREYXRhLmNhbFBvaW50cyA9IGNhbFBvaW50cztcclxuICAgICAgICAgICAgICAgIF90aGlzLmNoYXJ0RGF0YS5lYWNoU3BhY2luZyA9IGVhY2hTcGFjaW5nO1xyXG4gICAgICAgICAgICAgICAgZHJhd1hBeGlzKGNhdGVnb3JpZXMsIG9wdHMsIGNvbmZpZywgY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICBkcmF3TGVnZW5kKG9wdHMuc2VyaWVzLCBvcHRzLCBjb25maWcsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgZHJhd1lBeGlzKHNlcmllcywgb3B0cywgY29uZmlnLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIGRyYXdUb29sVGlwQnJpZGdlKG9wdHMsIGNvbmZpZywgY29udGV4dCwgcHJvY2Vzcyk7XHJcbiAgICAgICAgICAgICAgICBkcmF3Q2FudmFzKG9wdHMsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkFuaW1hdGlvbkZpbmlzaDogZnVuY3Rpb24gb25BbmltYXRpb25GaW5pc2goKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5ldmVudC50cmlnZ2VyKCdyZW5kZXJDb21wbGV0ZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdyaW5nJzpcclxuICAgIGNhc2UgJ3BpZSc6XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25JbnN0YW5jZSA9IG5ldyBBbmltYXRpb24oe1xyXG4gICAgICAgICAgICB0aW1pbmc6ICdlYXNlSW5PdXQnLFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXHJcbiAgICAgICAgICAgIG9uUHJvY2VzczogZnVuY3Rpb24gb25Qcm9jZXNzKHByb2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLmNoYXJ0RGF0YS5waWVEYXRhID0gZHJhd1BpZURhdGFQb2ludHMoc2VyaWVzLCBvcHRzLCBjb25maWcsIGNvbnRleHQsIHByb2Nlc3MpO1xyXG4gICAgICAgICAgICAgICAgZHJhd0xlZ2VuZChvcHRzLnNlcmllcywgb3B0cywgY29uZmlnLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIGRyYXdDYW52YXMob3B0cywgY29udGV4dCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uQW5pbWF0aW9uRmluaXNoOiBmdW5jdGlvbiBvbkFuaW1hdGlvbkZpbmlzaCgpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLmV2ZW50LnRyaWdnZXIoJ3JlbmRlckNvbXBsZXRlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgIGNhc2UgJ3JhZGFyJzpcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbkluc3RhbmNlID0gbmV3IEFuaW1hdGlvbih7XHJcbiAgICAgICAgICAgIHRpbWluZzogJ2Vhc2VJbk91dCcsXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcclxuICAgICAgICAgICAgb25Qcm9jZXNzOiBmdW5jdGlvbiBvblByb2Nlc3MocHJvY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuY2hhcnREYXRhLnJhZGFyRGF0YSA9IGRyYXdSYWRhckRhdGFQb2ludHMoc2VyaWVzLCBvcHRzLCBjb25maWcsIGNvbnRleHQsIHByb2Nlc3MpO1xyXG4gICAgICAgICAgICAgICAgZHJhd0xlZ2VuZChvcHRzLnNlcmllcywgb3B0cywgY29uZmlnLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIGRyYXdDYW52YXMob3B0cywgY29udGV4dCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uQW5pbWF0aW9uRmluaXNoOiBmdW5jdGlvbiBvbkFuaW1hdGlvbkZpbmlzaCgpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLmV2ZW50LnRyaWdnZXIoJ3JlbmRlckNvbXBsZXRlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxufVxyXG5cclxuLy8gc2ltcGxlIGV2ZW50IGltcGxlbWVudFxyXG5cclxuZnVuY3Rpb24gRXZlbnQoKSB7XHJcbiAgICB0aGlzLmV2ZW50cyA9IHt9O1xyXG59XHJcblxyXG5FdmVudC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uICh0eXBlLCBsaXN0ZW5lcikge1xyXG4gICAgdGhpcy5ldmVudHNbdHlwZV0gPSB0aGlzLmV2ZW50c1t0eXBlXSB8fCBbXTtcclxuICAgIHRoaXMuZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xyXG59O1xyXG5cclxuRXZlbnQucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xyXG4gICAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHR5cGUgPSBhcmdzWzBdO1xyXG4gICAgdmFyIHBhcmFtcyA9IGFyZ3Muc2xpY2UoMSk7XHJcbiAgICBpZiAodGhpcy5ldmVudHNbdHlwZV0pIHtcclxuICAgICAgICB0aGlzLmV2ZW50c1t0eXBlXS5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgbGlzdGVuZXIuYXBwbHkobnVsbCwgcGFyYW1zKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxudmFyIENoYXJ0cyA9IGZ1bmN0aW9uIENoYXJ0cyhvcHRzKSB7XHJcbiAgICBvcHRzLnRpdGxlID0gb3B0cy50aXRsZSB8fCB7fTtcclxuICAgIG9wdHMuc3VidGl0bGUgPSBvcHRzLnN1YnRpdGxlIHx8IHt9O1xyXG4gICAgb3B0cy55QXhpcyA9IG9wdHMueUF4aXMgfHwge307XHJcbiAgICBvcHRzLnhBeGlzID0gb3B0cy54QXhpcyB8fCB7fTtcclxuICAgIG9wdHMuZXh0cmEgPSBvcHRzLmV4dHJhIHx8IHt9O1xyXG4gICAgb3B0cy5sZWdlbmQgPSBvcHRzLmxlZ2VuZCAhPT0gZmFsc2U7XHJcbiAgICBvcHRzLmFuaW1hdGlvbiA9IG9wdHMuYW5pbWF0aW9uICE9PSBmYWxzZTtcclxuICAgIHZhciBjb25maWckJDEgPSBhc3NpZ24oe30sIGNvbmZpZyk7XHJcbiAgICBjb25maWckJDEueUF4aXNUaXRsZVdpZHRoID0gb3B0cy55QXhpcy5kaXNhYmxlZCAhPT0gdHJ1ZSAmJiBvcHRzLnlBeGlzLnRpdGxlID8gY29uZmlnJCQxLnlBeGlzVGl0bGVXaWR0aCA6IDA7XHJcbiAgICBjb25maWckJDEucGllQ2hhcnRMaW5lUGFkZGluZyA9IG9wdHMuZGF0YUxhYmVsID09PSBmYWxzZSA/IDAgOiBjb25maWckJDEucGllQ2hhcnRMaW5lUGFkZGluZztcclxuICAgIGNvbmZpZyQkMS5waWVDaGFydFRleHRQYWRkaW5nID0gb3B0cy5kYXRhTGFiZWwgPT09IGZhbHNlID8gMCA6IGNvbmZpZyQkMS5waWVDaGFydFRleHRQYWRkaW5nO1xyXG5cclxuICAgIHRoaXMub3B0cyA9IG9wdHM7XHJcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZyQkMTtcclxuICAgIHRoaXMuY29udGV4dCA9IHd4LmNyZWF0ZUNhbnZhc0NvbnRleHQob3B0cy5jYW52YXNJZCk7XHJcbiAgICAvLyBzdG9yZSBjYWxjdWF0ZWQgY2hhcnQgZGF0YVxyXG4gICAgLy8gc3VjaCBhcyBjaGFydCBwb2ludCBjb29yZGluYXRlXHJcbiAgICB0aGlzLmNoYXJ0RGF0YSA9IHt9O1xyXG4gICAgdGhpcy5ldmVudCA9IG5ldyBFdmVudCgpO1xyXG4gICAgdGhpcy5zY3JvbGxPcHRpb24gPSB7XHJcbiAgICAgICAgY3VycmVudE9mZnNldDogMCxcclxuICAgICAgICBzdGFydFRvdWNoWDogMCxcclxuICAgICAgICBkaXN0YW5jZTogMFxyXG4gICAgfTtcclxuXHJcbiAgICBkcmF3Q2hhcnRzLmNhbGwodGhpcywgb3B0cy50eXBlLCBvcHRzLCBjb25maWckJDEsIHRoaXMuY29udGV4dCk7XHJcbn07XHJcblxyXG5DaGFydHMucHJvdG90eXBlLnVwZGF0ZURhdGEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZGF0YSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XHJcblxyXG4gICAgdGhpcy5vcHRzLnNlcmllcyA9IGRhdGEuc2VyaWVzIHx8IHRoaXMub3B0cy5zZXJpZXM7XHJcbiAgICB0aGlzLm9wdHMuY2F0ZWdvcmllcyA9IGRhdGEuY2F0ZWdvcmllcyB8fCB0aGlzLm9wdHMuY2F0ZWdvcmllcztcclxuXHJcbiAgICB0aGlzLm9wdHMudGl0bGUgPSBhc3NpZ24oe30sIHRoaXMub3B0cy50aXRsZSwgZGF0YS50aXRsZSB8fCB7fSk7XHJcbiAgICB0aGlzLm9wdHMuc3VidGl0bGUgPSBhc3NpZ24oe30sIHRoaXMub3B0cy5zdWJ0aXRsZSwgZGF0YS5zdWJ0aXRsZSB8fCB7fSk7XHJcblxyXG4gICAgZHJhd0NoYXJ0cy5jYWxsKHRoaXMsIHRoaXMub3B0cy50eXBlLCB0aGlzLm9wdHMsIHRoaXMuY29uZmlnLCB0aGlzLmNvbnRleHQpO1xyXG59O1xyXG5cclxuQ2hhcnRzLnByb3RvdHlwZS5zdG9wQW5pbWF0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5hbmltYXRpb25JbnN0YW5jZSAmJiB0aGlzLmFuaW1hdGlvbkluc3RhbmNlLnN0b3AoKTtcclxufTtcclxuXHJcbkNoYXJ0cy5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uICh0eXBlLCBsaXN0ZW5lcikge1xyXG4gICAgdGhpcy5ldmVudC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKTtcclxufTtcclxuXHJcbkNoYXJ0cy5wcm90b3R5cGUuZ2V0Q3VycmVudERhdGFJbmRleCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICB2YXIgdG91Y2hlcyA9IGUudG91Y2hlcyAmJiBlLnRvdWNoZXMubGVuZ3RoID8gZS50b3VjaGVzIDogZS5jaGFuZ2VkVG91Y2hlcztcclxuICAgIGlmICh0b3VjaGVzICYmIHRvdWNoZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgdmFyIF90b3VjaGVzJCA9IHRvdWNoZXNbMF0sXHJcbiAgICAgICAgICAgIHggPSBfdG91Y2hlcyQueCxcclxuICAgICAgICAgICAgeSA9IF90b3VjaGVzJC55O1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vcHRzLnR5cGUgPT09ICdwaWUnIHx8IHRoaXMub3B0cy50eXBlID09PSAncmluZycpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbmRQaWVDaGFydEN1cnJlbnRJbmRleCh7IHg6IHgsIHk6IHkgfSwgdGhpcy5jaGFydERhdGEucGllRGF0YSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdHMudHlwZSA9PT0gJ3JhZGFyJykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmluZFJhZGFyQ2hhcnRDdXJyZW50SW5kZXgoeyB4OiB4LCB5OiB5IH0sIHRoaXMuY2hhcnREYXRhLnJhZGFyRGF0YSwgdGhpcy5vcHRzLmNhdGVnb3JpZXMubGVuZ3RoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmluZEN1cnJlbnRJbmRleCh7IHg6IHgsIHk6IHkgfSwgdGhpcy5jaGFydERhdGEueEF4aXNQb2ludHMsIHRoaXMub3B0cywgdGhpcy5jb25maWcsIE1hdGguYWJzKHRoaXMuc2Nyb2xsT3B0aW9uLmN1cnJlbnRPZmZzZXQpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gLTE7XHJcbn07XHJcblxyXG5DaGFydHMucHJvdG90eXBlLnNob3dUb29sVGlwID0gZnVuY3Rpb24gKGUpIHtcclxuICAgIHZhciBvcHRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xyXG5cclxuICAgIGlmICh0aGlzLm9wdHMudHlwZSA9PT0gJ2xpbmUnIHx8IHRoaXMub3B0cy50eXBlID09PSAnYXJlYScpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmdldEN1cnJlbnREYXRhSW5kZXgoZSk7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRPZmZzZXQgPSB0aGlzLnNjcm9sbE9wdGlvbi5jdXJyZW50T2Zmc2V0O1xyXG5cclxuICAgICAgICB2YXIgb3B0cyA9IGFzc2lnbih7fSwgdGhpcy5vcHRzLCB7XHJcbiAgICAgICAgICAgIF9zY3JvbGxEaXN0YW5jZV86IGN1cnJlbnRPZmZzZXQsXHJcbiAgICAgICAgICAgIGFuaW1hdGlvbjogZmFsc2VcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICB2YXIgc2VyaWVzRGF0YSA9IGdldFNlcmllc0RhdGFJdGVtKHRoaXMub3B0cy5zZXJpZXMsIGluZGV4KTtcclxuICAgICAgICAgICAgaWYgKHNlcmllc0RhdGEubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgX2dldFRvb2xUaXBEYXRhID0gZ2V0VG9vbFRpcERhdGEoc2VyaWVzRGF0YSwgdGhpcy5jaGFydERhdGEuY2FsUG9pbnRzLCBpbmRleCwgdGhpcy5vcHRzLmNhdGVnb3JpZXMsIG9wdGlvbiksXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dExpc3QgPSBfZ2V0VG9vbFRpcERhdGEudGV4dExpc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ID0gX2dldFRvb2xUaXBEYXRhLm9mZnNldDtcclxuXHJcbiAgICAgICAgICAgICAgICBvcHRzLnRvb2x0aXAgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dExpc3Q6IHRleHRMaXN0LFxyXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogb2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbjogb3B0aW9uXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRyYXdDaGFydHMuY2FsbCh0aGlzLCBvcHRzLnR5cGUsIG9wdHMsIHRoaXMuY29uZmlnLCB0aGlzLmNvbnRleHQpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuQ2hhcnRzLnByb3RvdHlwZS5zY3JvbGxTdGFydCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICBpZiAoZS50b3VjaGVzWzBdICYmIHRoaXMub3B0cy5lbmFibGVTY3JvbGwgPT09IHRydWUpIHtcclxuICAgICAgICB0aGlzLnNjcm9sbE9wdGlvbi5zdGFydFRvdWNoWCA9IGUudG91Y2hlc1swXS54O1xyXG4gICAgfVxyXG59O1xyXG5cclxuQ2hhcnRzLnByb3RvdHlwZS5zY3JvbGwgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgLy8gVE9ETyB0aHJvdHRpbmcuLi5cclxuICAgIGlmIChlLnRvdWNoZXNbMF0gJiYgdGhpcy5vcHRzLmVuYWJsZVNjcm9sbCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHZhciBfZGlzdGFuY2UgPSBlLnRvdWNoZXNbMF0ueCAtIHRoaXMuc2Nyb2xsT3B0aW9uLnN0YXJ0VG91Y2hYO1xyXG4gICAgICAgIHZhciBjdXJyZW50T2Zmc2V0ID0gdGhpcy5zY3JvbGxPcHRpb24uY3VycmVudE9mZnNldDtcclxuXHJcbiAgICAgICAgdmFyIHZhbGlkRGlzdGFuY2UgPSBjYWxWYWxpZERpc3RhbmNlKGN1cnJlbnRPZmZzZXQgKyBfZGlzdGFuY2UsIHRoaXMuY2hhcnREYXRhLCB0aGlzLmNvbmZpZywgdGhpcy5vcHRzKTtcclxuXHJcbiAgICAgICAgdGhpcy5zY3JvbGxPcHRpb24uZGlzdGFuY2UgPSBfZGlzdGFuY2UgPSB2YWxpZERpc3RhbmNlIC0gY3VycmVudE9mZnNldDtcclxuICAgICAgICB2YXIgb3B0cyA9IGFzc2lnbih7fSwgdGhpcy5vcHRzLCB7XHJcbiAgICAgICAgICAgIF9zY3JvbGxEaXN0YW5jZV86IGN1cnJlbnRPZmZzZXQgKyBfZGlzdGFuY2UsXHJcbiAgICAgICAgICAgIGFuaW1hdGlvbjogZmFsc2VcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZHJhd0NoYXJ0cy5jYWxsKHRoaXMsIG9wdHMudHlwZSwgb3B0cywgdGhpcy5jb25maWcsIHRoaXMuY29udGV4dCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5DaGFydHMucHJvdG90eXBlLnNjcm9sbEVuZCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICBpZiAodGhpcy5vcHRzLmVuYWJsZVNjcm9sbCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHZhciBfc2Nyb2xsT3B0aW9uID0gdGhpcy5zY3JvbGxPcHRpb24sXHJcbiAgICAgICAgICAgIGN1cnJlbnRPZmZzZXQgPSBfc2Nyb2xsT3B0aW9uLmN1cnJlbnRPZmZzZXQsXHJcbiAgICAgICAgICAgIGRpc3RhbmNlID0gX3Njcm9sbE9wdGlvbi5kaXN0YW5jZTtcclxuXHJcbiAgICAgICAgdGhpcy5zY3JvbGxPcHRpb24uY3VycmVudE9mZnNldCA9IGN1cnJlbnRPZmZzZXQgKyBkaXN0YW5jZTtcclxuICAgICAgICB0aGlzLnNjcm9sbE9wdGlvbi5kaXN0YW5jZSA9IDA7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENoYXJ0cztcclxuIl19