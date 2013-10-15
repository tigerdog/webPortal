function FormSingle() { 

}
FormSingle.SimpleForm = function (title, items, fn) {
    var id = Ext.id();
    var formPanel = null;
    if (fn != undefined) {
        formPanel = Ext.create('Ext.form.Panel', {
            bodyPadding: 5,
            width: 350,
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            defaultType: 'textfield',
            items: items,
            buttons: [{
                text: '重置',
                handler: function () {
                    this.up('form').getForm().reset();
                    //this.up('form').close();
                }
            }, {
                text: '提交',
                formBind: true,
                handler: function () {
                    var form = this.up('form').getForm();
                    var d = form.getValues();
                    fn(d, id);

                }
            }]

        });
    } //if
    else {
        formPanel = Ext.create('Ext.form.Panel', {
            bodyPadding: 5,
            width: 350,
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            defaultType: 'textfield',
            items: items


        });
    }
    return { panel: formPanel, title: title, id: id };
}
FormSingle.SimpleFormWindow = function (title, items, fn) {
    var data = FormSingle.SimpleForm(title, items,fn);
    Ext.create('Ext.window.Window', {
        id: data.id,
        title: data.title,
        height: 600,
        width: 800,
        layout: 'fit',
        items: [data.panel]
    }).show();

}
