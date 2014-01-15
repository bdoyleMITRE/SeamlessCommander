Ext.define('SeamlessC2.view.Manager.MainView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mainview',
    width: 500,
    height:65,
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
        type: 'hbox'
    },
    items: [
    {xtype: 'toolbar_view'}
    ]
});