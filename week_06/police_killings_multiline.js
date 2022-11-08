let height = 600,
    width = 1000,
    margin = ({ top: 30, right: 50, bottom: 50, left: 30 })
    innerWidth = width - margin.left - margin.right;

const svg = d3.select("#chart")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

d3.csv('police_killings_race_count.csv').then(data => {

  let race = new Set();

  for (let d of data) {
    d.total = +d.total;
    race.add(d.Race);
  }

  let x = d3.scaleLinear()
    .domain([1,12])
    .range([margin.left, width - margin.right]);

  let y = d3.scaleLinear()
    .domain([0,d3.max(data, d => d.total)])
    .range([height - margin.bottom, margin.top]);

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSize(-innerWidth));
    // .tickFormat(d => d + "%"));

  let line = d3.line()
    .x(d => x(d.Month))
    .y(d => y(d.total));
 
  for (let r of race) {
    let rData = data.filter(d => d.Race === r);

    let g = svg.append("g")
      .attr("class", "race")
      .on('mouseover', function () {
        d3.selectAll(".highlight").classed("highlight", false);
        d3.select(this).classed("highlight", true);
      });

    // if (country === "USA") {
    //   g.classed("highlight", true);
    // }

    g.append("path")
      .datum(rData)
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("d", line)

    let lastEntry = rData[rData.length - 1]; //last piece of data to position text x and y

    g.append("text")
      .text(r)
      .attr("x", x(lastEntry.Month) + 3)
      .attr("y", y(lastEntry.total))
      .attr("dominant-baseline", "middle")
      .attr("fill", "#999");
  }
  
});