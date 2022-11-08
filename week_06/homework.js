// By race
let height = 600,
    width = 1000,
    margin = ({ top: 30, right: 50, bottom: 50, left: 30 })
    innerWidth = width - margin.left - margin.right;

d3.csv('police_killings_race_count.csv').then(data => {

  let race = new Set();

  for (let d of data) {
    d.total = +d.total;
    race.add(d.Race);
  }
  const svg = d3.select("#chart1")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

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


    g.append("path")
      .datum(rData)
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("d", line)

    let lastEntry = rData[rData.length - 1];

    g.append("text")
      .text(r)
      .attr("x", x(lastEntry.Month) + 3)
      .attr("y", y(lastEntry.total))
      .attr("dominant-baseline", "middle")
      .attr("fill", "#999");
  }
  
});

/* Bar chart for manner of death */

d3.csv("police_killings_manner_race.csv").then(data => {

    for (let d of data) {
        d.total = +d.total; 
    };


    const height = 600,
          width = 800,
          margin = ({ top: 25, right: 30, bottom: 35, left: 50 });

    let svg = d3.select("#chart2")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]); 
    
    let x = d3.scaleBand()
        .domain(data.map(d => d.Manner_of_death)) 
        .range([margin.left, width - margin.right])
        .padding(0.1);
    
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.total)]).nice()
        .range([height - margin.bottom, margin.top]);
    
    /* Update: simplfied axes */

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`)
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y));

    let bar = svg.selectAll(".bar") // create bar groups
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar");

    bar.append("rect") // add rect to bar group
        .attr("fill", "steelblue")
        .attr("x", d => x(d.Manner_of_death)) // x position attribute
        .attr("width", x.bandwidth()) // this width is the width attr on the element
        .attr("y", d => y(d.total)) // y position attribute
        .attr("height", d => y(0) - y(d.total)); // this height is the height attr on element
    
    bar.append('text') // add labels
        .text(d => d.total)
        .attr('x', d => x(d.Manner_of_death) + (x.bandwidth()/2))
        .attr('y', d => y(d.total) + 13)
        .attr('text-anchor', 'middle')
        .style('fill', 'white');

});

  
/* Bar chart for mental illness */
  
d3.csv("police_killings_mental_race.csv").then(data => {
  
    for (let d of data) {
        d.total = +d.total; //force a number
    };
  
    let race = new Set();
  
    const height = 600,
          width = 800,
          margin = ({ top: 25, right: 30, bottom: 35, left: 50 });

    let svg = d3.select("#chart2")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]); // for resizing element in browser
    
    let x = d3.scaleBand()
        .domain(data.map(d => d.Mental_illness)) // data, returns array
        .range([margin.left, width - margin.right]) // pixels on page
        .padding(0.1);
    
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.total)]).nice() // nice rounds the top num
        .range([height - margin.bottom, margin.top]); //svgs are built from top down, so this is reversed
    
    /* Update: simplfied axes */

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`) // move location of axis
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y));

    let bar = svg.selectAll(".bar") // create bar groups
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar");
    bar.append("rect") // add rect to bar group
        .attr("fill", "steelblue")
        .attr("x", d => x(d.Mental_illness)) // x position attribute
        .attr("width", x.bandwidth()) // this width is the width attr on the element
        .attr("y", d => y(d.total)) // y position attribute
        .attr("height", d => y(0) - y(d.total)); // this height is the height attr on element
    
    bar.append('text') // add labels
        .text(d => d.total)
        .attr('x', d => x(d.Mental_illness) + (x.bandwidth()/2))
        .attr('y', d => y(d.total) + 13)
        .attr('text-anchor', 'middle')
        .style('fill', 'white');
  
  });