
common.pluginsTools.loadPlugins(
    () => new CustomerList(), 
[
    'template', 'eventproxy', 'highcharts'
]);

const UNIT = {
    bid: '',
    click: '',
    conversion: '',
    cost: Currency,
    impression: '',
    income: Currency,
    revenue: Currency,
    win: '',
}

class CustomerList {
    constructor() {
        helper()
        this.$customer = $('#customer-list')


        if(common.permission.has('queryOperationAccountList')) {
            Query.AMs.then(ams => {
                $('#am-selector').append(ams.map(am => '<option value="'+ am.accountId +'">'+ am.contactName +'</option>').join(''))
            })
        } else {
            $('#am-selector')
            .html('<option value="">'+ common.get('name') +'</option>')
            .prop('disabled', 'disabled')
        }
        // Query.AMs.then(ams => {
        //     if(common.get('roleId') == 6) {
        //         ams = _.filter(ams, am => am.accountId == common.get('approverId'))
        //     }
        //     $('#am-selector').append(ams.map(am => '<option value="'+ am.accountId +'">'+ am.contactName +'</option>').join(''))
        // })

        var Param = paramFactory({
            limit: 50
        })
        var pageRender = renderPage($('.page'), (param) => this.genCustomerList(param))
        this.genCustomerList = this.customerListFactory(pageRender)
        this.genCampaignList = this.campaignListFactory()
        this.genCampaignReport = this.campaignReportFactory()
        this.genUserHourlyReport = this.userHourlyReportFactory()

        this.events()
        this.init()

        Highcharts.setOptions({
            lang: {
                shortMonths:['一','二','三','四','五','六','七','八','九','十','十一','十二']
            },
        });
    }
    init() {
        this.genCustomerList()
        this.queryCustomer()
    }

    events() {
        var $showAll = $('#show-all')
        var $amSelector = $('#am-selector')
        var $filter = $('.filter').focus()
        var me = this
        $filter.on('keyup', function (e) {
            var charCode = e.charCode || e.keyCode;
            if(charCode == '13') {
                var key = $(this).attr('data-key')
                me.genCustomerList({
                    [key]: $(this).val()
                })

                $filter.each(function() {
                    if(key != $(this).attr('data-key')) {
                        $(this).val('')
                    }
                })
            }
        })

        $showAll.on('click', function() {
            $filter.val('')
            $amSelector.val('')
            me.genCustomerList()

        })

        
        $amSelector.on('change', function(){
            let amId = $amSelector.val()
            if(amId === '') {
                me.genCustomerList.removeParam(['amId'])
            }
            let param = !amId ? {} : {amId}
        
            me.genCustomerList(param)
            
        })


        this.$customer.on('click', '[customer-order]', function() {
            var orderParam = $(this).attr('customer-order')
            me.genCustomerList({orderParam})
        }).on('click', '[os-param-id]', function (e) {
            var osParamId = $(this).attr('os-param-id')
            var phost = prime_host + '/?osParamId=' + osParamId
            window.open(phost, 'aaa')
        }).on('click', '[campaign-list]', function() {
            var accountId = $(this).attr('campaign-list')
            me.showDetail(accountId)
        }).on('click', '[all-campaign]', function() {
            var accountId = $(this).attr('all-campaign')
            window.open('/index.html?goto=audit&mold=list&userId=' + accountId)
        }).on('click', '[user-history]', function() {
            var accountId = $(this).attr('user-history')
            var email = $(this).attr('account-email')
            me.genUserHourlyReport({accountId}, {email})
        }).on('click', '[campaign-order]', function() {
            var orderParam = $(this).attr('campaign-order')
            me.genCampaignList({orderParam})
        }).on('click', '[campaign-id]', function() {
            var campaignId = $(this).attr('campaign-id')
            var days = -1
            var startDate = moment().add(days, 'days').format('YYYY-MM-DD'),
                endDate = startDate;
            me.genCampaignReport({campaignId, startDate, endDate}, {days})
        }).on("click", '[reason]', function(e) {
            var campaignId = $(this).attr("reason");
            var queryString = $.param({
                'qtime': '',
                'qcamp': campaignId,
                'latest15': '查询最近15分钟',
            })

            window.open(window.filter_reason_host + "/filter_reason/?" + queryString)
            e.stopPropagation()
        })

        

        $('#myModal').on('click', '[top5]', function() {
            var days = $(this).attr('top5') | 0
            var startDate = moment().add(days, 'days').format('YYYY-MM-DD'),
                endDate = startDate;
            me.genCampaignReport({startDate, endDate}, {days})
        }).on('hidden.bs.modal', function (e) {
            $(this).find('.modal-body').empty()
        })

        /**
         * In order to synchronize tooltips and crosshairs, override the
         * built-in events with handlers defined on the parent element.
         */
        
        /**
         * Override the reset function, we don't need to hide the tooltips and crosshairs.
         */
        Highcharts.Pointer.prototype.reset = function () {
            return undefined;
        };

        /**
         * Highlight a point by showing tooltip, setting hover state and draw crosshair
         */
        Highcharts.Point.prototype.highlight = function (event) {
            this.onMouseOver(); // Show the hover marker
            this.series.chart.tooltip.refresh(this); // Show the tooltip
            this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
        };

        

    }



