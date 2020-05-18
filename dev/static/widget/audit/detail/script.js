$(function() {
    common.pluginsTools.loadPlugins(initialize, ['template']);
    var tmpData;
    // bindEvents();

    const LEVEL = 'ABCDEFGHIJKL'

    //获取素材详情
    function initialize() {
        
        let maxClass = 1
        //var adId = common.urlTools.getUrlParam("adId");
        let [campaignId, approvalStatus, showClosed] = common.getUrlVars('campaignId', 'approvalStatus', 'showClosed')
        var queryData = `campaignId=${campaignId}&approvalStatus=${approvalStatus}&adStatus=${showClosed?'1,2,3':''}`;
        bindEvents();
        common.ajaxRequest("queryCampaignApproveInfo", queryData, function(data) {
            if (data.status == 0) {
                document.title = data.data.campaignId + ':' + data.data.campaignName + ' | ' + document.title
                var classGroup = {}
                data.data.platforms.sort(function(a, b) {
                    return a.class >= b.class ? 1 : -1;
                })
                data.data.platforms.forEach(function(a) {
                    classGroup[LEVEL[a.class - 1]] = classGroup[LEVEL[a.class - 1]] || []
                    classGroup[LEVEL[a.class - 1]].push(a)
                })
                maxClass = data.data.platforms[data.data.platforms.length - 1].class
                // console.log(data.data.platforms);
                data.data.classGroup = classGroup
                data && renderCampaignApproveInfo(data.data);
                tmpData = data.data

                appendLevel(maxClass)
            }
        })
        

        helper();
        buildShielder();

        // if(common.get('roleId') == 2 || common.get('roleId') == 7) {
        //     $('#submits').show()
        // }
    }


    function appendLevel(max) {
        const render = template.compile(`
            <%for(var i = 0; i < max; i++){%>
                <a href="javascript:;" class="btn btn-primary" shield="<%= i + 1 %>"><%= LEVEL[i] %></a>
            <%}%>`)
        $('#shield-main').append(render({max: max, LEVEL}))

        const render1 = template.compile(`
            <%for(var i = 0; i < max; i++){%>
                <a href="javascript:;" class="btn btn-default" shield="<%= i + 1 %>"><%= LEVEL[i] %></a>
            <%}%>`)
        $('.ad-container .tools').append(render1({max: max, LEVEL}))

    }

    function buildShielder() {
        var container = $('.shield')

        container.on('click', 'a[shield]', function() {
            var shield = parseInt($(this).attr('shield'))
            $('#adList :checkbox').prop('checked', true)
            // $('#adList .checkAll').removeProp('checked')

            $('#adList').find(':checkbox[level]').each(function() {
                var level = parseInt($(this).attr('level'))
                if(level <= shield) {
                    $(this).removeProp('checked')
                }
            })
        })

        container.on('click', 'a[check-all]', function() {
            $('#adList :checkbox').prop('checked', true)
        })
    }

    //审核素材
    function approveCreative(type) {
        var saveType = type ? 1: 0;
        var error = false;
        // var queryData = $("form").serialize() + `&saveType=${saveType}`;

        var formSerialize = $('form').serializeArray().reduce((obj, item) => {
            obj[item.name] = item.value
            return obj;
        }, {})

        var data = {
            approveAds: [],
            runOnAlert: formSerialize.runOnAlert == 'on' ? 1 : 0,
            geoRunOnAlert: formSerialize.geoRunOnAlert == 'on' ? 1 : 0,
            inmobiRunOnAlert: formSerialize.inmobiRunOnAlert == 'on' ? 1 : 0
        }

        // console.log(formSerialize, data);
        // return


        $('.ad-container').each(function(i) {
            var $adContainer = $(this);
            var adId = $adContainer.attr('adId');
            var reason = $adContainer.find('.ad-reason').val() || '';
            var approvedPlatform = [];
            var isAllPass = !($adContainer.find('[platformId]').size() - $adContainer.find('[platformId]:checked').size())

            

            $adContainer.find('[platformId]:checked').each(function(input) {
                approvedPlatform.push($(this).attr('platformId'))
            })
            
            var sourceAdData = tmpData.creativeList[i];
            var ad = {
                adId,
                reason,
                approvedPlatform,

                bannerUrl: sourceAdData.bannerUrl,
                iconUrl: sourceAdData.iconUrl,
                picUrl: sourceAdData.picUrl,
                videoUrl: sourceAdData.videoUrl,
                html: sourceAdData.html,

                //TODO: Native相关
            };


            if(!isAllPass && reason == '') {
                error = true;
                alert(`[adID:${adId}]审核未通过或部分通过的创意必须填写原因`)
            }

            data.approveAds.push(ad)
        })


        !error && common.ajaxPost("batchApproveAd", data).done(function(data) {
            if(data.status == 0) {
                common.msgs.new_msg("success", "success");
                window.location = "./index.html?goto=audit&mold=list";
            } else {
                common.msgs.new_msg("error", "提交失败");
            }
            
        })
    }
    function  bindEvents() {
        $('#adList').on('click', '[check-all-ad]', function() {
            var $adContainer = $(this).parents('.ad-container:first')
            // var checked = 'true';//$(this).prop('checked')
            $adContainer.find('.platform-container input').prop('checked', 'checked')
        })
        $('#adList').on('click', '[apply-to-all]', function() {
            // $('#adList .checkAll').removeProp('checked')

            var $adContainer = $(this).parents('.ad-container:first')
            var platforms = {}
            $('[platformId]', $adContainer).each(function() {
                var id = $(this).attr('platformId')
                platforms[id] = $(this).prop('checked')
            })

            $('#adList').find('.ad-container [platformId]').each(function() {
                var id = $(this).attr('platformId')
                $(this).prop('checked', platforms[id])
            })

            var reason = $adContainer.find('.ad-reason').val()

            $('#adList').find('.ad-reason').val(reason)

            return false
        })

        $('#adList').on('click', '[shield]', function() {
            var shield = parseInt($(this).attr('shield'))
            // $(this).parent().find('.checkAll').removeProp('checked')
            $(this).parents('.ad-container:first').find(':checkbox[level]')
            .prop('checked', true)
            .each(function() {
                var level = parseInt($(this).attr('level'))
                if(level <= shield) {
                    $(this).removeProp('checked')
                }
            })
        })

        // $('#adList').on('click', ':checkbox[level]', function() {
        //     $(this).parents('.ad-container:first').find('.checkAll').removeProp('checked')
        // })

        // $("button.submitAndGoNext").unbind().on("click", function() {
        //     approveCreative("submitAndGoNext");
        // })
        $("button.submitAndExit").unbind().on("click", function() {
            approveCreative();
        })
        $("button.cancel").unbind().on("click", function() {
            window.location.href="index.html?goto=audit&mold=list"
        })
    }
    //adId和adType映射
    function handleAdType (id){
        switch (id) {
            case 1 :
                return "横幅"
                break;
            case 2 :
                return "原生"
                break;
            case 3 :
                return "视频"
                break;
            default:
                return "";
                break;
        }
    }
    

    function renderCampaignApproveInfo(data) {
        data.countryWl = JSON.parse('{"0":' + data.countryWl + '}')['0'].map(country => {
            // console.log(country);
            return country.name
        })

        data.creativeList.forEach(ad => {
            ad.approvedPlatform = JSON.parse(ad.approvedPlatform)
        })

        // console.log(data);

        $('#campaignDetail').html(template('campaignDetailTmp', {data}))

        $('#adList').html(template('adListTmp', {adList: data.creativeList, campaign: data}))
    }

    function helper() {
        template.helper("handleStatus", function(status){
            switch (status) {
                case 1 :
                    return '<span class="label label-default">审核中</span>'
                    break;
                case 2 :
                    return '<span class="label label-success">通过</span>'
                    break;
                case 3 :
                    return '<span class="label label-danger">未通过</span>'
                    break;
                case 4 :
                    return '<span class="label label-warning">部分通过</span>'
                    break;
                default:
                    return "";
                    break;
            }
        })

        template.helper("campaignStatus", function(status){
            switch (status) {
                case 1 :
                    return "Active"
                    break;
                case 2 :
                    return "Paused"
                    break;
                case 3 :
                    return "Deleted"
                    break;
                default:
                    return "Unknown"
            }
        })

        template.helper("adStatus", function(status){
            switch (status) {
                case 1 :
                    return "Active"
                    break;
                case 2 :
                    return "Paused"
                    break;
                case 3 :
                    return "Deleted"
                    break;
                default:
                    return "Unknown"
            }
        })

        template.helper("tmt", function(status){
            if(status == 0) {
                return '<span class="label label-danger">有报警！</span>'
            } else if(status == 1) {
                return '<span class="label label-success">无报警</span>'   
            } else if(status == 2) {
                return '<span class="label label-default">扫描中</span>'   
            }
        })

        var TRAFFICTYPE = {
            0: '不限',
            1: '移动网站流量',
            2: '移动应用流量'
        }
        template.helper("trafficType", string => {
            let arr = [], ret = ''
            try{
                arr = JSON.parse(string)
            }catch(e){}
            !arr.length && (arr = [0])
            arr = _.map(arr, i => TRAFFICTYPE[i])
            return arr.join(',')
        })

        template.helper("parseInt", function(id){
            return parseInt(id)
        })

        template.helper("forin", function(obj, fn){
            Object.keys(obj).forEach(key => fn(obj[key], key))
        })

        template.helper("linkType", function(i){
            var LinkType = {
                '1': 'Banner',
                '2': 'Jstag',
                '3': 'Video',
                '4': 'Pop',
                '5': 'Pop prime',
                '6': 'Native',
            }
            return LinkType[i] || 'UNKNOWN'
        })


    }
})
