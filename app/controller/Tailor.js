Ext.define('SeamlessC2.controller.Tailor', {
    extend: 'Ext.app.Controller',

    stores: ['TailorRecommendations','TailorSources'],
    models:['TailorRecommendationsModel','TailorSourcesModel'],
    views: [
    //'Manager.MainView'
    ],
   
    onLaunch: function() {//fires after everything is loaded
        
        var tailordata =  this.getTailorSourcesStore();
        tailordata.load({
            callback: this.onTailorSourcesStoreLoad,
            scope: this
        });
        log("Tailor Controller Launch Complete");
    },
    
    init: function() {
        
        if(OWF.Util.isRunningInOWF()) {
           
            // -----------------------------------
            // Retrieve saved state
            // -----------------------------------

            OWF.Preferences.getUserPreference({
                namespace: "MITRESeamlessC2",
                name: 'MITRE.SeamlessCommander.TailorData',
                onSuccess: function (response) {
                    if(response.value) {
                        var data = OWF.Util.parseJson(response.value);
                        log("TailorData",response);
                    }
                }
            });
            
            
            // -----------------------------------
            // Subscribe to channel
            // -----------------------------------
            OWF.Eventing.subscribe('org.mitre.seamlessc2commander.tailor', function (sender, msg, channel) {
                log("Tailor Message Recd",msg);
            });

            var self = this;
           
        
        }
        log("Initialized Tailor Controller");
    },
    //
    onTailorSourcesStoreLoad: function(records, operation, success) {       
        log("TailorSourcesStoreLoad",records);
    }
});
