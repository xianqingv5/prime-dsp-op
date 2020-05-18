$(function() {
    $('#sub-nav').html(`
        <li class="active"><a href="javascript:;">Adx报表</a></li>
        <li><a href="?goto=adx&mold=list">Adx管理</a></li>
    `).show()

    var [plugin1,plugin2,plugin3] = ["template","datetimepicker",'select2'];
    var roleId = $("#userInfomation").attr("roleId");

    var rangePickerOption = {
        startDate: moment(),
        singleDatePicker: false,
        opens: 'left',
        showDropdowns: true,
        locale: {
            format: 'YYYY-MM-DD',
            separator: ' / ',
            applyLabel: 'ok',
            cancelLabel: 'cancel',
            customRangeLabel: 'custom',
        },
        ranges: {
            '今天': [moment.utc(), moment.utc()],
            '昨天': [moment.utc().subtract(1, 'days'), moment.utc().subtract(1, 'days')],
            '前天': [moment.utc().subtract(2, 'days'), moment.utc().subtract(2, 'days')],
            '3天内': [moment.utc().subtract(2, 'days'), moment.utc()],
            '7天内': [moment.utc().subtract(6, 'days'), moment.utc()],
            '30天内': [moment.utc().subtract(29, 'days'), moment.utc()],
        }
    }

    common.pluginsTools.loadPlugins(init, [plugin1, plugin2, plugin3]);
    common.pluginsTools.loadCss("datetimepickerCss");

    
    const $form = $('#form-container'),
        $submit = $('#submit'),
        $reset = $('#reset'),
        $more = $('#more-param');
    
    var pageRender = common.PageRender($('.page'), getAndRenderList)
    const deleteAdx = id => common.ajaxGet('deleteAdExchange', {id})
    

    var render = (param = {}) => $("#list")
        .html(template('materialsList', Object.assign({ loading: false, data: null }, param)));
//初始化
    function  init() {
        $('input[daterange]').daterangepicker(rangePickerOption)
        
        helper();
        bindEvents();
        
        getAndRenderList();

        queryAllAdx().then(res => {
            if(res.status == 0) {
                renderAdxSelector(res.data.list)
            }

        })
    }

    var renderHeader = id => $("#table-header").html(template(id))


    function bindEvents (){

        $reset.on('click', function(e) {
            e.preventDefault()
            e.stopPropagation()

            $inputs.val('')
            $radios.removeProp('checked')
            getAndRenderList();
        })

        $form.on('submit', function() {
            getAndRenderList(getQueryData());
            return false
        })

        $('#adx-selector').on('change', function(e) {
            getAndRenderList()
        })

        $('#datetime').on('change', function() {
            getAndRenderList()
        })

        $('#list').on('click', '[platformId]', function() {
            let platformId = $(this).attr('platformId')
            $('#adx-selector').val(platformId).trigger('change.select2')
            getAndRenderList({platformId, groupBy: 'platformdate'})
        }).on('click', '[campaign-list]', function() {
            let date = $(this).attr('campaign-list')
            showAdxDetail(date)
        })

    }
    
    

    function getQueryData() {
        const param = $form.serializeJSON()
        param.platformId = $('#adx-selector').val()

        if(param.platformId == 0) {
            delete param.platformId
        }else {
            param.groupBy = 'platformdate'
        }

        const time = param.time.split('/')
        param.startTime = $.trim(time[0])
        param.endTime = $.trim(time[1])

        delete param.time

        return param
    }
    //获取并渲染素材列表
    function getAndRenderList (ext = {}){
        // 扩展
        var queryData = _.extend({}, getQueryData(), ext)
        // 默认值
        _.defaults(queryData, {
            currentPage: 1,
            // status: '1,2',
            limit: 50,
        })

        for(var n in queryData) {
            if(queryData[n] === undefined || queryData[n] === '') {
                delete queryData[n]
            }
        }
        getAndRenderList.require && getAndRenderList.require.abort && getAndRenderList.require.abort()

        render({loading: true});
        getAndRenderList.require = common.ajaxGet('queryAdExchangeReport', queryData)
        getAndRenderList.require.then(function(res) {
            if (res.status == 0) {
                let data = res.data && res.data.list.length == 0
                    ? []
                    : res.data.list.map(defaultResultMapper)

                if(!!queryData.groupBy) {
                    for(var i=0; i<data.length; i++) {
                        data[i].dateForm = data[i].date.split(' ')[0];
                    }
                }

                renderHeader(queryData.groupBy == 'platformdate' ? 'thead-platform-date' : 'thead-platform')
                render({data})
                
                
                pageRender(res.data.paging)

                $('.btn-toolbar').children('button').remove();
                $(".table#adx-report").tableExport({formats:["xlsx"]});
            }

            if(res.status) {
                render()
                pageRender()
            }
        })
    }

    function showAdxDetail(date, ext = {}) {
        var $container = $('#list').find(`#adx-detail-${date}`)
        if($container.data('display')) {
            $container.data('display', false).empty()
            return $container.hide()
        }

        $container.show().data('display', true)
        
        var queryData = _.extend({}, getQueryData(), ext)
        var detailHttp = 'queryAdExchangeDetailReport?adx=' + queryData.platformId + '&platformId=' + queryData.platformId +'&date=' + date.split(' ')[0];
        common.ajaxGet(detailHttp).then(function(res) {
            if(res.status == 0) {
                $container.html(template('campaignList', {
                    data:res.data.list
                })) 
            }
        })
    }

    function queryAllAdx() {
        return common.ajaxGet('queryAdExchange')
    }

    function renderAdxSelector(data) {
        if($('#adx-selector').data('complate')) return false
        $('#adx-selector').data('complate', true)
        $('#adx-selector').append(data.map(adx => `<option value="${adx.id}">${adx.name}</option>`))
        $('#adx-selector').select2()
    }

    function helper (){
        template.helper('numeral', function(...arg) {
            return numeral(...arg)
        })
    }

})

function defaultResultMapper(item) {
    return _.defaults(item, {
        id: '',
        token: '',
        name: '',
    })
}