'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

window.api_host = '/dsp-op';

__d('prime_host', '@Domain_name@', 'http://prime.yeahmobi.com');
__d('filter_reason_host', '@filter_reason_host@', 'http://dsp-filter-reason-538930803.us-east-1.elb.amazonaws.com');
__d('_location', '@Location@', '2');
if (/(172\.20\.0\.39)|(dsp\.dev\.dy)/.test(location.href)) {
	window.api_host = "http://192.168.1.185:8081/dsp-op";
	window.prime_host = "http://dev.dsp.com:3000/static";
}

function __d(name, v, d) {
	window[name] = v[0] === '@' ? d : v;
}

window.Currency = _location == 2 ? '$' : '￥';

moment.tz.add(["Asia/Shangshai|CST CDT|-80 -90|01010101010101010|-1c1I0 LX0 16p0 1jz0 1Myp0 Rb0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0|23e6", "America/New_York|EST EDT EWT EPT|50 40 40 40|01010101010101010101010101010101010101010101010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261t0 1nX0 11B0 1nX0 11B0 1qL0 1a10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 RB0 8x40 iv0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|21e6", "Etc/UTC|UTC|0|0|", "Etc/GMT-8|+08|-80|0|"]);

moment.tz.setDefault('Etc/UTC');

var APIS = {
	login: {
		baseURL: api_host + "/login",
		method: "POST"
	},
	logout: {
		baseURL: api_host + "/logout",
		method: "GET"
	},
	captcha: {
		baseURL: api_host + "/captcha",
		method: "GET"
	},

	queryApprovalList: {
		baseURL: api_host + "/queryApproverList",
		method: "GET"
	},

	queryApproverList: {
		baseURL: api_host + "/queryApproverList",
		method: "GET"
	},

	queryCreativeList: {
		baseURL: api_host + "/queryAdApproveList",
		method: "GET"
	},

	creativeInfo: {
		baseURL: api_host + "/queryAdApproveInfo",
		method: "GET"
	},

	approveCreative: {
		baseURL: api_host + "/approveAd",
		method: "POST"
	},

	queryAccountIdName: {
		baseURL: api_host + "/queryAccountIdName",
		method: "GET"
	},

	recharge: {
		baseURL: api_host + "/recharge",
		method: "POST"
	},

	refund: {
		baseURL: api_host + "/refund",
		method: "POST"
	},

	queryChargeInfo: {
		baseURL: api_host + "/queryChargeInfo",
		method: "GET"
	},

	financeApprovel: {
		baseURL: api_host + "/financeApprovel",
		method: "POST"
	},

	queryUserBalance: {
		baseURL: api_host + "/queryUserBalance",
		method: "GET"
	},

	queryAccountChargeHistory: {
		baseURL: api_host + "/queryAccountChargeHistory",
		method: "GET"
	},

	queryNextPendingChargeInfo: {
		baseURL: api_host + "/queryNextPendingChargeInfo",
		method: "GET"
	},

	queryOperationAccountList: {
		baseURL: api_host + "/queryOperationAccountList",
		method: "GET"
	},

	queryOperationAccountInfo: {
		baseURL: api_host + "/queryOperationAccountInfo",
		method: "GET"
	},

	createOperationAccount: {
		baseURL: api_host + "/createOperationAccount",
		method: "POST"
	},

	editOperationAccount: {
		baseURL: api_host + "/editOperationAccount",
		method: "POST"
	},

	queryRoleList: {
		baseURL: api_host + "/queryRoleList",
		method: "GET"
	},

	queryCustomerAccountList: {
		baseURL: api_host + "/queryCustomerAccountList",
		method: "GET"
	},

	queryCustomer: {
		baseURL: api_host + "/queryCustomer",
		method: "GET"
	},

	queryCustomerAccountInfo: {
		baseURL: api_host + "/queryCustomerAccountInfo",
		method: "GET"
	},

	approveCustomerAccount: {
		baseURL: api_host + "/approveCustomerAccount",
		method: "POST"
	},

	querCampaignApproveList: {
		baseURL: api_host + "/querCampaignApproveList",
		method: "GET"
	},

	queryCampaignApproveInfo: {
		baseURL: api_host + "/queryCampaignApproveInfo",
		method: "GET"
	},
	querAdExchange: {
		baseURL: api_host + "/querAdExchange",
		method: "GET"
	},

	batchApproveAd: {
		baseURL: api_host + "/batchApproveAd",
		method: 'POST'
	}
};
var libsPaths = {
	"template": './static/libs/template/template.js',
	"select2": './static/libs/select2/dist/js/select2.min.js',
	"datetimepicker": "./static/libs/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js",
	"datetimepickerCss": "./static/libs/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css",
	"eventproxy": "./static/libs/eventproxy/lib/eventproxy.js",
	"highcharts": "./static/libs/highcharts/highcharts.js"
};

