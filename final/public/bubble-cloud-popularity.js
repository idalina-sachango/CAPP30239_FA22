Promise.all([
    d3.csv('../data/playlist_avg_popularity_v2.csv')
]).then(([data]) => {
    for (let d of data) {
        d.artist_popularity = +d.artist_popularity
    }
    const height = 710,
    width = 400;

    const Array = data.map(d => d.artist_popularity);

    var colors = d3.schemeGreens[data.length];
        
    var colors = d3.quantize(d3.interpolateGreens, data.length);

    var set_color = d3.scaleOrdinal(Array, colors);

    const svg = d3.select("#chart4")  //Selecting id of chart. 
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .append('g')
      .attr('transform', 'translate(0,0)');

    var labels = svg.append('text');

    var radiusScale = d3.scaleSqrt().domain([17, 73]).range([2, 25])

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
            return radiusScale(d.artist_popularity)
        })
        .attr('fill', d => set_color(d.artist_popularity));
    
    var labels = svg.selectAll('.bubble-text-pop')
        .data(data)
        .enter().append('text')
        .attr('class', 'bubble-text-pop')
        .text(function(d) {
            return d.playlist_name
        })
        .attr('font-size', function(d) {
            return 0.30 * radiusScale(d.artist_popularity)
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