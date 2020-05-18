'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

common.pluginsTools.loadPlugins(function () {
    return new CustomerList();
}, ['template', 'eventproxy', 'highcharts']);

var UNIT = {
    bid: '',
    click: '',
    conversion: '',
    cost: Currency,
    impression: '',
    income: Currency,
    revenue: Currency,
    win: ''
};

var CustomerList = function () {
    function CustomerList() {
        var _this = this;

        _classCallCheck(this, CustomerList);

        helper();
        this.$customer = $('#customer-list');

        if (common.permission.has('queryOperationAccountList')) {
            Query.AMs.then(function (ams) {
                $('#am-selector').append(ams.map(function (am) {
                    return '<option value="' + am.accountId + '">' + am.contactName + '</option>';
                }).join(''));
            });
        } else {
            $('#am-selector').html('<option value="">' + common.get('name') + '</option>').prop('disabled', 'disabled');
        }


        var Param = paramFactory({
            limit: 50
        });
        var pageRender = renderPage($('.page'), function (param) {
            return _this.genCustomerList(param);
        });
        this.genCustomerList = this.customerListFactory(pageRender);
        this.genCampaignList = this.campaignListFactory();
        this.genCampaignReport = this.campaignReportFactory();
        this.genUserHourlyReport = this.userHourlyReportFactory();

        this.events();
        this.init();

        Highcharts.setOptions({
            lang: {
                shortMonths: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
            }
        });
    }

    _createClass(CustomerList, [{
        key: 'init',
        value: function init() {
            this.genCustomerList();
            this.queryCustomer();
        }
    }, {
        key: 'events',
        value: function events() {
            var $showAll = $('#show-all');
            var $amSelector = $('#am-selector');
            var $filter = $('.filter').focus();
            var me = this;
            $filter.on('keyup', function (e) {
                var charCode = e.charCode || e.keyCode;
                if (charCode == '13') {
                    var key = $(this).attr('data-key');
                    me.genCustomerList(_defineProperty({}, key, $(this).val()));

                    $filter.each(function () {
                        if (key != $(this).attr('data-key')) {
                            $(this).val('');
                        }
                    });
                }
            });

            $showAll.on('click', function () {
                $filter.val('');
                $amSelector.val('');
                me.genCustomerList();
            });

            $amSelector.on('change', function () {
                var amId = $amSelector.val();
                if (amId === '') {
                    me.genCustomerList.removeParam(['amId']);
                }
                var param = !amId ? {} : { amId: amId };

                me.genCustomerList(param);
            });

            this.$customer.on('click', '[customer-order]', function () {
                var orderParam = $(this).attr('customer-order');
                me.genCustomerList({ orderParam: orderParam });
            }).on('click', '[os-param-id]', function (e) {
                var osParamId = $(this).attr('os-param-id');
                var phost = prime_host + '/?osParamId=' + osParamId;
                window.open(phost, 'aaa');
            }).on('click', '[campaign-list]', function () {
                var accountId = $(this).attr('campaign-list');
                me.showDetail(accountId);
            }).on('click', '[all-campaign]', function () {
                var accountId = $(this).attr('all-campaign');
                window.open('/index.html?goto=audit&mold=list&userId=' + accountId);
            }).on('click', '[user-history]', function () {
                var accountId = $(this).attr('user-history');
                var email = $(this).attr('account-email');
                me.genUserHourlyReport({ accountId: accountId }, { email: email });
            }).on('click', '[campaign-order]', function () {
                var orderParam = $(this).attr('campaign-order');
                me.genCampaignList({ orderParam: orderParam });
            }).on('click', '[campaign-id]', function () {
                var campaignId = $(this).attr('campaign-id');
                var days = -1;
                var startDate = moment().add(days, 'days').format('YYYY-MM-DD'),
                    endDate = startDate;
                me.genCampaignReport({ campaignId: campaignId, startDate: startDate, endDate: endDate }, { days: days });
            }).on("click", '[reason]', function (e) {
                var campaignId = $(this).attr("reason");
                var queryString = $.param({
                    'qtime': '',
                    'qcamp': campaignId,
                    'latest15': '查询最近15分钟'
                });

                window.open(window.filter_reason_host + "/filter_reason/?" + queryString);
                e.stopPropagation();
            });

            $('#myModal').on('click', '[top5]', function () {
                var days = $(this).attr('top5') | 0;
                var startDate = moment().add(days, 'days').format('YYYY-MM-DD'),
                    endDate = startDate;
                me.genCampaignReport({ startDate: startDate, endDate: endDate }, { days: days });
            }).on('hidden.bs.modal', function (e) {
                $(this).find('.modal-body').empty();
            });

            Highcharts.Pointer.prototype.reset = function () {
                return undefined;
            };

            Highcharts.Point.prototype.highlight = function (event) {
                this.onMouseOver();
                this.series.chart.tooltip.refresh(this);
                this.series.chart.xAxis[0].drawCrosshair(event, this);
            };
        }
    }, {
        key: 'showDetail',
        value: function showDetail(accountId) {
            var $container = $('#customer-detail-' + accountId);
            if ($container.data('display')) {
                $container.data('display', false).empty();
                return $container.hide();
            }

            $container.show().data('display', true);
            this.genCampaignList({ accountId: accountId }, $container);
        }
    }, {
        key: 'queryCampaignReportByUser',
        value: function queryCampaignReportByUser(_ref) {
            var accountId = _ref.accountId;

            return common.ajaxGet('queryCampaignReportByUser', {
                accountId: accountId
            });
        }
    }, {
        key: 'queryCustomer',
        value: function queryCustomer() {
            var $container = $('#filter-result');
            return common.ajaxGet('queryCustomer').done(function (res) {
                if (res.status == 0) {
                    $container.html(template('filterResult', { customers: res.data.list }));
                }
            });
        }
    }, {
        key: 'customerListFactory',
        value: function customerListFactory(pageRender) {
            var _this2 = this;

            var Param = paramFactory({
                limit: 50
            });

            var r = function r(newParam) {
                var param = Param.update(newParam);

                return common.ajaxGet('queryCustomerAccountList', param).done(function (res) {
                    if (res.status == 0) {
                        _this2.$customer.html(template('customerList', {
                            customers: res.data.list,
                            param: Param.param
                        }));
                        pageRender(res.data.paging);
                        popover(_this2.$customer.find('.customerName'));

                        if (common.get('roleId') == 9) {
                            $('.customer-operation').empty();
                        }

                        setTimeout(function () {
                            $("#customer-list table.table-striped-manu").tableExport({ formats: ["xlsx"] });
                        });
                    }
                });
            };

            r.removeParam = Param.remove;

            return r;
        }
    }, {
        key: 'campaignListFactory',
        value: function campaignListFactory() {
            var Param = paramFactory();
            var $tmpContaner;
            return function (newParam) {
                var $container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : $tmpContaner;

                var param = Param.update(newParam);
                var finishLoading = $container.loading();
                return common.ajaxGet('queryCampaignReportByUser', param).done(function (res) {
                    finishLoading();
                    if (res.status == 0) {
                        $tmpContaner = $container;
                        $container.html(template('campaignList', {
                            data: res.data.list,
                            param: Param.param
                        }));
                    }
                });
            };
        }
    }, {
        key: 'campaignReportFactory',
        value: function campaignReportFactory() {
            var _this3 = this;

            var Param = paramFactory();
            var $container = $('#myModal .modal-body');
            return function (newParam) {
                var tmpData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                var param = Param.update(newParam);
                _this3.showModal();
                return common.ajaxGet('queryCampaignReportByDimension', param).done(function (res) {
                    if (res.status == 0) {
                        $container.html(template('campaignReport', {
                            data: res.data.list,
                            param: Param.param,
                            tmpData: tmpData
                        }));
                    }
                });
            };
        }
    }, {
        key: 'showModal',
        value: function showModal() {

            return $('#myModal').modal();
        }
    }, {
        key: 'userHourlyReportFactory',
        value: function userHourlyReportFactory() {
            var _this4 = this;

            var me = this;
            var Param = paramFactory({
                groupBy: 2,
                limit: 24 * 3,
                startDate: moment().endOf('day').add(-2, 'days').format('YYYY-MM-DD'),
                endDate: moment().endOf('day').format('YYYY-MM-DD')
            });
            var $container = $('#myModal .modal-body');
            return function (newParam) {
                var tmpData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                var param = Param.update(newParam);
                _this4.showModal();
                _this4.data = {};
                return common.ajaxGet('queryUserHourlyReport', param).done(function (res) {
                    if (res.status == 0) {
                        $container.html(template('userHourlyReport', {
                            data: res.data.list,
                            param: Param.param,
                            tmpData: tmpData
                        }));

                        _this4.bindHourChartEvents();

                        setTimeout(function () {
                            var data = res.data.list.reduce(function (ret, item) {
                                var d = Object.assign({}, item);
                                delete d.date;
                                delete d.hour;
                                ret[item.date + item.hour] = d;
                                return ret;
                            }, {});
                            _this4.data = data;

                            _this4.addCharts(data);
                        }, 100);
                    }
                });
            };
        }
    }, {
        key: 'addCharts',
        value: function addCharts(data) {
            var _this5 = this;

            var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

            $('#main1, #main2').empty();
            Object.keys(this.defaultHourDate()).map(function (key, i) {
                $('<div class="chart">').appendTo('#main' + (i % 2 + 1)).highcharts(_this5.makeChartOption(key, data, duration));
            });
        }
    }, {
        key: 'bindHourChartEvents',
        value: function bindHourChartEvents() {
            var unbind = function unbind() {
                Highcharts.charts.forEach(function (chart) {
                    return chart.destroy();
                });
                while (Highcharts.charts.length) {
                    Highcharts.charts.shift();
                }
            };
            var me = this;
            $('#myModal').one('hide.bs.modal', unbind);

            $('#hourly-report-top').on('click', 'button[duration]', function () {
                $('#hourly-report-top button[duration]').prop('class', 'btn btn-default');
                $(this).prop('class', 'btn btn-primary');
                var duration = $(this).attr('duration');
                unbind();
                me.addCharts(me.data, duration);
            });

            var handler = function handler(index) {
                return function (e) {
                    var chart = Highcharts.charts[index],
                        point,
                        i,
                        event = chart.pointer.normalize(e.originalEvent);

                    for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                        chart = Highcharts.charts[i];
                        point = chart.series[0].searchPoint(event, true);
                        point && point.highlight(e);
                    }
                    if (chart.hoverPoint) {
                        var category = chart.series[0].data[chart.hoverPoint.index].category;
                        $('#hourly-report-top .date').html(moment(category).format('YYYY-MM-DD HH:00'));
                    }
                };
            };

            $('#main1').bind('mousemove touchmove touchstart', handler(0));
            $('#main2').bind('mousemove touchmove touchstart', handler(1));
        }
    }, {
        key: 'makeChartOption',
        value: function makeChartOption(name, data, duration) {

            var value = [];
            this.makeHour(duration).map(function (_ref2) {
                var date = _ref2.date,
                    hour = _ref2.hour;

                if (data[date + hour]) {
                    value.push(data[date + hour][name]);
                } else {
                    value.push(0);
                }
            });

            var unit = UNIT[name];

            var dataset = {
                name: name,
                value: value,
                unit: unit
            };

            var option = {

                chart: {
                    marginLeft: 80,
                    marginRight: 20,
                    spacingTop: 30,
                    spacingBottom: 20,
                    height: 140,
                    backgroundColor: '#fafafa'
                },
                title: {
                    text: dataset.name,
                    align: 'left',
                    margin: 0,
                    x: 30,
                    y: -1
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                xAxis: {
                    crosshair: {
                        color: Highcharts.Color('#d28900').setOpacity(.1).get()
                    },
                    events: {
                        setExtremes: syncExtremes
                    },
                    type: 'datetime',

                    plotBands: [{
                        color: Highcharts.Color(Highcharts.defaultOptions.colors[0]).setOpacity(.2).get(),
                        from: moment().endOf('day').add(-2, 'days').add(1, 'hours').valueOf(),
                        to: moment().endOf('day').add(-1, 'days').add(1, 'hours').valueOf()
                    }]
                },
                yAxis: {
                    title: {
                        text: null
                    },
                    min: 0
                },
                plotOptions: {
                    series: {
                        color: Highcharts.Color(Highcharts.defaultOptions.colors[0]).get(),
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    positioner: function positioner() {
                        return {
                            x: this.chart.chartWidth - this.label.width,
                            y: -1 };
                    },
                    borderWidth: 0,
                    backgroundColor: 'none',

                    formatter: function formatter() {
                        return formatNumber(this.y, this.series.name);
                    },
                    shadow: false,
                    style: {
                        fontSize: '18px'
                    }
                },
                series: [{
                    name: dataset.name,
                    data: dataset.value,
                    pointStart: moment().endOf('day').add(-1 * duration, 'days').add(1, 'hours').valueOf(),
                    pointInterval: 3600 * 1000,
                    type: 'line',

                    fillOpacity: 0.3
                }]
            };
            return option;
        }
    }, {
        key: 'defaultHourDate',
        value: function defaultHourDate() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var hour = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return Object.assign({}, {
                bid: 0,
                income: 0,
                win: 0,
                impression: 0,
                click: 0,
                conversion: 0
            }, data, hour);
        }
    }, {
        key: 'makeHour',
        value: function makeHour() {
            var day = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            var startTime = moment().add(-(day - 1) - 1, 'days');
            var hours = [];
            for (var i = 0; i < day; i++) {
                var hour = 0;
                startTime = startTime.add(1, 'days');
                var date = startTime.format('YYYY-MM-DD');
                while (hour < 24) {
                    hours.push({ date: date, hour: String.prototype.substr.call('0' + hour, -2) + ':00' });
                    hour += 1;
                }
            }
            return hours;
        }
    }]);

    return CustomerList;
}();

