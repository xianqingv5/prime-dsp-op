"use strict";var accountId=common.urlTools.getUrlParam("accountId");function bindEvents(){$("button.confirm").unbind().on("click",function(t){t.preventDefault(),checkInputs()&&approveCustomerAccount()}),$("button.cancel").unbind().on("click",function(t){t.preventDefault(),window.location="./index.html?goto=account&mold=list"})}function approveCustomerAccount(){var t=$("form").serialize()+"&accountId="+accountId;console.log(t),common.ajaxRequest("approveCustomerAccount",t,function(t){0==t.status&&(common.msgs.new_msg("success","success"),window.location="./index.html?goto=account&mold=list")})}function checkInputs(){var t=$("#commissionRatio").val(),o=$("#amId").val();return/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(t)&&0<=t?""==o?void common.msgs.new_msg("error","请选择相关AM"):!0:void common.msgs.new_msg("error","The ratio value is between 0 and 1, please check it")}function AMS(e){common.ajaxRequest("queryOperationAccountList",{roleId:6},function(t){var n="";0==t.status&&($.each(t.data.list,function(t,o){6!=o.roleId&&7!=o.roleId||(e==o.accountId?n+='<option value="'+o.accountId+'" selected>'+o.contactName+"</option>":n+='<option value="'+o.accountId+'">'+o.contactName+"</option>")}),$("#amId").html(n))})}function getAndRenderList(){var t=common.urlTools.getUrlParam("type"),o={accountId:accountId};"view"==t&&($("form input, #amId").attr("disabled",!0),$("button").addClass("hidden")),2!=$("#userInfomation").attr("roleid")&&$("#recommender").attr("disabled",!0),common.ajaxRequest("queryCustomerAccountInfo",o,function(t){if(0==t.status){var o,n,e=t.data.amId;for(var a in console.log(t.data),t.data){"customerType"==a?$("input[name='"+a+"'][value='"+t.data[a]+"']").attr("checked",!0):"status"==a?(o=t.data[a],$("input[name='"+a+"'][type='radio'][value='"+o+"']").prop("checked",!0)):"htmlRight"==a?(n=t.data[a],$("input[name='"+a+"'][type='radio'][value='"+n+"']").prop("checked",!0)):$("#"+a).val(t.data[a])}bindEvents(),AMS(e)}})}getAndRenderList();