// On load
$(function() {
  // Read in data
  d3.json('data/les_mis.json', function(error, data) {

    // Settings for what graphical encodings to use
    var settings = {
        distance:false,
        color:false,
        opacity:false,
        width:false,
        charge:false
    };

    //Constants for the SVG
    var width = 800,
        height = 800;

    // Define a linear scale for the opacity of links
    var opacityScale = d3.scale.linear()
                      .domain([d3.max(data.links, function(d) {return d.value}), d3.min(data.links, function(d) {return d.value})])
                      .range([1,.02]);

    // Bring similar elements closer together
    var distanceScale = d3.scale.linear()
                      .domain([d3.max(data.links, function(d) {return d.value}), d3.min(data.links, function(d) {return d.value})])
                      .range([0,300]);

    // Define a linear scale for link width
    var widthScale = d3.scale.linear()
                      .domain([d3.max(data.links, function(d) {return d.value}), d3.min(data.links, function(d) {return d.value})])
                      .range([20, 1]);

    // Define a color scale for node group
    var color = d3.scale.category20();


    //Append a SVG to the body of the html page. Assign this SVG as an object to svg
    var svg = d3.select("#my-div").append("svg")
        .attr("width", width)
        .attr("height", height);

    // Declare force layout function
    var force = d3.layout.force() // function that returns a function
        .charge(-100) // set repulsion
        .linkDistance(function(d){
          return settings.distance == true ? distanceScale(d.value) : 100;
        }) // Distance between links varies by data
        .size([width, height]) // set width /height
        .nodes(data.nodes) // specify node data
        .links(data.links); // specify link data

    // Reusable function for drawing visual elements
    var draw = function() {

        // Bind link data
        var link = svg.selectAll(".link")
            .data(data.links);

        // Enter and append lines
        link.enter().append("line")
            .attr("class", "link")
            .style('opacity', function(d) {
              return settings.opacity == true ? opacityScale(d.value) : .7
            })
            .style("stroke-width", function (d) {
              return settings.width == true ? Math.sqrt(d.value) : 3;
            });

        // Bind node data
        var node = svg.selectAll(".node")
            .data(data.nodes);

        // Enter and append circles
        node.enter().append("circle")
            .attr("class", "node")
            .attr("r", 8)
            .attr('title', function(d){return d.name})
            .style("fill", function (d) {
                return settings.color == true ? color(d.group) : '#d3d3d3';
            })
            .style('opacity', 1)
            .call(force.drag);

        // In each simulation step, modify the position of nodes (circles) and links (lines)
        force.on("tick", function () {

            // Position links
            link.attr("x1", function (d) {
                return d.source.x;
            })
                .attr("y1", function (d) {
                return d.source.y;
            })
                .attr("x2", function (d) {
                return d.target.x;
            })
                .attr("y2", function (d) {
                return d.target.y;
            })
            .style('opacity', function(d) {
              return settings.opacity == true ? opacityScale(d.value) : .7
            })
            .style("stroke-width", function (d) {
             return settings.width == true ? widthScale(d.value) : 3;
            });

            // Position nodes
            node.attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            }).style("fill", function (d) {
                return settings.color == true ? color(d.group) : '#d3d3d3';
            });
        });

        // (re)start simulation
        force.start();
    };

    // Function to update a setting
    var change  = function(opt) {
        settings[opt] = settings[opt] == true ? false : true;
        draw();
    };

    // Apply bootstrap style to checkboxes and assign event handler
    $("[type='checkbox']").bootstrapSwitch().on('switchChange.bootstrapSwitch', function() {
        change($(this).attr('id'));
    });

    // Initialze draw function
    draw();

    // Apply tooltips
    $("circle").tooltip({
			'container': 'body',
			'placement': 'top'
		});
  });

});
