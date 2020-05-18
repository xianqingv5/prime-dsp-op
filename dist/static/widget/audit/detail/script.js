'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

$(function () {
    common.pluginsTools.loadPlugins(initialize, ['template']);
    var tmpData;


    var LEVEL = 'ABCDEFGHIJKL';

    function initialize() {

        var maxClass = 1;

        var _common$getUrlVars = common.getUrlVars('campaignId', 'approvalStatus', 'showClosed'),
            _common$getUrlVars2 = _slicedToArray(_common$getUrlVars, 3),
            campaignId = _common$getUrlVars2[0],
            approvalStatus = _common$getUrlVars2[1],
            showClosed = _common$getUrlVars2[2];

        var queryData = 'campaignId=' + campaignId + '&approvalStatus=' + approvalStatus + '&adStatus=' + (showClosed ? '1,2,3' : '');
        bindEvents();
        common.ajaxRequest("queryCampaignApproveInfo", queryData, function (data) {
            if (data.status == 0) {
                document.title = data.data.campaignId + ':' + data.data.campaignName + ' | ' + document.title;
                var classGroup = {};
                data.data.platforms.sort(function (a, b) {
                    return a.class >= b.class ? 1 : -1;
                });
                data.data.platforms.forEach(function (a) {
                    classGroup[LEVEL[a.class - 1]] = classGroup[LEVEL[a.class - 1]] || [];
                    classGroup[LEVEL[a.class - 1]].push(a);
                });
                maxClass = data.data.platforms[data.data.platforms.length - 1].class;

                data.data.classGroup = classGroup;
                data && renderCampaignApproveInfo(data.data);
                tmpData = data.data;

                appendLevel(maxClass);
            }
        });

        helper();
        buildShielder();
    }

    function appendLevel(max) {
        var render = template.compile('\n            <%for(var i = 0; i < max; i++){%>\n                <a href="javascript:;" class="btn btn-primary" shield="<%= i + 1 %>"><%= LEVEL[i] %></a>\n            <%}%>');
        $('#shield-main').append(render({ max: max, LEVEL: LEVEL }));

        var render1 = template.compile('\n            <%for(var i = 0; i < max; i++){%>\n                <a href="javascript:;" class="btn btn-default" shield="<%= i + 1 %>"><%= LEVEL[i] %></a>\n            <%}%>');
        $('.ad-container .tools').append(render1({ max: max, LEVEL: LEVEL }));
    }

    function buildShielder() {
        var container = $('.shield');

        container.on('click', 'a[shield]', function () {
            var shield = parseInt($(this).attr('shield'));
            $('#adList :checkbox').prop('checked', true);


            $('#adList').find(':checkbox[level]').each(function () {
                var level = parseInt($(this).attr('level'));
                if (level <= shield) {
                    $(this).removeProp('checked');
                }
            });
        });

        container.on('click', 'a[check-all]', function () {
            $('#adList :checkbox').prop('checked', true);
        });
    }

    function approveCreative(type) {
        var saveType = type ? 1 : 0;
        var error = false;


        var formSerialize = $('form').serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});

        var data = {
            approveAds: [],
            runOnAlert: formSerialize.runOnAlert == 'on' ? 1 : 0,
            geoRunOnAlert: formSerialize.geoRunOnAlert == 'on' ? 1 : 0,
            inmobiRunOnAlert: formSerialize.inmobiRunOnAlert == 'on' ? 1 : 0
        };

        $('.ad-container').each(function (i) {
            var $adContainer = $(this);
            var adId = $adContainer.attr('adId');
            var reason = $adContainer.find('.ad-reason').val() || '';
            var approvedPlatform = [];
            var isAllPass = !($adContainer.find('[platformId]').size() - $adContainer.find('[platformId]:checked').size());

            $adContainer.find('[platformId]:checked').each(function (input) {
                approvedPlatform.push($(this).attr('platformId'));
            });

            var sourceAdData = tmpData.creativeList[i];
            var ad = {
                adId: adId,
                reason: reason,
                approvedPlatform: approvedPlatform,

                bannerUrl: sourceAdData.bannerUrl,
                iconUrl: sourceAdData.iconUrl,
                picUrl: sourceAdData.picUrl,
                videoUrl: sourceAdData.videoUrl,
                html: sourceAdData.html

            };

            if (!isAllPass && reason == '') {
                error = true;
                alert('[adID:' + adId + ']\u5BA1\u6838\u672A\u901A\u8FC7\u6216\u90E8\u5206\u901A\u8FC7\u7684\u521B\u610F\u5FC5\u987B\u586B\u5199\u539F\u56E0');
            }

            data.approveAds.push(ad);
        });

        !error && common.ajaxPost("batchApproveAd", data).done(function (data) {
            if (data.status == 0) {
                common.msgs.new_msg("success", "success");
                window.location = "./index.html?goto=audit&mold=list";
            } else {
                common.msgs.new_msg("error", "提交失败");
            }
        });
    }
    function bindEvents() {
        $('#adList').on('click', '[check-all-ad]', function () {
            var $adContainer = $(this).parents('.ad-container:first');

            $adContainer.find('.platform-container input').prop('checked', 'checked');
        });
        $('#adList').on('click', '[apply-to-all]', function () {

            var $adContainer = $(this).parents('.ad-container:first');
            var platforms = {};
            $('[platformId]', $adContainer).each(function () {
                var id = $(this).attr('platformId');
                platforms[id] = $(this).prop('checked');
            });

            $('#adList').find('.ad-container [platformId]').each(function () {
                var id = $(this).attr('platformId');
                $(this).prop('checked', platforms[id]);
            });

            var reason = $adContainer.find('.ad-reason').val();

            $('#adList').find('.ad-reason').val(reason);

            return false;
        });

        $('#adList').on('click', '[shield]', function () {
            var shield = parseInt($(this).attr('shield'));

            $(this).parents('.ad-container:first').find(':checkbox[level]').prop('checked', true).each(function () {
                var level = parseInt($(this).attr('level'));
                if (level <= shield) {
                    $(this).removeProp('checked');
                }
            });
        });

        $("button.submitAndExit").unbind().on("click", function () {
            approveCreative();
        });
        $("button.cancel").unbind().on("click", function () {
            window.location.href = "index.html?goto=audit&mold=list";
        });
    }

    function handleAdType(id) {
        switch (id) {
            case 1:
                return "横幅";
                break;
            case 2:
                return "原生";
                break;
            case 3:
                return "视频";
                break;
            default:
                return "";
                break;
        }
    }

    function renderCampaignApproveInfo(data) {
        data.countryWl = JSON.parse('{"0":' + data.countryWl + '}')['0'].map(function (country) {
            return country.name;
        });

        data.creativeList.forEach(function (ad) {
            ad.approvedPlatform = JSON.parse(ad.approvedPlatform);
        });

        $('#campaignDetail').html(template('campaignDetailTmp', { data: data }));

        $('#adList').html(template('adListTmp', { adList: data.creativeList, campaign: data }));
    }

    function helper() {
        template.helper("handleStatus", function (status) {
            switch (status) {
                case 1:
                    return '<span class="label label-default">审核中</span>';
                    break;
                case 2:
                    return '<span class="label label-success">通过</span>';
                    break;
                case 3:
                    return '<span class="label label-danger">未通过</span>';
                    break;
                case 4:
                    return '<span class="label label-warning">部分通过</span>';
                    break;
                default:
                    return "";
                    break;
            }
        });

        template.helper("campaignStatus", function (status) {
            switch (status) {
                case 1:
                    return "Active";
                    break;
                case 2:
                    return "Paused";
                    break;
                case 3:
                    return "Deleted";
                    break;
                default:
                    return "Unknown";
            }
        });

        template.helper("adStatus", function (status) {
            switch (status) {
                case 1:
                    return "Active";
                    break;
                case 2:
                    return "Paused";
                    break;
                case 3:
                    return "Deleted";
                    break;
                default:
                    return "Unknown";
            }
        });

        template.helper("tmt", function (status) {
            if (status == 0) {
                return '<span class="label label-danger">有报警！</span>';
            } else if (status == 1) {
                return '<span class="label label-success">无报警</span>';
            } else if (status == 2) {
                return '<span class="label label-default">扫描中</span>';
            }
        });

        var TRAFFICTYPE = {
            0: '不限',
            1: '移动网站流量',
            2: '移动应用流量'
        };
        template.helper("trafficType", function (string) {
            var arr = [],
                ret = '';
            try {
                arr = JSON.parse(string);
            } catch (e) {}
            !arr.length && (arr = [0]);
            arr = _.map(arr, function (i) {
                return TRAFFICTYPE[i];
            });
            return arr.join(',');
        });

        template.helper("parseInt", function (id) {
            return parseInt(id);
        });

        template.helper("forin", function (obj, fn) {
            Object.keys(obj).forEach(function (key) {
                return fn(obj[key], key);
            });
        });

        template.helper("linkType", function (i) {
            var LinkType = {
                '1': 'Banner',
                '2': 'Jstag',
                '3': 'Video',
                '4': 'Pop',
                '5': 'Pop prime',
                '6': 'Native'
            };
            return LinkType[i] || 'UNKNOWN';
        });
    }
});