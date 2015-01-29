Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
          this.add({
              xtype: 'rallygrid',
              columnCfgs: [
                  'FormattedID',
                  'Name',
                  'Owner',
                  'Severity',
                  'Priority',
                  'Milestones'
              ],
              context: this.getContext(),
              enableEditing: true,
              showRowActionsColumn: true,
              storeConfig: {
                  model: 'PortfolioItem',
                
                  filters: [
                  {
                    property: 'Milestones.ObjectID',
                    value: null
                  }]
              }
          });
    }
});
