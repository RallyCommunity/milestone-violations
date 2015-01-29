Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
      
      
//      
//          this.add({
//              xtype: 'rallygrid',
//              columnCfgs: [
//                  'FormattedID',
//                  'Name',
//                  'Owner',
//                  'Severity',
//                  'Priority'
//              ],
//              context: this.getContext(),
//              enableEditing: true,
//              showRowActionsColumn: true,
//              storeConfig: {
//                  model: 'PortfolioItem'
//                
////                  filters: [
////                  {
////                    property: 'Milestones.ObjectID',
////                    value: null
////                  }
//              });
//      
//      

      this.store = Ext.create('Rally.data.wsapi.Store', {
        model: 'PortfolioItem',
        autoLoad:true,
        filters: [
//        {
//          property: 'Milestones.ObjectID',
//          value: null
//        },
        {
          property: 'FormattedID',
          value: 'F8142'
        }
        ],

        listeners: {
            load: function(store, data, success) {
              console.log(data);
            },
            scope: this
        },
        fetch: ['FormattedID', 'Milestones']
    });


            
    }
});
