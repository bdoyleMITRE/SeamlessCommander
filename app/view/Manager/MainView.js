Ext.define('SeamlessC2.view.Manager.MainView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mainview',
    width: 200,
    height: 300,
    //title: 'Seamless C2',
    border:0,
    
    defaults: {
        border:0,
        style: {
            //padding: '5px'
        }
    },
    //autoShow: true,
    layout: {
        type: 'vbox'
    },
    items: [
    {xtype: 'toolbar_view'},
    {xtype: 'content_view'} 
    ]
});