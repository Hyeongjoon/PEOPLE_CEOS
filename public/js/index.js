$(document).ready(function(){

var chart = new CanvasJS.Chart("chartContainer", {
		axisX: {
			labelFormatter: function (e) {
				return CanvasJS.formatDate( e.value, "DD MMM");
			}
		},
		axisY:{
			includeZero: false
		},
		data: [{
			type: "spline",
			dataPoints: [
			    { x: new Date(2010, 0, 3), y: 650 },
				{ x: new Date(2010, 0, 4), y: 700 },
				{ x: new Date(2010, 0, 5), y: 710 },
				{ x: new Date(2010, 0, 6), y: 658 },
				{ x: new Date(2010, 0, 7), y: 734 },
				{ x: new Date(2010, 0, 8), y: 963 },
				{ x: new Date(2010, 0, 9), y: 847 }
			]
		}]
	});
	chart.render();
});