
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
    system_widgets:[], //available widgets in the system
    /*refs: [{
        //wire up the btn to this controller
        selector: 'dashpicker_createbtn', //view alias
        ref: 'dashpickerCreate' //This will be used as part of the name of the getter that will be generated automatically getDashpickerCreate
    }],*/
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
    preInit:function(){
        //When the Dashboard is created and the page is redirected to this with the widget minimized. But a refresh fixes it.
        //So the dashboard_controller sets a value of new dashboard guid in user preference
        //if that value is there, then this widget refreshes page and clears the pref
        var st = this.getWidgetState();
        var ow= Ext.JSON.decode(OWF.getIframeId());        
        OWF.Preferences.getUserPreference(
        {
            namespace:'SeamlessC2.DashboardCreated', 
            name:'guid',
            onSuccess:function(pref){
                log("Pref:",pref);
                st.getWidgetState({
                    callback: function(state) {
                        log("State:",state);
                        if(state.x<0 && window.parent.location.href.indexOf(pref.value) > 0){
                            OWF.Preferences.setUserPreference(
                            {
                                namespace:'MITRE.DataSelector',
                                name:'guid',
                                value:'',
                                onSuccess:function(pref){
                                    window.parent.location.reload(true);
                                },
                                onFailure:function(a){
                                    error("Set Preferences",a);
                                }
                            }
                            );
                        }
                         
                        if(!state.active){
                            st.activateWidget({
                                callback:function(isactivated){
                                    log("Widget Activated",isactivated);
                                }
                            });                 
                        }           
                    }
                });
            }, 
            onFailure:function(a){
                error("Set Preferences",a);
            }
        }); 
    },
    init: function() {
        var self = this;
        this.preInit();
        this.tailor_controller = this.getController('Tailor');
        this.tailor_controller.init();
        this.smartcow_controller = this.getController('SmartCow');
        this.smartcow_controller.init();
        
        this.control({ // listeners            
            'dashpicker_createbtn': { //wire up the btn to this controller
                click: self.onDashboardCreate  
            }
        });
    
        if(OWF.Util.isRunningInOWF()) {
            this.updateOWFWidgetList(); // load the available widgets in system
            
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
        
        

            //   var st = this.getWidgetState();
            //   var ow= Ext.JSON.decode(OWF.getIframeId());

            /*    
        Ozone.eventing.getAllWidgets(function(widgetList){ //widgets on current frame
            log("WidgetList",widgetList);
            
           // var proxy = Ozone.eventing.importWidget(widgetList[1].id,function (prox) {
           //         var widget = proxy.sendMessage('{addr:null}');
                // widget.maximize();
                });
            
       // });*/
              
            log("Widget Ready");
            OWF.notifyWidgetReady();
        }
        log("Initialized SeamlessC2 Commander");
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
                    self.onDashboardStoreLoadFromPrefs(newdashs,self);                    
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
    onDashboardCreate:function(btn, e, eOpts){
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
    onDashboardStoreLoadFromPrefs:function (dashboards,self) {
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

        //get listing off all ozone widgets registered in the system
        //Launch Widget https://github.com/ozoneplatform/owf/wiki/OWF-7-Developer-Widget-Launcher-API
        OWF.Preferences.findWidgets({ //https://localhost:8443/owf/prefs/widget/listUserAndGroupWidgets
            searchParams: {
                widgetName: '' // show all  //widgetName:  "Channel Listener"  //universalName: 'org.owfgoss.owf.examples.NYSE', //defined in descriptor file
            },
            onSuccess: function(results) {
                var guid = null;
                log("#OWF widgets:"+results.length);
                if(results.length== 0){
                    log("No results");
                }else if(results.length== 1){
                    log("One Result: "+results[0].path);
                }else{
                    // for(var i=0;i<results.length;i++){log("Result: "+results[i].value.namespace,results[i]);};
                    log("system widgets",results);
                }
                self.system_widgets = results;
            } ,
            onFailure: function(err,status){
                log("getOWFWidgetList error! Status Code: " + status
                    + ". Error message: " + err);
            }
        });
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
                if(ret_funct) ret_funct(response);
            });
        }else{
            error("Launch Widget failed for guid:"+widget_guid,data);
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
