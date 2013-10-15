function Ajax() {

}
Ajax.AjaxGet = function (successFn, params) {
    Ext.Ajax.request({
        url: globalUrl.url,
        params: params,
        method: "GET",
        success: function (response, opts) {
            var resp = Ext.decode(response.responseText);
            if (successFn != undefined) {
                successFn(resp);
            } //if

        },
        failure: function (response, opts) {
            console.log(arguments);
            Utils.Alert("服务器错误:" + response.responseText);
        }
    });
}
Ajax.AjaxPost = function (successFn, params) {
    Ext.Ajax.request({
        url: globalUrl.url,
        params: params,
        method: "POST",
        success: function (response, opts) {
            var resp = Ext.decode(response.responseText);
            if (successFn != undefined) {
                successFn(resp);
            } //if

        },
        failure: function (response, opts) {
            console.log(arguments);
            Utils.Alert("服务器错误:" + response.responseText);
        }
    });
}
