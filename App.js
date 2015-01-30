Ext.define('MilestoneApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    
    launch: function() {
      this._loadMilestones();
      this._loadPortfolioItemTypes();
    },
   _loadMilestones: function() {
        Ext.create('Rally.data.WsapiDataStore', {
              autoLoad : true,
              limit : "Infinity",
              model : "Milestone",
              fetch : ["Name", "TargetDate"],
              listeners : {
                  scope : this,
                  load : function(store, data) {
                      this.milestones = store;
                      if(this.pfstore) this._onDataReady();
                  }
              }
          });
    },
    _loadPortfolioItemTypes: function() {
      //Usually PortfolioItem/Feature, but the name
      //could be changed in workspace so we need to 
      //dynamically determine lowest level
      
       var self = this;
       Ext.create('Rally.data.wsapi.Store', {
        model: 'TypeDefinition',
        autoLoad:true,
        filters: [{
          property: "TypePath",
          operator: "contains",
          value: "PortfolioItem/"
        }],
    
        listeners: {
            load: function(store, data, success) { 
              self._loadPortfolioItems(data[0].data.TypePath);
            }
        }
      });
    },
    _loadPortfolioItems: function(typePath) {  
        Ext.create('Rally.data.wsapi.TreeStoreBuilder').build({
            models: [typePath, "milestone"],
             root: {expanded: true},
            autoLoad: true,  
            enableHierarchy: true,
            context: null,
            filters: [
            {
              property: 'Milestones.ObjectID',
              operator: "!=",
              value: null
            }],
            listeners: {
                load: this._onDataLoaded,
                scope: this
            }
        }).then({
            success: this._onStoreBuilt.bind(this, typePath),
            scope: this
        });
    },
    _onDataLoaded: function(store, node, data) {
      this.pfstore = store;
      if(this.milestones) this._onDataReady();
      
                    
    },
    _onDataReady: function() {
      var self = this;
      _.map(this.pfstore.getTopLevelNodes(), function(record) {
        record.self.addField('DaysLate');
        record.self.addField('Milestone');
        record.self.addField('TargetDate');

        var milestone = self._findFirstMilestone(record.get("Milestones"));

        var plannedEndDate = record.get("PlannedEndDate");
        var targetDate = milestone.get("TargetDate");
        var targetDateString = moment(targetDate).format("MM/DD/YYYY");
        
        record.set("Milestone", milestone.data.Name);
        record.set("TargetDate", targetDateString);
        
        
        if( moment(plannedEndDate).diff(moment(targetDate)) > 0) {
          var daysLate = moment(plannedEndDate).diff(moment(targetDate), 'days') + 1;
          record.set("DaysLate", daysLate);
        } else {
          //record.remove();
        }
        
      });
    },
  
    _findFirstMilestone: function(pfmilestones) {
      var refs = _.pluck(pfmilestones._tagsNameArray, "_ref");
      
      var mdata = _.filter(this.milestones.data.items, function(milestone) { 
        return _.contains(refs, milestone.data._ref);
      });
      var sorted = _.sortBy(mdata, function(milestone) {
        return milestone.data.TargetDate;
      });
      return _.first(sorted);
    },
    _onStoreBuilt: function(modelName, store) {
        var modelNames = [modelName],
            context = this.getContext();
      
        store.model.addField({name: "Milestone"});
        store.model.addField({name: "TargetDate"});
        store.model.addField({name: "DaysLate"});
        var grid = this.add({
            xtype: 'rallygridboard',
            context: context,
            modelNames: modelNames,
            toggleState: 'grid',
            stateful: false,
            plugins: [
                {
                    ptype: 'rallygridboardfieldpicker',
                    headerPosition: 'right',
                    modelNames: modelNames,
                    stateful: true,
                    stateId: context.getScopedStateId('milestone-app')
                }
            ],
            gridConfig: {
                store: store,
                expandAllInColumnHeaderEnabled: true,
                columnCfgs: [
                    'Name',
                    'Project',
                    'Parent',
                    'Owner',
                    'PlannedEndDate',
                    'Milestones',
//                    {
//                      text: 'First Milestone',
//                      dataIndex: 'Milestone'
//                    },
                    {
                      text: 'First Target Date',
                      dataIndex: 'TargetDate'
                    },
                    {
                      text: 'Days Late',
                      dataIndex: 'DaysLate'
                    }
                    
                ],
                plugins: [
                {
                  ptype: "rallytreegridexpandedrowpersistence", 
                  enableExpandLoadingMask:false
                }]
                
            },
            height: this.getHeight()
        });
    }
  
});
