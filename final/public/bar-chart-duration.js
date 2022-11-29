Promise.all([
    d3.csv('../data/playlist_avg_duration.csv')
]).then(([data]) => {
    const height = 320,
          width = 600;

    let svg = d3.select("#chart5")
        .append("svg")
        .attr("viewBox", [0, 0, width - 98, height + 90]); // for resizing element in browser

    data.sort((a, b) => {return d3.descending(a.duration_min, b.duration_min)});

    var format = d3.format(",.2f");

    const colors = d3.schemeSpectral[data.length][2];
    console.log(colors)


    for (let d of data) {
        d.duration_min = +d.duration_min; //force a number
        d.duration_min = format(d.duration_min)
    };

    let x = d3.scaleBand()
        .domain(data.map(d => d.playlist_name)) // data, returns array
        .range([margin.left, width - margin.right]) // pixels on page
        .padding(0.1);
    
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.duration_min)]).nice() // nice rounds the top num
        .range([height - margin.bottom, margin.top]); //svgs are built from top down, so this is reversed
    
    /* Update: simplfied axes */

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`) // move location of axis
        .call(d3.axisBottom(x))
        .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
    
    svg.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y));
        

    let bar = svg.selectAll(".bar") // create bar groups
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar");

    bar.append("rect") // add rect to bar group
        .attr("fill", '#191414')
        .attr("x", d => x(d.playlist_name)) // x position attribute
        .attr("width", x.bandwidth()) // this width is the width attr on the element
        .attr("y", d => y(d.duration_min)) // y position attribute
        .attr("height", d => y(0) - y(d.duration_min)); // this height is the height attr on element
    
    bar.append('text') // add labels
        .attr('class', 'text')
        .text(d => d.duration_min)
        .attr('font-size', 8)
        .attr('x', d => x(d.playlist_name) + (x.bandwidth()/2))
        .attr('y', d => y(d.duration_min) + 13)
        .attr('text-anchor', 'middle')
        .style('fill', 'white');

});
  
