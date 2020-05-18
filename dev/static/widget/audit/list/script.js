$(function() {
    var [plugin1,plugin2] = ["template","datetimepicker"];
    var approverId = $("#userInfomation").attr("approverId");
    var roleId = $("#userInfomation").attr("roleId");
    var showClosed = getQueryData()['status'] ? '1' : ''

    common.pluginsTools.loadPlugins(init, [plugin1, plugin2]);
    common.pluginsTools.loadCss("datetimepickerCss");

    var pageRender = common.PageRender($('.page'), getAndRenderList)
//初始化
    function  init() {
        helper();
        bindEvents();

        var userId = common.getUrlVars('userId')
        if(userId) {
            $("#searchChoice").val('acUserId')
            $("#inputSuccess4").val(userId)
        }
        // console.log(1,common.getUrlVars('userId'));

        $('.form_datetime, .form_date').datetimepicker({
            todayHighlight: 1,
            pickerPosition: "bottom"
        });
        // queryApprovalList();
        getAndRenderList();
    }


    function bindEvents (){
        //审核素材
        $("#list").on("click", 'button.detail', function(e) {
            var campaignId = $(this).attr("campaignId");
            localStorage.setItem("campaignId", campaignId);
            ApprovalStatus.val()

            var queryString = $.param({
                'goto': 'audit',
                'mold': 'detail',
                'approvalStatus': ApprovalStatus.val(),
                'showClosed': showClosed,
                campaignId,
            })


            window.open("./index.html?" + queryString, 'dsp-op-' + campaignId)
            e.stopPropagation()
        })

        $("#list").on("click", 'button.reason', function(e) {
            var campaignId = $(this).attr("campaignId");
            var queryString = $.param({
                'qtime': '',
                'qcamp': campaignId,
                'latest15': '查询最近15分钟',
            })

            window.open(window.filter_reason_host + "/filter_reason/?" + queryString)
            e.stopPropagation()
        })

        $("#list").on('click', 'tr td:not(.actions)', function() {
            // console.log(1)
            $(this).parent().find('button.detail').trigger('click')
        })

        $('#reset').on('click', function(e) {
            e.preventDefault()
            e.stopPropagation()
            $("#searchChoice").val('campaignId')
            $("#inputSuccess4").val('')
            !$("#approverId").prop('disabled') && $("#approverId").val('')
            $("#approval-status label:first").trigger('click')
        })

        $('#inputSuccess4').on('keydown', function(e){
            var keyCode = e.keyCode || e.which 

            if(keyCode == '13') {
                e.preventDefault();
                getAndRenderList();
            }

            else if(keyCode == '27') {
                $("#inputSuccess4").val('');
                getAndRenderList();
            }
        })

        //模糊搜索
        $("#search").on("click", function(e) {
            e.preventDefault();

            
            // console.log(queryData);
            getAndRenderList();
        })
    }
    //获取审核人列表
    /*function queryApprovalList () {
        var queryData = "";
        console.log(111);
        if (roleId == 2) {
            common.ajaxRequest('queryApprovalList', queryData, function(result) {
                if (result.status == 0) {

                    result.data.list = result.data.list.map(defaultResultMapper)
                    console.log(result.data.list);
                    var options = $("#approverId").html();
                    for (let i = 0, length = result.data.list.length; i < length; i++) {
                        options += '<option value="' + result.data.list[i].approverId+　'">' + result.data.list[i].approverName + '</option>';
                    }
                    $("#approverId").html(options);
                }
            })
        } else {
            var approvalName = $("#userInfomation").text().split("@")[0];
            

            var options = '<option value="' + approverId +　'">' + approvalName + '</option>';
            $("#approverId").html(options);
            $("#approverId").val(approverId).attr("disabled", true);
        }   
        
    }*/

    function getQueryData() {
        var searchType = $("#searchChoice").val();
        var searchValue = $("#inputSuccess4").val();

        if(searchValue!='') {
            ApprovalStatus.all()
        }

        var queryData = $("form").serializeArray().reduce((param, opt) => {
            param[opt.name] = opt.value
            return param
        }, {})


        var s = {}
        s[searchType] = searchValue
        
        return $.extend(s, queryData)
    }
    //获取并渲染素材列表
    function getAndRenderList (ext = {}){
        // localStorage.setItem("approvalStatus", ApprovalStatus.val());
        //TODO 保存 approval status到地址栏中，用location.replace()
        
        // 扩展
        var queryData = _.extend({}, getQueryData(), ext)

        showClosed = getQueryData()['status'] ? '1' : ''

        // localStorage.setItem("showClosed", queryData['show-closed'])

        // 默认值
        _.defaults(queryData, {
            currentPage: 1,
            status: '1,2',
            limit: 50,
        })

        for(var n in queryData) {
            if(queryData[n] === undefined || queryData[n] === '') {
                delete queryData[n]
            }
        }
        getAndRenderList.require && getAndRenderList.require.abort && getAndRenderList.require.abort()

        // var queryData = getQueryData() + "&currentPage=" + page;
        // console.log(queryData);
        $("#list").html('<tr><td  class="text-center" colspan="10">Loading...</td></tr>')
        getAndRenderList.require = common.ajaxGet('querCampaignApproveList', queryData)
        getAndRenderList.require.then(function(res) {
            let materials_list_html;
            if (res.status == 0) {
                if (res.data && res.data.list.length == 0) {
                    materials_list_html = '<tr><td  class="text-center" colspan="10">No Result</td></tr>';
                } else {
                    materials_list_html = template('materialsList', {data:res.data.list.map(defaultResultMapper)});
                }
                $("#list").html(materials_list_html);

                
                pageRender(res.data.paging)
            }

            if(res.status) {
                $("#list").html('')
                pageRender()
            }
        })
    }
    function helper (){
        template.helper("handleStatus", function(status){
            switch (status) {
                case 1 :
                    return '<span class="label label-default">审核中</span>'
                case 2 :
                    return '<span class="label label-success">通过</span>'
                case 3 :
                    return '<span class="label label-danger">未通过</span>'
                case 4 :
                    return '<span class="label label-warning">部分通过</span>'
                default:
                    return "";
            }
        })
        template.helper("status", function(status){
            switch (status) {
                case 1 :
                    return '<span class="text-success"><i class="glyphicon glyphicon-play" /></span>'
                case 2 :
                    return '<span class="text-muted"><i class="glyphicon glyphicon-pause" /></span>'
                case 3 :
                    return '<span class="text-danger"><i class="glyphicon glyphicon-stop" /></span>'
                default:
                    return "";
            }
        })
        template.helper("handleAdType", function(id){
            switch (id) {
                case 1:
                    return "横幅"
                case 2:
                    return "原生"
                case 3:
                    return "视频"
                case 4:
                default:
                    return "";
            }
        })
        template.helper("alertIcon", function(status){
            // status = _.random(0, 1)
            if(status === 0) {
                return '<span class="label label-danger" title="Alter"><i class="glyphicon glyphicon-exclamation-sign"></i></span>'
            }

            return '<span class="label label-ignore" title="Alter"><i class="glyphicon glyphicon-exclamation-sign"></i></span>'
        })
        template.helper("runOnAlert", function(status){
            // status = _.random(0, 1)
            switch (status) {
                case 1:
                    return '<span class="label label-success" title="Ignore alter">Ignore</span>'
                default:
                    return '<span class="label label-ignore" title="Ignore alter">Ignore</span>';
            }
        })
        // template.helper("countUnapprovedAdIds", function(id, status, unapprovedAdIds){
        //     if (status != 2) {
        //         unapprovedAdIds.push(id);
        //     }
        //     return unapprovedAdIds.join(",");
        // })
    }

    

    const ApprovalStatus = (function($container) {
        $container.find('input').on('change', function(e) {
            var a = $container.find('label').not($(this).parent());
            setTimeout(function(){
                a.removeClass('active').removeClass('active').find('input').prop('checked', false)
            }, 0)
            getAndRenderList()
        })
        return {
            val: () => {
                return $container.find(' input:checked').val()
            },
            all: () => {
                $container.find('label').removeClass('active').eq(0).addClass('active')
                $container.find('input').removeProp('checked').eq(0).prop('checked', true)


            }
        }
    })($('#approval-status'))

})

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
        updateTime: null,
    })
}