Ext.define('MilestoneApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    
    launch: function() {
   
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
              self.loadPortfolioItems(data[0].data.TypePath);
            }
        }
      });
    },
    loadPortfolioItems: function(typePath) {    
        console.log('loading ' + typePath);
        Ext.create('Rally.data.wsapi.TreeStoreBuilder').build({
            models: [typePath],
             root: {expanded: true},
            autoLoad: true,  
            enableHierarchy: true,
            context: null,
            filters: [
            {
              property: 'Milestones.ObjectID',
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

      _.map(data, function(record) {
          record.self.addField('DaysLate');
          record.set('DaysLate', 10);
      });
    },
    _onStoreBuilt: function(modelName, store) {
        var modelNames = [modelName],
            context = this.getContext();
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
                    'Milestones',
                    {
                      text: 'Days Late',
                      dataIndex: 'DaysLate'
                    }
                    
                ],
                plugins: [
                {
                  ptype: "rallytreegridexpandedrowpersistence", 
                  enableExpandLoadingMask:false
                }], 
                listeners: {
                  afterrender: function(grid) {
                    //debugger;
                  },
                  scope: this
                }
            },
            height: this.getHeight()
        });
     // debugger;
    }
  
});
