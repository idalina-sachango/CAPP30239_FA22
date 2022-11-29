const tooltip = d3.select("body")
  .append("div")
  .attr("class", "svg-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

const height = 610,
  width = 975;

const svg = d3.select("#chart")  //Selecting id of chart. 
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

// rellly important that our data has ID's for topojson
Promise.all([ // we are loading data and also the mesh file
  d3.csv("data/unemployment2020.csv"), //these id's are mapping to topojson
  d3.json("libs/counties-albers-10m.json") //this is our mesh file, we put this over topojson library. gives us the shape of the counties
]).then(([data, us]) => { // first value in array is data, us: comes from the counties file. these repsemnt the two data sets we passed into Promise.all
  const dataById = {}; 

  for (let d of data) {
    d.rate = +d.rate; //coerces it to be ?
    //making a lookup table from the array (unemployment data). creating a new object out of each ID and setting it to d
    dataById[d.id] = d;
  }

  const counties = topojson.feature(us, us.objects.counties); //using method of topjson library called feature. to build paths. we give it out mesh, which we named us
  // on the US there is objects.counties

  // Quantize evenly breakups domain into range buckets
  const color = d3.scaleQuantize() // setting up our color buckets depending on the data. scaleQuantize will break up domain into mult different ranges.
    .domain([0, 10]).nice() // saying 0% unemp to 10% unemployment. 0-10 will get individual color
    .range(d3.schemeBlues[9]); //using a blue color scheme

  const path = d3.geoPath(); // talking about out path element. telling D# your about to build a map

  d3.select("#legend") // being placed in line 20 in the html. line 25 is the source for the colors? i think of the legend
    .node()
    .appendChild( // node append child is the way we are appending legend. the child we are appending is hte legend
      Legend( // Legend function lives in D# color legend
        d3.scaleOrdinal( //running the observable code for teh legend
          ["1", "2", "3", "4", "5", "6", "7", "8", "9+"], // this is the same thing as above when we set the color.
          d3.schemeBlues[9]
        ),
        { title: "Unemployment rate (%)" } //legend title
      ));

  svg.append("g")
    .selectAll("path") // select all before doing a data join
    .data(counties.features) // do a data join on counties.features
    .join("path")
    .attr("fill", d => (d.id in dataById) ? color(dataById[d.id].rate) : '#ccc') // the color of the path. loop through and if there is data, use the 'rate' to determien what color
    // ? is an ifelse statement
    // # ccc if theres no data fill gray
    .attr("d", path)
    .on("mousemove", function (event, d) { //even tbring back data from browser like where a mouse is
      let info = dataById[d.id];
      tooltip
        .style("visibility", "visible")
        .html(`${info.county}<br>${info.rate}%`)
        .style("top", (event.pageY - 10) + "px") // positioning of the mouse
        .style("left", (event.pageX + 10) + "px");
      d3.select(this).attr("fill", "goldenrod");
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
      d3.select(this).attr("fill", d => (d.id in dataById) ? color(dataById[d.id].rate) : '#ccc');
    });
});