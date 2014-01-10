Ext.define('SeamlessC2.store.S2Dashboard', {
    extend: 'Ext.data.Store',
    model:'SeamlessC2.model.S2DashboardModel',
    autoLoad: true,
    storeId:'S2Dashboard',
 /*
    proxy: {
        type: 'ajax',
        api: {
            read: 'data/dashboards.json'
        },
        reader: {
            type: 'json',
            root: 'dashboards',
            successProperty: 'success'
        }
    }
    
}
 */
    data: [
        //{name: 'Sample',guid: 'f4a334dc-e334-46b5-af0b-e0e69ae359db'},
        //{name: 'Admin', guid: '8caf2e76-4f41-4bd7-a765-5764e792ff83'}
    ]
   
});