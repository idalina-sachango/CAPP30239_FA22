Promise.all([
    d3.csv('../data/master_gen_info.csv')
]).then(([data]) => {
  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "svg-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden");
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/dot-plot
    function DotPlot(data, {
        x = ([x]) => x, // given d in data, returns the (quantitative) value x
        y = ([, y]) => y, // given d in data, returns the (categorical) value y
        z = () => 1, // given d in data, returns the (categorical) value z
        r = 3.5, // (fixed) radius of dots, in pixels
        xFormat, // a format specifier for the x-axis
        marginTop = 30, // top margin, in pixels
        marginRight = 60, // right margin, in pixels
        marginBottom = 10, // bottom margin, in pixels
        marginLeft = 100, // left margin, in pixels
        width = 1000, // outer width, in pixels
        height = 840, // outer height, in pixels, defaults to heuristic
        xType = d3.scaleLinear, // type of x-scale
        xDomain, // [xmin, xmax]
        xRange = [marginLeft, width - marginRight], // [left, right]
        xLabel, // a label for the x-axis
        yDomain, // an array of (ordinal) y-values
        yRange, // [top, bottom]
        yPadding = 1, // separation for first and last dots from axis
        zDomain, // array of z-values
        colors, // color scheme
        stroke = "currentColor", // stroke of rule connecting dots
        strokeWidth, // stroke width of rule connecting dots
        strokeLinecap, // stroke line cap of rule connecting dots
        strokeOpacity, // stroke opacity of rule connecting dots
        duration: initialDuration = 250, // duration of transition, if any
        delay: initialDelay = (_, i) => i * 10, // delay of transition, if any
      } = {}) {
        data.sort((a, b) => {return d3.descending(a.release_date, b.release_date)});
        // Compute values.
        const X = d3.map(data, x);
        const Y = d3.map(data, y);
        const Z = d3.map(data, z);
        

        const track = d3.map(data, d => d.track_name);
        const artist = d3.map(data, d => d.artist_name);
        const album = d3.map(data, d => d.album_name);
        const release = d3.map(data, d => d.release_date);
        const track_pop = d3.map(data, d => d.popularity);
    
        // Compute default domains, and unique them as needed.
        if (xDomain === undefined) xDomain = d3.extent(X);

        if (yDomain === undefined) yDomain = Y;
        if (zDomain === undefined) zDomain = Z;
        yDomain = new d3.InternSet(yDomain);
        zDomain = new d3.InternSet(zDomain);
        console.log(zDomain)
        

        // Omit any data not present in the y- and z-domains.
        const I = d3.range(X.length).filter(i => yDomain.has(Y[i]) && zDomain.has(Z[i]));
    
        // Compute the default height.
        if (height === undefined) height = Math.ceil((yDomain.size + yPadding) * 16) + marginTop + marginBottom;
        if (yRange === undefined) yRange = [marginTop, height - marginBottom];
    
        // Chose a default color scheme based on cardinality.
        // if (colors === undefined) colors = d3.schemeViridis[zDomain.size];
        
        if (colors === undefined) colors = d3.quantize(d3.interpolateViridis, zDomain.size);
    
        // Construct scales and axes.
        const xScale = xType(xDomain, xRange);
        
        const yScale = d3.scalePoint(yDomain, yRange).round(true).padding(yPadding);
        const color = d3.scaleOrdinal(zDomain, colors);
        const xAxis = d3.axisTop(xScale).ticks(width / 80, xFormat);

        const svg = d3.select("#chart3")
            .append('svg')
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height]);
            // .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
    
        svg.append("g")
            .attr("transform", `translate(0,${marginTop})`)
            .call(xAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("y2", height - marginTop - marginBottom)
                .attr("stroke-opacity", 0.1))
            .call(g => g.append("text")
                .attr("x", width - marginRight)
                .attr("y", -22)
                .attr("fill", "currentColor")
                .attr("text-anchor", "end")
                .text(xLabel));
    
        const g = svg.append("g")
            .attr("text-anchor", "end")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
          .selectAll()
          .data(d3.group(I, i => Y[i]))
          .join("g")
            .attr("transform", ([y]) => `translate(0,${yScale(y)})`);
    
        g.append("line")
            .attr("stroke", stroke)
            .attr("stroke-width", strokeWidth)
            .attr("stroke-linecap", strokeLinecap)
            .attr("stroke-opacity", strokeOpacity)
            .attr("x1", ([, I]) => xScale(d3.min(I, i => X[i])))
            .attr("x2", ([, I]) => xScale(d3.max(I, i => X[i])));
    
        g.selectAll("circle")
          .data(([, I]) => I)
          .join("circle")
            .attr("cx", i => xScale(X[i]))
            .attr("fill", i => color(Z[i]))
            .attr("r", r)
            .on("mousemove", function (event, i) {
              tooltip
                .style("visibility", "visible")
                .html(`Song name: ${track[i]}
                      <br>Artist: ${artist[i]}
                      <br>Album: ${album[i]}
                      <br>Release Year: ${release[i]}
                      <br>Track Popularity: ${track_pop[i]}`)
                .style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
              d3.select(this).attr("fill", "goldenrod");
            })
            .on("mouseout", function (i) {
              tooltip.style("visibility", "hidden");
              d3.select(this).attr("fill", color(Z[i]));
            });
    
        g.append("text")
            .attr("dy", "0.35em")
            .attr("x", ([, I]) => xScale(d3.min(I, i => X[i])) - 6)
            .text(([y]) => y);
    
        return Object.assign(svg.node(), {
          color,
          update(yDomain, {
            duration = initialDuration, // duration of transition
            delay = initialDelay, // delay of transition
          } = {}) {
            yScale.domain(yDomain);
            const t = g.transition().duration(duration).delay(delay);
            t.attr("transform", ([y]) => `translate(0,${yScale(y)})`);
          }
        });
      }

      chart = DotPlot(data, {
        x: d => d.release_date,
        y: d => d.playlist_name,
        z: d => d.release_date,
        xFormat: "f",
        xLabel: "Year →"
      })
})