function paramFactory() {
    var _defaultParam = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (this === window) {
        return new paramFactory(newParam);
    }
    var defaultParam = $.extend({}, _defaultParam);
    var param = $.extend({}, defaultParam);
    return {
        update: function update(newParam) {
            if (newParam) {
                if (newParam.orderParam) {
                    newParam.currentPage = 1;
                    newParam.orderFlag = newParam.orderParam === param.orderParam && param.orderFlag == '1' ? '2' : '1';
                }

                $.extend(param, newParam);
            } else {
                param = $.extend({}, defaultParam);
            }
            return $.extend({}, param);
        },
        remove: function remove() {
            var rp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            _.each(rp, function (p) {
                delete param[p];
            });
        },

        get param() {
            return $.extend({}, param);
        }
    };
}

function popover($content) {
    $content.each(function () {
        var me = this;
        var p = $(this).popover({
            placement: 'bottom',
            trigger: 'click'
        });
        $(this).parent().on('click', function (e) {
            e.stopPropagation();
        });

        $(this).on('shown.bs.popover', function () {
            $('body').on('click.clickpopover', function () {
                $(me).popover('hide');
                $('body').off('click.clickpopover');
            });
        });
    });
}

function renderPage($container, query) {
    $container.on('click', 'a', function () {
        if ($(this).hasClass('disabled')) return;

        var currentPage = $(this).attr('page');
        if (currentPage) {
            query({
                currentPage: currentPage
            });
        }
    });
    var render = function render(pager) {
        return $container.html(template('pageTemp', { pager: pager }));
    };
    return render;
}

