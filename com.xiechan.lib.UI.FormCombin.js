function FormCombin() { 

}
FormCombin.CreateStoreInnerGrid = function (listCfg) {
    console.log(Ext.isDefined(listCfg.model));

    Ext.define(listCfg.model, {
        extend: 'Ext.data.Model',
        fields: listCfg.fields
    });

    var store = Ext.create('Ext.data.Store', {
        autoLoad: true,
        model: listCfg.model,
        data:listCfg.data,
        proxy: {
            type: 'memory',
            reader: {
                type: 'json'
                /*,
                root: 'users'*/
            }
        }
    });
    return store;
}

FormCombin.SimpleForm = function (title, items, listCfg, fn,readOnly) {
    var id = Ext.id();
    var subGridId = Ext.id();
    headPanel = Ext.create('Ext.form.Panel', {
        bodyPadding: 5,
        title: '概要',
        width: 350,
        layout: 'anchor',
        defaults: {
            anchor: '100%'
        },
        defaultType: 'textfield',
        items: items,
        collapsible: true


    });
    var listStore = FormCombin.CreateStoreInnerGrid(listCfg);
    var innerGrid = new SimpleListForInner(listCfg.columns, listStore, subGridId,readOnly);
    var p = innerGrid.List();

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
            items: [
                headPanel, p
            ],
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
                    var g = Ext.getCmp(subGridId);
                    var s = g.getStore();

                    
                    var obj = {};
                    obj.h = {};
                    obj.l = [];
                    obj.persons = [];
                    for (var k in d) {
                        if (k.indexOf("_") == 0) {
                            obj[k] = d[k];
                        }
                        else if (k == "createDate" || k == "dirtyFlag" || k == "createDate") {
                            obj[k] = d[k];
                        }
                        else {
                            obj.h[k] = d[k];
                        }
                    }
                    s.each(function (r) {
                        obj.l.push(r.data);
                    });

                    
                    fn(obj, id);

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
            items: [
                headPanel, p
            ],


        });
    }
    return { panel: formPanel, title: title, id: id };
}
FormCombin.SimpleFormWindow = function (title, items, listCfg, fn,readOnly) {
    var data = FormCombin.SimpleForm(title, items, listCfg, fn,readOnly);
    Ext.create('Ext.window.Window', {
        id: data.id,
        title: data.title,
        height: 600,
        width: 800,
        layout: 'fit',
        items: [data.panel]
    }).show();

}
