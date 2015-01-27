// I prefer naming the topmost namespace `App` for simplicity.
window.App = {
  Collections: {},
  Models: {},
  Routers: {},
  Views: {},
  Global: {},

  initialize: function () {
      // var parsed_data = JSON.parse($('#bootstrapped_data').html());
      // App.Models.user = new App.Models.User(parsed_data.user, { parse: true });
      // App.Collections.user_subscriptions = new App.Collections.UserSubscriptions();
      // App.Collections.subscriptions = new App.Collections.Subscriptions(parsed_data.subscriptions, { parse: true });

      
      
      // App.Collections.users = new App.Collections.Users();
      // App.Collections.subscriptions = new App.Collections.Subscriptions();
      // App.Collections.user_subscriptions = new App.Collections.UserSubscriptions();
      // // App.Collections.users.fetch();
      // new App.Routers.AppRouter();
      console.log('hello from backbone!');
      Backbone.history.start();
  }  
};
$(App.initialize);