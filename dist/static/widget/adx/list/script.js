"use strict";

$(function () {
    $('#sub-nav').html("\n        <li><a href=\"?goto=adx&mold=report\">Adx\u62A5\u8868</a></li>\n        <li class=\"active\"><a href=\"javascript:;\">Adx\u7BA1\u7406</a></li>\n        ").show();

    var plugin1 = "template",
        plugin2 = "datetimepicker";

    var roleId = $("#userInfomation").attr("roleId");

    common.pluginsTools.loadPlugins(init, [plugin1, plugin2]);
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
        helper();
        bindEvents();

        getAndRenderList();
    }

    function bindEvents() {
        function edit() {}

        $("#list").on("click", 'button.detail', function (e) {
            var adxId = $(this).attr("adxId");
            var queryString = $.param({
                'goto': 'adx',
                'mold': 'detail',
                adxId: adxId
            });

            location.href = "./index.html?" + queryString;
            e.stopPropagation();
        });

        $("#list").on("click", 'button.delete', function (e) {
            var adxId = $(this).attr("adxId");
            deleteAdx(adxId).then(function (res) {
                if (res.status == 0) {
                    common.msgs.new_msg("success", "Delete success");
                } else {
                    common.msgs.new_msg("fail", "Delete failed");
                }
            });

            e.stopPropagation();
        });

        $more.on('click', function () {
            $('.extend-param').toggleClass('hidden');
        });

        $('#inputSuccess4').on('keydown', function (e) {
            var keyCode = e.keyCode || e.which;

            if (keyCode == '13') {
                e.preventDefault();
                getAndRenderList();
            } else if (keyCode == '27') {
                $("#inputSuccess4").val('');
                getAndRenderList();
            }
        });

        var $inputs = $form.find('input[type=text]');
        var $radios = $form.find('input[type=radio]');
        $inputs.on('input', function () {
            var $me = $(this);
            $inputs.each(function () {
                var $other = $(this);
                if (!$me.is($other)) {
                    $other.val('');
                }
            });
        });

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
    }

    function getQueryData() {
        var param = $form.serializeJSON();
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
        getAndRenderList.require = common.ajaxGet('queryAdExchange', queryData);
        getAndRenderList.require.then(function (res) {
            if (res.status == 0) {
                var data = res.data && res.data.list.length == 0 ? [] : res.data.list.map(defaultResultMapper);

                render({ data: data });

                pageRender(res.data.paging);
            }

            if (res.status) {
                render();
                pageRender();
            }
        });
    }

    function helper() {
        template.helper("status", function (status) {
            switch (status) {
                case 1:
                    return '<span class="text-success"><i class="glyphicon glyphicon-play" /></span>';
                case 2:
                    return '<span class="text-muted"><i class="glyphicon glyphicon-pause" /></span>';
                case 3:
                    return '<span class="text-danger"><i class="glyphicon glyphicon-stop" /></span>';
                default:
                    return "";
            }
        });

        template.helper("chargeType", function (id) {
            var data = { 1: 'nurl', 2: 'adm' };
            return data[id];
        });

        template.helper("priceType", function (id) {
            var data = { 1: '第一出价', 2: '第二出价' };
            return data[id];
        });

        template.helper("adxUsageType", function (id) {
            var data = { 1: '普通', 2: '租用' };
            return data[id];
        });

        template.helper("type", function (id) {
            var data = { 1: 'Normal', 2: 'Prime', 3: 'Pop', 4: 'Adult', 5: 'Pop Prime' };
            return data[id];
        });

        template.helper('tureOrFalse', function (flag) {
            return flag == 1 ? '<span class="label label-success" title="Ignore alter"><i class="glyphicon glyphicon-ok" /></span>' : '<span class="label label-ignore" title="Ignore alter"><i class="glyphicon glyphicon-ok" /></span>';
        });

        template.helper('status', function (flag) {

            return flag == 1 ? '<span class="label label-success" title="Ignore alter"><i class="glyphicon glyphicon-play" /></span>' : '<span class="label label-ignore" title="Ignore alter"><i class="glyphicon glyphicon-stop" /></span>';
        });
    }
});

function defaultResultMapper(item) {
    return _.defaults(item, {
        id: '',
        token: '',
        name: '',
        chargeType: '',
        priceType: '',
        adxUsageType: '',
        type: '',
        forUser: '',
        isSupportHtml: '',
        isSupportVideo: '',
        status: '',
        approveClass: ''
    });
}