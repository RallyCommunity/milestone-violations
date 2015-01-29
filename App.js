Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {
        Ext.create('Rally.data.wsapi.TreeStoreBuilder').build({
            models: ['PortfolioItem/Feature'],
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
                //'ScheduleState',
                'Owner'
            ]
        });
    }
});
