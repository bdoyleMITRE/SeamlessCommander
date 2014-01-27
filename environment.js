//GLOBAL VARIABLES
var LOCAL_8443_URL = "https://localhost:8443/";
var LOCAL_8080_URL = "http://localhost:8080/";
var TAILOR_URL = LOCAL_8443_URL+"SeamlessCommander/data/";// "https://tinker.mitre.org:8443/";  URL to the TAILOR service
//uses proxy webapp from https://github.com/mitre/HTTP-Proxy-Servlet
var DASHBOARD_SELECTOR_WIDGET= "DashboardSelector"; // the dashboard selector namespace registered in OWF widgets
var DATA_SELECTOR_WIDGET= "DataSelector"; // the dataselector namespace registered in OWF widgets
var SMARTCOW_WIDGET="S2SmartCow";
var ALERTS_WIDGET="S2Alerts";

var DEBUG_LOCAL = true;
var LOGGER_ENABLED = false;
var CONSOLE_ENABLED = true;

Ext.Ajax.useDefaultXhrHeader = false; //for cross side scripting xxs http://stackoverflow.com/questions/10830334/ext-ajax-request-sending-options-request-cross-domain-when-jquery-ajax-sends-get
Ext.Loader.setConfig({
                enabled:true,
                disableCaching: false //debugging
            });

//OWF SETUP
var owf_running = OWF.Util.isRunningInOWF(); //https://github.com/ozoneplatform/owf/wiki/OWF-7-Developer-Creating-a-Widget                    
//The location is assumed to be at /<context>/js/eventing/rpc_relay.uncompressed.html if it is not set
OWF.relayFile = 'https://localhost:8443/owf/js/eventing/rpc_relay.uncompressed.html';
OWF.relayFile = 'owf/js/eventing/rpc_relay.uncompressed.html';

//LOGGING
if(LOGGER_ENABLED){
    var logger = OWF.Log.getDefaultLogger(); //popup window
    var appender = logger.getEffectiveAppenders()[0];
    // Enable logging 
    appender.setThreshold(log4javascript.Level.DEBUG);
    OWF.Log.setEnabled(LOG_ENABLED);
}

//Logger used through app
function log(str,obj){  
    str = "[S2Commander]:"+str;
    if(CONSOLE_ENABLED){
        if(typeof(console) !== 'undefined'){
            if(typeof(obj) !== 'undefined'){
                console.log(str,obj);
            }else{
                console.log(str);
            }
        }
    }
    if(LOGGER_ENABLED){
        logger.debug(str);
    }
    
}

function error(str,obj){  
    str = "[S2Commander](ERROR):"+str;
    if(CONSOLE_ENABLED){
        if(typeof(console) !== 'undefined'){
            if(typeof(obj) !== 'undefined'){
                console.log(str,obj);
            }else{
                console.log(str);
            }
        }
    }
    if(LOGGER_ENABLED){
        logger.error(str);
    }
    Ext.MessageBox.alert(str);
    throw(str);
}