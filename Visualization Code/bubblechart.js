let width = window.innerWidth, height = window.innerHeight - 200, sizeDivisor = 0.1, nodePadding = 2.5;

        let svg = d3.select("#dataviz")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        let color = d3.scaleSequential().domain([1,150]).interpolator(d3.interpolateViridis);

        let simulation = d3.forceSimulation()
            .force("forceX", d3.forceX().strength(.1).x(width * .5))
            .force("forceY", d3.forceY().strength(.1).y(height * .5))
            .force("center", d3.forceCenter().x(width * .5).y(height * .5))
            .force("charge", d3.forceManyBody().strength(-15));

        
        let csv = {}, tag, temp = {}, oldData;

        d3.csv("bigquery_data.csv", function(error, data) {
        if (error) throw error;
        
        oldData = data;

        data.forEach(function(d) {

            tag = d['tag'];

            if(csv[tag] == undefined) {
                    csv[tag] = +d['count'];
                } else {
                    csv[tag] += +d['count'];
            }
        });

        let csvlist = d3.entries(csv);

        csvlist.forEach(function(d) {
            d.value = +d.value;
            d.size = +d.value / sizeDivisor;
            d.size < 3 ? d.radius = 3 : d.radius = d.size;
            return d;
        });

        // sort the nodes so that the bigger ones are at the back
        csvlist = csvlist.sort(function(a,b) { return b.size - a.size; });

        //update the simulation based on the data
        simulation
            .nodes(csvlist)
            .force("collide", d3.forceCollide().strength(0.5).radius(function(d) { return d.radius + nodePadding; }).iterations(1))
            .on("tick", function(d){
                
                circle.attr("cx", function(d){ return d.x; })
                    .attr("cy", function(d){ return d.y; })
                
                text.attr("dx", function(d) { return d.x; })
                    .attr("dy", function(d) { return d.y; })

            });
        
        let node = svg.selectAll("circle")
                    .data(csvlist)
                    .attr("class", "node")
                    .enter().append("g")
                    .call(d3.drag()
                            .on("start", dragstarted)
                            .on("drag", dragged)
                            .on("end", dragended));
                            
        let circle = node.append("circle")
                        .data(csvlist)
                        .attr("r", function(d) { return d.radius; })
                        .attr("fill", function(d) { return color(d.index); })
                        .attr("cx", function(d){ return d.x; })
                        .attr("cy", function(d){ return d.y; });
        
        let text = node.append("text")
                    .attr("class", "text")
                    .data(csvlist)
                    .attr("dx", function(d) { return d.x; })
                    .attr("dy", function(d) { return d.y + d.size/5; })
                    .text(function(d) { return d.key; })
                    .style("font-size", function(d) {return d.size/2 > 8 ? d.size/2 : 8; })
                    .style("font-family", "Helvetica")
                    .style("text-anchor", "middle");

        });

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(.03).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(.03);
            d.fx = null;
            d.fy = null;
        }

        function update() {

            d3.csv("bigquery_data.csv", function(error, data) {
            if (error) throw error;
            
            if (data[data.length - 1].date  == oldData[oldData.length - 1].date ) {
                // console.log(data[data.length - 1].date);
                // console.log(data[oldData.length - 1].date);
                return;
            }

            oldData = data;
            console.log(csv);

            data.forEach(function(d) {

                tag = d['tag'];

                if(csv[tag] == undefined) {
                        csv[tag] = +d['count'];
                    } else {
                        csv[tag] += +d['count'];
                }
            });

            let csvlist = d3.entries(csv);

            csvlist.forEach(function(d) {
                d.value = +d.value;
                d.size = +d.value / sizeDivisor;
                d.size < 3 ? d.radius = 3 : d.radius = d.size;
                return d;
            });

            // sort the nodes so that the bigger ones are at the back
            csvlist = csvlist.sort(function(a,b) { return b.size - a.size; });
            // console.log(csvlist)

            //update the simulation based on the data
            simulation
                .nodes(csvlist)
                .force("collide", d3.forceCollide().strength(0.5).radius(function(d) { return d.radius + nodePadding; }).iterations(1))
                .on("tick", function(d) {
                    
                    circle.attr("cx", function(d){ return d.x; })
                          .attr("cy", function(d){ return d.y; })
                    
                    text.attr("dx", function(d) { return d.x; })
                        .attr("dy", function(d) { return d.y; })

                });
            
            node = svg.selectAll(".node")
                      .data(csvlist)
                      .transition();

            // node.exit().remove();
            // svg.selectAll("g").exit().remove();
            // svg.selectAll(".circle").exit().remove();

            node.enter().append("g")
                .attr("class", "node")
                .call(d3.drag()
                            .on("start", dragstarted)
                            .on("drag", dragged)
                            .on("end", dragended));
                            
            let circle = node.append("circle")
                .duration(750)
                .data(csvlist)
                .attr("r", function(d) { return d.radius; })
                .attr("fill", function(d) { return color(d.index); })
                .attr("cx", function(d){ return d.x; })
                .attr("cy", function(d){ return d.y; });
            
            let text = node.append("text")
                .attr("class", "text")
                .data(csvlist)
                .attr("dx", function(d) { return d.x; })
                .attr("dy", function(d) { return d.y + d.size/5; })
                .text(function(d) { return d.key; })
                .style("font-size", function(d) {return d.size/2 > 8 ? d.size/2 : 8; })
                .style("font-family", "Helvetica")
                .style("text-anchor", "middle");

            });

            function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(.03).restart();
            d.fx = d.x;
            d.fy = d.y;
            }

            function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
            }

            function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(.03);
            d.fx = null;
            d.fy = null;
            }

            }       
        let inter = setInterval(function() {update()}, 1000);