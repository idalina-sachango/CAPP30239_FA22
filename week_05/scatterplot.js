// Setting global variables for height, width. margin
let height = 400,
    width = 600,
    margin = ({ top: 25, right: 30, bottom: 35, left: 40 });
// Selecting the ID of chart in the html page and appending an SVG to it. Adding a viewbox.
const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);
// Getting the data and ___ once you have the data

d3.csv('penguins.csv').then(data => {
  // Setting the x-scale; domain is the data (set of all possible values)
  // Range is the space it takes on teh page
  let x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.body_mass_g)).nice()
    .range([margin.left, width - margin.right]);

  // Setting the y-scale; domain is the data that will be used (set of all possible values)
  // range: extend of page taken up
  let y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.flipper_length_mm)).nice()
    .range([height - margin.bottom, margin.top]);

  // Creating x and y axes line 19-27
  // Tick's create horizontal/vertical lines
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .attr("class", "x-axis")
    .call(d3.axisBottom(x).tickFormat(d => (d/1000) + "kg").tickSize(-height + margin.top + margin.bottom))
    // Ticks here are vertical lines
  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("class", "y-axis")
    .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right))
    // Ticks are horizontal lines

  // Appending SVG element
  svg.append("g")
    .attr("fill", "black")
    .selectAll("circle")
    // Joining data to circles; circles are the shape of the data points we want. 
    .data(data)
    .join("circle")
    // cx/cy how we position circles from center for x and y
    .attr("cx", d => x(d.body_mass_g))
    .attr("cy", d => y(d.flipper_length_mm))
    // r = radius of dots will be 2
    .attr("r", 2)
    .attr("opacity", 0.75);

  // Selecting the body tag
  // To body tag append new div
  const tooltip = d3.select("body").append("div")
    //  Give div a class
    .attr("class", "svg-tooltip")
    
    // Append the two styles
    .style("position", "absolute")
    .style("visibility", "hidden");

  // Adding events
  // Select dots from scatter
  d3.selectAll("circle")
    // Wait until someone mouses over circle
    .on("mouseover", function(event, d) {
      // Select the circle you're on
      // Fill the circle with red
      d3.select(this).attr("fill", "red");
      tooltip
        // Set the tooltip to visisble 
        .style("visibility", "visible")
        // Show the specified data information at bottom of page
        .html(`Species: ${d.species}<br />Island: ${d.island}<br />Weight: ${d.body_mass_g/1000}kg`);
    })
    // Event gives info on cursor
    .on("mousemove", function(event) {
      tooltip
        // How far should the mouse move?
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
    })
    // When the mouse moves off the circle, what should we do
    .on("mouseout", function() {
      // Fill the circle back to black
      d3.select(this).attr("fill", "black");
      // Make the tooltip visibility back to hidden
      tooltip.style("visibility", "hidden");
    })
    
});