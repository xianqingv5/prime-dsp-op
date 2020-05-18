var accountId = common.urlTools.getUrlParam("accountId");
function bindEvents (){
	$("button.confirm").unbind().on("click", function(e) {
		e.preventDefault();
		var flag = checkInputs();
		if (flag) {
			approveCustomerAccount();
		}
	})
	
	$("button.cancel").unbind().on("click", function(e) {
		e.preventDefault();
		window.location = './index.html?goto=account&mold=list';
	})
}
function approveCustomerAccount(){
	var queryData = $("form").serialize() + "&accountId=" + accountId;
	console.log(queryData)

  	common.ajaxRequest('approveCustomerAccount', queryData, function(result) {
  		// console.log(11)
        if (result.status == 0) {
        	common.msgs.new_msg("success", "success");
			window.location = "./index.html?goto=account&mold=list";
        }
    })
}
function checkInputs() {
	var flag = false;
	var commissionRatio = $("#commissionRatio").val();
	var amId = $("#amId").val();
	var patten =  /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/;
	if (patten.test(commissionRatio) &&　commissionRatio >= 0 /*&& commissionRatio <= 1*/) {
		flag = true;
	} else {
		flag = false;
		common.msgs.new_msg("error", "The ratio value is between 0 and 1, please check it");
		return;
	}
	if (amId == "") {
		flag = false;
		common.msgs.new_msg("error", "请选择相关AM");
		return;
	} else {
		flag = true;
	}
	return flag;
}
function AMS (amId) {
  	common.ajaxRequest('queryOperationAccountList', {roleId:6}, function(result) {
  		var options = '';
        if (result.status == 0) {
        	$.each(result.data.list, function(i, item) {
        		if(item.roleId == 6 || item.roleId == 7) {
        			if (amId ==  item.accountId) {
						options += '<option value="' + item.accountId + '" selected>' + item.contactName + '</option>';
        			} else {
						options += '<option value="' + item.accountId + '">' + item.contactName + '</option>';
        			}
        		}
        	})
        	$("#amId").html(options);
        }
    })
}
function getAndRenderList (){
	var type = common.urlTools.getUrlParam("type");
	var queryData = {accountId:accountId};
	if (type == "view") {
		$("form input, #amId").attr("disabled", true);
		$("button").addClass("hidden");
	}
	if ($("#userInfomation").attr("roleid") != 2) {
		$("#recommender").attr("disabled", true);
	}
   	common.ajaxRequest('queryCustomerAccountInfo', queryData, function(result) {
        if (result.status == 0) {
			var amId = result.data.amId;
			console.log(result.data)
			for (var key in result.data) {
				if (key == "customerType") {
					$("input[name='"+key+"'][value='" + result.data[key] + "']").attr("checked", true)
				} else if (key == "status") {
					var status = result.data[key]// && result.data[key].toLowerCase() ==  "active" ? 1: 2;
					$("input[name='"+key+"'][type='radio'][value='" + status + "']").prop("checked", true);
				} else if (key == "htmlRight") {
                    var htmlRight = result.data[key];

                    $("input[name='"+key+"'][type='radio'][value='" + htmlRight + "']").prop("checked", true);
                } else {
                	$("#" + key).val(result.data[key]);
				}
            }
            bindEvents();
			// if (type != "view") {
				AMS(amId);
			// }
        }
    })
}
getAndRenderList();
