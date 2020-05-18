$(function() {
    $('#sub-nav').html(`
        <li><a href="?goto=adx&mold=report">Adx报表</a></li>
        <li class="active"><a href="javascript:;">Adx管理</a></li>
        `).show()

    var [plugin1,plugin2] = ["template","datetimepicker"];
    var roleId = $("#userInfomation").attr("roleId");

    common.pluginsTools.loadPlugins(init, [plugin1, plugin2]);
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
        helper();
        bindEvents();
        
        getAndRenderList();
    }


    function bindEvents (){
        function edit() {

        }

        //审核素材
        $("#list").on("click", 'button.detail', function(e) {
            var adxId = $(this).attr("adxId");
            var queryString = $.param({
                'goto': 'adx',
                'mold': 'detail',
                adxId,
            })


            location.href = "./index.html?" + queryString //, 'dsp-op-' + adxId
            e.stopPropagation()
        })

        $("#list").on("click", 'button.delete', function(e) {
            var adxId = $(this).attr("adxId");
            deleteAdx(adxId).then(res => {
                if(res.status == 0) {
                    common.msgs.new_msg("success", "Delete success");
                }
                else {
                    common.msgs.new_msg("fail", "Delete failed");
                }
            })

            e.stopPropagation()
        })

        $more.on('click', function() {
            $('.extend-param').toggleClass('hidden')
        })

        $('#inputSuccess4').on('keydown', function(e){
            var keyCode = e.keyCode || e.which 

            if(keyCode == '13') {
                e.preventDefault();
                getAndRenderList();
            }

            else if(keyCode == '27') {
                $("#inputSuccess4").val('');
                getAndRenderList();
            }
        })

        const $inputs = $form.find('input[type=text]')
        const $radios = $form.find('input[type=radio]')
        $inputs.on('input', function() {
            let $me = $(this)
            $inputs.each(function() {
                let $other = $(this)
                if(!$me.is($other)) {
                    $other.val('')
                }
            })
            
        })

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

        //模糊搜索
        // $submit.on("click", function(e) {
        //     e.preventDefault();


        //     console.log(111);
        //     getAndRenderList(getQueryData());
        // })
    }
    
    

    function getQueryData() {
        const param = $form.serializeJSON()
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

        // var queryData = getQueryData() + "&currentPage=" + page;
        // console.log(queryData);
        render({loading: true});
        getAndRenderList.require = common.ajaxGet('queryAdExchange', queryData)
        getAndRenderList.require.then(function(res) {
            if (res.status == 0) {
                let data = res.data && res.data.list.length == 0
                    ? []
                    : res.data.list.map(defaultResultMapper) 

                render({data})
                
                pageRender(res.data.paging)
            }

            if(res.status) {
                render()
                pageRender()
            }
        })
    }



    
    function helper (){
        template.helper("status", function(status){
            switch (status) {
                case 1 :
                    return '<span class="text-success"><i class="glyphicon glyphicon-play" /></span>'
                case 2 :
                    return '<span class="text-muted"><i class="glyphicon glyphicon-pause" /></span>'
                case 3 :
                    return '<span class="text-danger"><i class="glyphicon glyphicon-stop" /></span>'
                default:
                    return "";
            }
        })
        
        template.helper("chargeType", function(id){
            const data = {1:'nurl', 2:'adm'}
            return data[id]
        })

        template.helper("priceType", function(id){
            const data = {1:'第一出价', 2:'第二出价'}
            return data[id]
        })
        
        template.helper("adxUsageType", function(id){
            const data = {1:'普通', 2:'租用'}
            return data[id]
        })

        template.helper("type", function(id){
            const data = {1:'Normal', 2:'Prime', 3:'Pop', 4:'Adult', 5:'Pop Prime'}
            return data[id]
        })

        template.helper('tureOrFalse', function(flag) {
            return flag == 1 
                ? '<span class="label label-success" title="Ignore alter"><i class="glyphicon glyphicon-ok" /></span>'
                : '<span class="label label-ignore" title="Ignore alter"><i class="glyphicon glyphicon-ok" /></span>'
        })
        
        template.helper('status', function(flag) {

            return flag == 1
                ? '<span class="label label-success" title="Ignore alter"><i class="glyphicon glyphicon-play" /></span>'
                : '<span class="label label-ignore" title="Ignore alter"><i class="glyphicon glyphicon-stop" /></span>'
        })
    }


})

function defaultResultMapper(item) {
    return _.defaults(item, {
        id: '',
        token: '',
        name: '',
        chargeType: '',
        priceType: '',
        adxUsageType: '',
        type: '',
        forUser: '',
        isSupportHtml: '',
        isSupportVideo: '',
        status: '',
        approveClass: '',
    })
}