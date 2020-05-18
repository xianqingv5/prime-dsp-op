$(function() {
    $('#sub-nav').html(`<li class="active"><a href="javascript:;">Adx管理</a></li>
        <li><a href="?goto=adx&mold=report">Adx报表</a></li>`).show()

    const $submit = $('#form-container .confirm')
    bindEvents();
    const adxId = common.getUrlVars('adxId')
    const backToList = () => location.href = "./index.html?" + $.param({
        'goto': 'adx',
        'mold': 'list',
    })
    const queryDetail = id => common.ajaxGet('queryAdExchange', {id})
    const submit = param => common.ajaxPost('updateAdExchange', param)
    const fillValue = ($field, value) => {
        let type = $field.attr('type')
        if(type == 'text' || type == 'email' || type == 'number' ) {
            $field.val(value)
        }
        if(type == 'checkbox' || type == 'radio') {
            $field.each(function(){
                if($(this).val() == value) {
                    $(this).prop('checked', true)
                } else {
                    $(this).removeProp('checked')
                }
            })
        }

    }
    const renderFormData = data => {
        const $con = $('#form-container')
        Object.keys(data).forEach(key => {
            let value = data[key]
            let $field = $con.find('[name='+ key +']')
            fillValue($field, value)
        })

        
    }
    

    function initialize() {
        queryDetail(adxId).then(res => {
            if(res.status == 0 && res.data && res.data.list && res.data.list.length) {
                renderFormData(res.data.list[0])
            }
        })

        // $('#forUser').select2()
        
    }

    function bindEvents() {
        $('#form-container').on('submit', function() {
            let done = $submit.btnSubmiting('正在提交...')
            let param = _.extend($("form").serializeJSON(), {
                id: adxId
            })

            if(param.forUser) {
                try{
                    param.forUser = JSON.parse(param.forUser)
                }catch(e){
                    $('#forUser').val('')
                    console.warn('parse forUser error! ', param.forUser)
                }
            }else {
                param.forUser = []
            }
            


            submit(param).then(res => {
                done()
                if(res.status == 0) {
                    common.msgs.new_msg("success", "success");
                    backToList()
                } else {
                    common.msgs.new_msg("fail", "fail");
                }
            })
            return false
        })

        $('#form-container .cancel').on('click', function() {
            backToList()
        })
    }

    common.pluginsTools.loadPlugins(initialize, [/*'select2'*/]);
})
