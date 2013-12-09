
Ext.define('SeamlessC2.view.Manager.DashPickerView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.dashpicker_view',
    id:'dashpicker_view',
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
        cls: 'dashpicker_btn_img',
        menu:
        {
            id:"dashpicker_btn_menu",//used to populate in controller
            items:[
            //'<b class="menu-title">Choose a Dashboard</b>',                    
            ]
        }
    }
    ]
});