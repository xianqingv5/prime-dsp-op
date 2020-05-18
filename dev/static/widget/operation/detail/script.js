var accountId = common.urlTools.getUrlParam("accountId");
var type = common.urlTools.getUrlParam("type");
function bindEvents (){
	$("button.confirm").unbind().on("click", function(e) {
		e.preventDefault();
		if (type == "detail") {
			editOperationAccount();
		} else {
			createOperationAccount();
		}
	})
	$("button.cancel").unbind().on("click", function(e) {
		e.preventDefault();
		window.location = './index.html?goto=operation&mold=list';
	})
}
function getAndRenderList (){
	if (accountId) {
		var queryData = {accountId:accountId};
	   	common.ajaxRequest('queryOperationAccountInfo', queryData, function(result) {
	        if (result.status == 0) {
				for (var key in result.data) {
					if (key == "status") {
						var status = result.data[key] && result.data[key].toLowerCase() ==  "active" ? 1: 2;
						$("input[value='" + status + "']").prop("checked", true);
					} else if (key == "qq" &&　result.data.qq != "") {
						$("option[value='qq]").prop("selected", true);
						$("#contact").val(result.data.qq);
					} else if (key == "skype" && result.data.skype != "") {
						$("option[value=skype]").prop("selected", true);
						$("#contact").val(result.data.skype);
					} else if (key == "roleId") {
						$("select#roleId option[value='" + result.data.roleId + "']").prop("selected", true);
					} else {
	                	$("#" + key).val(result.data[key]);
					}
	            }
	        }
	    })
	}
}
function checkInputs (){
	var accountEmail = $("#accountEmail").val();
	var contactName = $("#contactName").val();
	var flag = false;
	var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if (accountEmail && filter.test(accountEmail)) {
		flag = true;
	} else {
		common.msgs.new_msg("error","请检查账户邮箱");
		flag = false;
		return;
	}
	/*if (contactName == "") {
		common.msgs.new_msg("error","请检查账户名称");
		flag = false;
	}*/
	return flag;
}

function editOperationAccount (){
	if (accountId) {
		var queryData = $("form").serialize() + "&accountId=" + accountId;
	   	common.ajaxRequest('editOperationAccount', queryData, function(result) {
	        if (result.status == 0) {
	        	common.msgs.new_msg("success", "success");
				window.location = './index.html?goto=operation&mold=list';
	        }
	    })
	}
}
function createOperationAccount (){
	var flag = checkInputs();
	if (flag) {
		var queryData = $("form").serialize();
		var searchChoice = $("#searchChoice").val();
		var contact = $("#contact").val();
		queryData = queryData + "&" + searchChoice + "=" + contact;
	   	common.ajaxRequest('createOperationAccount', queryData, function(result) {
	        if (result.status == 0) {
	        	common.msgs.new_msg("success", "success");
				window.location = './index.html?goto=operation&mold=list';
	        }
	    })
	}
}
function handleRoleId (roleId){
	switch (roleId) {
		case 0 :
			return "unknow"
			break;
		case 1 :
			return "customer"
			break;
		case 2 :
			return "admin"
			break;
		case 3 :
			return "pm_creative_approval"
			break;
		case 4 :
			return "pm_finance_operator"
			break;
		case 5 :
			return "pm_finance_approval"
			break;
		case 6 :
			return "AM"
			break;
		default:
			return "";
			break;
	}
}
function queryRoleList() {
	var queryData = {};
    var options = "";
   	common.ajaxRequest('queryRoleList', queryData, function(result) {
        if (result.status == 0) {
        	var roles = result && result.data && result.data.list;
        	$.each(roles, function(i, role) {
        		if (role.roleId > 1) {
        			options += '<option value="' + role.roleId +'">' + role.roleName + '</option>';
        		}
        	})
        	$("#roleId").html(options);
        }
    })
}
function  init() {
    queryRoleList();
	if (type == "create") {
		$("form input, form select").removeAttr("disabled");
		$("#accountId").prop("disabled", true);
		$(".breadcrumb .active").text("新建账户");
		$("form .form-group:first").addClass("hidden");
	} else {
    	getAndRenderList();
	}
    bindEvents();
}
init();
