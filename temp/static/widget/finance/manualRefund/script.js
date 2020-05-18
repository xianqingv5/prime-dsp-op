function bindEvents (){
	$("button").unbind().on("click", function(e) {
		e.preventDefault();
		var confirm = $(this).is(".confirm");
		if (confirm) {
			var formData = $("form").serialize();
			var check = checkInputs();
			if (check) {
			   	common.ajaxRequest('refund', formData, function(result) {
			        if (result.status == 0) {
						common.msgs.new_msg("success", "success");
						window.location = './index.html?goto=finance&mold=list';
			        } else {
						common.msgs.new_msg("error", result.msg);
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
	var validStatus = 2;
	common.getAccountIdName(validStatus, $("#accountId"));
	$("#approver").text($("#userInfomation").attr("name"));
}
//计算实际退款金额
function countAmount() {
	var payment = $("#payment").val();
	var commission = $("#commission").val();
	var amount = payment - commission;
	$("#amount").removeClass("hidden").text(amount);
}
//检查输入
function checkInputs() {
	var flag = false;
	var account_id = $("#accountId").val(),
		payment = $("#payment").val() * 1,
		paymentCheck = $("#paymentCheck").val() * 1,
		commission = $("#commission").val() * 1,
		charge_type = $("#charge_type").val(),
		balance = $("#balance").text() * 1;
	if (account_id == "") {
		common.msgs.new_msg("Error", "请选择账户");
		return;
	} else {
		flag = true;
	}
	if (payment == undefined) {
		common.msgs.new_msg("Error", "请输入退款金额");
		return;
	} else {
		flag = true;
	}
	if (paymentCheck == undefined) {
		common.msgs.new_msg("Error", "请确认退款金额");
		return;
	} else {
		flag = true;
	}
	if (commission == undefined) {
		common.msgs.new_msg("Error", "请输入退款手续费");
		return;
	} else {
		flag = true;
	}
	if (charge_type == "") {
		common.msgs.new_msg("Error", "请选择退款方式");
		return;
	} else {
		flag = true;
	}
	if (payment != paymentCheck) {
		common.msgs.new_msg("Error", "退款金额和确认退款金额不一致");
		return;
	} else {
		flag = true;
	}
	if (payment < commission) {
		common.msgs.new_msg("Error", "退款手续费大于退款金额");
		return;
	} else {
		flag = true;
	}
	if (payment < balance) {
		common.msgs.new_msg("Error", "退款金额小于账户余额，请尝试关闭所有广告活动后操作");
		return;
	} else {
		flag = true;
	}
	return flag;
}
getAccountIdName();
bindEvents();
