var [plugin1,plugin2] = ["template","datetimepicker"];
var approverId = $("#userInfomation").attr("approverId");
function bindEvents (){
	//审核素材
	$("button").unbind().on("click", function() {
		var adId = $(this).attr("adId");
		var unapprovedAdIds = $(this).attr("unapprovedAdIds");
		localStorage.setItem("unapprovedAdIds", unapprovedAdIds);
		window.location = "./index.html?goto=creative&mold=detail";
		localStorage.setItem("adId", adId);
	})
/*	$("tr").unbind().on("click", function() {
		var adId = $(this).attr("id");
		window.location = "./index.html?goto=creative&mold=detail&adId=" + adId;
	})*/
	//模糊搜索
	$("#search").unbind().on("click", function(e) {
   		var queryData = $("form").serialize() + "&approverId=" + approverId;
		e.preventDefault();
		getAndRenderList(1, "", "", queryData);
	})
	/*排序，本次暂时不加此功能
	$(".sort .glyphicon").unbind().on("click", function(e) {
		e.preventDefault();
		var _this = $(this);
		var sort = _this.attr("data-id");
		var account_id = $("#account").attr("account_id");
		var queryData = $("form").serialize() + `&sort=${sort}`;
		_this.siblings().removeClass("disabled");
		_this.addClass("disabled");

		getAndRenderList(queryData);
	})
	*/
}
//获取审核人列表
function queryApproverList () {
	var queryData = "";
    var roleId = $("#userInfomation").attr("roleId");
   		if (roleId == 2) {
		   	common.ajaxRequest('queryApproverList', queryData, function(result) {
		        if (result.status == 0) {
					var options = $("#approverId").html();
					for (let i = 0, length = result.data.list.length; i < length; i++) {
						options += '<option value="' + result.data.list[i].approverId+　'">' + result.data.list[i].approverName + '</option>';
					}
					$("#approverId").html(options);
		        }
		   		getAndRenderList();
		    })
   		} else {
    		var approverName = $("#userInfomation").text().split("@")[0];
   			queryData = queryData + "&approverId=" + approverId;
			var options = '<option value="' + approverId +　'">' + approverName + '</option>';
			$("#approverId").html(options);
   			$("#approverId").val(approverId).attr("disabled", true);
		   	getAndRenderList(1, "", "", queryData);
   		}
}
//获取并渲染素材列表
function getAndRenderList (currentPage,start, end, queryData){
	var queryData =  queryData || $("form").serialize();
	var searchType = $("#searchChoice").val();
	var searchValue = $("#inputSuccess4").val();
	var page = currentPage || 1;
	var queryData = queryData + `&${searchType}=${searchValue}` + "&currentPage=" + page;
	helper();
   	common.ajaxRequest('queryCreativeList', queryData, function(result) {
   		let materials_list_html;
        if (result.status == 0) {
        	if (result.data && result.data.list.length == 0) {
        		materials_list_html = '<tr><td  class="text-left" colspan="10">No result</td></tr>';
        	} else {
				materials_list_html = template('materialsList', {data:result.data.list});
        	}
			$("#list").html(materials_list_html);
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
	template.helper("handleAdType", function(id){
		switch (id) {
			case 1 :
				return "横幅"
				break;
			case 2 :
				return "原生"
				break;
			case 3 :
				return "视频"
				break;
			case 4 :
			default:
				return "";
				break;
		}
	})
	template.helper("countUnapprovedAdIds", function(id, status, unapprovedAdIds){
		if (status != 2) {
    		unapprovedAdIds.push(id);
		}
    	return unapprovedAdIds.join(",");
	})
}
//初始化
function  init() {
	$('.form_datetime, .form_date').datetimepicker({
		todayHighlight: 1,
		pickerPosition: "bottom"
    });
    queryApproverList();
}
common.pluginsTools.loadPlugins(init, [plugin1, plugin2]);
common.pluginsTools.loadCss("datetimepickerCss");
