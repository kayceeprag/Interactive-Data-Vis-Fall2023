    const width = window.innerWidth * 0.9;
    const height = window.innerHeight * 0.7;
    const margin = { top: 20, bottom: 50, left: 60, right: 40 };
    
    Promise.all([
      d3.json("../data/world.json"),
      d3.csv("../data/MoMA_nationalities.csv", d3.autoType),
    ]).then(([geojson, nationalities]) => {
      const svg = d3
        .select("#container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
  const projection = d3.geoNaturalEarth1()
    .fitSize([width - margin.left - margin.right, height - margin.top - margin.bottom], geojson);

  const path = d3.geoPath(projection);

  // Extract the list of countries with artists
  const countriesWithData = new Set(nationalities.map(d => d.Nationality));

  // Append geojson path for all countries
  const countries = svg.selectAll("path")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("stroke", "black")
    .attr("fill", d => countriesWithData.has(d.properties.name) ? "blue" : "transparent")
    .attr("d", path);

  console.log(countries); // Check in the console if the paths are created

  // Check the number of items in the selection
  console.log(countries.size());

  // Check for any errors in the code
  console.error("Any error messages will appear here");
});
