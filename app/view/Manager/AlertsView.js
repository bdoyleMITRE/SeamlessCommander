
Ext.define('SeamlessC2.view.Manager.AlertsView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.alerts_view',
    id:'alerts_view',
    items: [
    {
        xtype:'button',
        width:42,
        height:32,
        cls: 'alerts_btn',
        text: "<div class='sourcePanel'>Tailor Data Source</div>"
    }
    ]
});