var getset = {};

var Query = {
	_result: function _result() {},
	getAccounts: function getAccounts() {
		var p = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		var def = $.Deferred();
		common.ajaxRequest('queryOperationAccountList', p, function (result) {
			if (result.status == 0) {
				def.resolve(result.data.list);
			}

			def.reject();
		});

		return def;
	},


	get Accounts() {
		return this.getAccounts();
	},
	get AMs() {
		return this.getAccounts({ roleId: 6 });
	}

};
var common = {
	get: function get(name) {
		return getset[name];
	},

	set: function set(v) {
		$.extend(getset, v);
	},
	hash: function hash() {
		return $('meta[name=hash]').attr('content') || '';
	},

	urlTools: {
		getUrlParam: function getUrlParam(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);return null;
		},

		urlRoute: function urlRoute(name, type) {
			var name = name,
			    type = type;
			var location = './static/widget/' + name + '/' + type;
			var hash = common.hash();
			if (name == null || name == "") {
				$("#content").html("");
			} else {
				$("#content").load(location + '/tpl.html?' + hash);

				$("#customStyle").attr('href', location + '/style.css?' + hash);
				$('.non-dropdown a').removeClass('active');
				$('#' + name).addClass("active");
				$.getScript({
					cache: true,
					url: location + '/script.js?' + hash
				}).done(function (data, textStatus, jqxhr) {
					console.log(' Triggered ' + location + '/script.js success.');
				}).fail(function (jqxhr, settings, exception) {
					console.log(' Triggered ' + location + '/script.js Error');
				});
			}
		}
	},
	getChargeInfo: function getChargeInfo(queryData) {
		common.ajaxRequest('queryChargeInfo', queryData, function (result) {
			if (result && result.status == 0) {
				common.renderfinanceApprovel(result);
			}
		});
	},
	renderfinanceApprovel: function renderfinanceApprovel(result) {
		for (var key in result.data) {
			if (key == "chargeType") {
				$("#chargeType option[value='" + result.data.chargeType + "']").attr("selected", true);
			} else if (key == "accountId") {
				$("#" + key).val(result.data.accountName + "(ID：" + result.data.accountId + ")");
			} else {
				$("#" + key).val(result.data[key]).text(result.data[key]);
			}
			$("#approver").text(result.data.approver);
			$("#number").text(result.data.chargeId);
			$("#type").text(result.data.action == 1 ? "充值审核" : "退款审核");
		}
	},
	renderCreativeInfo: function renderCreativeInfo(data) {
		var checkBox = $(".inner");
		var checkboxes = "";
		var platforms = data && data.data && data.data.platforms;
		var approvedPlatforms = data && data.data && data.data.approvedPlatform;
		var adType = data && data.data && data.data.adType;
		var adId = data && data.data && data.data.adId;
		$("input[name='adType']").val(adType);
		$("input[name='adId']").val(adId);
		$.each(platforms, function (i, platform) {
			checkboxes += '<label class="col-md-2">' + '<input type="checkbox" name="approvedPlatform" value="' + platform.id + '">' + (platform.name ? platform.name : "") + '</label>';
		});
		for (var key in data && data.data) {
			if (key == "adType") {
				var text = handleAdType(data.data[key]);
				$("#" + key).text(text);
			} else if (key == "clickThroughUrl") {
				var text = data.data.clickThroughUrl;
				var href = text.replace(/\{[A-Z_0123456789]+\}/ig, 1);
				$("#clickThroughUrl").text(text).attr("href", href);
			} else {
				$("#" + key).text(data.data[key]);
			}
			if (data.data.adType == 3) {
				$("#banner").addClass("hidden");
				$("video").removeClass("hidden").attr("src", data.data.videoUrl);
				$("#video").attr("name", "videoUrl").val(data.data.videoUrl);
			} else if (data.data.adType == 2) {
				var name1 = "iconUrl";
				var name2 = "picUrl";
				var iconUrl = data.data.iconUrl;
				var picUrl = data.data.picUrl;
				$("#icon").attr("name", name1).val(iconUrl);
				$("#pic").attr("name", name2).val(picUrl);
			} else {
				var url = data.data.bannerUrl;
				var name = "bannerUrl";
				$("#bannerUrl").attr("src", url);
				$("#banner").attr("name", name).val(url);
			}
		}
		checkBox.html(checkboxes);
		$("#bannerUrl").attr("src", data.data.bannerUrl);
		$.each(approvedPlatforms, function (j, approvedPlatform) {
			$('input[value="' + approvedPlatform + '"').prop("checked", true);
		});
	},
	getAuthorityAndSetLocation: function getAuthorityAndSetLocation(roleId) {
		switch (roleId) {
			case 1:
				window.location = "./index.html?goto=account&mold=list";
				break;
			case 2:
				window.location = "./index.html?goto=audit&mold=list";
				break;
			case 3:
				window.location = "./index.html?goto=audit&mold=list";
				break;
			case 4:
				window.location = "./index.html?goto=finance&mold=list";
				break;
			case 5:
				window.location = "./index.html?goto=finance&mold=list";
				break;
			case 6:
				window.location = "./index.html?goto=account&mold=list";
				break;
			case 7:
				window.location = "./index.html?goto=audit&mold=list";
				break;
			case 9:
				window.location = "./index.html?goto=account&mold=list";
				break;
			default:
				window.location = "./index.html";
				break;
		}
	},
	handleAuthority: function handleAuthority(roleId) {
		var finance = $("#finance"),
		    customer = $("#customer"),
		    audit = $("#audit"),
		    account = $("#account"),
		    operation = $("#operation");

		switch (roleId) {
			case "0":
				break;
			case "1":
				break;
			case "2":
				break;
			case "3":
				finance.addClass("hidden");
				account.addClass("hidden");
				operation.addClass("hidden");
				customer.addClass("hidden");
				break;
			case "4":
				account.addClass("hidden");
				operation.addClass("hidden");
				audit.addClass("hidden");
				customer.addClass("hidden");
				break;


			case "5":
				account.addClass("hidden");
				operation.addClass("hidden");
				audit.addClass("hidden");
				customer.addClass("hidden");
				break;


			case "6":

				operation.addClass("hidden");
				break;

			case "7":
				operation.addClass("hidden");
				break;
			default:
				break;
		}
	},
	getNextPendingChargeInfo: function getNextPendingChargeInfo() {
		var action = common.urlTools.getUrlParam("mold");
		var type = action == "chargeCheck" ? 1 : 2;
		common.ajaxRequest('queryNextPendingChargeInfo', { action: type }, function (result) {
			if (result.status == 0) {
				if (result.data != null) {
					common.renderfinanceApprovel(result);
				} else {
					if (action == "chargeCheck") {
						var msgType = "充值信息";
					} else {
						var msgType = "退款信息";
					}
					common.msgs.new_msg("warning", '\u6CA1\u6709\u5F85\u5BA1\u6838\u7684' + msgType);
					setTimeout(function () {
						window.location = "./index.html?goto=finance&mold=list";
					}, 2000);
				}
			}
		});
	},
	getUserBalance: function getUserBalance(accountId, dom) {
		var dom = dom;
		var balance = 0;
		common.ajaxRequest('queryUserBalance', { accountId: accountId }, function (result) {
			if (result.status == 0) {
				balance = result && result.data && result.data.balance;
				dom.removeClass("hidden").text(balance);
			}
		});
	},
	getAccountIdName: function getAccountIdName(validStatus, dom) {
		var param = {};
		validStatus !== undefined && Object.assign(param, { validStatus: validStatus });

		return common.ajaxRequest('queryAccountIdName', param, function (result) {
			var options = '<option value="" selected>-请选择账户-</option>';
			if (result.status == 0) {
				var accounts = result && result.data && result.data.list;
				$.each(accounts, function (i, account) {
					options += '<option value="' + account.accountId + '">' + account.accountName + " ( ID: " + account.accountId + " )" + '</option>';
				});
			}
			dom.html(options);
		});
	},
	countStartAndEnd: function countStartAndEnd(currentPage, data, page) {
		var middle = page / 2;
		var start = currentPage > middle ? currentPage * 1 - middle + 1 : 1;
		var end = currentPage > middle ? currentPage * 1 + middle : page;
		var totalPage = data && data.totalPage;
		var pageInfo = {};
		if (totalPage < page) {
			end = totalPage;
		}
		end = end <= totalPage ? end : totalPage;
		start = end != totalPage ? start : totalPage - page + 1;
		start = start > 1 ? start : 1;
		pageInfo = {
			start: start,
			end: end
		};
		return pageInfo;
	},
	buildPage: function buildPage($container, data, query, callback, page, currentPage) {
		var page = page || 10;
		var templatePath = common.pluginsTools.getPath("template");
		if (!data) {
			return;
		}
		var currentPage = currentPage || 1;
		var pageInfo = common.countStartAndEnd(currentPage, data, page);
		var start = pageInfo.start;
		var end = pageInfo.end;
		$.getScript(templatePath, function () {
			var html = template('tableListPage', { data: data, page: page, currentPage: currentPage, start: start, end: end });
			$container.html(html);
			$(".pageList", $container).unbind().bind("click", query, function (e) {
				var pageNum = $(this).attr("data-value");
				common.countStartAndEnd(pageNum, data, page);
				if (pageNum && pageNum != '0') {
					pageInfo = common.countStartAndEnd(currentPage, data, page);
					start = pageInfo.start;
					end = pageInfo.end;
					callback && callback(pageNum, start, end);
				}
			});
		});
	},

	pluginsTools: {
		getPath: function getPath(name) {
			var path = libsPaths[name];
			return path;
		},
		updateParams: function updateParams() {},
		loadPlugins: function loadPlugins(callback, plugins) {
			var successCallback = typeof callback == 'function' ? callback : null;
			var length = plugins.length;
			if (plugins && plugins.length) {
				var _$;

				(_$ = $).when.apply(_$, _toConsumableArray(plugins.map(function (plugin) {
					var path = common.pluginsTools.getPath(plugin);
					return $.getScript('' + path);
				}))).done(function () {
					successCallback && successCallback();
				});
			} else {
				successCallback && successCallback();
			}
		},
		loadCss: function loadCss(style) {
			var path = common.pluginsTools.getPath(style);
			$("<link>").attr({ rel: "stylesheet",
				type: "text/css",
				href: path
			}).appendTo("head");
			console.log("path:" + path);
		},

		conveterParamsToJson: function conveterParamsToJson(paramsAndValues) {
			var paramsAndValues = paramsAndValues;
			var jsonObj = {};
			var jsonObjName = "";
			var approvedPlatform = [];
			var param = paramsAndValues.split("&");
			for (var i = 0; param != null && i < param.length; i++) {
				var para = param[i].split("=");
				if (!isNaN(para[1]) && para[0] != "password" && para[0] != "authCode" && para[0] != "comment" && para[0] != "reason" && para[0] != "bannerUrl" && para[0] != "videoUrl" && para[0] != "iconUrl" && para[0] != "picUrl") {
					para[1] = para[1] * 1;
				}
				if (para[0] == "approvedPlatform") {
					approvedPlatform.push(para[1]);
					jsonObj[para[0]] = approvedPlatform;
				} else {
					jsonObj[para[0]] = para[1];
				}
			}
			return jsonObj;
		}
	},
	ajaxPost: function ajaxPost(api, data) {
		var config = APIS[api];
		if (!config) {
			config = { baseURL: api_host + '/' + api };
		}

		return $.ajax({
			timeout: 60 * 1000,
			url: config.baseURL,
			type: 'POST',
			dataType: 'json',
			contentType: "application/json",
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			data: JSON.stringify(data)
		});
	},
	ajaxGet: function ajaxGet(api, data) {
		var config = APIS[api];
		if (!config) {
			config = { baseURL: api_host + '/' + api };
		}

		return $.ajax({
			timeout: 60 * 1000,
			url: config.baseURL,
			type: 'GET',
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			data: data
		});
	},
	ajaxRequest: function ajaxRequest(api, data, successCallback, beforeSend) {
		if (_typeof(APIS[api]) !== 'object') {
			console.log("api not defined", true);
			return false;
		}
		var errorCallback = null;
		var dataType = 'json';
		if (arguments.length == 6) {
			errorCallback = arguments[5];
		}

		if (arguments.length == 5) {
			dataType = arguments[4];
		}
		var config = APIS[api];
		var beforeSend = beforeSend || function () {
			var yt_overlay = '<div id="yt_overlay" class="yt_overlay" style="display: block;"><img src="./static/images/ajax_loader.gif" /></div>';
			$(yt_overlay).appendTo("#content");
		};
		if (config.method == "POST") {
			var contentType = "application/json";
			var data = decodeURIComponent(data.replace(/\+/g, " "));
			data = JSON.stringify(common.pluginsTools.conveterParamsToJson(data));
		}
		var ajaxOptions = {
			timeout: 60 * 1000,
			beforeSend: beforeSend,
			url: config.baseURL,
			type: config.method,
			dataType: dataType,
			contentType: contentType,
			xhrFields: {
				withCredentials: true
			},
			success: function success(res) {
				if (res.status == 0) {
					successCallback && successCallback(res);
				}
			},
			crossDomain: true,
			data: data
		};

		return $.ajax(ajaxOptions);
	},
	globalErrorHandle: function globalErrorHandle(context, xhr, type, error, callback, api) {},
	msgs: {
		new_msg: function new_msg(msg_type, msg, callback) {
			var msg = msg || 'Unknow error occured.';
			var msg_type = msg_type && msg_type.toLowerCase() || 'error';
			var dom = $("#content");
			var callback = callback || function () {};
			var alert = $('<div class="alert alert-' + msg_type + ' "><a class="close" data-dismiss="alert">&times;</a><strong>' + msg_type.toUpperCase() + ': </strong> ' + msg + '</div>');
			var alert_dom = $(dom).find('.alert');
			if (alert_dom) {
				alert_dom.remove();
			}
			$(dom).prepend(alert);
			alert.delay(10000).animate({
				height: 0,
				opacity: 0
			}, {
				duration: 300,
				complete: function complete() {
					$(this).remove();
					callback && callback();
				}
			});
		}
	},
	PageRender: function PageRender($container, query) {
		$container.on('click', 'a', function () {
			if ($(this).hasClass('disabled')) return;
			var currentPage = $(this).attr('page');
			if (currentPage) {
				query({
					currentPage: currentPage
				});
			}
		});

		return function (pager) {
			return pager ? $container.html(template('pageTemp', { pager: pager })).find('select').on('change', function () {
				query({
					limit: $(this).val()
				});
			}) : $container.html('');
		};
	},
	getUrlVars: function getUrlVars() {
		var vars = [],
		    hash;
		var hashes = window.location.search.slice(1).split('&');
		for (var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		if (args.length > 1) {
			return [].concat(_toConsumableArray(args.map(function (p) {
				return vars[p];
			})));
		}

		if (args.length == 1 && typeof args[0] == 'string') {
			return vars[args];
		}

		return vars;
	},
	appendStyle: function appendStyle(css) {
		var head = document.head || document.getElementsByTagName('head')[0],
		    style = document.createElement('style');

		style.type = 'text/css';
		if (style.styleSheet) {
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}

		head.appendChild(style);
	},

	permission: permission()
};

