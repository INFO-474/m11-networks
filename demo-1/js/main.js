/* Create a simple network visualization, adapted from http://bl.ocks.org/jose187/4733747
*/

// Data to be visualized
var data = {
  "nodes":[
		{"name":"node0"},
		{"name":"node1"},
		{"name":"node2"},
		{"name":"node3"}
	],
	"links":[
		{"source":2,"target":1},
		{"source":0,"target":2}
	]
};

// Original data
var data_copy = $.extend(true, {}, data);

// On load:
$(function() {
	var width = $('.container').width()/3,
    height = 300;

	var svg = d3.select("#vis").append("svg")
	    .attr("width", width)
	    .attr("height", height);

	var force = d3.layout.force()
	    .gravity(.05)
	    .distance(100)
	    .charge(-100)
	    .size([width, height]);

	force
			 .nodes(data.nodes)
			 .links(data.links)
			 .start();

	 var link = svg.selectAll(".link")
			 .data(data.links)
		 	 .enter().append("line")
			 .attr("class", "link")
		 	 .style("stroke-width", function(d) { return 5; });

	 var node = svg.selectAll(".node")
			 .data(data.nodes)
		 	 .enter().append("g")
			 .attr("class", "node")
			 .call(force.drag);

	 node.append("circle")
			 .attr("r","5");

	 node.append("text")
			 .attr("dx", 12)
			 .attr("dy", ".35em")
			 .text(function(d) { return d.name });

	 force.on("tick", function() {
		 link.attr("x1", function(d) { return d.source.x; })
				 .attr("y1", function(d) { return d.source.y; })
				 .attr("x2", function(d) { return d.target.x; })
				 .attr("y2", function(d) { return d.target.y; });

	 	 node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
 	 });

	 // Show the json object
	 $('#nodes').text('// Elements to be visualized \n' + JSON.stringify(data_copy.nodes, null, 2) + ';');
	 $('#links').text('// Relationships visualized \n' +JSON.stringify(data_copy.links, null, 2) + ';');
	 prettyPrint()

});
