Ext.define('SeamlessC2.view.Manager.ContentView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.content_view',
    id: 'content_view',
    width: 160,
    height: 300,//258,
    border:0,
    cls:'content_view',
    defaults: {
        border:0
    },
    layout: {
        type: 'card'
    },
    items: [ 
        {html:"Welcome to Seamless C2 <br/> Please select from the toolbar to the left."},
        {xtype:'dashpicker_view' } ,
        {xtype:'datasource_view' } ,
        {xtype: 'alerts_view'}
    ]
});