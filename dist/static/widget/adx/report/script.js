"use strict";

$(function () {
    $('#sub-nav').html("\n        <li class=\"active\"><a href=\"javascript:;\">Adx\u62A5\u8868</a></li>\n        <li><a href=\"?goto=adx&mold=list\">Adx\u7BA1\u7406</a></li>\n    ").show();

    var plugin1 = "template",
        plugin2 = "datetimepicker",
        plugin3 = 'select2';

    var roleId = $("#userInfomation").attr("roleId");

    var rangePickerOption = {
        startDate: moment(),
        singleDatePicker: false,
        opens: 'left',
        showDropdowns: true,
        locale: {
            format: 'YYYY-MM-DD',
            separator: ' / ',
            applyLabel: 'ok',
            cancelLabel: 'cancel',
            customRangeLabel: 'custom'
        },
        ranges: {
            '今天': [moment.utc(), moment.utc()],
            '昨天': [moment.utc().subtract(1, 'days'), moment.utc().subtract(1, 'days')],
            '前天': [moment.utc().subtract(2, 'days'), moment.utc().subtract(2, 'days')],
            '3天内': [moment.utc().subtract(2, 'days'), moment.utc()],
            '7天内': [moment.utc().subtract(6, 'days'), moment.utc()],
            '30天内': [moment.utc().subtract(29, 'days'), moment.utc()]
        }
    };

    common.pluginsTools.loadPlugins(init, [plugin1, plugin2, plugin3]);
    common.pluginsTools.loadCss("datetimepickerCss");

    var $form = $('#form-container'),
        $submit = $('#submit'),
        $reset = $('#reset'),
        $more = $('#more-param');

    var pageRender = common.PageRender($('.page'), getAndRenderList);
    var deleteAdx = function deleteAdx(id) {
        return common.ajaxGet('deleteAdExchange', { id: id });
    };

    var render = function render() {
        var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return $("#list").html(template('materialsList', Object.assign({ loading: false, data: null }, param)));
    };

    function init() {
        $('input[daterange]').daterangepicker(rangePickerOption);

        helper();
        bindEvents();

        getAndRenderList();

        queryAllAdx().then(function (res) {
            if (res.status == 0) {
                renderAdxSelector(res.data.list);
            }
        });
    }

    var renderHeader = function renderHeader(id) {
        return $("#table-header").html(template(id));
    };

    function bindEvents() {

        $reset.on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            $inputs.val('');
            $radios.removeProp('checked');
            getAndRenderList();
        });

        $form.on('submit', function () {
            getAndRenderList(getQueryData());
            return false;
        });

        $('#adx-selector').on('change', function (e) {
            getAndRenderList();
        });

        $('#datetime').on('change', function () {
            getAndRenderList();
        });

        $('#list').on('click', '[platformId]', function () {
            var platformId = $(this).attr('platformId');
            $('#adx-selector').val(platformId).trigger('change.select2');
            getAndRenderList({ platformId: platformId, groupBy: 'platformdate' });
        }).on('click', '[campaign-list]', function () {
            var date = $(this).attr('campaign-list');
            showAdxDetail(date);
        });
    }

    function getQueryData() {
        var param = $form.serializeJSON();
        param.platformId = $('#adx-selector').val();

        if (param.platformId == 0) {
            delete param.platformId;
        } else {
            param.groupBy = 'platformdate';
        }

        var time = param.time.split('/');
        param.startTime = $.trim(time[0]);
        param.endTime = $.trim(time[1]);

        delete param.time;

        return param;
    }

    function getAndRenderList() {
        var ext = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var queryData = _.extend({}, getQueryData(), ext);

        _.defaults(queryData, {
            currentPage: 1,

            limit: 50
        });

        for (var n in queryData) {
            if (queryData[n] === undefined || queryData[n] === '') {
                delete queryData[n];
            }
        }
        getAndRenderList.require && getAndRenderList.require.abort && getAndRenderList.require.abort();

        render({ loading: true });
        getAndRenderList.require = common.ajaxGet('queryAdExchangeReport', queryData);
        getAndRenderList.require.then(function (res) {
            if (res.status == 0) {
                var data = res.data && res.data.list.length == 0 ? [] : res.data.list.map(defaultResultMapper);

                if (!!queryData.groupBy) {
                    for (var i = 0; i < data.length; i++) {
                        data[i].dateForm = data[i].date.split(' ')[0];
                    }
                }

                renderHeader(queryData.groupBy == 'platformdate' ? 'thead-platform-date' : 'thead-platform');
                render({ data: data });

                pageRender(res.data.paging);

                $('.btn-toolbar').children('button').remove();
                $(".table#adx-report").tableExport({ formats: ["xlsx"] });
            }

            if (res.status) {
                render();
                pageRender();
            }
        });
    }

    function showAdxDetail(date) {
        var ext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var $container = $('#list').find("#adx-detail-" + date);
        if ($container.data('display')) {
            $container.data('display', false).empty();
            return $container.hide();
        }

        $container.show().data('display', true);

        var queryData = _.extend({}, getQueryData(), ext);
        var detailHttp = 'queryAdExchangeDetailReport?adx=' + queryData.platformId + '&platformId=' + queryData.platformId + '&date=' + date.split(' ')[0];
        common.ajaxGet(detailHttp).then(function (res) {
            if (res.status == 0) {
                $container.html(template('campaignList', {
                    data: res.data.list
                }));
            }
        });
    }

    function queryAllAdx() {
        return common.ajaxGet('queryAdExchange');
    }

    function renderAdxSelector(data) {
        if ($('#adx-selector').data('complate')) return false;
        $('#adx-selector').data('complate', true);
        $('#adx-selector').append(data.map(function (adx) {
            return "<option value=\"" + adx.id + "\">" + adx.name + "</option>";
        }));
        $('#adx-selector').select2();
    }

    function helper() {
        template.helper('numeral', function () {
            return numeral.apply(undefined, arguments);
        });
    }
});

function defaultResultMapper(item) {
    return _.defaults(item, {
        id: '',
        token: '',
        name: ''
    });
}