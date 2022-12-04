Promise.all([
    d3.csv('../data/playlist_avg_popularity_final.csv')
]).then(([data]) => {
    for (let d of data) {
        d.artist_popularity = +d.artist_popularity
    }
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "svg-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden");

    const height = 710,
    width = 400;
    data.sort((a, b) => {return d3.descending(a.artist_popularity, b.artist_popularity)});
    console.log(data)

    const Array = data.map(d => d.artist_popularity);

    // var colors = d3.schemeGreens[data.length];
        
    var colors = d3.quantize(d3.interpolateGreens, data.length);

    var set_color = d3.scaleOrdinal(Array, colors);

    const svg = d3.select("#chart4")  //Selecting id of chart. 
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .append('g')
      .attr('transform', 'translate(0,0)');

    var labels = svg.append('text');

    var radiusScale = d3.scaleLinear().domain(d3.extent(data, d => d.artist_popularity)).range([5, 35])

    var simulation = d3.forceSimulation()
        .force('x', d3.forceX(width / 2).strength(0.05))
        .force('y', d3.forceY(height / 4).strength(0.05))
        .force('collide', d3.forceCollide(function(d) {
            return radiusScale(d.artist_popularity) + 1
        }))

    var circles = svg.selectAll('.popularity')
        .data(data)
        .enter().append('circle')
        .attr('class', 'popularity')
        .attr('r', function(d) {
            return 0.95 * radiusScale(d.artist_popularity)
        })
        .attr('fill', d => set_color(radiusScale(d.artist_popularity)))
        .on("mousemove", function (event, d) {
            let pop = d.artist_popularity;
            let p_name = d.playlist_name;
      
            tooltip
              .style("visibility", "visible")
              .html(`playlist name: ${p_name}
                    <br>average popularity of artists: ${pop}`)
              .style("top", (event.pageY - 10) + "px")
              .style("left", (event.pageX + 10) + "px");
            d3.select(this).attr("fill", "goldenrod");
          })
          .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
            d3.select(this).attr("fill", d => set_color(radiusScale(d.artist_popularity)));
          });
    
    var labels = svg.selectAll('.bubble-text-pop')
        .data(data)
        .enter().append('text')
        .attr('class', 'bubble-text-pop')
        .text(function(d) {
            return d.playlist_name
        })
        .attr('font-size', function(d) {
            return 0.25 * radiusScale(d.artist_popularity)
        })
        .attr('text-anchor', 'middle');        


    simulation.nodes(data)
        .on('tick', ticked)
      

    function ticked() {
        circles
            .attr('cx', function(d) {
                return d.x
            })
            .attr('cy', function(d) {
                return d.y
            });
        labels
            .attr('dx', function(d) {
                return d.x
            })
            .attr('dy', function(d) {
                return d.y
            })
            
            
            
    }



})