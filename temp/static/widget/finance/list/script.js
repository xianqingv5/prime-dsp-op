var [plugin1,plugin2] = ["template","datetimepicker"];
function bindEvents (){
	$("#manualCharge, #manualRefund").unbind().on("click", function() {
		var action = $(this).attr("id");
		window.location = `./index.html?goto=finance&mold=${action}`;
	})
	$("#chargeCheck, #refundCheck").unbind().on("click", function() {
		var action = $(this).attr("id");
		window.location = `./index.html?goto=finance&mold=${action}`;
		//queryNextPendingChargeInfo(actionType);
	})
	$("button.detail").unbind().on("click", function() {
		var chargeId = $(this).attr("chargeId");
		var type = $(this).attr("type");
		window.location = `./index.html?goto=finance&mold=${type}&chargeId=${chargeId}`;
	})
	/*$("tr").unbind().on("click", function() {
		var chargeId = $(this).attr("id");
		var type = $(this).attr("type");
		var action =  $(this).attr("action");
		window.location = `./index.html?goto=finance&mold=${type}&chargeId=${chargeId}&action=${action}`;
	})*/
	$("#search").unbind().on("click", function(e) {
		e.preventDefault();
		getAndRenderList();
	})
}
function getAndRenderList (currentPage,start, end){
	var page = currentPage || 1;
	var queryData = $("form").serialize() + "&currentPage=" + page;
    var roleId = $("#userInfomation").attr("roleId");
	var manualCharge = $("#manualCharge"),
		manualRefund = $("#manualRefund"),
		chargeCheck = $("#chargeCheck"),
		refundCheck = $("#refundCheck");
	if (roleId == 4) {
		manualCharge.removeClass("hidden");
		manualRefund.removeClass("hidden");
	} else if (roleId == 5) {
		chargeCheck.removeClass("hidden");
		refundCheck.removeClass("hidden");
	} else if (roleId == 2) {
		manualCharge.removeClass("hidden");
		manualRefund.removeClass("hidden");
		chargeCheck.removeClass("hidden");
		refundCheck.removeClass("hidden");
	} else if (roleId == 6) {
		manualCharge.removeClass("hidden");
		manualRefund.removeClass("hidden");
	}
    helper();
   	common.ajaxRequest('queryAccountChargeHistory', queryData, function(result) {
        if (result.status == 0) {
        	if (result.data && result.data.list.length == 0) {
        		var html = '<tr><td  class="text-left" colspan="11">No result</td></tr>';
        	} else {
				var html = template('financeList', {data:result.data && result.data.list,roleId:roleId});
        	}
			common.buildPage($(".page"), result.data.paging, queryData, getAndRenderList, 10, currentPage, start, end);
			$("#list").html(html);
			bindEvents();
        }
    })
}
function helper(){
	template.helper("handleStatus", function(id){
		switch (id) {
			case 0 :
				return "??????"
				break;
			case 1 :
				return "?????????"
				break;
			case 2 :
				return "????????????"
				break;
			case 3 :
				return "???????????????"
				break;
			default:
				return "";
				break;
		}
	})
	template.helper("handleType", function(type){
		switch (type){
			case 0:
				return "??????";
				break;
			case 1:
				return "paypal??????";
				break;
			case 2:
				return "paypal???????????????";
				break;
			case 3:
				return "??????????????????";
				break;
			case 4:
				return "???????????????????????????";
				break;
			case 5:
				return "???????????????";
				break;
			case 6:
				return "????????????????????????";
				break;
			case 7:
				return "paypal??????";
				break;
			case 8:
				return "paypal???????????????";
				break;
			case 9:
				return "??????????????????";
				break;
			case 10:
				return "???????????????????????????";
				break;
			default:
				return "";
				break;
		}
	})
	template.helper("handleAmount", function(type){
		switch (type){
			case 0:
				return "??????";
				break;
			case 1:
				return "income";
				break;
			case 2:
				return "payout";
				break;
			case 3:
				return "income";
				break;
			case 4:
				return "payout";
				break;
			case 5:
				return "income";
				break;
			case 6:
				return "payout";
				break;
			case 7:
				return "payout";
				break;
			case 8:
				return "payout";
				break;
			case 9:
				return "payout";
				break;
			case 10:
				return "payout";
				break;
			default:
				return "";
				break;
		}

	})
}
function init() {
	$('.form_datetime, .form_date').datetimepicker({
		todayHighlight: 1,
		pickerPosition: "bottom"
    });
    getAndRenderList();
}
bindEvents();
common.pluginsTools.loadCss("datetimepickerCss");
common.pluginsTools.loadPlugins(init, [plugin1, plugin2]);
