var plugin1 = "template";
common.pluginsTools.loadPlugins(render, [plugin1]);
function bindEvents (){
	$('#list').on("click", 'button.detail, button.view', function() {
		var accountId = $(this).attr("accountId");
		var type = $(this).attr("type");
		window.location = `./index.html?goto=account&mold=detail&accountId=${accountId}&type=${type}`;
	})
	// $("#search").unbind().on("click", function() {
	// 	getAndRenderList();
	// })

    var $filter = $('.filter').focus()
    $filter.on('keyup', function (e) {
        var charCode = e.charCode || e.keyCode;
        if(charCode == '13') {
            var key = $(this).attr('data-key')

            $filter.each(function() {
                if(key != $(this).attr('data-key')) {
                    $(this).val('')
                }
            })

            getAndRenderList()
            
        }
    })
    var $showAll = $('#show-all')
    $showAll.on('click', function() {
            $filter.val('')
            getAndRenderList()

        })
}
function getAndRenderList (currentPage,start, end){
	var page = currentPage || 1;
	var queryData = $("form").serialize() + "&currentPage=" + page;

	helper();
   	common.ajaxRequest('queryCustomerAccountList', queryData, function(result) {
        if (result.status == 0) {
        	var roleId = $("#userInfomation").attr("roleId");
        	if(roleId == 2 || roleId == 7) {
        		setTimeout(function(){
        			$('.check-authority').show();
        		});
        	}

        	if (result.data && result.data.list.length == 0) {
        		var html = '<tr><td  class="text-left" colspan="10">No result</td></tr>';
        	} else {
				var html = template('accountList', {data:result.data && result.data.list, roleId:roleId, Currency});
        	}
			$("#list").html(html);
			common.buildPage($(".page"), result.data.paging, queryData, getAndRenderList, 10, currentPage, start, end);
			
            $('.btn-toolbar').children('button').remove();
		    $("table#account-list").tableExport({formats:["xlsx"]});
        }
    })
}
function helper (){
	template.helper("handleStatus", function(id){
		switch (id) {
			case 1 :
				return "Active"
				break;
			case 2 :
				return "Pause"
				break;
			case 3 :
				return "Remove"
				break;
			default:
				return "";
				break;
		}
	})
}
function  render() {
    getAndRenderList();
    bindEvents();
}