"use strict";

$(function () {
    var plugin1 = "template",
        plugin2 = "datetimepicker";

    var approverId = $("#userInfomation").attr("approverId");
    var roleId = $("#userInfomation").attr("roleId");
    var showClosed = getQueryData()['status'] ? '1' : '';

    common.pluginsTools.loadPlugins(init, [plugin1, plugin2]);
    common.pluginsTools.loadCss("datetimepickerCss");

    var pageRender = common.PageRender($('.page'), getAndRenderList);

    function init() {
        helper();
        bindEvents();

        var userId = common.getUrlVars('userId');
        if (userId) {
            $("#searchChoice").val('acUserId');
            $("#inputSuccess4").val(userId);
        }


        $('.form_datetime, .form_date').datetimepicker({
            todayHighlight: 1,
            pickerPosition: "bottom"
        });

        getAndRenderList();
    }

    function bindEvents() {
        $("#list").on("click", 'button.detail', function (e) {
            var campaignId = $(this).attr("campaignId");
            localStorage.setItem("campaignId", campaignId);
            ApprovalStatus.val();

            var queryString = $.param({
                'goto': 'audit',
                'mold': 'detail',
                'approvalStatus': ApprovalStatus.val(),
                'showClosed': showClosed,
                campaignId: campaignId
            });

            window.open("./index.html?" + queryString, 'dsp-op-' + campaignId);
            e.stopPropagation();
        });

        $("#list").on("click", 'button.reason', function (e) {
            var campaignId = $(this).attr("campaignId");
            var queryString = $.param({
                'qtime': '',
                'qcamp': campaignId,
                'latest15': '查询最近15分钟'
            });

            window.open(window.filter_reason_host + "/filter_reason/?" + queryString);
            e.stopPropagation();
        });

        $("#list").on('click', 'tr td:not(.actions)', function () {
            $(this).parent().find('button.detail').trigger('click');
        });

        $('#reset').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $("#searchChoice").val('campaignId');
            $("#inputSuccess4").val('');
            !$("#approverId").prop('disabled') && $("#approverId").val('');
            $("#approval-status label:first").trigger('click');
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

        $("#search").on("click", function (e) {
            e.preventDefault();

            getAndRenderList();
        });
    }


    function getQueryData() {
        var searchType = $("#searchChoice").val();
        var searchValue = $("#inputSuccess4").val();

        if (searchValue != '') {
            ApprovalStatus.all();
        }

        var queryData = $("form").serializeArray().reduce(function (param, opt) {
            param[opt.name] = opt.value;
            return param;
        }, {});

        var s = {};
        s[searchType] = searchValue;

        return $.extend(s, queryData);
    }

    function getAndRenderList() {
        var ext = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var queryData = _.extend({}, getQueryData(), ext);

        showClosed = getQueryData()['status'] ? '1' : '';

        _.defaults(queryData, {
            currentPage: 1,
            status: '1,2',
            limit: 50
        });

        for (var n in queryData) {
            if (queryData[n] === undefined || queryData[n] === '') {
                delete queryData[n];
            }
        }
        getAndRenderList.require && getAndRenderList.require.abort && getAndRenderList.require.abort();

        $("#list").html('<tr><td  class="text-center" colspan="10">Loading...</td></tr>');
        getAndRenderList.require = common.ajaxGet('querCampaignApproveList', queryData);
        getAndRenderList.require.then(function (res) {
            var materials_list_html = void 0;
            if (res.status == 0) {
                if (res.data && res.data.list.length == 0) {
                    materials_list_html = '<tr><td  class="text-center" colspan="10">No Result</td></tr>';
                } else {
                    materials_list_html = template('materialsList', { data: res.data.list.map(defaultResultMapper) });
                }
                $("#list").html(materials_list_html);

                pageRender(res.data.paging);
            }

            if (res.status) {
                $("#list").html('');
                pageRender();
            }
        });
    }
    function helper() {
        template.helper("handleStatus", function (status) {
            switch (status) {
                case 1:
                    return '<span class="label label-default">审核中</span>';
                case 2:
                    return '<span class="label label-success">通过</span>';
                case 3:
                    return '<span class="label label-danger">未通过</span>';
                case 4:
                    return '<span class="label label-warning">部分通过</span>';
                default:
                    return "";
            }
        });
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
        template.helper("handleAdType", function (id) {
            switch (id) {
                case 1:
                    return "横幅";
                case 2:
                    return "原生";
                case 3:
                    return "视频";
                case 4:
                default:
                    return "";
            }
        });
        template.helper("alertIcon", function (status) {
            if (status === 0) {
                return '<span class="label label-danger" title="Alter"><i class="glyphicon glyphicon-exclamation-sign"></i></span>';
            }

            return '<span class="label label-ignore" title="Alter"><i class="glyphicon glyphicon-exclamation-sign"></i></span>';
        });
        template.helper("runOnAlert", function (status) {
            switch (status) {
                case 1:
                    return '<span class="label label-success" title="Ignore alter">Ignore</span>';
                default:
                    return '<span class="label label-ignore" title="Ignore alter">Ignore</span>';
            }
        });
    }

    var ApprovalStatus = function ($container) {
        $container.find('input').on('change', function (e) {
            var a = $container.find('label').not($(this).parent());
            setTimeout(function () {
                a.removeClass('active').removeClass('active').find('input').prop('checked', false);
            }, 0);
            getAndRenderList();
        });
        return {
            val: function val() {
                return $container.find(' input:checked').val();
            },
            all: function all() {
                $container.find('label').removeClass('active').eq(0).addClass('active');
                $container.find('input').removeProp('checked').eq(0).prop('checked', true);
            }
        };
    }($('#approval-status'));
});

function defaultResultMapper(item) {
    return _.defaults(item, {
        accountId: null,
        accountName: null,
        adCount: null,
        approvalStatus: null,
        campaignId: null,
        campaignName: null,
        email: null,
        geoRunOnAlert: null,
        geoStatus: null,
        linkType: null,
        runOnAlert: null,
        status: null,
        tmtStatus: null,
        updateTime: null
    });
}