Ext.define('SeamlessC2.view.Dashboard.DashPickerView', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.dashpicker_view',
    id:'dashpicker_view',
    store: 'S2Dashboard',
    title:'Dashboards',
    hideHeaders: true,
    columns: [
        { header: 'Dashboards',  dataIndex: 'name' },
        {}
    ],
    width:50,
    height:40 
    /*
    layout:{
        type:'vbox'
    }
    
    items: [
    //populated in controller //onDashboardStoreLoad
   // {xtype:'dashpicker_createbtn'}    
    ],
    addDashboard:function(info){
        log("Add Dash to view",info); 
    }*/
});