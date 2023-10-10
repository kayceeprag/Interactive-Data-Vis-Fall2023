/* CONSTANTS AND GLOBALS */
const width = 800, // Set your desired width
  height = 600, // Set your desired height
  margin = { top: 20, right: 30, bottom: 40, left: 40 }; // Adjust margins as needed

/* LOAD MOmA Distribution DATA */
d3.csv("../data/MoMA_distributions.csv", d3.autoType)
  .then(data => {
    // Creating an SVG container for the scatter plot
    const svg = d3.select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Define scales for x and y axes
    const xScale = d3.scaleLinear()
      .domain([d3.min(data, d => d["Length (cm)"]), d3.max(data, d => d["Length (cm)"])])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(data, d => d["Width (cm)"]), d3.max(data, d => d["Width (cm)"])])
      .range([height - margin.bottom, margin.top]);

    // Calculate quartiles for artist lifespan
    const artistLifespanValues = data.map(d => d["Artist Lifespan"]);
    const q1 = d3.quantile(artistLifespanValues, 0.25);
    const median = d3.median(artistLifespanValues);
    const q3 = d3.quantile(artistLifespanValues, 0.75);

    // Defining a custom scale for dot size based on artist lifespan quartiles
    const artistLifespanScale = d3.scaleThreshold()
      .domain([0, q1, median, q3, d3.max(artistLifespanValues)])
      .range([3, 6, 9, 12, 15]);

    // Color scale defination for gender
    const colorScale = d3.scaleOrdinal()
      .domain(["Male", "Female"])
      .range(["blue", "pink"]);

    // Create and append groups for each data point (circle + label)
    const groups = svg.selectAll("g")
      .data(data)
      .enter()
      .append("g");

    // Add circles to each group
    groups.append("circle")
      .attr("cx", d => xScale(d["Length (cm)"]))
      .attr("cy", d => yScale(d["Width (cm)"]))
      .attr("r", d => artistLifespanScale(d["Artist Lifespan"]))
      .attr("fill", d => colorScale(d["Gender"])) // Color based on gender
      .attr("opacity", 0.7); // Adjust dot opacity as desired

    // Add labels to each group
    groups.append("text")
      .attr("x", d => xScale(d["Length (cm)"]) + 5) // Adjust the x-position of the label
      .attr("y", d => yScale(d["Width (cm)"]) - 5) // Adjust the y-position of the label
      .text(d => d["Artist"]) // Use the artist name as the label text
      .attr("font-size", "10px") // Adjust font size as desired
      .attr("fill", "black"); // Adjust label color as desired

    // Add x and y axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);

    // Add axis labels if needed
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom / 2)
      .attr("text-anchor", "middle")
      .text("Length (cm)");

    svg.append("text")
      .attr("x", -height / 2)
      .attr("y", margin.left / 2)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Width (cm)");
  })
  .catch(error => {
    console.error("Error loading data:", error);
  });
