//defining constant for the visualization
let width2 = window.innerWidth - 50, height2 = window.innerHeight - 200, sizeDivisor2 = 0.1, nodePadding2 = 2.75, topTags2 = 12;

//defining svg canvas
let svg2 = d3.select("#dataviz2")
            .append("svg")
            .attr("width", width2)
            .attr("height", height2);

const tickDuration = 1000;

const margin2 = {
                top: 80,
                right: 0,
                bottom: 5,
                left: 0
               };
  
let title = svg2.append('text')
               .attr('class', 'title')
               .attr('y', 24)
               .html('Stack Overflow Topics');

let subTitle = svg2.append("text")
                  .attr("class", "subTitle")
                  .attr("y", 55)
                  .html("Number of questions, #");

let caption = svg2.append('text')
                 .attr('class', 'caption')
                 .attr('x', width2)
                 .attr('y', height2 - 5)
                 .style('text-anchor', 'end')
                 .html('Source: StackAPI - RealTime');

// let dateTime = new Date('12/10/2022 18:59:00');
// let dd = String(dateTime.getDate()).padStart(2, '0');
// let mm = String(dateTime.getMonth() + 1).padStart(2, '0'); //January is 0!
// let hh = String(dateTime.getHours()).padStart(2, '0');
// let MM = String(dateTime.getMinutes()).padStart(2, '0');
// let ss = String(dateTime.getSeconds()).padStart(2, '0');

// dateTime = mm + '/' + dd + ' ' + hh + ':' + MM + ':' + ss;
dateTime = '12/10 19:07:30';

let csv2 = {}, tag2, tags2 = [], dates2 = [], date2, barChart2 = [];

