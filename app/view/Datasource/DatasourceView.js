Ext.define('SeamlessC2.view.Datasource.DatasourceTreeView', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.datasource_treeview',
    id:'datasource_treeview',
    title:'Datasources',
    store: 'S2Datasource',
    rootVisible: false
});

Ext.define('SeamlessC2.view.Datasource.DatasourceSelect', {
    extend: 'Ext.Panel',
    alias: 'widget.datasource_select',
    layout: {
        type: 'vbox',
        align: 'center'
    },
    border: false,
    items: [
    {
        html: "<div class='sourcePanel'>Tailor Data Source</div>",
        bodyStyle: "background: #DFE9F6; border: 0px;"
    },
    {
        xtype:'combobox',
        id:'tailor_combobox',
        title:'Tailor Sources',
        store: 'TailorSources',
        rootVisible: false,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'name'
    },
    {
        html: "<div class='sourcePanel'>Add URL Data Source</div>",
        bodyStyle: "background: #DFE9F6; border: 0px;"
    },
    {
        xtype: 'textfield',
        id:'urlInput',
        name: 'urlInput',
        label: "Web Address",
        hideLabel: 'true'
    //height: 40,
    },
    {
        xtype:'button',
        title:'Add Datasource',
        id:'add_datasource_btn',
        text:'Add datasource',
        height:25,
        width:160,
        handler: function(button,e){  
            var tf =  Ext.getCmp('urlInput');
            var datasource=null;
            if(tf.getValue()){
               datasource = {type:'URL',source:tf.getValue()};
            }else {  
                tf =  Ext.getCmp('tailor_combobox');
                if(tf.getValue()){
                    datasource = {type:'Tailor',source:tf.getValue()};
                }
            }
            if(datasource != null){
                scope:this,
                this.fireEvent('add_datasource_btn',datasource);
            }
            Ext.getCmp('datasource_view').items.items[0].expand();
        }
    }
    ]
});

Ext.define('SeamlessC2.view.Datasource.DatasourceView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.datasource_view',
    id:'datasource_view',
    
    width:160,
    height:300, 
    layout: {
        type: 'accordion'
    },
    items: [
    {
        title:'Datasources',
        xtype: 'datasource_treeview'
       
    },
    {
        title: 'Add Datasource',
        xtype:'datasource_select'
    }
    ]
});

