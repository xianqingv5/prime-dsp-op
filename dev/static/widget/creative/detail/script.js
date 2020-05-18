

    //获取素材详情
    function getCreativeInfo (adId) {
        //var adId = common.urlTools.getUrlParam("adId");
        var adId = localStorage.getItem("adId");
        var queryData = `adId=${adId}`;
        common.ajaxRequest("creativeInfo", queryData, function(data) {
            if (data.status == 0) {
                common.renderCreativeInfo(data);
                bindEvents();
            }
        })
    }
    //审核素材
    function approveCreative(type) {
        var saveType = type ? 1: 0;
        var queryData = $("form").serialize() + `&saveType=${saveType}`;
        common.ajaxRequest("approveCreative", queryData, function(data) {
            if (data.status == 0) {
                if (saveType == 1) {
                    if (data.data != null) {
                        var adType = data && data.data && data.data.adType;
                        common.renderCreativeInfo(data);
                    } else {
                        common.msgs.new_msg("warning", "已审核完所有素材", window.location = "./index.html?goto=creative&mold=list");
                    }
                } else {
                    common.msgs.new_msg("success", "success");
                    window.location = "./index.html?goto=creative&mold=list";
                }
            }
        })
    }
    function  bindEvents() {
        $('#checkAll').on("change", function(e){
            var checked = $(this).is(':checked');
            var elems = $(".inner input[type='checkbox']");
            if (checked) {
                elems.prop("checked", true);
            } else {
                elems.prop("checked", false);
            }
        })
        $("button.submitAndGoNext").unbind().on("click", function() {
            approveCreative("submitAndGoNext");
        })
        $("button.submitAndExit").unbind().on("click", function() {
            approveCreative();
        })
        $("button.cancel").unbind().on("click", function() {
            window.location.href="index.html?goto=creative&mold=list"
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
    getCreativeInfo();
    bindEvents();

