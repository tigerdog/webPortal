//form内部的
function SimpleListForInner(columns, store,id,readOnly) {
    this.columns = columns;
    this.selModel = Ext.create('Ext.selection.CheckboxModel', {
        listeners: {
            selectionchange: function (sm, selections) {
            }
        }
    });
    var fields = [];
    for (var k in columns) {
        fields.push(columns[k].dataIndex);
    }
    if (readOnly == true) {
        this.showBar = false;
    }
    else {
        this.showBar = true;
    }
    //this.showBar = readOnly==true?false:true;
    this.grid = {
        id:id,
        xtype: 'gridpanel',
        store: store,
        columns: columns,
        selModel: this.selModel,
        tbar:this.showBar==false?undefined: [
            { xtype: 'button', text: '增加项', handler: function () {
                var items = [];
                for (var k in columns) {
                    var obj = {};
                    obj.fieldLabel = columns[k].text;
                    obj.name = columns[k].dataIndex;
                    obj.allowBlank = true;
                    if (columns[k]._hideInForm == true) {
                        obj.xtype = 'hiddenfield';
                    }
                    if (columns[k]._notShowInForm == true) {
                        obj.hide = true;
                    }
                    if (columns[k]._formVtype != undefined) {
                        obj.vtype = columns[k]._formVtype;
                    }
                    items.push(obj);
                }
                FormSingle.SimpleFormWindow("新增表单", items, function (data, id) {

                    store.add(data);
                    Ext.getCmp(id).close();
                })
            }
            },
            { xtype: 'button', text: '删除项', handler: function () {
                var p = this.ownerCt.ownerCt;
                UICommon.Confirm("确定删除所选吗？", function (b, t, o) {
                    if (b == "ok") {
                        var array = p.getView().getSelectionModel().getSelection();

                        if (array.length == 0) {
                            UICommon.Alert("请至少选择一项");
                        }
                        else {
                            store.remove(array);
                        } //else

                    } //if
                });
            }
            },
            { xtype: 'button', text: '修改项', handler: function () {
                var p = this.ownerCt.ownerCt;
                var array = p.getView().getSelectionModel().getSelection();
                if (array.length != 1) {
                    UICommon.Alert("请只选择一项，系统将自动清除当前所选 ", function () {
                        p.getView().getSelectionModel().deselectAll();
                    });
                }
                else {
                    
                    var items = [];
                    for (var k in columns) {
                        var obj = {};
                        obj.fieldLabel = columns[k].text;
                        obj.name = columns[k].dataIndex;
                        obj.value = array[0].raw[columns[k].dataIndex];
                        obj.allowBlank = true;
                        if (columns[k]._hideInForm == true) {
                            obj.xtype = 'hiddenfield';
                        }
                        if (columns[k]._notShowInForm == true) {
                            obj.hide = true;
                        }
                        if (columns[k]._formVtype != undefined) {
                            obj.vtype = columns[k]._formVtype;
                        }
                        items.push(obj);
                    }
                    FormSingle.SimpleFormWindow("修改表单", items, function (data, id) {
                        store.remove(array);
                        store.add(data);
                        Ext.getCmp(id).close();
                    })


                }
            }
            }

        ]

    };

    this.panel = Ext.create('Ext.form.Panel', {
        bodyPadding: 5,
        width: 350,
        title:'明细',
        layout: 'anchor',
        defaults: {
            anchor: '100%'
        },
        items: [this.grid],
        collapsible: true,
        collapsed: true


    });


}
SimpleListForInner.prototype.List = function () {
    return this.panel;
}
