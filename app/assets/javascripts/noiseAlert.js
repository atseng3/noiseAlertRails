// I prefer naming the topmost namespace `App` for simplicity.
window.App = {
  Collections: {},
  Models: {},
  Routers: {},
  Views: {},
  Global: {},

  initialize: function () {
      App.decibels = new App.Collections.Decibels();

      new App.Views.Decibels({
      	collection: App.decibels
      });
      
      Backbone.history.start();
  }  
};
$(App.initialize);