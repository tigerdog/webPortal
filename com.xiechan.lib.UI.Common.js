function UICommon() { 

}
UICommon.CreateTab = function (panel) {
    var x = Ext.getCmp("app-portal");
    x.add(panel).show();
}
UICommon.Alert = function (desc, fn) {
    if (fn == undefined) {
        Ext.Msg.alert("提示", desc);
    } //if
    else {
        Ext.Msg.alert("提示", desc, fn);
    }
}
UICommon.Confirm = function (desc, fn) {
    Ext.Msg.show({
        title: 'info',
        msg: desc,
        width: 300,
        buttons: Ext.Msg.OKCANCEL,
        fn: fn,
        icon: Ext.window.MessageBox.INFO
    });
}

