var op = {
    list: function (actionType) {
        var operation = new Ext.data.Operation({
            action: 'read',
            params: { action: 'list', actionType: actionType }
        });
        return operation;
    },
    addItem: function (actionType, obj) {
        var operation = new Ext.data.Operation({
            action: 'create',
            params: { action: 'addItem', data: encodeURIComponent(Ext.encode(obj)), actionType: actionType }

        });
        return operation;
    },
    deleteItem: function (actionType, idList) {
        var operation = new Ext.data.Operation({
            action: 'create',
            params: { action: 'deleteItem', data: encodeURIComponent(Ext.encode(idList)), actionType: actionType }

        });
        return operation;
    },
    updateItem: function (actionType, obj) {
        var operation = new Ext.data.Operation({
            action: 'create',
            params: { action: 'addItem', data: encodeURIComponent(Ext.encode(obj)), actionType: actionType }

        });
        return operation;
    }

};
var proxy = new Ext.data.proxy.Ajax({
    url: globalUrl.url,
    reader: {
        type: 'json',
        root:'data',
        record: '_content'
    },
    writer: {
        type: 'json'
    }
});

function SimpleList(title, columns, actionType,formType) {
    this.actionType = actionType;
    this.columns = columns;
    this.selModel = Ext.create('Ext.selection.CheckboxModel', {
        listeners: {
            selectionchange: function (sm, selections) {
            }
        }
    });
    var fields = [];
    for (var k in columns) {
        if (columns[k].text == undefined) {
            console.log('h.' + columns[k].dataIndex);
            //fields.push({ name: columns[k].dataIndex, mapping: 'h.' + columns[k].dataIndex });
            fields.push(columns[k].dataIndex);
        } //if
        if (columns[k].text != undefined) {
            console.log('h.' + columns[k].dataIndex);
            fields.push({ name: columns[k].dataIndex, mapping: 'h.' + columns[k].dataIndex });
            //fields.push(columns[k].dataIndex);
        } //if
    }


    var that = this;
    var store = new Ext.data.JsonStore({
        fields: fields,
        autoSync: true,
        proxy: proxy,
        listeners: {
            beforeload: function (s, o) {
                console.log(arguments);
                Ext.apply(o, op['list'](that.actionType));

            },
            write: function (store, operation) {
                var record = operation.getRecords()[0],
                    name = Ext.String.capitalize(operation.action),
                    verb;


                if (name == 'Destroy') {
                    record = operation.records[0];
                    verb = 'Destroyed';
                } else {
                    verb = name + 'd';
                }
                Ext.example.msg(name, Ext.String.format("{0} user: {1}", verb, record.getId()));

            }
        }
    });

    store.load(op['list'](this.actionType));

    this.panel = {
        xtype: 'gridpanel',
        title: title,
        store: store,
        bbar: Ext.create('Ext.PagingToolbar', {
            store: store,
            displayInfo: true,
            displayMsg: '当前 {0} - {1} of {2}',
            emptyMsg: "无数据"
        }),
        tbar: [
            { xtype: 'button', text: '显示选中项',
                handler: function () {
                    var p = this.ownerCt.ownerCt;
                    var array = p.getView().getSelectionModel().getSelection();
                    if (array.length != 1) {
                        UICommon.Alert("请选择一项，系统将自动清除当前项 ", function () {
                            p.getView().getSelectionModel().deselectAll();
                        });
                    }
                    else {
                        console.log(formType);
                        
                        var items = [];

                        var listCfg = undefined;
                        for (var k in columns) {
                            var obj = {};
                            obj.fieldLabel = columns[k].text;
                            obj.name = columns[k].dataIndex;
                            if (array[0].raw[columns[k].dataIndex] != undefined) {
                                obj.value = array[0].raw[columns[k].dataIndex];
                            }
                            if (array[0].raw.h[columns[k].dataIndex] != undefined) {
                                obj.value = array[0].raw.h[columns[k].dataIndex];
                            }
                            obj.allowBlank = true;
                            if (columns[k]._hideInForm == true) {
                                obj.xtype = 'hiddenfield';
                            }
                            else {
                                obj.xtype = 'displayfield';
                            }
                            if (columns[k]._notShowInForm == true) {
                                obj.hide = true;
                            }
                            if (columns[k]._formVtype != undefined) {
                                obj.vtype = columns[k]._formVtype;
                            }
                            if (columns[k].listItemCfg != undefined) {
                                listCfg = columns[k].listItemCfg;
                                listCfg.data = array[0].raw.l;
                            }


                            items.push(obj);
                        }
                        if (formType == "single") {
                            FormSingle.SimpleFormWindow("细节表单", items);
                        } //if
                        if (formType == "combin") {
                            FormCombin.SimpleFormWindow("细节表单", items, listCfg, undefined, true);
                        } //if
                    } //else
                }
            },
            { xtype: 'button', text: '增加项',
                handler: function () {
                    var items = [];

                    var listCfg = undefined;
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
                        if (columns[k].listItemCfg != undefined) {
                            listCfg = columns[k].listItemCfg;
                        }


                        items.push(obj);
                    }
                    if (formType == "single") {
                        FormSingle.SimpleFormWindow("新增表单", items, listCfg, function (data, id) {
                            proxy.doRequest(op['addItem'](that.actionType, data), function (o) {
                                if (o.response != undefined && o.response.status == "200") {
                                    var resp = Ext.decode(o.response.responseText);
                                    if (resp != null && resp.resultFlag == "success") {
                                        UICommon.Alert("提交成功", function () {
                                            Ext.getCmp(id).close();
                                            store.load(op['list'](that.webSite, that.actionType));
                                        });
                                    }
                                    else if (resp != null && resp.resultFlag == "failure") {
                                        UICommon.Alert("提交失败:" + resp.resultMsg);
                                    }

                                }
                                else {
                                    Utils.Alert("服务器错误:" + o.error);
                                }


                            });

                        });
                    } //if
                    if (formType == "combin") {
                        FormCombin.SimpleFormWindow("新增表单", items, listCfg, function (data, id) {
                            proxy.doRequest(op['addItem'](that.actionType, data), function (o) {
                                if (o.response != undefined && o.response.status == "200") {
                                    var resp = Ext.decode(o.response.responseText);
                                    if (resp != null && resp.resultFlag == "success") {
                                        UICommon.Alert("提交成功", function () {
                                            Ext.getCmp(id).close();
                                            store.load(op['list'](that.webSite, that.actionType));
                                        });
                                    }
                                    else if (resp != null && resp.resultFlag == "failure") {
                                        UICommon.Alert("提交失败:" + resp.resultMsg);
                                    }

                                }
                                else {
                                    Utils.Alert("服务器错误:" + o.error);
                                }


                            });

                        });
                    }

                }
            },
            { xtype: 'button', text: '删除项',
                handler: function () {
                    var p = this.ownerCt.ownerCt;
                    UICommon.Confirm("确定删除?", function (b, t, o) {
                        if (b == "ok") {
                            var array = p.getView().getSelectionModel().getSelection();
                            var toBeDel = [];
                            for (var k in array) {
                                toBeDel.push(array[k].raw._mid);
                            }
                            if (toBeDel.length == 0) {
                                UICommon.Alert("请至少选择一项");
                            }
                            else {
                                proxy.doRequest(op['deleteItem'](that.actionType, toBeDel), function (o) {
                                    if (o.response != undefined && o.response.status == "200") {
                                        var resp = Ext.decode(o.response.responseText);
                                        if (resp != null && resp.resultFlag == "success") {
                                            UICommon.Alert("提交成功", function () {
                                                //p.close();
                                                store.load(op['list'](that.webSite, that.actionType));
                                            });
                                        }
                                        else if (resp != null && resp.resultFlag == "failure") {
                                            UICommon.Alert("提交失败:" + resp.resultMsg);
                                        }

                                    }
                                    else {
                                        UICommon.Alert("服务器错误:" + o.error);
                                    }
                                });
                                //store.reload();
                                store.load(op['list'](that.webSite, that.actionType));

                            } //else

                        } //if
                    });
                }
            },
            { xtype: 'button', text: '修改项',
                handler: function () {
                    var p = this.ownerCt.ownerCt;
                    var array = p.getView().getSelectionModel().getSelection();
                    if (array.length != 1) {
                        UICommon.Alert("请选择一项，系统将自动清除当前所选 ", function () {
                            p.getView().getSelectionModel().deselectAll();
                        });
                    }
                    else {
                        var items = [];

                        var listCfg = undefined;
                        for (var k in columns) {
                            var obj = {};
                            obj.fieldLabel = columns[k].text;
                            obj.name = columns[k].dataIndex;
                            if (array[0].raw[columns[k].dataIndex] != undefined) {
                                obj.value = array[0].raw[columns[k].dataIndex];
                            }
                            if (array[0].raw.h[columns[k].dataIndex] != undefined) {
                                obj.value = array[0].raw.h[columns[k].dataIndex];
                            }
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
                            if (columns[k].listItemCfg != undefined) {
                                listCfg = columns[k].listItemCfg;
                                listCfg.data = array[0].raw.l;
                            }


                            items.push(obj);
                        }
                        if (formType == "single") {
                            FormSingle.SimpleFormWindow("修改表单", items, function (data, id) {
                                proxy.doRequest(op['updateItem'](that.actionType, data), function (o) {
                                    if (o.response != undefined && o.response.status == "200") {
                                        var resp = Ext.decode(o.response.responseText);
                                        if (resp != null && resp.resultFlag == "success") {
                                            UICommon.Alert("提交成功", function () {
                                                Ext.getCmp(id).close();
                                                store.load(op['list'](that.webSite, that.actionType));
                                            });
                                        }
                                        else if (resp != null && resp.resultFlag == "failure") {
                                            UICommon.Alert("提交失败:" + resp.resultMsg);
                                        }

                                    }
                                    else {
                                        UICommon.Alert("服务器错误:" + o.error);
                                    }
                                });

                            });
                        } //if
                        if (formType == "combin") {
                            FormCombin.SimpleFormWindow("修改表单", items, listCfg, function (data, id) {
                                proxy.doRequest(op['updateItem'](that.actionType, data), function (o) {
                                    if (o.response != undefined && o.response.status == "200") {
                                        var resp = Ext.decode(o.response.responseText);
                                        if (resp != null && resp.resultFlag == "success") {
                                            UICommon.Alert("提交成功", function () {
                                                Ext.getCmp(id).close();
                                                store.load(op['list'](that.webSite, that.actionType));
                                            });
                                        }
                                        else if (resp != null && resp.resultFlag == "failure") {
                                            UICommon.Alert("提交失败:" + resp.resultMsg);
                                        }

                                    }
                                    else {
                                        UICommon.Alert("服务器错误:" + o.error);
                                    }
                                });

                            });
                        } //if


                    }
                }
            }
        ],
        columns: columns,
        selModel: this.selModel
    };
}
SimpleList.prototype.List = function () {
    UICommon.CreateTab(this.panel);
}