$(document).ajaxSuccess(function ajaxSuccess(event, XHR, options, data) {
	if (options.dataType !== 'html' && options.dataType !== 'script') {
		$("body").find('.yt_overlay').fadeOut(function () {
			$(this).remove();
		});
		if (data.status != 0 && data.status != 403 && data.status != 1) {
			common.msgs.new_msg("error", data.msg);
		} else if (data.status == 403) {
			common.msgs.new_msg("error", " You do not have authority.", $("#content").html(""));
		} else if (data.status == 1) {
			common.msgs.new_msg("error", "Need Login", window.location = "./login.html");
		} else {}
	}
});

$.fn.extend({
	serializeJSON: function serializeJSON() {
		return $(this).serializeArray().reduce(function (obj, item) {
			obj[item.name] = item.value;
			return obj;
		}, {});
	},
	btnSubmiting: function btnSubmiting(newVal) {
		var me = $(this);
		var val = me.val();
		me.data('tmpVal', me.text()).text(newVal).prop('disabled', true);

		var b = _.debounce(function () {
			me.text(me.data('tmpVal')).removeData('tmpVal').removeProp('disabled');
		}, 1000, true);
		return b;
	},
	loading: function loading() {
		var me = $(this).addClass('nor-loading');
		return function () {
			me.removeClass('nor-loading');
		};
	}
});
$(document).ajaxComplete(function ajaxComplete(event, XHR, status) {
	if (status == 'timeout') {
		common.msgs.new_msg("error", "连接超时");
	}
	console.log('http request end.');
	$("body").find('.yt_overlay').fadeOut(function () {
		$(this).remove();
	});
	common.permission.resolve();
});

