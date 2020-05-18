function bindEvents (){
	$("button").unbind().on("click", function(e) {
		e.preventDefault();
		var submitAndGo = $(this).is(".submitAndGo");
		var submitAndExit = $(this).is(".submitAndExit");
		if (submitAndGo || submitAndExit) {
			var saveType = submitAndGo ? 1 : 0;
			var formData = $("form").serialize() + `&saveType=${saveType}`;
			var check = checkInputs();
			if (check) {
			   	common.ajaxRequest('financeApprovel', formData, function(result) {
			        if (result.status == 0) {
			        	if (saveType == 1) {
				        	if (result.data != null) {
		        				common.renderfinanceApprovel(result);
				        	} else {
								common.msgs.new_msg("warning", "已审核完所有退款记录", window.location = './index.html?goto=finance&mold=list');
				        	}
			        	} else {
							common.msgs.new_msg("success", "success");
							window.location = './index.html?goto=finance&mold=list';
			        	}
			        }
			    })
			}
		} else {
			window.location = './index.html?goto=finance&mold=list';
		}
	})
}
function checkInputs() {
	var flag = false;
	var approvalStatus = $("#approvalStatus").val();
	if (approvalStatus == "") {
		common.msgs.new_msg("Error", "请选择审核结果");
		return;
	} else {
		flag = true;
	}
	return flag;
}
function getRechargeInfo () {
	var chargeId = common.urlTools.getUrlParam("chargeId");
	var action = common.urlTools.getUrlParam("action");
	if (chargeId) {
		var queryData = {chargeId: chargeId};
		$("#chargeId").val(chargeId);
		common.getChargeInfo(queryData);
		if (action) {
			$("#approvalStatus, textarea").prop("disabled", true);
			$("button").addClass("hidden");
		}
	} else {
		common.getNextPendingChargeInfo();
	}
}
function init() {
	bindEvents();
	getRechargeInfo();
}
init();