
Ext.define('SeamlessC2.controller.Manager', {
    extend: 'Ext.app.Controller',

    stores: ['Dashboard','Alerts'],
    models:['DashboardModel','AlertsModel'],
    views: [
    'Manager.MainView',
    'Manager.ToolbarView',
    'Manager.ContentView',
    'Manager.AlertsView',
    'Manager.DashPickerView'
    ],
    dashboards:[], // stored in preferences and loaded
    
    onLaunch: function() {//fires after everything is loaded
        //handle the load of the dashboards
        this.loadDashboardStore();
        
        var alerts =  this.getAlertsStore();
        alerts.load({
            callback: this.onAlertsStoreLoad,
            scope: this
        });
         log("SeamlessC2 Commander Launch Complete");
    },
    
    init: function() {
        var self = this;
        
        /*
        //load existing dashboards
        var onSuccess = function(obj) {//obj.success obj.results obj.data
            log("Dashboards", obj.results);
            if (obj.results > 0) {
                for (var i = 0; i < obj.results; i++) {
                    log(obj.data[i].name);
                }
            }
        };           
        var onFailure = function(error) {
            alert(error);
        };           
        Ozone.pref.PrefServer.findDashboards({
            onSuccess:onSuccess,
            onFailure:onFailure
        });
          */  
            
        /*this.control({
            'toolbar': {
        //itemdblclick: this.editUser
        }
        });*/
        //s.load();
        if(OWF.Util.isRunningInOWF()) {
            // -----------------------------------
            // Add behaviour if widget is in OWF
            // -----------------------------------    
            this.save = function () {
                OWF.Preferences.setUserPreference({
                    namespace: "MITRESeamlessC2",
                    name: 'MITRE.SeamlessCommander.widgetstate',
                    value: OWF.Util.toString( this.state ),
                    onSuccess: function () {
                    //console.log(arguments)
                    },
                    onFailure: function () {}
                });
            };
    
            // -----------------------------------
            // Check for launch data
            // -----------------------------------
            var launchData = OWF.Launcher.getLaunchData();
            if (launchData != null) {
                log("Launch Data",launchData);
                var data = OWF.Util.parseJson(launchData);
            }


            // -----------------------------------
            // Retrieve saved state
            // -----------------------------------

            OWF.Preferences.getUserPreference({
                namespace: "MITRESeamlessC2",
                name: 'MITRE.SeamlessCommander.widgetstate',
                onSuccess: function (response) {
                    if(response.value) {
                        var data = OWF.Util.parseJson(response.value);
                    }
                }
            });
            
            
            // -----------------------------------
            // Subscribe to channel
            // -----------------------------------
            OWF.Eventing.subscribe('org.mitre.seamlessc2commander', function (sender, msg, channel) {
                log("Widget Message Recd",msg);
            });


            // -----------------------------------
            // Setup receive intents
            // -----------------------------------
            // Registering for plot intent
            /* OWF.Intents.receive({
            action: 'plot',
            dataType: 'application/vnd.owf.sample.address'
        },function (sender, intent, msg) {
            Map.placeMarker(msg);
        });
        */


            // Registering for intent
            /*
        OWF.Intents.receive({
            action: 'navigate',
            dataType: 'application/vnd.owf.sample.addresses'
        },function (sender, intent, msg) {

            Map.getDirections(msg[0], msg[1]);

        });
         */




            // -----------------------------------
            // Add print button to widget chrome
            // -----------------------------------
            /*
        OWF.Chrome.insertHeaderButtons({
            items: [
                {
                    xtype: 'widgettool',
                    type: 'print',
                    itemId:'print',
                    tooltip:  {
                      text: 'Print Directions!'
                    },
                    handler: function(sender, data) {
                        Map.toggleMapPrintView();
                    }
                }
            ]
        });
*/



            // -----------------------------------
            // Clean up when widget closes
            // -----------------------------------

            var self = this;
            /* 
            this.widgetState = Ozone.state.WidgetState.getInstance({
                onStateEventReceived: function(sender, msg) {
                    var event = msg.eventName;
                    if(event === 'beforeclose') {
                         widgetState.removeStateEventOverrides({
                            event: [event],
                            callback: function() {
                              
                                OWF.Preferences.deleteUserPreference({
                                    namespace: OWF.getInstanceId(),
                                    name: 'widgetstate',
                                    onSuccess: function (response) {
                                        self.widgetState.closeWidget();
                                    }
                                });
                               
                            }
                        }); 

                    }
                    else if(event === 'activate' || event === 'show') {
                    // Map.el.style.display = 'block';
                    }
                    else if(event === 'hide') {
                    // Map.el.style.display = 'none';
                    }
                }
            });

            // override beforeclose event so that we can clean up
            // widget state data
            this.widgetState.addStateEventOverrides({
                events: ['beforeclose']
            });

            // listen for  activate and hide events so that we can
            // hide map object to fix a bug in Google Maps
            this.widgetState.addStateEventListeners({
                events: ['activate', 'hide', 'show']
            });

       */
        
            //this.updateOWFWidgetList(); // load the available widgets in system

            var st = this.getWidgetState();
            var ow= Ext.JSON.decode(OWF.getIframeId());

            /* 
        Ozone.eventing.getAllWidgets(function(widgetList){
            var proxy = Ozone.eventing.importWidget(widgetList[1].id,function (prox) {
                    var widget = proxy.sendMessage('{addr:null}');
                // widget.maximize();
                });
        });
          */      
            log("Widget Ready");
            OWF.notifyWidgetReady();
        }
        log("Initialized SeamlessC2 Commander");
    },
    
    loadDashboardStore:function(){
        /* if setup for loading from json file
        var store =  this.getDashboardStore();
        
         store.load({
            callback: this.onDashboardStoreLoad,
            scope: this
        });*/
        var self=this;
        OWF.Preferences.getUserPreference({
            namespace: "MITRESeamlessC2",
            name: 'MITRE.SeamlessCommander.dashboards',
            onSuccess:function(response){
                self.onDashboardStoreLoadFromPrefs(response,self);
            } ,
            onFailure:error
        });
    },
    //load in dynamic names for the dashboard menu from the store
    onDashboardStoreLoad: function(records, operation, success) {
        var picker_menu = Ext.getCmp("dashpicker_btn_menu");
        var self = this;
        Ext.each(records,function(record,id){
            log("Record:",record);
            picker_menu.add({
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
       
        log("Dashboard load",records);
    },
    onDashboardStoreLoadFromPrefs:function (response,self) {
        var dashguid = window.parent.location.href.replace(OWF.getContainerUrl()+"/#guid=","");
        if(response.value) {
            var data = OWF.Util.parseJson(response.value);
            self.dashboards = data;
            
            //see if current dashboard is in prefs
            var found=false;
            for(var i=0;i<data.length;i++){
                var dash = data[i];
                if(dash.guid == dashguid) found =true;
            }
            if(!found){
                //get the dashboard info
                self.dashboards.push({
                    name:window.parent.document.title,
                    guid:dashguid
                });
                self.saveDashboardToPrefs();
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
        var store =  this.getDashboardStore();
        Ext.each(self.dashboards,function(item,id){
            log("Record:",item);
            var d = Ext.create('SeamlessC2.model.DashboardModel', item);
            store.add(d);
        });
        this.onDashboardStoreLoad(store.data.items);
    },
    dashboardSelectHandler :function(menuitem,checked){
        //they selected a different dashboard, store some config info them relocate
        log("AlertSelected "+checked,menuitem);
        if(menuitem.data && menuitem.data.name){
            var url= OWF.getContainerUrl()+"/#guid=" + menuitem.data.guid;
            log("New Dashboard URL:"+url);
            OWF.Preferences.setUserPreference(
            {
                namespace:'MITRESeamlessC2',
                name:'MITRE.SeamlessCommander.previousDashboard',
                value:menuitem.data.guid,
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
    },
    //load in dynamic names for the dashboard menu
    onAlertsStoreLoad: function(records, operation, success) {
        var picker_menu = Ext.getCmp("alerts_btn_menu");
        var self = this;
        Ext.each(records,function(record,id){
            log("Record:",record);
            picker_menu.add({
                text:record.get('name'),
                checked: false,
                group: 'theme',
                checkHandler: self.alertSelectHandler,
                data:{
                    name:record.get('name'),
                    guid:record.get('guid')
                }
            });
        });
       
        log("Dashboard load",records);
    },
    alertSelectHandler :function(menuitem,success){
        log("AlertSelected "+success,menuitem);
    },
    updateOWFWidgetList:function(){
        var self = this;

        //Launch Widget https://github.com/ozoneplatform/owf/wiki/OWF-7-Developer-Widget-Launcher-API
        OWF.Preferences.findWidgets({ //https://localhost:8443/owf/prefs/widget/listUserAndGroupWidgets
            searchParams: {
                widgetName: '' // show all
            //widgetName:  "Channel Listener"
            //universalName: 'org.owfgoss.owf.examples.NYSE', //defined in descriptor file
            },
            onSuccess: function(results) {
                var guid = null;
                log("#OWF widgets:"+results.length);
                if(results.length== 0){
                    log("No results");
                }else if(results.length== 1){
                    log("One Result: "+results[0].path);

                }else{
                    for(var i=0;i<results.length;i++){
                        //log("Result: "+results[i].value.namespace,results[i]);
                        };
                    log("system widgets",results);
                }
                self.system_widgets = results;
                

                // self.launchWidget(results[0].id,"test",{});
                var widgetConfig = self.createWidgetConfig(results[23].value);
                widgetConfig = Ext.Object.merge(widgetConfig, {
                    width: 500,
                    height: 500,
                    x: 0,
                    y: 0,
                    active: true,
                    floatingWidget: true
                });
            //var widget = Ext.widget('widgetwindow', widgetConfig);
            // widget.show();
            // widget.model.get('minimized') && widget.minimize();
            // OWF.Container.State.registerHandler(widget.itemId);
            } ,
            onFailure: function(err,status){
                log("getOWFWidgetList error! Status Code: " + status
                    + ". Error message: " + err);
            }
        });
    },
    createWidgetConfig: function(model, instanceId, launchData) {
        var me = this,
        widgetCfg;

        instanceId = guid.util.guid();
        widgetCfg = Ext.JSON.decode($(window).attr("name")); //get existing info

        //var dash = OWF.getContainerName();
        var paneid = Ext.JSON.decode(OWF.getIframeId()).id;
        // var dashguid = OWF.getContainerName();
        //url

        widgetCfg =  Ext.Object.merge(widgetCfg,{
            id: instanceId,
            itemId: guid.util.guid(),

            isWidget: true,

            model: model, // can be widget defination or state model (page refresh)
            pane: document.body,
            dashboard: "Sample",

            paneGuid: paneid,
            dashboardGuid:"f4a334dc-e334-46b5-af0b-e0e69ae359db",
            uniqueId: instanceId,
            universalName: model.universalName,
            widgetGuid: model.widgetGuid || instanceId ,
            widgetStateContainer: this.widgetStateContainer || null,

            name: model.name,
            title: model.name,
            icon: encodeURI(decodeURI(model.headerIcon)),

            singleton: model.singleton,
            background: model.background,

            //     statePosition: ++this.statePositionCount,

            launchData: launchData || model.launchData || null,

            intentConfig: model.intentConfig || null,
            url:model.url,
            //    deferred: $.Deferred(),

            listeners: {}
        });


        return widgetCfg;
    },
    launchWidget:function(widget_guid,title,data,ret_funct){
        if(widget_guid != null){
            var dataString = OWF.Util.toString(data);
            OWF.Launcher.launch({
                guid: widget_guid,
                launchOnlyIfClosed: false,
                title: title,
                maximize:true,
                data: dataString
            }, function(response){
                log(response);
                var ow= Ext.JSON.decode(OWF.getIframeId());
                var guid = response.uniqueId;

                OWF.Preferences.getWidget({
                    widgetId: guid,
                    onSuccess: function(result) {
                        scope.guid = result.path;
                    },
                    onFailure: function(err) { /* No op */
                        log(err);
                    }
                });
                ret_funct(response);
            });
        }else{
            error("Launch Widget failed for guid:"+widget_guid,data);
        }
    },
    addSelectionListeners:function(listener){
        this.selection_listeners.push(listener);
    },
    notifySelectionListeners:function(recommendations,data){
        for(i in this.selection_listeners){
            var listener = this.selection_listeners[i];
            listener(recommendations,data);
        }
    },
    getWidgetState:function(){
        //close widget https://github.com/ozoneplatform/owf/wiki/OWF-7-Developer-Widget-State-API https://github.com/ozoneplatform/owf/blob/master/web-app/examples/walkthrough/widgets/EventMonitor.html
        var eventMonitor = {};
        var state =Ozone.state.WidgetState;
        eventMonitor.widgetEventingController = Ozone.eventing.Widget.getInstance();
        eventMonitor.widgetState = Ozone.state.WidgetState.getInstance({
            widgetEventingController: eventMonitor.widgetEventingController,
            autoInit: true,
            onStateEventReceived: function(){
            //handle state events
            }
        });

        return eventMonitor.widgetState;
    },
    close:function(){
        this.getWidgetState().closeWidget();
    }
});
