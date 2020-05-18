'use strict';

$(function () {
    $('#sub-nav').html('<li class="active"><a href="javascript:;">Adx\u7BA1\u7406</a></li>\n        <li><a href="?goto=adx&mold=report">Adx\u62A5\u8868</a></li>').show();

    var $submit = $('#form-container .confirm');
    bindEvents();
    var adxId = common.getUrlVars('adxId');
    var backToList = function backToList() {
        return location.href = "./index.html?" + $.param({
            'goto': 'adx',
            'mold': 'list'
        });
    };
    var queryDetail = function queryDetail(id) {
        return common.ajaxGet('queryAdExchange', { id: id });
    };
    var submit = function submit(param) {
        return common.ajaxPost('updateAdExchange', param);
    };
    var fillValue = function fillValue($field, value) {
        var type = $field.attr('type');
        if (type == 'text' || type == 'email' || type == 'number') {
            $field.val(value);
        }
        if (type == 'checkbox' || type == 'radio') {
            $field.each(function () {
                if ($(this).val() == value) {
                    $(this).prop('checked', true);
                } else {
                    $(this).removeProp('checked');
                }
            });
        }
    };
    var renderFormData = function renderFormData(data) {
        var $con = $('#form-container');
        Object.keys(data).forEach(function (key) {
            var value = data[key];
            var $field = $con.find('[name=' + key + ']');
            fillValue($field, value);
        });
    };

    function initialize() {
        queryDetail(adxId).then(function (res) {
            if (res.status == 0 && res.data && res.data.list && res.data.list.length) {
                renderFormData(res.data.list[0]);
            }
        });
    }

    function bindEvents() {
        $('#form-container').on('submit', function () {
            var done = $submit.btnSubmiting('正在提交...');
            var param = _.extend($("form").serializeJSON(), {
                id: adxId
            });

            if (param.forUser) {
                try {
                    param.forUser = JSON.parse(param.forUser);
                } catch (e) {
                    $('#forUser').val('');
                    console.warn('parse forUser error! ', param.forUser);
                }
            } else {
                param.forUser = [];
            }

            submit(param).then(function (res) {
                done();
                if (res.status == 0) {
                    common.msgs.new_msg("success", "success");
                    backToList();
                } else {
                    common.msgs.new_msg("fail", "fail");
                }
            });
            return false;
        });

        $('#form-container .cancel').on('click', function () {
            backToList();
        });
    }

    common.pluginsTools.loadPlugins(initialize, []);
});