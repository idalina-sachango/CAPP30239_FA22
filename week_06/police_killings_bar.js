/* Bar chart for manner of death */

d3.csv("police_killings_manner_race.csv").then(data => {

    for (let d of data) {
        d.total = +d.total; //force a number
    };


    const height = 600,
          width = 800,
          margin = ({ top: 25, right: 30, bottom: 35, left: 50 });

    let svg = d3.select("#chart")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]); // for resizing element in browser
    
    let x = d3.scaleBand()
        .domain(data.map(d => d.Manner_of_death)) // data, returns array
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