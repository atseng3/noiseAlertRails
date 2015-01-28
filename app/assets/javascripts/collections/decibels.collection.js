App.Collections.Decibels = Backbone.Collection.extend({

	initialize: function() {

	},

	payload: {
		"contacts": [ "+12179793193" ],
		"text": "It's noisy!"
	},

	highPoints: [],

	model: App.Models.Decibel
});