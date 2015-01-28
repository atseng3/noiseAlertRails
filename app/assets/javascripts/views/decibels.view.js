App.Views.Decibels = Backbone.View.extend({

	template: JST['decibels/index'],

	el: '#decibels-user-input',

	tagName: 'div',

	id: '',

	className: '',

	threshold: '60',

	events: {
	    'submit form': 'submitForm',
	    'change form': 'validateForm',
	    'click #stop': 'stopInterval'
	},

	h: 300,

	w: 900,

	stopInterval: function(event) {
		event.preventDefault();
		clearInterval(this.collection.interval);
	},

	validateForm: function() {

	},

	submitForm: function(event) {
	    event.preventDefault();
	    var params = $(event.currentTarget).serializeJSON();

	    var phone = params.phone ? params.phone.match(/\d+/gi).join() : '';
	    debugger
	    if(params.threshold) {
	    	if(params.threshold > 1 || params.threshold < 0) {
				this.$el.parent().prepend('<div class="alert alert-danger" role="alert">This is not the right threshold format, please try again.</div>');
		    	$('.alert-danger').hide(4000);
		    } else {
		    	var scale = d3.scale.linear()
								.domain([0, 1])
								.range([15, this.h - 5]);
			    this.threshold = scale(params.threshold);
			    this.collection.threshold = params.threshold;
		    }
	    }
	    if(phone) {
	    	if(phone.length != 10) {
	    		this.$el.parent().prepend('<div class="alert alert-danger" role="alert">This is not the right phone format, please try again.</div>');
		    	$('.alert-danger').hide(4000);	
	    	} else {
	    		this.collection.payload['contacts'] = '+1' + params.phone;	
	    	}
	    }

	},

	initialize: function () {
		this.listenTo(this.collection, 'add', this.render);
		var h = 300;
		var w = 900;
		var barPadding = 1;
		this.svg = d3.select('#visualizer')
		                      .append('svg')
		                      .attr('width', w)
		                      .attr('height', h);
	    this.render();
	},

	render: function () {
		var dataset = _.pluck(this.collection.toJSON(), 'value')
		var h = this.h;
		var w = this.w;
		var barPadding = 1;
		var scale = d3.scale.linear()
							.domain([0, 1])
							.range([0, h]);
		// render audio bars
		this.svg.selectAll('rect').remove();
		var rects = this.svg.selectAll('rect')
		             .data(dataset)
		             .enter()
		             .append('rect')
		             .attr('x', function(d, i) {
		                return i * (w / dataset.length) + 30;
		             })
		             .attr('y', function(d) {
		                return h - scale(d) - 20;
		             })
		             .attr('width', w / dataset.length - barPadding)
		             .attr('height', function(d) {
		                return scale(d);
		             })
		             .attr('fill', function(d) {
		                return 'rgb(' + (d * 1000) + ', 0, 0)';
		             });
		// render threshold line
		this.svg.selectAll('line').remove();
		var line = this.svg.append('line')
						   .attr('x1', 0)
						   .attr('y1', this.h - this.threshold - 15)
						   .attr('x2', w)
						   .attr('y2', this.h - this.threshold - 15)
						   .attr('stroke', 'teal')
						   .attr('stroke-width', 2);
		// render axis
		var yScale = d3.scale.linear()
							 .domain([0, 1]).range([h - 20, 5]);
		var xScale = d3.scale.linear()
							 .domain([0, w]).range([30, w - 0 * 2]);
		this.svg.selectAll('g').remove();

		var xAxis = d3.svg.axis()
							.scale(xScale)
							.orient('bottom')
							.ticks(6);
		this.svg.append('g')
				.attr('class', 'axis')
				.attr('transform', 'translate(0, ' + (h - 20) + ')')
				.call(xAxis);

		var yAxis = d3.svg.axis()
							.scale(yScale)
							.orient('left')
							.ticks(9);
		this.svg.append('g')
				.attr('class', 'axis')
				.attr('transform', 'translate(30, 0)')
				.call(yAxis);

		// get where the focus is
		var focusedElement = $(':focus');
		focusedElementId = focusedElement.attr('id');

		// get input values
		var phoneVal = $('#phone').val();
		var thresholdVal = $('#threshold').val();

	    this.$el.html(this.template({
	    	decibels: this.collection,
	    	highest: this.collection.highPoints
	    }));

	    // put value back on input
	    $('#phone').val(phoneVal);
	    $('#threshold').val(thresholdVal);

	    // put focus back on input
	    var toBeFocused = $('#' + focusedElementId);
	    toBeFocused.focus();
	}
});