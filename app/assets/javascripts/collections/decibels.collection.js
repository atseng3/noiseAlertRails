App.Collections.Decibels = Backbone.Collection.extend({

	initialize: function() {

	},

	time: 0,

	api: 'https://api.sendhub.com/v1/messages/?username=6504899461&api_key=a622558e9f2cc5134744c3892043aaf207eca250',

	cors_api_url: 'https://cors-anywhere.herokuapp.com/',

	doCORSRequest: function(options, printResult) {
	    var x = new XMLHttpRequest();
	    x.open(options.method, this.cors_api_url + options.url);
	    x.onload = x.onerror = function() {
	      printResult(
	        options.method + ' ' + options.url + '\n' +
	        x.status + ' ' + x.statusText + '\n\n' +
	        (x.responseText || '')
	      );
	    };
	    if (/^POST/i.test(options.method)) {
	      x.setRequestHeader('Content-Type', 'application/json');
	    }
	    x.send(options.data);
	},

	threshold: 20,

	payload: {
		"contacts": [ "+12179793193" ],
		"text": "It's noisy! The noise level is "
	},

	highPoints: [],

	model: App.Models.Decibel
});