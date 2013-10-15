Ext.apply(Ext.form.field.VTypes, {
    digit: function(val, field) {
        return Ext.isNumeric(val);//timeTest.test(val);
    },
    digitText: 'Not a valid digit.  Must be in the format "12.34".',
    digitMask: /[\d\.]/i
});
Ext.apply(Ext.form.field.VTypes, {
    integer: function(val, field) {
        return Ext.isNumber(new Number(val).valueOf());
    },
    integerText: 'Not a valid integer.  Must be in the format "12".',
    integerMask: /[\d]/i
});
