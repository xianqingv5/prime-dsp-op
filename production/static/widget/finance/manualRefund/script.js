"use strict";function bindEvents(){$("button").unbind().on("click",function(n){if(n.preventDefault(),$(this).is(".confirm")){var o=$("form").serialize();checkInputs()&&common.ajaxRequest("refund",o,function(n){0==n.status?(common.msgs.new_msg("success","success"),window.location="./index.html?goto=finance&mold=list"):common.msgs.new_msg("error",n.msg)})}else window.location="./index.html?goto=finance&mold=list"}),$("#accountId").unbind().on("change",function(){var n=$(this).val();common.getUserBalance(n,$("#balance"))}),$("#payment, #commission").unbind().on("keyup",function(){countAmount()})}function getAccountIdName(){common.getAccountIdName("1,2",$("#accountId")).then(function(){$("#accountId").select2()}),$("#approver").text($("#userInfomation").attr("name"))}function countAmount(){var n=$("#payment").val()-$("#commission").val();$("#amount").removeClass("hidden").text(n)}function checkInputs(){var n=$("#accountId").val(),o=1*$("#payment").val(),e=1*$("#paymentCheck").val(),m=1*$("#commission").val(),t=$("#charge_type").val();$("#balance").text();if(""!=n)if(!0,null!=o)if(!0,null!=e)if(!0,null!=m)if(!0,""!=t)if(!0,o==e){if(!0,!(o<m))return!0;common.msgs.new_msg("Error","退款手续费大于退款金额")}else common.msgs.new_msg("Error","退款金额和确认退款金额不一致");else common.msgs.new_msg("Error","请选择退款方式");else common.msgs.new_msg("Error","请输入退款手续费");else common.msgs.new_msg("Error","请确认退款金额");else common.msgs.new_msg("Error","请输入退款金额");else common.msgs.new_msg("Error","请选择账户")}function init(){getAccountIdName(),bindEvents(),$(".currency").html(template("currencyTmp",{currency:window.Currency}))}common.pluginsTools.loadPlugins(init,["select2","template"]);