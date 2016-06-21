// Draws a sinewave with two sliders for controlling the
// amplitude and frequency. Inspiration from 
// https://www.jasondavies.com/animated-trig/
function draw_input() {
    var outerWidth = 320, outerHeight = 300;

    var margin = {top: 50, right: 20, bottom: 20, left: 30},
        width = outerWidth - margin.left - margin.right,
        height = outerHeight - margin.top - margin.bottom;
        
    var x = d3.scale.linear().domain([-5, 15]).range([0, width]),
        y = x;

    var svg = d3.select("#input_wave").append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                    .attr("transform", "translate(" + x(1) + "," + margin.top + ")");
        
    amp_slider = d3.slider().scale(d3.scale.linear().domain([0,4]).range([0, 1])).axis(d3.svg.axis()).value(2);
    
    freq_slider = d3.slider().scale(d3.scale.log().domain([.1,1000]).range([0, 1])).axis(d3.svg.axis()
    .orient("bottom")
    .ticks(5, ",.1s")
    .tickSize(6, 0)).value(1);

    d3.select('#amp_slider').call(amp_slider.on("slide", function(evt, value) {
        d3.select(".wave").attr("d", d3.svg.line()
            .x(function(d, i) { return x(i * num_points) - x(0) })
            .y(function(d) { return y(value*d) }));
        }));
        
    d3.select('#freq_slider').call(freq_slider.on("slide", function(evt, value) {
        freq = value;
        }));

                 
    var num_points = Math.PI / 40;
        
    var amp = 2;
    var freq = 1;

    svg.attr("id", "sinwave")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + x(1) + "," + margin.top + ")")
      .selectAll("path")
        .data([d3.range(0, 5 * 2* Math.PI + num_points, num_points).map(Math.sin)])
      .enter().append("path")
        .attr("class", "wave")
        .attr("d", d3.svg.line()
          .x(function(d, i) { return x(i * num_points) - x(0) })
          .y(function(d) { return y(amp*d) }));
          
    var offset = -4*Math.PI, last = 0;

    var filler = function(width, height) {
      return d3.select("#input_wave svg").append("rect")
          .attr("class", "filler")
          .attr("width", width)
          .attr("height", height);
    }

    filler(x(1), height);
    
    d3.select("#input_wave svg").append("text")
          .text("Current:")
          .attr("transform", "translate(0," + (margin.top + 20) + ")")

    d3.timer(function(elapsed) {
        offset += (elapsed - last) * Math.pow(5, Math.log10(freq))/200;
        last = elapsed;
        if (offset > -2*Math.PI) offset = -4*Math.PI;
        d3.selectAll("#sinwave")
            .attr("transform", "translate(" + x(offset+5*Math.PI/4) + ",0)")
        });
}