
Ext.define('SeamlessC2.controller.Manager', {
    extend: 'Ext.app.Controller',

    views: [
    'Manager.MainView',
    'Manager.ToolbarView'
    ],
    
    //fields
    system_widgets:[], //available widgets in the system
    OWFuser:null,
    
    onLaunch: function() {//fires after everything is loaded
    
        log("SeamlessC2 Commander Launch Complete");
    },
    preInit:function(){
        var self=this;
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
        OWF.Preferences.getCurrentUser({
                onSuccess: function (response) {
                    if(response) {
                        self.OWFuser = response.currentUserName;
                        log("OWFUser",self.OWFuser);
                    }
                }
            });
    },        
    init: function() {
        var self = this;
        this.preInit();
        this.datasource_controller = this.getController('S2Datasource');
        this.datasource_controller.init();
        var listenerCfg = {//listen for launch_widget events
            'launch_widget':function(data){
                scope:self;
            self.launchWidgetCall(data)
            }
        };
        this.application.addListener(listenerCfg);
        
        //  this.smartcow_controller = this.getController('SmartCow');
        //  this.smartcow_controller.init();
        
        // We listen for events on toolbar
        this.control({
            //'#dash_btn': {click: self.onButton},
            'toolbar_view button':{
                toolbar_tab_selected:this.onTabSelection
            }
        });
            
        if(OWF.Util.isRunningInOWF()) {
            this.initOWF();
        }
        log("Initialized SeamlessC2 Commander");
    },
    
    onTabSelection: function(name) {
        log(" Tab Pressed: "+name);        
        if(name == 'dash'){
            this.launchWidgetCall({name:DASHBOARD_SELECTOR_WIDGET});
        }else if(name == 'datasource'){
             this.launchWidgetCall({name:DATA_SELECTOR_WIDGET});
        }else if(name == 'smartcow'){
            this.launchWidgetCall({name:SMARTCOW_WIDGET,data:{user:this.OWFuser }});
        }else if(name == 'alerts'){
            this.launchWidgetCall({name:ALERTS_WIDGET});
        }   
    },
    
   
    addMessage:function(str){
        $("#s2_messages-body").prepend(str);
    },
    //get listing off all ozone widgets registered in the system
    //update self.system_widgets
    updateOWFWidgetList:function(){
        var self = this;        //get listing off all ozone widgets registered in the system
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
    //prepares to launch a widget
    //i.e. {name:DASHBOARD_SELECTOR_WIDGET} makes sure the widget is available in system_widgets
    launchWidgetCall:function(data){
        var self=this;
        log("launch widget call:"+data.name);
        var launch = false;
        Ext.each(self.system_widgets,function(widget,id){
            if(widget.value.namespace == data.name){
                self.launchWidget(widget.id,data.name,data.data || {});
                launch=true;
            }
        });
        if(!launch){error("Lauch widget failed for widget:"+data.name,data);}
    },
    //lauches a widget
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
    //returns widget state
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
    },
    //setup OWF specifics
    initOWF:function(){
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
});
