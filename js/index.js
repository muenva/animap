(function (window) {
  var width = window.innerWidth - 10,
      height = window.innerHeight - 10,
      nodeColor = "#3A8F9B",
      highlight = "#B54545",
      strokeColor = "#F7ECDF",
      linkVisible = "visible",
      titleVisibility = "hidden",
      alreadySelected = false,
      myListVisible = false;

  var xScale = d3.scale.linear()
      .domain([0, width])
      .range([0, width]),
      yScale = d3.scale.linear()
      .domain([0, height])
      .range([height, 0]);

  function zoom() {
      svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
  }

  var svg = d3.select("body").append("svg:svg")
      .attr("width", width)
      .attr("height", height)
      .append("svg:g")
      .attr("id", "zoomableArea")
      .call(d3.behavior.zoom().x(xScale).y(yScale).scaleExtent([-1, 8]).on("zoom", zoom))
      .append("svg:g");

  svg.append('svg:rect')
      .attr('width', width + 10)
      .attr('height', height + 10)
      .attr("class", "overlay");

  var loading = svg.append("text")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text("simulating...");


  d3.json("js/anime.json", function(json) {
      var distanceScale = d3.scale.linear()
          .domain([1, d3.max(json.links, function(d) {
              return d.value;
          })])
          .range([100, 10]);

      var force = self.force = d3.layout.force()
          .nodes(json.nodes)
          .links(json.links)
          .gravity(.1)
          .linkDistance(function(d) {
              return distanceScale(d.value);
          })
          //.linkStrength( function(d) { return strengthScale(d.value); })
          .charge(-120)
          .size([width, height]);

      var strokeWidth = d3.scale.linear()
          .domain([1, d3.max(json.links, function(d) {
              return d.value;
          })])
          .range([0.1, 8]);

      var link = svg.selectAll(".link")
          .data(json.links)
          .enter().append("svg:g")
          .append("line")
          .attr("class", "link")
          .style("stroke", strokeColor)
          .style("stroke-width", function(d) {
              return strokeWidth(d.value);
          })
          .attr("visibility", linkVisible);

      var rankScale = d3.scale.linear()
          .domain([1, d3.max(json.nodes, function(d) {
              return d.rank;
          })])
          .range([3, 35]);

      var radius = function(d) {
          return rankScale(d.rank);
      }

      var node = svg.selectAll(".node")
          .data(json.nodes)
          .enter().append("svg:g")
          .attr("class", "node")
          .on("mouseover", mouseover)
          .on("mouseout", mouseout);

      node.append("svg:circle")
          .attr("r", radius)
          .style("fill", nodeColor)
          .attr("rel", "hide")
          .on("click", function(d) {
              return toggleInfo(this)
          })
          .attr("rank", function(d) {
              return d.id + 1;
          })
          .attr("nodeTitle", function(d) {
              return d.name;
          })
          .attr("cover", function(d) {
              return d.cover;
          })
          .attr("genres", function(d) {
              return d.genres;
          })
          .attr("description", function(d) {
              return d.description;
          });

      node.append("text")
          .attr("dx", -2)
          .attr("dy", -5)
          .attr("class", "titles")
          .attr("visibility", titleVisibility)
          .style("pointer-events", "none")
          .text(function(d) {
              return d.name
          })
          .append("title")
          .text(function(d) {
              return d.name;
          });


      function isConnected(first, second) {
        var linkedByIndex = {};
        json.links.forEach(function(d) {
          linkedByIndex[d.source.index + "," + d.target.index] = 1;
        });
        return linkedByIndex[first.index + "," + second.index]
        || linkedByIndex[second.index + "," + first.index]
        || first.index == second.index;
      }

      function fade(opacity) {
          return function(d) {
              node.style("opacity", function(o) {
                      thisOpacity = isConnected(d, o) ? 1 : opacity;
                      this.setAttribute('opacity', thisOpacity);
                      return thisOpacity;
                  });
              link.style("stroke-opacity", opacity)
                  .style("stroke-opacity", function(o) {
                      return o.source === d || o.target === d ? 1 : opacity;
                  });
          };
      }

      function showTitles(visibilityProperty) {
          return function(d) {
              node.select("text")
                  .attr("visibility", function(o) {
                      thisVisibility = isConnected(d, o) ? 'visible' : titleVisibility;
                      //this.setAttribute('fill-opacity', thisOpacity);
                      this.setAttribute('visibility', thisVisibility);
                      return thisVisibility;
                  });
          }
      }

      function mouseover() {
          d3.select(this).select("circle").transition()
              .duration(150)
              .style("fill", highlight);
          d3.select(this).select("circle").each(fade(.1));
          d3.select(this).selectAll(".link").attr("stroke", highlight);
          d3.select(this).select("text").each(showTitles("hidden"));
      }

      function mouseout() {
          d3.select(this).select("circle").transition()
              .duration(150)
              .style("fill", nodeColor);
          d3.select(this).select("circle").each(fade(1));
          d3.select(this).selectAll(".link").attr("stroke", strokeColor);
          d3.select(this).select("text").each(showTitles("visible"));
      }


      setTimeout(function() {
          var n = link.length + node.length + 50;
          force.start();
          for (var i = n * n; i > 0; --i) force.tick();
          force.stop();

          link.attr("x1", function(d) {
                  return d.source.x;
              })
              .attr("y1", function(d) {
                  return d.source.y;
              })
              .attr("x2", function(d) {
                  return d.target.x;
              })
              .attr("y2", function(d) {
                  return d.target.y;
              });

          node.attr("transform", function(d) {
              return "translate(" + d.x + "," + d.y + ")";
          });

          loading.remove();
      }, 10);

      $('svg circle').tipsy({
          gravity: 'b',
          trigger: 'hover',
          html: true,
          opacity: 1,
          fade: true,
          delayIn: 0,
          delayOut: 3000,
          title: function() {
              var rank = this.getAttribute('rank'),
                  title = this.getAttribute('nodeTitle'),
                  cover = this.getAttribute('cover'),
                  genres = this.getAttribute('genres').replace(/,/g, ", "),
                  myDescription = this.getAttribute('description'),
                  linkTitle = this.getAttribute('nodeTitle').replace(/ /g, "-").replace(/'/g, ""),
                  // videoLink = 'http://gogoanime.io/search.html?keyword=' + linkTitle;
                  videoLink = 'http://gogoanime.io/' + linkTitle + '-episode-1';
              return '<div class="popDiv">' +
                  '<img src="covers/' + cover + '" alt="Anime Cover Art" />' +
                  '<p class="header"> <span>' +
                  title +
                  '<span> </p>' +
                  '<p class="header">Rank: <span>' + rank + '</span> out of 327</p>' +
                  '<p class="header"><span>' + genres + '</span></p>' +
                  '<p>' + myDescription + '</p>' +
                  '<p> <a class="videoLink" href="' + videoLink + '" target="videoFrame">Watch Anime</a></p>' +
                  '</div>';
          }
      });

  });
  var count = 0;
  function toggleInfo(ele) {
      //hide tooltip
      if ($(ele).attr("rel") === "show") {
          $(ele).tipsy("hide");
          $(ele).attr('rel', 'hide');
          count--;
      }
      //swap tooltips
      else if ($(ele).attr("rel") === "hide" && count === 1) {
          $('.tipsy').remove();
          $(ele).tipsy("show");
          $(ele).attr('rel', 'show');
          count = 0;
      }
      //show tooltip
      else {
          $(ele).tipsy("show");
          $(ele).attr('rel', 'show');
          count++;

      }
      $(".tipsy").click(function() {
          $('.tipsy').remove();
      });
      return false;
  }


  function toggleNames() {
      if (titleVisibility == "visible") {
          d3.selectAll(".titles").attr("visibility", "hidden");
          titleVisibility = "hidden";
      } else {
          d3.selectAll(".titles").attr("visibility", "visible");
          titleVisibility = "visible";
      }
  }

  function toggleConnections() {
      if (linkVisible == "visible") {
          d3.selectAll(".link").attr("visibility", "hidden");
          linkVisible = "hidden";
      } else {
          d3.selectAll(".link").attr("visibility", "visible");
          linkVisible = "visible";
      }
  }

  function findNext() {
      var str = document.getElementById("findInput").value;
      if (str == "") {
          alert("Please enter some text to search!");
          return;
      }

      if (window.find) { // Firefox, Google Chrome, Safari
          var found = window.find(str);
          if (!found) {
              alert("The following text was not found:\n" + str);
          }

          //else {
          //	alert ("Your browser does not support finding text!");
          //}
      }
  }

  function toggleGenre(theGenre) {
      if (!alreadySelected) {
          /*d3.selectAll("circle").attr("visibility", function(d) {
  			return d.genres.filter( function(item){
      			return typeof item == 'string' && item.indexOf(theGenre) > -1;
  				}) == theGenre?"visible":"hidden";
  			});*/
          d3.selectAll("circle")
              .transition().duration(1000).style("opacity", function(d) {
                  return d.genres.filter(function(item) {
                      return typeof item == 'string' && item.indexOf(theGenre) > -1;
                  }) == theGenre ? 1 : 0.2;
              });

          alreadySelected = true;
      } else if (alreadySelected) {
          d3.selectAll("circle").transition().duration(1000).style("opacity", "1");
          alreadySelected = false;
      }
  }

  function toggleMyList() {
      if (!myListVisible) {
          d3.selectAll("circle").transition()
              .duration(1000)
              .style("fill", function(d, i) {
                return i % 25 == 0 ? highlight : strokeColor;
              });
          myListVisible = true;
      } else {
          d3.selectAll("circle").transition()
              .duration(1000)
              .style("fill", nodeColor);
          myListVisible = false;
      }
  }
  var myRankVisible = false;

  function toggleMyRank() {
      if (!myRankVisible) {
          d3.selectAll("circle").transition()
              .duration(1000)
              .attr("r", function(d, i) {
                  return i % 25 == 0 ? (Math.random() * 20) + 3 : this.getAttribute('r');
              });
          myRankVisible = true;
      } else {
          var rankScale = d3.scale.linear()
              .domain([1, 100])
              .range([3, 35]);
          d3.selectAll("circle").transition()
              .duration(1000)
              .attr("r", function(d, i) {
                  return i % 25 == 0 ? rankScale(d.rank) : this.getAttribute('r');
              });
          myRankVisible = false;
      }
  }

  $(document).ready(function() {
      $(".videoLink").fancybox({
          'width': '80%',
          'height': '80%',
          'autoScale': false,
          'transitionIn': 'none',
          'transitionOut': 'none',
          'type': 'iframe'
      });
      var svgElement = document.getElementById('zoomableArea');
      svgElement.addEventListener('mousedown', function (e) {
        e.target.style.cursor = '-webkit-grabbing';
        e.target.style.cursor += '-moz-grabbing';
      });
      svgElement.addEventListener('mouseup', function (e) {
        e.target.style.cursor = '-webkit-grab';
        e.target.style.cursor += '-moz-grab';
      });
  });



 window.animap = {
   toggleMyRank,
   toggleMyList,
   toggleGenre,
   findNext,
   toggleConnections,
   toggleNames,
   toggleInfo
 };


})(window);
