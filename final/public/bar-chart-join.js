Promise.all([
  d3.csv('../data/master_song_features_sorted.csv')
]).then(([data]) => {

  for (let d of data) {
    d.value = +d.value; 
  };
  
  const height = 320,
        width = 600
        margin = ({ top: 25, right: 200, bottom: 35, left: 100 });

  const colors = d3.schemeGreens[6][0];
  console.log(colors)

  const svg = d3.select("#chart2")
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);

  let y = d3.scaleBand()
      .domain(data.map(d => d.playlist_name)) 
      .range([margin.top, height - margin.bottom]);
      // .padding(0.1);

  let x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)]).nice()
      .range([margin.left, width - margin.right + 100]);

  svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom + 5})`) // move location of axis
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("font-size","6");
  
  svg.append("g")
      .attr("transform", `translate(${margin.left - 5},0)`)
      .attr('class', 'y axis')
      .call(d3.axisLeft(y))
      .selectAll("text")  
        // .style("text-anchor", "end")
        .attr("dx", "-0.5em")
        .attr("dy", "0.10em")
        .attr("font-size","5");

  allGroup = ['acousticness', 'danceability', 'energy', 'instrumentalness', 
  'liveness', 'loudness', 'speechiness', 'time_signature', 'valence']

  d3.select("#filter")
      .selectAll('myOptions')
      .data(allGroup)
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; });

  const bar = svg.append('g');

  function updateChart(m) {
      let filtered = data.filter(d => d.variable == m);

      // let y = d3.scaleBand()
      //   .domain(filtered.map(d => d.playlist_name)) 
      //   .range([margin.top, height - margin.bottom])
      //   .padding(0.1);
      y.domain(filtered.map(d => d.playlist_name))

      svg.selectAll("g.y.axis")
        .call(d3.axisLeft(y));
      // yAxis.transition().duration(1000).call(d3.axisLeft(y));
      
      bar.selectAll('g') //change
          .data(filtered)
          .join(
              enter => {
                let g = enter.append("g")
              
                g.append("rect")
                  .attr("fill", '#191414')
                  .attr("x", margin.left)
                  .attr("width", d => x(d.value))
                  .attr("y", d => y(d.playlist_name))
                  .attr("height", y.bandwidth() - 1) // this height is the height attr on element
                  .transition()
                  .duration(750);
              
              },
              update => {
                update.select("rect")
                  .transition()
                  .duration(750)
                  .attr("y", d => y(d.playlist_name))
                  .attr("width", d => x(d.value))
                  .attr("height", y.bandwidth())
                  .attr("x",  margin.left);

              
                update.select("text")
                  .text(d => d.value)
                  .transition()
                  .duration(750)
                  .attr("y", d => y(d.playlist_name));
              },
              exit => {
                exit.select("rect")
                  .transition()
                  .duration(750)
                  .attr("height", 0)
                  .attr("y", d => y(d.playlist_name))
                  .attr("width", d => x(d.value))
                  .attr("x",  margin.left);
              
                exit.select("text")
                  .text("");
              
                exit.transition()
                  .duration(750)
                  .remove();
              }
            );

      }

  updateChart('acousticness')
  d3.selectAll("select")
    .on("change", function(d){
      selectedGroup = this.value
      return updateChart(selectedGroup)
    });     
});





// Promise.all([
//     d3.csv('../data/master_song_features.csv')
// ]).then(([data]) => {
//     data.sort((a, b) => d3.descending(a.value, b.value));
//     for (let d of data) {
//         d.value = +d.value; 
//     };
//     const height = 320,
//           width = 500,
//           margin = ({ top: 25, right: 30, bottom: 220, left: 50 });

//     const svg = d3.select("#chart2")
//         .append("svg")
//         .attr("viewBox", [0, 0, width, height])

//     let x = d3.scaleBand()
//         .domain(data.map(d => d.playlist_name)) 
//         .range([margin.left, width - margin.right])
//         .padding(0.1);

//     let y = d3.scaleLinear()
//         .domain([0, 1]).nice()
//         .range([height - margin.bottom, margin.top]);

//     svg.append("g")
//         .attr("transform", `translate(0,${height - margin.bottom + 5})`)
//         // .call(d3.axisBottom(x));
//         .call(d3.axisBottom(x))
//         .selectAll("text")  
//             .style("text-anchor", "end")
//             .attr("dx", "-.8em")
//             .attr("dy", ".15em")
//             .attr("transform", "rotate(-65)" );

//     svg.append("g")
//         .attr("transform", `translate(${margin.left - 5},0)`)
//         .call(d3.axisLeft(y));


//         // -width + margin.right + margin.left

    
//     allGroup = ['acousticness', 'danceability', 'energy', 'instrumentalness', 
//     'liveness', 'loudness', 'speechiness', 'time_signature', 'valence']

//     d3.select("#filter")
//         .selectAll('myOptions')
//         .data(allGroup)
//         .enter()
//         .append('option')
//         .text(function (d) { return d; }) // text showed in the menu
//         .attr("value", function (d) { return d; })

//     const bar = svg.append('g');
    
//     function updateChart(m) {
//         const filtered = data.filter(d => d.variable == m);
//         // filtered.sort((a, b) => b.value - a.value);
//         // y.domain([0, d3.max(filtered, d => d.value)]).nice()
//         // yAxis.transition().duration(1000).call(d3.axisLeft(y))

//         bar.selectAll('g')
//             .data(filtered)
//             .join(
//                 enter => {
//                   let g = enter.append("g")
                
//                   g.append("rect")
//                     .attr("fill", '#377eb8')
//                     .attr("x", d => x(d.playlist_name))
//                     .attr("width", x.bandwidth()) // this width is the width attr on the element
//                     .attr("y", d => y(d.value))
//                     .attr("height", d => y(0) - y(d.value)) // this height is the height attr on element
//                     .transition()
//                     .duration(750)
                
//                 },
//                 update => {
//                   update.select("rect")
//                     .transition()
//                     .duration(750)
//                     .attr("y", d => y(d.value))
//                     .attr("height", d => y(0) - y(d.value));
  
                
//                   update.select("text")
//                     .text(d => d.value)
//                     .transition()
//                     .duration(750)
//                     .attr("y", d => y(d.value));
//                 },
//                 exit => {
//                   exit.select("rect")
//                     .transition()
//                     .duration(750)
//                     .attr("height", 0)
//                     .attr("y", height - margin.bottom);
                
//                   exit.select("text")
//                     .text("");
                
//                   exit.transition()
//                     .duration(750)
//                     .remove();
//                 }
//               );

//         }

//     updateChart('acousticness')
//     d3.selectAll("select")
//       .on("change", function(d){
//         selectedGroup = this.value
//         return updateChart(selectedGroup)
//       });     
// });