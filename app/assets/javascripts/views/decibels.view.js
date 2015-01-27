App.Views.Decibels = Backbone.View.extend({

	template: JST['decibels/index'],

	el: '#decibels-user-input',

	tagName: 'div',

	id: '',

	className: '',

	events: {
	    'submit form': 'submitForm'
	},

	submitForm: function(event) {
	    event.preventDefault();
	    
	},

	initialize: function () {
	    // this.listenTo(this.model, 'change', this.render);
	    this.render();
	},

	render: function () {
	    this.$el.html(this.template());
	}
});