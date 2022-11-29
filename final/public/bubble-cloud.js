const height = 710,
    width = 400;

const svg = d3.select("#chart")  //Selecting id of chart. 
  .append("svg")
  .attr("viewBox", [0, 0, width, height])
  .append('g')
  .attr('transform', 'translate(0,0)');

var labels = svg.append('text');

Promise.all([
    d3.csv('../data/most_pop_genre_v2.csv')
]).then(([data]) => {
    for (let d of data) {
        d.count = +d.count
    }

    

    var radiusScale = d3.scaleSqrt().domain([10, 167]).range([5, 50]);

    const Array = data.map(d => radiusScale(d.count));

    var colors = d3.schemeGreens[data.length];
        
    var colors = d3.quantize(d3.interpolateGreens, data.length);

    var set_color = d3.scaleOrdinal(Array, colors);

    var simulation = d3.forceSimulation()
        .force('x', d3.forceX(width / 2).strength(0.05))
        .force('y', d3.forceY(height / 4).strength(0.05))
        .force('collide', d3.forceCollide(function(d) {
            return radiusScale(d.count) + 1
        }));

    var circles = svg.selectAll('.genre')
        .data(data)
        .enter().append('circle')
        .attr('class', 'genre')
        .attr('r', function(d) {
            return radiusScale(d.count)
        })
        .attr('fill', d => set_color(radiusScale(d.count)));
    
    var labels = svg.selectAll('.bubble-text')
        .data(data)
        .enter().append('text')
        .attr('class', 'bubble-text')
        .text(function(d) {
            return d.genre
        })
        .attr('font-size', function(d) {
            return 0.35 * radiusScale((d.count))
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