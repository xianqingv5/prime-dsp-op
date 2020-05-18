"use strict";function bindEvents(){$("#content button").unbind().on("click",function(n){if(n.preventDefault(),$(this).is(".confirm")){if(checkInputs()){var o=$("#form")[0],e=new FormData(o);$.ajax({url:window.api_host+"/recharge",type:"POST",cache:!1,contentType:!1,processData:!1,success:function(n){common.msgs.new_msg("Success","充值成功"),window.location="./index.html?goto=finance&mold=list"},data:e,xhrFields:{withCredentials:!0}})}}else window.location="./index.html?goto=finance&mold=list"}),$("#accountId").unbind().on("change",function(){var n=$(this).val();common.getUserBalance(n,$("#balance"))}),$("#payment, #commission").unbind().on("keyup",function(){countAmount()}),$("select[name=chargeType]").unbind().on("change",function(){$(".add_group").addClass("hidden"),$(".add_group").find("input").each(function(n,o){$(o).val("")}),1==$(this).val()||2==$(this).val()?$(".add_group_1").removeClass("hidden"):4==$(this).val()&&$(".add_group_2").removeClass("hidden")})}function getAccountIdName(){common.getAccountIdName(1,$("#accountId")).then(function(){$("#accountId").select2()}),$("#approver").text($("#userInfomation").attr("name"))}function countAmount(){var n=$("#payment").val()-$("#commission").val();$("#amount").removeClass("hidden").text(n)}function checkInputs(){var n=!1,o=$("#accountId").val(),e=$("#payment").val(),t=$("#paymentCheck").val(),r=$("#commission").val(),i=$("#chargeType").val(),m=$("#remitter").val(),c=$("#remittTime").val(),s=$("#affid").val(),a=$("#file_1").val(),u=$("#file_2").val();if("4"==i&&(r="0"),""==o)return n=!1,void common.msgs.new_msg("Error","请选择账户");if(n=!0,""==e)return n=!1,void common.msgs.new_msg("Error","请输入充值金额");if(n=!0,""==t)return n=!1,void common.msgs.new_msg("Error","请输入确认充值金额");if(n=!0,""==r)return n=!1,void common.msgs.new_msg("Error","请输入充值手续费");if(n=!0,!i)return n=!1,void common.msgs.new_msg("Error","请选择充值方式");if(n=!0,e!=t)return n=!1,void common.msgs.new_msg("Error","充值金额和确认充值金额不一致");if(n=!0,1==i||2==i){if(!m)return n=!1,void common.msgs.new_msg("Error","请输入打款人");if(n=!0,!c)return n=!1,void common.msgs.new_msg("Error","请输入打款时间");if(n=!0,!a)return n=!1,void common.msgs.new_msg("Error","请上传打款截图");n=!0}if(4==i){if(!s)return n=!1,void common.msgs.new_msg("Error","请输入Aff ID");if(n=!0,!u)return n=!1,void common.msgs.new_msg("Error","请上传邮件截图");n=!0}return n}function init(){getAccountIdName(),bindEvents(),$(".currency").html(template("currencyTmp",{currency:window.Currency}))}common.pluginsTools.loadPlugins(init,["select2","template"]);