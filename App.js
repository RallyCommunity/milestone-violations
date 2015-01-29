Ext.define('CustomApp', {
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
            autoLoad: true,  
            enableHierarchy: false,
            filters: [
            {
              property: 'Milestones.ObjectID',
              value: null
            }
           ]
        }).then({
            success: this._onStoreBuilt,
            scope: this
        });
    },
   _onStoreBuilt: function(store) {
        this.add({
            xtype: 'rallytreegrid',
            context: this.getContext(),
            store: store,
            columnCfgs: [
                'FormattedID',
                'Name',
                'Owner',
                'PlannedEndDate',
                'c_TShirtSize ',
                'Milestones'
            ]
        });
   }
  
});