    showDetail(accountId) {
        var $container = $(`#customer-detail-${accountId}`)
        if($container.data('display')) {
            $container.data('display', false).empty()
            return $container.hide()
        }

        $container.show().data('display', true)
        this.genCampaignList({accountId}, $container)
    }

    queryCampaignReportByUser({accountId}) {
        return common.ajaxGet('queryCampaignReportByUser', {
            accountId
        })
    }

    queryCustomer() {
        var $container = $('#filter-result')
        return common.ajaxGet('queryCustomer').done(res => {
            if(res.status == 0) {
                $container.html(template('filterResult', {customers:res.data.list})) 
            }
        })
    }

    customerListFactory(pageRender) {
        var Param = paramFactory({
            limit: 50
        })

        let r = newParam => {
            var param = Param.update(newParam)

            return common.ajaxGet('queryCustomerAccountList', param).done(res => {
                if(res.status == 0) {
                    this.$customer.html(template('customerList', {
                        customers:res.data.list,
                        param: Param.param,
                    })) 
                    pageRender(res.data.paging)
                    popover(this.$customer.find('.customerName'))

                    if(common.get('roleId') == 9) {
                        $('.customer-operation').empty();
                    }

                    setTimeout(function(){
                        $("#customer-list table.table-striped-manu").tableExport({formats:["xlsx"]});
                    });
                }
            })
        }

        r.removeParam = Param.remove

        return r
    }
    campaignListFactory() {
        var Param = paramFactory()
        var $tmpContaner
        return (newParam, $container = $tmpContaner) => {
            var param = Param.update(newParam)
            var finishLoading = $container.loading()
            return common.ajaxGet('queryCampaignReportByUser', param).done(res => {
                finishLoading()
                if(res.status == 0) {
                    $tmpContaner = $container
                    $container.html(template('campaignList', {
                        data:res.data.list,
                        param: Param.param,
                    })) 
                }
            })
        }
    }

    campaignReportFactory() {
        var Param = paramFactory()
        var $container = $('#myModal .modal-body')
        return (newParam, tmpData = {}) => {
            var param = Param.update(newParam)
            this.showModal()
            return common.ajaxGet('queryCampaignReportByDimension', param).done(res => {
                if(res.status == 0) {
                    $container.html(template('campaignReport', {
                        data:res.data.list,
                        param: Param.param,
                        tmpData,
                    })) 
                }
            })
        }
    }
    showModal() {
        
        return $('#myModal').modal()
        
    }

