Ext.define('SeamlessC2.controller.S2Dashboard', {
    extend: 'Ext.app.Controller',
     stores: ['S2Dashboard'],
     models:['S2DashboardModel'],
     views: [
      'Dashboard.DashPickerView'
    ],
    
    //fields
    dashboards:[], // stored in preferences and loaded
   
    onLaunch: function() {//fires after everything is loaded
        //handle the load of the dashboards
        this.loadDashboardStore();
        log("Dashboard Controller Launch Complete");
    },
    
    init: function() {        
        var self=this;
        
        //listen for events
        this.control({
            'dashpicker_view': {
                itemclick: self.dashboardSelectHandler
            },
            'dashpicker_createbtn': { //wire up the btn to this controller
                click: self.onS2DashboardCreate  
            }
        });
        if(OWF.Util.isRunningInOWF()) {           
            // Retrieve saved state
            OWF.Preferences.getUserPreference({
                namespace: "MITRESeamlessC2",
                name: 'MITRE.SeamlessCommander.DashboardData',
                onSuccess: function (response) {
                    if(response.value) {
                        var data = OWF.Util.parseJson(response.value);
                        log("User Prefs - MITRE.SeamlessCommander.DashboardData",response);
                    }
                }
            });
            // Subscribe to channel
            OWF.Eventing.subscribe('org.mitre.seamlessc2commander.dashboard', function (sender, msg, channel) {
                log("Dashboard Message Recd",msg);
            });
        }       
        
        log("Initialized Dashboard Controller");    
    },
    loadDashboardStore:function(){
        var self=this;
        var onFailure = function(error) {
            error(error);
        };   
        //load existing dashboards in the system
        var onSuccess = function(obj) {//obj.success obj.results obj.data
            var existing_dashs = obj.data;
            log("OWF Dashboards", existing_dashs);
            
            //get the user list of dashboards this manages
            OWF.Preferences.getUserPreference({
                namespace: "MITRESeamlessC2",
                name: 'MITRE.SeamlessCommander.dashboards',
                onSuccess:function(response){   
                    var newdashs = []; 
                    if(response && response.value){//may be empty or not created
                        //need to remove those dashboards that  may have been removed
                        var user_dashs = OWF.Util.parseJson(response.value); //in user preferences               
                    
                        //see if current dashboard is in prefs
                        for (var i = 0; i < existing_dashs.length; i++) {
                            var exist_dash_guid = existing_dashs[i].guid;
                            for(var j=0;j<user_dashs.length;j++){
                                var user_dash_guid = user_dashs[j].guid;
                                if(user_dash_guid == exist_dash_guid)
                                    newdashs.push(user_dashs[j]);
                            }
                        }                       
                    }
                    self.onS2DashboardStoreLoadFromPrefs(newdashs,self);                    
                } ,
                onFailure:onFailure
            });
            
        };           
                
        Ozone.pref.PrefServer.findDashboards({
            onSuccess:onSuccess,
            onFailure:onFailure
        });
    /* if setup for loading from json file
        var store =  this.getDashboardStore();
        
         store.load({
            callback: this.onDashboardStoreLoad,
            scope: this
        });*/
        
    },
    //load in dynamic names for the dashboard menu from the store 
    /*
    onS2DashboardStoreLoad: function(records, operation, success) {
        var picker = Ext.getCmp("dashpicker_view");
        var self = this;
        Ext.each(records,function(record,id){
            log("Record:",record);
            picker.addDashboard({
                text:record.get('name'),
                checked: false,
                group: 'theme',
                checkHandler: self.dashboardSelectHandler,
                data:{
                    name:record.get('name'),
                    guid:record.get('guid')
                }
            });
        });       
        log("Dashboard view loaded",records);
    },*/
    onS2DashboardCreate:function(btn, e, eOpts){
        log("Dashboard Create");
        var widget = null;
        for(var i=0;i<this.system_widgets.length;i++){
            var w = this.system_widgets[i];
            if(w.value.namespace == DASHBOARDMAKER_WIDGET){
                widget = w;
                break;
            }
        };
        if(widget == null){
            Ext.MessageBox.alert("The " +DASHBOARDMAKER_WIDGET +" widget has not been loaded into the system.");//from environment.js
            return;
        }
        //launch it
        this.launchWidget(widget.path,"Dashboard Selector",{});
        
    },
    onS2DashboardStoreLoadFromPrefs:function (dashboards,self) {
        var dashguid = window.parent.location.href.replace(OWF.getContainerUrl()+"/#guid=","");
        if(dashboards) {
            
            self.dashboards = dashboards;            
            //see if current dashboard is in prefs
            var found=false;
            for(var i=0;i<dashboards.length;i++){
                var dash = dashboards[i];
                if(dash.guid == dashguid) found =true;
            }
            if(!found){
                //get the dashboard info
                self.dashboards.push({
                    name:window.parent.document.title,
                    guid:dashguid
                });
                self.saveDashboardToPrefs();//add to the list
            }
        }else{
            log("No dashboards in user preferences");           
            self.dashboards.push({
                name:window.parent.document.title,
                guid:dashguid
            });
            self.saveDashboardToPrefs();
        }
        
        //add to store
        Ext.each(self.dashboards,function(item,id){
            log("Record:",item);
            var d = Ext.create('SeamlessC2.model.S2DashboardModel', item);
            self.getS2DashboardStore().add(d);
        });
         var comp = Ext.getCmp("dashpicker_view");
         ;
        //this.onS2DashboardStoreLoad(store.data.items);
    },
    //they selected a view in the dashboard view
    
    dashboardSelectHandler :function(view, record, row, index, e, eOpts ){
        log('dashboard selected',record);
        
        //they selected a different dashboard, store some config info then relocate
        if(record.data && record.data.name){
            var url= OWF.getContainerUrl()+"/#guid=" + record.data.guid;
            log("New Dashboard URL:"+url);
            OWF.Preferences.setUserPreference(
            {
                namespace:'MITRESeamlessC2',
                name:'MITRE.SeamlessCommander.previousDashboard',
                value:record.data.guid,
                onSuccess:function(pref){
                    log("Set Preferences",pref);
                    //Ext.MessageBox.confirm('Confirm', 'Are you sure ?', function(btn){
                    //  if(btn === 'yes'){
                    window.parent.location.href= url ;
                    window.parent.location.reload(true);                                      
                },
                onFailure:function(a){
                    error("Set Preferences Error",a);
                }
            }
            );   
        }
    },
    saveDashboardToPrefs: function () {
        OWF.Preferences.setUserPreference({
            namespace:"MITRESeamlessC2",
            name: 'MITRE.SeamlessCommander.dashboards',
            value: OWF.Util.toString( this.dashboards ),
            onSuccess: function () {
                log("Save to prefs ok",arguments);
            },
            onFailure: function () {
                error("Save to prefs error",arguments)
            }
        });
    }
});


