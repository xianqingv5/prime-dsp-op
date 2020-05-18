var plugin1 = "template";
var roleId = $("#userInfomation").attr("roleId");
function bindEvents (){
	$("button").unbind().on("click", function(e) {
		e.preventDefault();
		var accountId = $(this).attr("accountId");
		var type = $(this).is(".detail") ? 'detail': 'create';
		window.location = `./index.html?goto=operation&mold=detail&accountId=${accountId}&type=${type}`;
	})
	$("#search").unbind().on("click", function(e) {
		e.preventDefault();
		getAndRenderList();
	})
}
function getAndRenderList (currentPage,start, end){
	var page = currentPage || 1;
	var queryData = $("form").serialize() + "&currentPage=" + page;
	if (roleId == 6) {
		$("#createAccount").addClass("hidden");
	}
    helper();
   	common.ajaxRequest('queryOperationAccountList', queryData, function(result) {
        if (result.status == 0) {
        	if (result.data && result.data.list.length == 0) {
        		var html = '<tr><td  class="text-left" colspan="10">No result</td></tr>';
        	} else {
				var html = template('accountList', {data:result.data && result.data.list, roleId:roleId});
        	}
			$("#list").html(html);
			common.buildPage($(".page"), result.data.paging, queryData, getAndRenderList, 10, currentPage, start, end);
			bindEvents();
        }
    })
}
function helper() {
	template.helper("handleStatus", function(statusId){
		switch (statusId) {
			case 1 :
				return "有效"
				break;
			case 2 :
				return "无效"
				break;
			case 3 :
				return "待审核"
				break;
			default:
				return "";
				break;
		}
	})
	template.helper("handleRoleId", function(roleId){
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
	})
}
function  render() {
    getAndRenderList();
}
var plugin1 = "template";
common.pluginsTools.loadPlugins(render, [plugin1]);
