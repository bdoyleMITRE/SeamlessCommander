
Ext.define('SeamlessC2.view.Manager.AlertsView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.alerts_view',
    id:'alerts_view',
    onItemCheck: function(item, checked){
        Ext.example.msg('Item Check', 'You {1} the "{0}" menu item.', item.text, checked ? 'checked' : 'unchecked');
    },
    width:50,
    height:40,    
    items: [
    {
        xtype:'button',
        width:42,
        height:32,
        cls: 'alerts_btn_img',
        menu:
        {
            id:"alerts_btn_menu",//used to populate in controller
            items:[
                          
            ]
        }
    }
    ]
});