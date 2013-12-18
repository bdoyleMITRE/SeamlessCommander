Ext.define('SeamlessC2.controller.SmartCow', {
    extend: 'Ext.app.Controller',
    // stores: ['TailorRecommendations','TailorSources'],
    // models:['TailorRecommendationsModel','TailorSourcesModel'],
    views: [
    //'Manager.MainView'
    ],
   
    onLaunch: function() {//fires after everything is loaded
        this.getUserTasks('mhowansky');
        log("SmartCow Controller Launch Complete");
    },
    
    init: function() {        
        if(OWF.Util.isRunningInOWF()) {           
            // Retrieve saved state
            OWF.Preferences.getUserPreference({
                namespace: "MITRESeamlessC2",
                name: 'MITRE.SeamlessCommander.SmartCowData',
                onSuccess: function (response) {
                    if(response.value) {
                        var data = OWF.Util.parseJson(response.value);
                        log("SmartCowData",response);
                    }
                }
            });
            // Subscribe to channel
            OWF.Eventing.subscribe('org.mitre.seamlessc2commander.smartcow', function (sender, msg, channel) {
                log("SmartCow Message Recd",msg);
            });
        }
        log("Initialized SmartCow Controller");
    },
    // Retrieve all assigned active tasks for a specified assignee
    getUserTasks:function (user,callback){
        var restURI = SMARTCOW_URL+"processInstances/tasks.json?assignee=" + user;
        
        Ext.Ajax.request({
            method: "GET",
            //withCredentials: true,
            //useDefaultXhrHeader: false,
            url: restURI,
            success: function(response){
                //log("Success! Response: ", response.responseText);
                var data =  Ext.JSON.decode(response.responseText);
                log("SmartCow UserTasks - ProcessInstance for "+user, data);
                /*
                var pIs = data.processInstances.processInstance
                //if there is only one instance (object) , convert it to an array
                if (pIs.length == undefined){
                    pIs = [pIs]
                }				
                pIs.forEach(function(pi){
                    var wfName  = pi.processDefinitionId
                    var taskName = pi.task.name
                });
       */
            },
            failure: function(response){
                log("getUserTasks failed for url:"+restURI, response);
            },
            callback: callback
           
        });
    },

    //Retrieve all active unassigned tasks for which a user is an eligible candidate. This includes both tasks for which the user is directly a candidate,
    // via the candidateUser element in the process XML,
    // or indirectly, via the user's membership in a group, as indicated by a candidateGroup element.
    getAvailableTasks:function(user){
        var restURI = SMARTCOW_URL+"processInstances/tasks.json?candidate=" + user
        $.ajax({
            url: restURI,
            contentType:"application/xml;",
            type:"GET",			
            dataType:"xml",
            success:function(data) {
                data = jQuery.parseJSON(xml2json(data).replace("undefined", ''))
                console.log(data);
				
				
                var pIs = data.processInstances.processInstance
                //if there is only one instance (object) , convert it to an array
                if ((pIs != undefined)){
                    if (pIs.length == undefined){
                        pIs = [pIs]
                    }
                    var tasksHTML = ""
				
                    pIs.forEach(function(pi){
                        var wfName  = pi.processDefinitionId
                        var taskName = pi.task.name
                        tasksHTML += (wfName + ": " + taskName + "<br>")
                    });
                    $( "#availTasks").html(tasksHTML)
					
                }
				
				
				
			   
            },
            error:function(jqXHR, textStatus, errorThrown ){
                console.log("failure");
                console.log(errorThrown);
                console.log(jqXHR);
                console.log(textStatus);
            }
        });


    }
});


