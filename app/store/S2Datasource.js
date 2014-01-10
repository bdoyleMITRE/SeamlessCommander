Ext.define('SeamlessC2.store.S2Datasource', {
    extend: 'Ext.data.TreeStore',
    autoLoad: true,
    storeId:'S2Datasource',
     proxy: {
        type: 'memory'
    }
    
    /* proxy: {
        type: 'ajax',
       api: {
            read: 'data/treedata.json'
        }, 
        reader: {
            type: 'json',
            root: 'root',
            successProperty: 'success'
        }
    }*/
});
/*
    root: {
        expanded: true,
        children: [
            { text: "detention", leaf: true },
            { text: "homework", expanded: true, children: [
                { text: "book report", leaf: true },
                { text: "alegrbra", leaf: true}
            ] },
            { text: "buy lottery tickets", leaf: true }
        ]
    }
   */


/*
 Ext.define('SeamlessC2.store.S2Datasource', {
    extend: 'Ext.data.TreeStore',
    model:'SeamlessC2.model.S2DatasourceModel',
    autoLoad: true,
    storeId:'S2Datasource',
 
 
    data: [
        //{name: 'Sample',guid: 'f4a334dc-e334-46b5-af0b-e0e69ae359db'},
        //{name: 'Admin', guid: '8caf2e76-4f41-4bd7-a765-5764e792ff83'}
    ]
   
});
 */