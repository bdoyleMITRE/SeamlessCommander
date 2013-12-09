Ext.define('SeamlessC2.view.Manager.ToolbarView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.toolbar_view',
    width: "100%",
    height: 40,
    cls:"toolbar_view",
    border:0,
    defaults: {
        border:0,
        style: {
            padding: '1px'
        }
    },
    //autoShow: true,
    layout: {
        type: 'hbox'
    },
    items: [
    {xtype: 'alerts_view'},
    {xtype: 'dashpicker_view'}       
    ]
});