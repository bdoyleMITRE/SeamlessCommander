Ext.define('SeamlessC2.controller.S2Datasource', {
    extend: 'Ext.app.Controller',
    stores: ['S2Datasource'],
    views: ['Datasource.DatasourceView'],
    
    //fields
    datasources:[], // stored in preferences and loaded
   
    onLaunch: function() {//fires after everything is loaded
        //handle the load of the dashboards
        var store = this.loadDatasourceStore();
        log("Dashboard Controller Launch Complete");
    },
    
    init: function() {        
        var self=this;
        
        //listen for events
        this.control({
            'datasource_treeview': {itemclick: self.onTreeSelect            },
            'datasource_view button':{
                add_datasource_btn:this.onAddDatasourceBtn
            }
        });
        if(OWF.Util.isRunningInOWF()) {           
            // Retrieve saved state
            OWF.Preferences.getUserPreference({
                namespace: "MITRESeamlessC2",
                name: 'MITRE.SeamlessCommander.DatasourcePrefs',
                onSuccess: function (response) {
                    if(response.value) {
                        var data = OWF.Util.parseJson(response.value);
                        log("User Prefs - MITRE.SeamlessCommander.DatasourcePrefs",response);
                    }
                }
            });
            // Subscribe to channel of dataselector
            OWF.Eventing.subscribe('org.mitre.seamlessc2commander.dataselector', function(sender, msg, channel){
                scope:self,self.addDatasource(msg);
            });
        }
        log("Initialized Datasource Controller");    
    },
    onTreeSelect:function(row, record, item, index, e, eOpts){
      log("Tree row selected",record);  
    },
    onAddDatasourceBtn:function(){
        log("Add datasource btn pressed");
        this.application.fireEvent('launch_widget',{
            name:DATA_SELECTOR_WIDGET
        });//environment.js
    },
    addDatasource:function (data) {//name,type
        log("Add Datasource",data);
        
        //update the view
        var store = this.getS2DatasourceStore();
        var root = store.getRootNode();
        var newnode = {
            id: data.type,
            text: data.source,
            leaf: true
        };
        var parent = root.findChild('text',data.type);
        if(parent==null){
            var node = {//create the type folder
                id: data.type,
                text: data.type,
                children:[newnode],
                leaf: false
            };
            root.appendChild(node);
        }else{
            parent.appendChild(newnode);
        }
        root.expandChildren(true); // Optional: To see what happens
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
                if(response && response.value){//may be empty or not created
                    var datastore = self.getS2DatasourceStore();
                    var d = Ext.JSON.decode(response.value);                    
                    if(d) self.getS2DatasourceStore().setRootNode(d);
                }           
                
            } ,
            onFailure:onFailure
        });         
    },
    getTreeDataRecurse:function(node){
        var newnode = {
            //id:node.data.id,
            text:node.data.text,
            leaf:node.data.leaf
            };
        var self=this;
        if(node.childNodes && node.childNodes.length > 0){
            newnode.children=[];
            node.eachChild(function(child){
                newnode.children.push(self.getTreeDataRecurse(child));
            }); 
        }
        return newnode;
    },
    saveDatasourceToPrefs: function () {
       // var d = '{"text":"root","children":[            { "text": "detention", "leaf": true },            { "text": "homework",  "children": [                { "text": "book report", "leaf": true }            ] }        ]   }';
       // var data = Ext.JSON.decode(d);
        var store = this.getS2DatasourceStore();
        var root = this.getTreeDataRecurse(store.getRootNode());
        var data = Ext.JSON.encode(root);
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