    userHourlyReportFactory() {
        var me = this
        var Param = paramFactory({
            groupBy:2,
            limit: 24 * 3,
            startDate: moment().endOf('day').add(-2, 'days').format('YYYY-MM-DD'),
            endDate: moment().endOf('day').format('YYYY-MM-DD'),
        })
        var $container = $('#myModal .modal-body')
        return (newParam, tmpData = {}) => {
            var param = Param.update(newParam)
            this.showModal()
            this.data = {}
            return common.ajaxGet('queryUserHourlyReport', param).done(res => {
                if(res.status == 0) {
                    $container.html(template('userHourlyReport', {
                        data:res.data.list,
                        param: Param.param,
                        tmpData,
                    })) 

                    this.bindHourChartEvents()
                    
                    setTimeout(() => {
                        const data = res.data.list.reduce((ret, item) => {
                            let d = Object.assign({}, item)
                            delete d.date
                            delete d.hour
                            ret[item.date + item.hour] = d
                            return ret
                        }, {})
                        this.data = data

                        this.addCharts(data)
                    }, 100)
                }
            })
        }
    }
    addCharts(data, duration = 2) {
        // console.log(data)
        $('#main1, #main2').empty()
        Object.keys(this.defaultHourDate()).map((key, i) => {
            $('<div class="chart">')
                .appendTo('#main' + (i%2+1))
                .highcharts(this.makeChartOption(key, data, duration));

        })
    }
    bindHourChartEvents() {
        let unbind = function() {
            // Highcharts.charts.shift().destroy()
            // 以上方式Highcharts无法正确处理
            Highcharts.charts.forEach(chart => chart.destroy())
            while(Highcharts.charts.length) {
                Highcharts.charts.shift()
            }
        }
        let me = this
        $('#myModal').one('hide.bs.modal', unbind)

        $('#hourly-report-top').on('click', 'button[duration]', function() {
            $('#hourly-report-top button[duration]').prop('class', 'btn btn-default')
            $(this).prop('class', 'btn btn-primary')
            let duration = $(this).attr('duration')
            unbind()
            me.addCharts(me.data, duration)
        })

        let handler = index => e => {
            var chart = Highcharts.charts[index],
                point,
                i,
                event = chart.pointer.normalize(e.originalEvent);
                
            for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                chart = Highcharts.charts[i];
                point = chart.series[0].searchPoint(event, true); // Get the hovered point
                point && point.highlight(e);
            }
            if(chart.hoverPoint) {
                const category = chart.series[0].data[chart.hoverPoint.index].category
                $('#hourly-report-top .date').html(moment(category).format('YYYY-MM-DD HH:00'))
            }
        }

        $('#main1').bind('mousemove touchmove touchstart', handler(0));
        $('#main2').bind('mousemove touchmove touchstart', handler(1));
    }
    makeChartOption(name, data, duration) {
        // console.log('>',name, data);

        const value = []
        this.makeHour(duration).map(({date, hour}) => {
            if(data[date + hour]) {
                value.push(data[date + hour][name])
            }
            else {
                value.push(0)
            }
        })
        // if(name == 'bid') {console.log(this.makeHour(duration))}
        // if(name == 'bid') {console.log(value)}
        const unit = UNIT[name]

        const dataset = {
            name,
            value,
            unit
        }
        


        let option = {
            
            chart: {
                marginLeft: 80, // Keep all charts left aligned
                marginRight: 20,
                spacingTop: 30,
                spacingBottom: 20,
                height: 140,
                backgroundColor: '#fafafa',
            },
            title: {
                text: dataset.name,
                align: 'left',
                margin: 0,
                x: 30,
                y: -1,
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
                // categories: this.makeHour().map(({date, hour}) =>  hour.substr(0,2)),
                // visible: false,
                plotBands: [{
                    color: Highcharts.Color(Highcharts.defaultOptions.colors[0]).setOpacity(.2).get(),
                    from: moment().endOf('day').add(-2, 'days').add(1, 'hours').valueOf(),
                    to: moment().endOf('day').add(-1, 'days').add(1, 'hours').valueOf(),
                }]
            },
            yAxis: {
                title: {
                    text: null
                },
                min: 0,
            },
            plotOptions: {
                series: {
                    color: Highcharts.Color(Highcharts.defaultOptions.colors[0]).get(),
                    marker: {
                        enabled: false,
                    }
                },
            },
            tooltip: {
                positioner: function () {
                    return {
                        x: this.chart.chartWidth - this.label.width, // right aligned
                        y: -1 // align to title
                    };
                },
                borderWidth: 0,
                backgroundColor: 'none',

                formatter: function () {
                    return formatNumber(this.y, this.series.name)
                },
                shadow: false,
                style: {
                    fontSize: '18px'
                },
            },
            series: [{
                name: dataset.name,
                data: dataset.value,
                pointStart: moment().endOf('day').add(-1 * duration, 'days').add(1, 'hours').valueOf(),
                pointInterval: 3600 * 1000, // one day
                type: 'line',
                // color: Highcharts.getOptions().colors[i],
                fillOpacity: 0.3,
            }]
        };
        return option
    }
    defaultHourDate(data = {}, hour = {}) {
        return Object.assign({}, {
            bid: 0,
            income: 0,
            win: 0,
            impression: 0,
            click: 0,
            conversion: 0,
            // cost: 0,
            // revenue: 0,
        }, data, hour)
    }
    makeHour(day = 0) {
        let startTime = moment().add(-(day - 1) - 1, 'days')
        let hours = []
        for(let i = 0; i < day; i++) {
            let hour = 0
            startTime = startTime.add(1, 'days')
            let date = startTime.format('YYYY-MM-DD')
            while(hour < 24) {
                hours.push({date, hour: String.prototype.substr.call('0' + hour, -2) + ':00'})
                hour += 1
            }
        }
        return hours
    }
}