d3.csv("bigquery_data.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {

    tag2 = d['tag'];

    if(csv2[tag2] == undefined) {

      d.lastCount = 0;
      csv2[tag2] = {count: +d['count'], lastCount: 0, date: d['date']};
      d.colour = d3.hsl(Math.random()*360, 0.75, 0.75);

    } else {

      csv2[tag2].lastCount = csv2[tag2].count;
      csv2[tag2].count += +d['count'];
      csv2[tag2].date = d['date'];

      d.lastCount = csv2[tag2].lastCount;
      d.count = csv2[tag2].count;
      d.colour = d3.hsl(Math.random()*360, 0.75, 0.75);

    }
    
    date2 = d['date'];
    if (!tags2.includes(tag2)) tags2.push(tag2);
    if (!dates2.includes(date2)) {
      if (dates2.length == 0) dates2.push(date2);
      else {
        dates2.push(date2);
        for (let i = 0; i < tags2.length; i++){
          barChart2.push({date: dates2.at(-2), tag: tags2[i], count: csv2[tags2[i]].count,
            lastCount: csv2[tags2[i]].lastCount, colour: d3.hsl(Math.random()*360, 0.75, 0.75)});
        }
      }
    }
  });

  let dateTimeSlice = barChart2.filter(d => d.date == dateTime && !isNaN(d.count))
                              .sort((a, b) => b.count - a.count)
                              .slice(0, topTags2);

  dateTimeSlice.forEach((d, i) => d.rank = i);

  let x = d3.scaleLinear()
            .domain([0, d3.max(dateTimeSlice, d => d.count)])
            .range([margin2.left, width2 - margin2.right - 65]);

  let y = d3.scaleLinear()
            .domain([topTags2, 0])
            .range([height2 - margin2.bottom, margin2.top]);

  let xAxis = d3.axisTop()
                .scale(x)
                .ticks(width2 > 500 ? 5:2)
                .tickSize(-(height2 - margin2.top - margin2.bottom))
                .tickFormat(d => d3.format(',')(d));

  svg2.append('g')
     .attr('class', 'axis xAxis')
     .attr('transform', `translate(0, ${margin2.top})`)
     .call(xAxis)
     .selectAll('.tick line')
     .classed('origin', d => d == 0);

  svg2.selectAll('rect.bar')
     .data(dateTimeSlice, d => d.tag)
     .enter()
     .append('rect')
     .attr('class', 'bar')
     .attr('x', x(0) + 1)
     .attr('width', d => x(d.count) - x(0) - 1)
     .attr('y', d => y(d.rank) + 5)
     .attr('height', y(1) - y(0) - nodePadding2)
     .style('fill', d => d.colour);

  svg2.selectAll('text.label')
     .data(dateTimeSlice, d => d.tag)
     .enter()
     .append('text')
     .attr('class', 'label')
     .attr('x', d => x(d.count) - 8)
     .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1)
     .style('text-anchor', 'end')
     .html(d => d.tag);

  svg2.selectAll('text.countLabel')
     .data(dateTimeSlice, d => d.tag)
     .enter()
     .append('text')
     .attr('class', 'countLabel')
     .attr('x', d => x(d.count) + 5)
     .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1)
     .text(d => d3.format(',.0f')(d.lastCount));

  let dateTimeText = svg2.append('text')
                        .attr('class', 'dateTimeText')
                        .attr('x', width2 - margin2.right)
                        .attr('y', height2 - 25)
                        .style('text-anchor', 'end')
                        // .text(dateTime)
                        .call(halo, 10);
  
  let nextDateTime = 0;

  let ticker = d3.interval(e => {

    dateTimeSlice = barChart2.filter(d => d.date == dateTime && !isNaN(d.count))
                            .sort((a, b) => b.count - a.count)
                            .slice(0, topTags2);

    dateTimeSlice.forEach((d, i) => d.rank = i);
    // console.log(dateTimeSlice);

    x.domain([0, d3.max(dateTimeSlice, d => d.count)]); 

    svg2.select('.xAxis')
       .transition()
       .duration(tickDuration)
       .ease(d3.easeLinear)
       .call(xAxis);

    let bars = svg2.selectAll('.bar').data(dateTimeSlice, d => d.tag);

    bars.enter()
        .append('rect')
        .attr('class', d => `bar ${d.tag.replace(/\s/g,'_')}`)
        .attr('x', x(0) + 1)
        .attr( 'width', d => x(d.count) - x(0) - 1)
        .attr('y', d => y(topTags2 + 1) + 5)
        .attr('height', y(1) - y(0) - nodePadding2)
        .style('fill', d => d.colour)
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attr('y', d => y(d.rank)+5);

    bars.transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attr('width', d => x(d.count) - x(0) - 1)
        .attr('y', d => y(d.rank) + 5);

    bars.exit()
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attr('width', d => x(d.count) - x(0) - 1)
        .attr('y', d => y(topTags2 + 1) + 5)
        .remove();

    let labels = svg2.selectAll('.label')
                    .data(dateTimeSlice, d => d.tag);

    labels.enter()
          .append('text')
          .attr('class', 'label')
          .attr('x', d => x(d.count) - 8)
          .attr('y', d => y(topTags2 + 1) + 5 + ((y(1) - y(0)) / 2))
          .style('text-anchor', 'end')
          .html(d => d.tag)
          .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('y', d => y(d.rank) + 5 + ((y(1)-y(0)) / 2) + 1);


    labels.transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('x', d => x(d.count) - 8)
          .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1);

    labels.exit()
          .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('x', d => x(d.count) - 8)
          .attr('y', d => y(topTags2 + 1 ) + 5)
          .remove();

    let countLabels = svg2.selectAll('.countLabel').data(dateTimeSlice, d => d.tag);

    countLabels.enter()
               .append('text')
               .attr('class', 'countLabel')
               .attr('x', d => x(d.count) + 5)
               .attr('y', d => y(topTags2 + 1) + 5)
               .text(d => d3.format(',.0f')(d.count))
               .transition()
               .duration(tickDuration)
               .ease(d3.easeLinear)
               .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1);

    countLabels.transition()
               .duration(tickDuration)
               .ease(d3.easeLinear)
               .attr('x', d => x(d.count) + 5)
               .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1)
               .text(d=> d.count);

    countLabels.exit()
               .transition()
               .duration(tickDuration)
               .ease(d3.easeLinear)
               .attr('x', d => x(d.count) + 5)
               .attr('y', d => y(topTags2 + 1) + 5)
               .remove();

    // dateTimeText.html(dateTime);
    
    // dateTime = new Date(dateTime);
    // dateTime.setSeconds(dateTime.getSeconds() + 10);
    // let dd = String(dateTime.getDate()).padStart(2, '0');
    // let mm = String(dateTime.getMonth() + 1).padStart(2, '0');
    // let hh = String(dateTime.getHours()).padStart(2, '0');
    // let MM = String(dateTime.getMinutes()).padStart(2, '0');
    // let ss = String(dateTime.getSeconds()).padStart(2, '0');
    nextDateTime += 1;
    if (typeof dates2[nextDateTime] === 'undefined') {
      nextDateTime -= 1;
      dateTime = dates2[nextDateTime];
    }
    else {
      dateTime = dates2[nextDateTime];
    }

  }, tickDuration);

});

const halo = function(text, strokeWidth) {
                  text.select(function() { return this.parentNode.insertBefore(this.cloneNode(true), this); })
                      .style('fill', '#ffffff')
                      .style('stroke','#ffffff')
                      .style('stroke-width', strokeWidth)
                      .style('stroke-linejoin', 'round')
                      .style('opacity', 1);
};