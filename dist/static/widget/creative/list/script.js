"use strict";

var plugin1 = "template",
    plugin2 = "datetimepicker";

var approverId = $("#userInfomation").attr("approverId");
function bindEvents() {
	$("button").unbind().on("click", function () {
		var adId = $(this).attr("adId");
		var unapprovedAdIds = $(this).attr("unapprovedAdIds");
		localStorage.setItem("unapprovedAdIds", unapprovedAdIds);
		window.location = "./index.html?goto=creative&mold=detail";
		localStorage.setItem("adId", adId);
	});

	$("#search").unbind().on("click", function (e) {
		var queryData = $("form").serialize() + "&approverId=" + approverId;
		e.preventDefault();
		getAndRenderList(1, "", "", queryData);
	});
}

function queryApproverList() {
	var queryData = "";
	var roleId = $("#userInfomation").attr("roleId");
	if (roleId == 2) {
		common.ajaxRequest('queryApproverList', queryData, function (result) {
			if (result.status == 0) {
				var options = $("#approverId").html();
				for (var i = 0, length = result.data.list.length; i < length; i++) {
					options += '<option value="' + result.data.list[i].approverId + '">' + result.data.list[i].approverName + '</option>';
				}
				$("#approverId").html(options);
			}
			getAndRenderList();
		});
	} else {
		var approverName = $("#userInfomation").text().split("@")[0];
		var serializeArray = $("form").serializeArray();
		var approvalStatus;
		$.each(serializeArray, function (index, node) {
			if (node.name == 'approvalStatus') {
				approvalStatus = node.value;
				return false;
			}
		});

		queryData = queryData + "&approverId=" + approverId + "&approvalStatus=" + approvalStatus;
		var options = '<option value="' + approverId + '">' + approverName + '</option>';
		$("#approverId").html(options);
		$("#approverId").val(approverId).attr("disabled", true);
		getAndRenderList(1, "", "", queryData);
	}
}

function getAndRenderList(currentPage, start, end, queryData) {
	var queryData = queryData || $("form").serialize();
	var searchType = $("#searchChoice").val();
	var searchValue = $("#inputSuccess4").val();
	var page = currentPage || 1;
	var queryData = queryData + ("&" + searchType + "=" + searchValue) + "&currentPage=" + page;
	helper();
	common.ajaxRequest('queryCreativeList', queryData, function (result) {
		var materials_list_html = void 0;
		if (result.status == 0) {
			if (result.data && result.data.list.length == 0) {
				materials_list_html = '<tr><td  class="text-left" colspan="10">No result</td></tr>';
			} else {
				materials_list_html = template('materialsList', { data: result.data.list });
			}
			$("#list").html(materials_list_html);
			common.buildPage($(".page"), result.data.paging, queryData, getAndRenderList, 10, currentPage, start, end);
			bindEvents();
		}
	});
}
function helper() {
	template.helper("handleStatus", function (id) {
		switch (id) {
			case 1:
				return "审核中";
				break;
			case 2:
				return "审核通过";
				break;
			case 3:
				return "审核未通过";
				break;
			case 4:
				return "审核通过(部分)";
				break;
			default:
				return "";
				break;
		}
	});
	template.helper("handleAdType", function (id) {
		switch (id) {
			case 1:
				return "横幅";
				break;
			case 2:
				return "原生";
				break;
			case 3:
				return "视频";
				break;
			case 4:
			default:
				return "";
				break;
		}
	});
	template.helper("countUnapprovedAdIds", function (id, status, unapprovedAdIds) {
		if (status != 2) {
			unapprovedAdIds.push(id);
		}
		return unapprovedAdIds.join(",");
	});
}

function init() {
	console.log('init');
	$('.form_datetime, .form_date').datetimepicker({
		todayHighlight: 1,
		pickerPosition: "bottom"
	});
	queryApproverList();
}
common.pluginsTools.loadPlugins(init, [plugin1, plugin2]);
common.pluginsTools.loadCss("datetimepickerCss");