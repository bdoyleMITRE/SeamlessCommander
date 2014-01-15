Ext.define('SeamlessC2.view.Manager.ToolbarView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.toolbar_view',
    width: 500,
    height: 65,
    cls:"toolbar_view",
    border:0,
    defaults: {
        border:0,
        style: {
            'background-color':'#000'
        }
    },
    //autoShow: true,
    layout: {
        type: 'hbox'
    },
    items: [
    {
        xtype:'button',
        id:'dash_btn',
        cls: 'dashpicker_btn_img s2_toolbar_button',
        handler: function(button,e){  
            scope:this,
            this.fireEvent('toolbar_tab_selected','dash',this);
        }
    },
    {
        xtype:'button',
        id:'data_btn',
        cls: 'datasource_btn_img s2_toolbar_button',
        handler: function(button,e){  
            scope:this,
            this.fireEvent('toolbar_tab_selected','datasource',this);
        }
    },
     {
        xtype:'button',
        id:'cow_btn',
        cls: 'smartcow_btn_img s2_toolbar_button',
        handler: function(button,e){  
            scope:this,
            this.fireEvent('toolbar_tab_selected','smartcow',this);
        }
    },
    {
        xtype:'button',
        id:'alert_btn',
        cls: 'alerts_btn_img s2_toolbar_button',
        handler: function(button,e){  scope:this,
            this.fireEvent('toolbar_tab_selected','alerts',this);
        }
    },
    {
        id:'s2_messages',
        width:200,
        height:60,
        autoScroll:true,
        
        html:"<h2>Welcome to Seamless C2</h2>"
    }
   
    ]
});