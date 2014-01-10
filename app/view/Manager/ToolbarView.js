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
            padding: '1px',
            'background-color':'#000',
            color:'#fff'
        }
    },
    //autoShow: true,
    layout: {
        type: 'vbox'
    },
    items: [
    {
        xtype:'button',
        id:'dash_btn',
        width:42,
        height:32,
        cls: 'dashpicker_btn_img',
        handler: function(button,e){  
            scope:this,
            this.fireEvent('toolbar_tab_selected',1,this);
        }
    },
    {
        xtype:'button',
        id:'data_btn',
        width:42,
        height:32,
        cls: 'datasource_btn_img',
        handler: function(button,e){  
            scope:this,
            this.fireEvent('toolbar_tab_selected',2,this);
        }
    },
    {
        xtype:'button',
        id:'alert_btn',
        width:42,
        height:32,
        cls: 'alerts_btn_img',
        handler: function(button,e){  scope:this,
            this.fireEvent('toolbar_tab_selected',3,this);
        }
    },
    //  {xtype: 'smartcow_view'},
    //  {xtype: 'datasource_view'},
    //{xtype: 'alerts_view'}
           
    ]
});