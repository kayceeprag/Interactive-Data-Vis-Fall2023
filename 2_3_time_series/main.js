// CONSTANTS AND GLOBALS
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 60 };

const formatDate = d3.timeFormat("%Y"); // Use the year format for x-axis labels

// LOAD DATA
d3.csv("../data/Brent_Price.csv", d => {
  return {
    Price: +d.Price,
    Date: new Date(d.Date) // No need for d3.timeParse
  };
}).then(data => {
  console.log('data :>> ', data);

  // + SCALES
  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.Date))
    .range([margin.left, width - margin.right]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Price)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // CREATE SVG ELEMENT
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // BUILD AND CALL AXES
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(formatDate);

  const xAxisGroup = svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  const yAxis = d3.axisLeft(yScale);

  const yAxisGroup = svg.append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);

  // CREATE AREA CHART
  const area = d3.area()
    .x(d => xScale(d.Date))
    .y0(yScale(0)) // Set the baseline to the x-axis
    .y1(d => yScale(d.Price)); // Define the upper boundary

  svg.append("path")
    .datum(data)
    .attr("fill", "steelblue") // Fill the area with a color
    .attr("d", area); // Apply the area generator

  // Optional: Add a line on top of the area
  const line = d3.line()
    .x(d => xScale(d.Date))
    .y(d => yScale(d.Price));

  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);
});