function helper() {
    template.helper("sort", function (name, param) {
        if (param.orderParam == name) {
            switch (param.orderFlag) {
                case "2":
                    return '<i class="glyphicon glyphicon-sort-by-attributes" />';
                case "1":
                    return '<i class="glyphicon glyphicon-sort-by-attributes-alt" />';
            }
        }

        return '<i class="glyphicon glyphicon-sort op30" />';
    });

    template.helper('numeral', function () {
        return numeral.apply(undefined, arguments);
    });
    template.helper('fn', function () {
        for (var _len = arguments.length, arg = Array(_len), _key = 0; _key < _len; _key++) {
            arg[_key] = arguments[_key];
        }

        return formatNumber.apply(undefined, [0].concat(arg));
    });
    template.helper('fns', function () {
        for (var _len2 = arguments.length, arg = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            arg[_key2] = arguments[_key2];
        }

        return formatNumber.apply(undefined, [0].concat(arg));
    });
}

function formatNumber(isShort, value, type) {
    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
        value = value[type];
    }

    var short = isShort ? ' a' : '';

    switch (type) {
        case 'bid':
        case 'win':
        case 'impression':
        case 'click':
        case 'conversion':
            return numeral(value).format('0,0' + short);
        case 'ctr':
        case 'cvr':
            return numeral(value).format('0,0.0%');
        case 'cpm':
            return Currency + ' ' + numeral(value).format('0.00' + short);
        case 'impwin':
        case 'winRate':
            return numeral(value).format('0.0%');
        case 'win_avg':
        case 'income':
        case 'cost':
        case 'revenue':
        case 'balance':

        case 'totalSpend':
        case 'lastMonthSpend':
        case 'currentMonthSpend':
        case 'beforeYesterdaySpend':
        case 'yesterdaySpend':
        case 'todaySpending':
        case 'todaySpend':
            return Currency + ' ' + numeral(value).format('0.00' + short);
    }
}

function syncExtremes(e) {
    var thisChart = this.chart;

    if (e.trigger !== 'syncExtremes') {
        Highcharts.each(Highcharts.charts, function (chart) {
            if (chart !== thisChart) {
                if (chart.xAxis[0].setExtremes) {
                    chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, { trigger: 'syncExtremes' });
                }
            }
        });
    }
}