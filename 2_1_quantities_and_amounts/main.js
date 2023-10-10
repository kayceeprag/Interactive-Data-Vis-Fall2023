/* CONSTANTS AND GLOBALS */
const width = 500; 
const height = window.innerHeight * 0.8;

const labels = ["American", "German", "British", "French", "Italian", "Japanese", "Swiss", "Dutch", "Russian", "Austrian"
]; // Add your labels here

/* LOADING THE MOMA DATA SET*/
d3.csv('../data/MoMA_topTenNationalities.csv', d3.autoType)
  .then(data => {
    console.log("data", data)

    /* SCALES */
    // xscale - linear, count
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Count)])
      .range([0, width]);

    // yscale - categorical, activity
    const yScale = d3.scaleBand()
      .domain(data.map(d => d.Nationality))
      .range([0, height]) // visual variable
      .paddingInner(0.2);

    // Color scale
    const colorScale = d3.scaleSequential()
      .domain([0, d3.max(data, d => d.Count)]) // Map the count values to colors
      .interpolator(d3.interpolateBlues); // Choose a color scale

    /* HTML ELEMENTS */
    // svg
    const svg = d3.select("#container")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // bars
    svg.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("width", d => xScale(d.Count))
      .attr("height", yScale.bandwidth())
      .attr("x", 0)
      .attr("y", d => yScale(d.Nationality))
      .attr("fill", d => colorScale(d.Count)); // Use the color scale for fill

    // Append labels
    svg.selectAll(".label")
      .data(labels)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", 10) // Adjust the x-coordinate as needed
      .attr("y", (d, i) => yScale(data[i].Nationality) + yScale.bandwidth() / 2)
      .text(d => d)
      .attr("dy", "0.35em") // Vertical alignment adjustment
      .style("font-size", "12px") // Adjust font size
      .style("fill", "black"); // Adjust text color
  });
