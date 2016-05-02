/* Create a simple network visualization, adapted from http://bl.ocks.org/jose187/4733747
*/

// Data to be visualized
var nodes = [
		{"id":"node0"},
		{"id":"node1"},
		{"id":"node2"},
		{"id":"node3"}
	];

var links = [
		{"source":0,"target":2}
	];

// On load:
$(function() {
	// Set width, height
	var width = $('.container').width()/3,
    height = 300;

	// Append svg
	var svg = d3.select("#vis").append("svg")
	    .attr("width", width)
	    .attr("height", height);

	// Set force function
	var force = d3.layout.force()
	    .gravity(.05)
	    .distance(100)
	    .charge(-100)
	    .size([width, height])
			.nodes(nodes)
			.links(links);



	// Create draw function
	draw = function() {
		force.nodes(nodes)
				 .links(links);

		// Links
		var link = svg.selectAll(".link")
									.data(links, function(d) { return d.source.id + "-" + d.target.id; })

		// Enter new links
		link.enter().insert('line')
									.attr("class", "link")
									.style("stroke-width", function(d) { return 5; });

		// Exit links
		link.exit().remove();

		// Bind data for nodes
		var node = svg.selectAll(".node")
									 .data(nodes, function(d) {return d.id;})

		// Enter g elements for entering nodes
		var gEnter = node.enter()
											.insert("g")
											.attr("class", "node")
											.call(force.drag);

		// Append circles to entering elements
		gEnter.append("circle")
											.attr("r","5")

    // Append text to entering elements
		gEnter .append("text")
					 .attr("dx", 12)
					 .attr("dy", ".35em")
					 .text(function(d) { return d.id });

    // Remove exiting nodes
		node.exit().remove();

		// On tick function for each step in the simulation
		force.on("tick", function() {
			link.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });

			node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		});

	  // Start the simulation
		force.start()
	};

  // Code that displays and controls nodes
	var codeNodes = CodeMirror(document.getElementById('node-code'), {
	  value: JSON.stringify(nodes, null, 2),
	  mode:  "javascript",
	});

	// Change event for node codemirror
	codeNodes.on('change', function(){
		try {
			var input = JSON.parse(codeNodes.getValue())

			// Get IDs from input
			var inputIds = input.map(function(d){
				return d.id
			})

			// Get IDs from nodes
			var nodeIds = nodes.map(function(d) {return d.id});

			// Add nodes that are in the input that aren't in the nodes
			inputIds.filter(function(d){return nodeIds.indexOf(d) == -1}).map(function(d) {
				nodes.push({id:d})
			});

			// Remove nodes that are not in the input
			nodes = nodes.filter(function(d){return inputIds.indexOf(d.id) != -1}).map(function(d){ console.log(d);return d});
			draw();
			$('#node-warning').stop().css('opacity', 0)
		} catch(e){
			$('#node-warning').animate({'opacity': 1})
		}
	});

	// Create codemirror for links
	var codeLinks = CodeMirror(document.getElementById('link-code'), {
	  value: JSON.stringify(links, null, 2),
	  mode:  "javascript",
	});


  // Change event for links
	codeLinks.on('change', function(){
		try {
			links = JSON.parse(codeLinks.getValue())
			$('#link-warning').stop().css('opacity', 0)
			draw();
    } catch(e){
			$('#link-warning').animate({'opacity': 1})
    }
	});

	// Initial draw
	draw();
});