function permission() {
	var doms = [];
	var permissionArray = localStorage.getItem("permissions") || '';
	var permissions = permissionArray.split(',');
	var debug = localStorage.getItem("permission-debug") == 'true';

	var has = function has(items, arr) {
		return items.split('|').reduce(function (flag, item) {
			return flag || arr.indexOf(item) >= 0;
		}, false);
	};
	var all = function all(items) {
		return function (fn, arr1) {
			return items.reduce(function (flag, item) {
				return flag && fn(item, arr1);
			}, true);
		};
	};

	var resolve = function resolve() {
		var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : $('body');
		return $(container).find('[permission]').each(function () {
			var permission = $(this).attr('permission');
			if (permission.indexOf(',') >= 0) {
				permission = permission.split(',');
			} else {
				permission = [permission];
			}
			if (all(permission)(has, permissions)) {
				$(this).attr('permission-resolved', permission).removeAttr('permission').removeClass('hidden');
			} else {
				$(this).addClass(debug ? 'permission-deny-debug' : 'permission-deny').removeAttr('permission').prop('disabled', 'disabled');
			}
		});
	};

	resolve();


	var $container = function () {
		var $p = $('<div class="permission-test hidden">').append('<button apply>应用</button>').append('<button mini>MIN</button>').append('<input type="checkbox" debug name="debug" ' + (debug ? 'checked="checked"' : '') + '><label for="debug">debug</label>').append(['queryUserBalance', 'queryAccountIdName', 'financeApprovel', 'queryChargeInfo', 'queryAccountChargeHistory', 'queryNextPendingChargeInfo', 'recharge', 'refund', 'queryApproverList', 'queryCustomerAccountList', 'queryCustomerAccountInfo', 'approveCustomerAccount', 'queryOperationAccountList', 'queryOperationAccountInfo', 'createOperationAccount', 'editOperationAccount', 'queryRoleList', 'queryAdApproveList', 'queryAdApproveInfo', 'approveAd', 'querCampaignApproveList', 'queryCampaignApproveInfo', 'batchApproveAd', 'queryAdExchange', 'updateAdExchange', 'deleteAdExchange'].reduce(function ($content, name) {
			return $content.append('<li><input name="permission" id="' + name + '" type="checkbox" ' + (has(name, permissions) && 'checked="checked"') + ' /> <label for="' + name + '">' + name + '</label></li>');
		}, $('<ul>'))).on('click', 'button[apply]', function () {
			var pers = $p.find('input:checked').toArray().map(function (input) {
				return $(input).attr('id');
			});

			localStorage.setItem("permissions", pers.join(','));
			localStorage.setItem("permission-debug", debug);
			window.location.href = window.location.href;
		}).on('click', 'button[mini]', function () {
			$p.toggleClass('mini');
		}).find('[debug]').on('change', function () {
			debug = $(this).prop('checked');
		}).end();

		$('body').append($p);
		return $p;
	}();

	var show = function show() {
		return $container.toggleClass('hidden');
	};
	show.resolve = resolve;
	show.permissions = permissions;
	show.has = function (p) {
		return has(p, permissions);
	};

	$('#main-navbar').on('dblclick', 'img:first', show);

	return show;
}