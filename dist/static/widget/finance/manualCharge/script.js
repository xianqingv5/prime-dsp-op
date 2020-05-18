"use strict";

function bindEvents() {
	$("#content button").unbind().on("click", function (e) {
		e.preventDefault();
		var confirm = $(this).is(".confirm");
		if (confirm) {
			var check = checkInputs();
			if (check) {
				var formElement = $("#form")[0];
				var formData = new FormData(formElement);
				$.ajax({
					url: window.api_host + '/recharge',
					type: 'POST',
					cache: false,
					contentType: false,
					processData: false,
					success: function success(result) {
						common.msgs.new_msg("Success", "充值成功");
						window.location = './index.html?goto=finance&mold=list';
					},
					data: formData,
					xhrFields: {
						withCredentials: true
					}
				});
			}
		} else {
			window.location = './index.html?goto=finance&mold=list';
		}
	});
	$("#accountId").unbind().on("change", function () {
		var accountId = $(this).val();
		common.getUserBalance(accountId, $("#balance"));
	});
	$("#payment, #commission").unbind().on("keyup", function () {
		countAmount();
	});
	$("select[name=chargeType]").unbind().on("change", function () {
		$('.add_group').addClass('hidden');
		$('.add_group').find('input').each(function (i, obj) {
			$(obj).val('');
		});
		if ($(this).val() == 1 || $(this).val() == 2) {
			$('.add_group_1').removeClass('hidden');
		} else if ($(this).val() == 4) {
			$('.add_group_2').removeClass('hidden');
		}
	});
}

function getAccountIdName() {
	var validStatus = 1;
	common.getAccountIdName(validStatus, $("#accountId")).then(function () {
		$("#accountId").select2();
	});
	$("#approver").text($("#userInfomation").attr("name"));
}

function countAmount() {
	var payment = $("#payment").val();
	var commission = $("#commission").val();
	var amount = payment - commission;
	$("#amount").removeClass("hidden").text(amount);
}

function checkInputs() {
	var flag = false;
	var accountId = $("#accountId").val(),
	    payment = $("#payment").val(),
	    paymentCheck = $("#paymentCheck").val(),
	    commission = $("#commission").val(),
	    chargeType = $("#chargeType").val(),
	    remitter = $("#remitter").val(),
	    remittTime = $("#remittTime").val(),
	    affid = $("#affid").val(),
	    attach_1 = $("#file_1").val(),
	    attach_2 = $("#file_2").val();

	if (chargeType == '4') {
		commission = '0';
	}

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
	if (chargeType == 1 || chargeType == 2) {
		if (!remitter) {
			flag = false;
			common.msgs.new_msg("Error", "请输入打款人");
			return;
		} else {
			flag = true;
		}
		if (!remittTime) {
			flag = false;
			common.msgs.new_msg("Error", "请输入打款时间");
			return;
		} else {
			flag = true;
		}
		if (!attach_1) {
			flag = false;
			common.msgs.new_msg("Error", "请上传打款截图");
			return;
		} else {
			flag = true;
		}
	}
	if (chargeType == 4) {
		if (!affid) {
			flag = false;
			common.msgs.new_msg("Error", "请输入Aff ID");
			return;
		} else {
			flag = true;
		}
		if (!attach_2) {
			flag = false;
			common.msgs.new_msg("Error", "请上传邮件截图");
			return;
		} else {
			flag = true;
		}
	}
	return flag;
}

function init() {
	getAccountIdName();
	bindEvents();

	$('.currency').html(template('currencyTmp', { currency: window.Currency }));
}

common.pluginsTools.loadPlugins(init, ['select2', 'template']);