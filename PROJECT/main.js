// Adjusted SVG canvas dimensions with larger size
const margin = { top: 60, right: 40, bottom: 60, left: 60 };
const width = 600 - margin.left - margin.right; // Increased width
const height = 400 - margin.top - margin.bottom; // Increased height

// Create a grid container div for all charts
const gridContainer = d3.select('body').append('div')
  .style('display', 'grid')
  .style('grid-template-columns', 'repeat(2, 1fr)') // Adjusted for 2 columns
  .style('grid-template-rows', 'repeat(2, auto)') // Adjusted for 2 rows
  .style('gap', '15px');

// Select the tooltip element
const tooltip = d3.select("#tooltip");

// Load data from CSV file
d3.csv('../data/ArtworkMOMA.csv').then(function (data) {
  // Parse the date
  const parseTime = d3.timeParse('%Y');

  // Format the data
  data.forEach(function (d) {
    d.Year = parseTime(d.Year.toString());
    d.Count_Object = +d.Count_Object;
  });

  // Group the data by department
  const nestedData = d3.group(data, d => d.Department);

  // Set up color scale for different departments
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Iterate over each department and create a line chart
  nestedData.forEach(function (departmentData, departmentName) {
    // Create a container div for each line chart inside the grid
    const containerDiv = gridContainer.append('div');

    // Create the SVG canvas within the containerDiv
    const svg = containerDiv
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Append title for each chart
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2 + 10)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('text-decoration', 'underline')
      .text('No of Acquired ' + departmentName + ' Artworks Over Time');

    // Set up the scales
    const xScale = d3.scaleTime().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);

    // Set up the axis
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y'));
    const yAxis = d3.axisLeft(yScale);

    // Set the domains for this department
    xScale.domain(d3.extent(departmentData, function (d) { return d.Year; }));
    yScale.domain([0, d3.max(departmentData, function (d) { return d.Count_Object; })]);

    // Add the x-axis
    svg.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .append('text')
      .attr('x', width / 2)
      .attr('y', 45) // Adjusted y position for x-axis label
      .style('text-anchor', 'middle')
      .text('Year');

    // Add the y-axis
    svg.append('g').call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -50) // Adjusted y position for y-axis label
      .style('text-anchor', 'middle')
      .text('No of Artworks');

    // Function to show the tooltip on mouseover
    function mouseover(event, d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip.html("Year: " + d.Year.getFullYear() + "<br/>" + "Count: " + d.Count_Object)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
    }

    // Function to hide the tooltip on mouseout
    function mouseout(event, d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    }

    // Add circles for each data point and attach mouse events
    svg.selectAll(".dot")
      .data(departmentData)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", function (d) { return xScale(d.Year); })
      .attr("cy", function (d) { return yScale(d.Count_Object); })
      .attr("r", 5) // Radius of the circle
      .style("fill", color(departmentName))
      .on("mouseover", mouseover) // Attach mouseover event
      .on("mouseout", mouseout); // Attach mouseout event

    // Function to render lines and data points for this department
    function renderLinesAndPoints(data) {
      const line = d3.line()
        .x(function (d) { return xScale(d.Year); })
        .y(function (d) { return yScale(d.Count_Object); });

      svg.append('path')
        .data([data])
        .attr('class', 'line')
        .attr('d', line)
        .style('stroke', color(departmentName))
        .style('fill', 'none');
    }

    // Initial rendering of lines and data points for this department
    renderLinesAndPoints(departmentData);
  });
});
