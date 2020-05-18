var plugin1 = "template";
common.pluginsTools.loadPlugins(render, [plugin1]);
function bindEvents (){
	$("button.detail, button.view").unbind().on("click", function() {
		var accountId = $(this).attr("accountId");
		var type = $(this).attr("type");
		window.location = `./index.html?goto=account&mold=detail&accountId=${accountId}&type=${type}`;
	})
	$("#search").unbind().on("click", function() {
		getAndRenderList();
	})
}
function getAndRenderList (currentPage,start, end){
	var page = currentPage || 1;
	var queryData = $("form").serialize() + "&currentPage=" + page;
	helper();
   	common.ajaxRequest('queryCustomerAccountList', queryData, function(result) {
        if (result.status == 0) {
        	var roleId = $("#userInfomation").attr("roleId");
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
function helper (){
	template.helper("handleStatus", function(id){
		switch (id) {
			case 1 :
				return "审核中"
				break;
			case 2 :
				return "审核通过"
				break;
			case 3 :
				return "审核未通过"
				break;
			case 4 :
				return "审核通过(部分)"
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