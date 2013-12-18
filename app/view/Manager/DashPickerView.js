Ext.define('SeamlessC2.view.Manager.DashCreateBtn', {
    extend: 'Ext.Button',    
    alias: 'widget.dashpicker_createbtn',
    text: 'Create New',
    handler: function() {
        //log("Create Button Pressed");
    }
});

Ext.define('SeamlessC2.view.Manager.DashPickerView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.dashpicker_view',
    id:'dashpicker_view',
    width:50,
    height:40,    
    items: [
    {
        xtype:'button',
        width:42,
        height:32,
        cls: 'dashpicker_btn_img',
        menu:
        {
            id:"dashpicker_btn_menu",//used to populate in controller
            items:[
                {xtype:'dashpicker_createbtn'}
            ]
        }
    }
    ]
});