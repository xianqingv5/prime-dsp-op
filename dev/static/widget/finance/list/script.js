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
	$("#finance-list").on("click", "button.detail", function(e) {
        e.stopPropagation()
		var chargeId = $(this).attr("chargeId");
		var type = $(this).attr("type");
		window.location = `./index.html?goto=finance&mold=${type}&chargeId=${chargeId}`;
	})
	$("#finance-list").on("click", "button.attach-img", function(e) {
        e.stopPropagation()
        var imgLink = $(this).attr('imgLink');
        $('#imgModal').modal({backdrop: 'static', keyboard: false});
        $('#imgModal').find('img').attr('src',imgLink);
	})

    // $("#finance-list").on('click', "tr", function() {
    //     $(this).find('.detail').trigger('click')
    // })
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
function filterEvents (){
	var $showAll = $('#show-all')
    var $chargeType = $('#chargeType')
    var $filter = $('.filter').focus()
    $filter.on('keyup', function (e) {
        var charCode = e.charCode || e.keyCode;
        if(charCode == '13') {
        	var key = $(this).attr('data-key')
        	$filter.each(function() {
                if(key != $(this).attr('data-key')) {
                    $(this).val('')
                }
            })
            getAndRenderList();
        }
    })

    $showAll.on('click', function() {
        $filter.val('')
        $chargeType.val('')
        getAndRenderList();
    })
    
    $chargeType.on('change', function(){
        getAndRenderList();
    })
}
function getAndRenderList (currentPage,start, end){
	var page = currentPage || 1;
	var queryData = $("form").serialize() + "&currentPage=" + page;
    var roleId = $("#userInfomation").attr("roleId");
	// var manualCharge = $("#manualCharge"),
	// 	manualRefund = $("#manualRefund"),
	// 	chargeCheck = $("#chargeCheck"),
	// 	refundCheck = $("#refundCheck");
	// if (roleId == 4) {
	// 	manualCharge.removeClass("hidden");
	// 	manualRefund.removeClass("hidden");
	// } else if (roleId == 5) {
	// 	chargeCheck.removeClass("hidden");
	// 	refundCheck.removeClass("hidden");
	// } else if (roleId == 2) {
	// 	manualCharge.removeClass("hidden");
	// 	manualRefund.removeClass("hidden");
	// 	chargeCheck.removeClass("hidden");
	// 	refundCheck.removeClass("hidden");
	// } else if (roleId == 6 || roleId == 7) {
	// 	manualCharge.removeClass("hidden");
	// 	manualRefund.removeClass("hidden");
	// }
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
        }
    })
}
function helper(){
	template.helper("handleStatus", function(id){
		switch (id) {
			case 0 :
				return "??????"
			case 1 :
				return "?????????"
			case 2 :
				return "????????????"
			case 3 :
				return "???????????????"
			default:
				return "";
		}
	})
	template.helper("handleType", function(type){
		switch (type){
			case 0:
				return "??????";
			case 1:
				return "paypal??????";
			case 2:
				return "paypal???????????????";
			case 3:
				return "??????????????????";
			case 4:
				return "???????????????????????????";
			case 5:
				return "???????????????";
			case 6:
				return "????????????????????????";
			case 7:
				return "paypal??????";
			case 8:
				return "paypal???????????????";
			case 9:
				return "??????????????????";
			case 10:
				return "???????????????????????????";
			case 11:
				return "??????";
			// case 12:
			// 	return "???????????????";
			case 13:
				return "??????";
			// case 14:
			// 	return "???????????????";
			case 15:
				return "????????????";
			case 16:
				return "?????????????????????";
			case 17:
				return "bonus";
			case 18:
				return "bonus?????????";
			case 19:
				return "??????";
			case 20:
				return "???????????????";
			case 21:
				return "?????????";
			case 22:
				return "??????????????????";
			default:
				return "";
		}
	})
	template.helper("handleAmount", function(type){
		switch (type){
			case 0:
				return "??????";
			case 1:
				return "income";
			case 2:
				return "payout";
			case 3:
				return "income";
			case 4:
				return "payout";
			case 5:
				return "income";
			case 6:
				return "payout";
			case 7:
				return "payout";
			case 8:
				return "payout";
			case 9:
				return "payout";
			case 10:
				return "payout";
			case 11:
				return "income";
			// case 12:
			// 	return "payout";
			case 13:
				return "payout";
				
			default:
				return "";
		}

	})

	template.helper("checkType", function(type){
		switch (type){
			case 0:
				return '';
			case 1:
				return "chargeCheck";
			case 2:
				return "chargeCheck";
			case 3:
				return "chargeCheck";
			case 4:
				return "chargeCheck";
			case 5:
				return "chargeCheck";
			case 6:
				return "chargeCheck";
			case 7:
				return "refundCheck";
			case 8:
				return "refundCheck";
			case 9:
				return "refundCheck";
			case 10:
				return "refundCheck";
			case 11:
				return "chargeCheck";
			case 13:
				return "refundCheck";
			// case 14:
			// 	return "refundCheck";
			case 15:
				return "chargeCheck";
			case 16:
				return "chargeCheck";
			case 17:
				return "chargeCheck";
			case 18:
				return "chargeCheck";
			case 19:
				return "chargeCheck";
			case 20:
				return "chargeCheck";
			case 21:
				return "chargeCheck";
			case 22:
				return "chargeCheck";
			default:
				return "";
		}
	})
}
function init() {
	$('.form_datetime, .form_date').datetimepicker({
		todayHighlight: 1,
		pickerPosition: "bottom"
    });
    getAndRenderList();
    bindEvents();
    filterEvents();
}

common.pluginsTools.loadCss("datetimepickerCss");
common.pluginsTools.loadPlugins(init, [plugin1, plugin2]);
