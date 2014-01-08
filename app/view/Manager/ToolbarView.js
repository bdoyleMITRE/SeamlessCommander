Ext.define('SeamlessC2.view.Manager.ToolbarView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.toolbar_view',
    width: 40,
    height: 300,
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
        type: 'vbox'
    },
    items: [
        {xtype: 'dashpicker_view'},
      //  {xtype: 'smartcow_view'},
      //  {xtype: 'datasource_view'},
    {xtype: 'alerts_view'}
           
    ]
});