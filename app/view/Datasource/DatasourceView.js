Ext.define('SeamlessC2.view.Datasource.DatasourceTreeView', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.datasource_treeview',
    id:'datasource_treeview',
    title:'Datasources',
    store: 'S2Datasource',
    rootVisible: false
});
/*
Ext.define('SeamlessC2.view.Datasource.DatasourceGridView', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.datasource_gridview',
    id:'datasource_gridview',
    store: 'S2Datasource',
    //hideHeaders: true,
    columns: [
    {
        header: 'Datasources',  
        dataIndex: 'name'
    },
    {}
    ],
    width:50,
    height:40 
    
});
*/
Ext.define('SeamlessC2.view.Datasource.DatasourceView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.datasource_view',
    id:'datasource_view',
    
    width:160,
    height:300, 
    layout: {
        type: 'vbox'
    },
    items: [
    {
        xtype: 'datasource_treeview',
        width:160,
        height:275
    },
    {
        xtype:'button',
        id:'add_datasource_btn',
        text:'Add datasource',
        height:25,
        width:160,
        handler: function(button,e){  
            scope:this,
            this.fireEvent('add_datasource_btn',1,this);
        }
    } 
    ]
});

