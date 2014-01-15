Ext.define('SeamlessC2.controller.S2Datasource', {
    extend: 'Ext.app.Controller',
    
    data_source: {},//just one item
    
    onLaunch: function() {//fires after everything is loaded
        //handle the load of the dashboards
        var store = this.loadDatasourceStore();
        log("Datasource Controller Launch Complete");
    },
    
    init: function() {        
        var self=this;        
        if(OWF.Util.isRunningInOWF()) {           
            // Retrieve saved state
            OWF.Preferences.getUserPreference({
                namespace: "MITRESeamlessC2",
                name: 'MITRE.SeamlessCommander.DatasourcePrefs',
                onSuccess: function (response) {
                    if(response.value) {
                        //var data = OWF.Util.parseJson(response.value);
                        log("User Prefs - MITRE.SeamlessCommander.DatasourcePrefs",response);
                    }
                }
            });
            // Subscribe to channel of dataselector
            OWF.Eventing.subscribe('org.mitre.seamlessc2commander.data_widget_selector', function(sender, msg, channel){
                scope:self,self.addDatasource(msg);
            });
            
        }
        log("Initialized Datasource Controller");    
    },
    addDatasource:function (data) {//{type:'source',source:'tailor',value:data_source}
        log("Add Datasource",data);
        this.datasource= data;
        this.saveDatasourceToPrefs();
    },
    loadDatasourceStore:function(){
        var self=this;
      
        var onFailure = function(error) {
            error(error);
        }; 
        //get the user list of dashboards this manages
        OWF.Preferences.getUserPreference({
            namespace: "MITRESeamlessC2",
            name: 'MITRE.SeamlessCommander.DatasourceData',
            onSuccess:function(response){ 
                if(response && response.value){
                   this.datasource = Ext.JSON.decode(response.value); 
                   log("Datasource loaded from prefs",this.datasource);
                }                           
            },
            onFailure:onFailure
        });         
    },
    saveDatasourceToPrefs: function () {
       
        var data = Ext.JSON.encode(this.datasource);
        OWF.Preferences.setUserPreference({
            namespace:"MITRESeamlessC2",
            name: 'MITRE.SeamlessCommander.DatasourceData',
            value: data,
            onSuccess: function () {
                log("Save to prefs ok",arguments);
            },
            onFailure: function () {
                error("Save to prefs error",arguments)
            }
        });
    }
});


