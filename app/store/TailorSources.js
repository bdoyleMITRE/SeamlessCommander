Ext.define('SeamlessC2.store.TailorSources', {
    extend: 'Ext.data.Store',
    model:'SeamlessC2.model.TailorSourcesModel',
    autoLoad: true,

    proxy: {
        type: 'ajax',
        api: {
            read: TAILOR_URL+'tailorcore/sources.json' //environment.js global config file for widget
        },
        reader: {
            type: 'json',
            root: '',
            successProperty: 'success'
        }
    }
 /*
    data: [
        {name: 'Sample',guid: 'f4a334dc-e334-46b5-af0b-e0e69ae359db'},
        {name: 'Admin', guid: '8caf2e76-4f41-4bd7-a765-5764e792ff83'}
    ]
    */
});