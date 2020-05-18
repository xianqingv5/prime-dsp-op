function bindEvents (){
	$("button").unbind().on("click", function(e) {
		e.preventDefault();
		var confirm = $(this).is(".confirm");
		if (confirm) {
			var formData = $("form").serialize();
			var check = checkInputs();
			if (check) {
			   	common.ajaxRequest('recharge', formData, function(result) {
			        if (result.status == 0) {
						common.msgs.new_msg("success", "success");
						window.location = './index.html?goto=finance&mold=list';
			        }
			    })
			}
		} else {
			window.location = './index.html?goto=finance&mold=list';
		}
	})
	$("#accountId").unbind().on("change", function(){
		var accountId = $(this).val();
		common.getUserBalance(accountId,$("#balance"));
	})
	$("#payment, #commission").unbind().on("keyup", function() {
		countAmount();
	})
}
//获取账户ID和名称
function getAccountIdName(){
	var validStatus = 1;
	common.getAccountIdName(validStatus, $("#accountId"));
	$("#approver").text($("#userInfomation").attr("name"));
}
//计算实际到款金额
function countAmount() {
	var payment = $("#payment").val();
	var commission = $("#commission").val();
	var amount = payment - commission;
	$("#amount").removeClass("hidden").text(amount);
}
//检查输入
function checkInputs() {
	var flag = false;
	var accountId = $("#accountId").val(),
		payment = $("#payment").val(),
		paymentCheck = $("#paymentCheck").val(),
		commission = $("#commission").val(),
		chargeType = $("#chargeType").val();
	if (accountId == "") {
		flag = false;
		common.msgs.new_msg("Error", "请选择账户");
		return;
	} else {
		flag = true;
	}
	if (payment == "") {
		flag = false;
		common.msgs.new_msg("Error", "请输入充值金额");
		return;
	} else {
		flag = true;
	}
	if (paymentCheck == "") {
		flag = false;
		common.msgs.new_msg("Error", "请输入确认充值金额");
		return;
	} else {
		flag = true;
	}
	if (commission == "") {
		flag = false;
		common.msgs.new_msg("Error", "请输入充值手续费");
		return;
	} else {
		flag = true;
	}
	if (!chargeType) {
		flag = false;
		common.msgs.new_msg("Error", "请选择充值方式");
		return;
	} else {
		flag = true;
	}
	if (payment != paymentCheck) {
		flag = false;
		common.msgs.new_msg("Error", "充值金额和确认充值金额不一致");
		return;
	} else {
		flag = true;
	}
	return flag;
}
getAccountIdName();
bindEvents();