
table5 = document.getElementById("html_table_count");
table6 = document.getElementById("html_table_title");

const width1 = 450, height1 = 450, margin1 = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(width1, height1) / 2 - margin1

let svg1 = d3.select("#piechart_my")
            .append("svg")
            .attr("width", width1)
            .attr("height", height1)
            .append("g")
            .attr("transform", "translate(" + width1 / 2 + "," + height1 / 2 + ")");

d3.csv("pred.csv", function(error, data) {
    if (error) throw error;

    var classification = data.map(function(d) {

        return {
            classification: d.class,
            question_title: d.title,
        }
        });

        
    var freqMap = {}, data_table_2 = [];
    data_table_2.push(["Title", "Classification"]);

    classification.forEach(function(w){
        
        data_table_2.push([w.question_title, w.classification]);
        w = (w.classification);

        if (!freqMap[w]) {
            freqMap[w] = 0;
        }
        freqMap[w] += 1;
    });

    var color = d3.scaleOrdinal()
                .domain(freqMap)
                .range(d3.schemeCategory10);

    var pie = d3.pie()
                .value(function(d) {return d.value; })


    var data_ready = pie(d3.entries(freqMap));
    
    data_values = Object.values(freqMap);
    
    var sum_values = 0; 

    data_values.forEach(function(w){
        sum_values = sum_values + w;
    });

    data_table = [];
    data_table.push(["Class", "Number"]);

    Object.keys(freqMap).sort().forEach(function(word) {
        data_table.push([word, freqMap[word]])
    });

    var arcGenerator = d3.arc()
                        .innerRadius(0)
                        .outerRadius(radius)

    var arcGenerator2 = d3.arc()
                        .outerRadius(radius + 120)
                        .innerRadius(0);

    mySlices = svg1.selectAll("path")
                    .data(data_ready);

    mySlices.enter().append("path")
            .merge(mySlices)
            .transition()
            .duration(750)
            .attr('d', arcGenerator)
            .attr('fill', function(d){ return(color(d.data.key)) })
            .text(function(d){return (d.data);})
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7);
    
    // Now add the annotation. Use the centroid method to get the best coordinates
    mySlices.enter().append("text")
            .transition()
            .duration(750)
            .text(function(d) {return d.data.key })
            .attr("transform", function(d) { return "translate(" + arcGenerator2.centroid(d) + ")";  })
            .style("text-anchor", "end")
            .style("font-size", 14);
    
    mySlices.enter().append("text")
            .transition()
            .duration(750)
            .text( function(d) {return (((d.data.value)/sum_values)*100).toPrecision(3) + '%';})
            .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
            .style("text-anchor", "middle")
            .style("font-size", 14);

    mySlices.exit().remove();

        for (let item of data_table) {
            let tr = table5.insertRow();
            for (let col of item) {
                col = col.toString()
                let td = tr.insertCell();
                td.innerHTML = col.replace(/(^"|"$)/g, "");
        }
    }
     
    
        for (let item of data_table_2) {
            let tr = table6.insertRow();
            for (let col of item) {
                col = col.toString()
                let td = tr.insertCell();
                td.innerHTML = col.replace(/(^"|"$)/g, "");
        }
    }

});


// function q() {

//     d3.csv("pred.csv", function(error, data) {
//         if (error) throw error;

//         var classification = data.map(function(d) {

//             return {
//               classification: d.pred,
//             }
//           });

          
//         var freqMap = {};
//         classification.forEach(function(w){
//             w = d3.values(w);
//             if (!freqMap[w]) {
//                 freqMap[w] = 0;
//             }
//             freqMap[w] += 1;
//         });

//         var data = freqMap;

//         var color = d3.scaleOrdinal()
//                     .domain(data)
//                     .range(d3.schemeCategory10);

//         var pie = d3.pie()
//                     .value(function(d) {return d.value; })


//         var data_ready = pie(d3.entries(data));
        
//         data_values = Object.values(data);
        
//         var sum_values = 0; 

//         data_values.forEach(function(w){
//             sum_values = sum_values + w;
//         });

//         data_table = [];
//         // data_table.push(["Class", "Number"]);


//         Object.keys(data).sort().forEach(function(word) {
//             data_table.push([word, data[word]])
//         });

//         var arcGenerator = d3.arc()
//                             .innerRadius(0)
//                             .outerRadius(radius)

//         var arcGenerator2 = d3.arc()
//                             .outerRadius(radius + 120)
//                             .innerRadius(0);

//         mySlices = svg1.selectAll("path")
//                         .data(data_ready);

//         mySlices.enter().append("path")
//                 .merge(mySlices)
//                 .transition()
//                 .duration(750)
//                 .attr('d', arcGenerator)
//                 .attr('fill', function(d){ return(color(d.data.key)) })
//                 .text(function(d){return (d.data);})
//                 .attr("stroke", "black")
//                 .style("stroke-width", "2px")
//                 .style("opacity", 0.7);
        
//         // Now add the annotation. Use the centroid method to get the best coordinates
//         mySlices.enter().append("text")
//                 .transition()
//                 .duration(750)
//                 .text(function(d) {return d.data.key })
//                 .attr("transform", function(d) { return "translate(" + arcGenerator2.centroid(d) + ")";  })
//                 .style("text-anchor", "end")
//                 .style("font-size", 14);
        
//         mySlices.enter().append("text")
//                 .transition()
//                 .duration(750)
//                 .text( function(d) {return (((d.data.value)/sum_values)*100).toPrecision(3) + '%';})
//                 .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
//                 .style("text-anchor", "middle")
//                 .style("font-size", 14);

//         mySlices.exit().remove();

//         let removeThis = document.getElementsByTagName('tr')[1];
//         removeThis.parentNode.removeChild(removeThis);

//             for (let item of data_table) {
//                 let tr = table5.insertRow();
//                 for (let col of item) { 
//                     col = col.toString()
//                     let td = tr.insertCell();
//                     td.innerHTML = col.replace(/(^"|"$)/g, "");
//             }
//             }
        
//         let removeThis2 = document.getElementsByTagName('tr')[1];
//         removeThis2.parentNode.removeChild(removeThis2);

//             for (let item of data_table) {
//                 let tr = table6.insertRow();
//                 for (let col of item) { 
//                     col = col.toString()
//                     let td = tr.insertCell();
//                     td.innerHTML = col.replace(/(^"|"$)/g, "");
//             }
//             }
                            

// });
// };

// let p = setInterval(function() { q() }, 2000);