function paramFactory( _defaultParam = {}) {
    if(this === window) {
        return new paramFactory(newParam)
    }
    var defaultParam = $.extend({}, _defaultParam)
    var param = $.extend({}, defaultParam)
    return {
        update(newParam) {
            if(newParam) {
                // 排序
                if(newParam.orderParam) {
                    newParam.currentPage = 1
                    newParam.orderFlag = newParam.orderParam === param.orderParam && param.orderFlag == '1' ? '2' : '1'
                }

                $.extend(param, newParam)
            }

            else {
                //清空参数
                param = $.extend({}, defaultParam)
            }
            return $.extend({}, param)
        },
        remove(rp = []) {
            _.each(rp, p => {
                delete param[p]
            })
        },
        get param() {
            return $.extend({}, param)
        }
    }
}

function popover($content) {
    $content.each(function(){
        var me = this
        var p = $(this).popover({
            placement: 'bottom',
            trigger: 'click',
        })
        $(this).parent().on('click', function(e){
            e.stopPropagation()
        })

        $(this).on('shown.bs.popover', function () {
            $('body').on('click.clickpopover', function() {
                $(me).popover('hide')
                $('body').off('click.clickpopover')
            })
        })
    })
}




function renderPage($container, query) {
    $container.on('click', 'a', function() {
        if($(this).hasClass('disabled')) return;

        var currentPage = $(this).attr('page')
        if(currentPage) {
            query({
                currentPage
            })
        }
    })
    var render = pager => $container.html(template('pageTemp', {pager})) 
    return render
}

function helper (){
    template.helper("sort", function(name, param){
        if(param.orderParam == name) {
            switch (param.orderFlag) {
                case "2" :
                    return '<i class="glyphicon glyphicon-sort-by-attributes" />'
                case "1" :
                    return '<i class="glyphicon glyphicon-sort-by-attributes-alt" />'
            }
        }

        return '<i class="glyphicon glyphicon-sort op30" />'
    })

    template.helper('numeral', function(...arg) {
        return numeral(...arg)
    })
    template.helper('fn', function(...arg) {
        return formatNumber(0, ...arg)
    })
    template.helper('fns', function(...arg) {
        return formatNumber(0, ...arg)
    })
}

function formatNumber(isShort, value, type) {
    if(typeof value == 'object') {
        value = value[type]
    }

    var short = isShort ? ' a' : ''


    switch(type) {
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
/**
         * Synchronize zooming through the setExtremes event handler.
         */
        function syncExtremes(e) {
            var thisChart = this.chart;

            if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
                Highcharts.each(Highcharts.charts, function (chart) {
                    if (chart !== thisChart) {
                        if (chart.xAxis[0].setExtremes) { // It is null while updating
                            chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, { trigger: 'syncExtremes' });
                        }
                    }
                });
            }
        }