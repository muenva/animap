import React, { Component } from 'react';
// import visualization from './visualization';
import d3 from 'd3';
// import $ from 'jQuery';
import { toggleInfo, mouseover, mouseout } from '../services';
import config from '../config';

class Animap extends Component {
  render() {
    const svg = d3.select('#canvas');
    const xScale = d3.scale.linear()
      .domain([0, config.width])
      .range([0, config.width]);
    const yScale = d3.scale.linear()
      .domain([0, config.height])
      .range([config.height, 0]);

    d3.select('#zoomableArea')
      .call(d3.behavior.zoom().x(xScale).y(yScale).scaleExtent([0, 15]).on('zoom', function() {
              svg.attr('transform', 'translate(' + d3.event.translate + ')' + ' scale(' + d3.event.scale + ')');
            }));

    var loading = svg.append('text')
        .attr('x', config.width / 2)
        .attr('y', config.height / 2)
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .text('simulating...');


    d3.json('/src/static/anime.json', function(json) {
          const distanceScale = d3.scale.linear()
              .domain([1, d3.max(json.links, (d) => d.value)])
              .range([100, 10]);

          const force = self.force = d3.layout.force()
              .nodes(json.nodes)
              .links(json.links)
              .gravity(.1)
              .linkDistance((d) => distanceScale(d.value))
              //.linkStrength( function(d) { return strengthScale(d.value); })
              .charge(-120)
              .size([config.width, config.height]);

          const strokeWidth = d3.scale.linear()
              .domain([1, d3.max(json.links, (d) => d.value)])
              .range([0.1, 8]);

          const link = svg.selectAll('.link')
              .data(json.links)
              .enter().append('svg:g')
              .append('line')
              .attr('class', 'link')
              .style('stroke', config.strokeColor)
              .style('stroke-width', function(d) {
                  return strokeWidth(d.value);
              })
              .attr('visibility', config.linkVisible);

          const rankScale = d3.scale.linear()
              .domain([1, d3.max(json.nodes, function(d) {
                  return d.rank;
              })])
              .range([3, 35]);

          // const radius = (d) =>  rankScale(d.rank);d

          const node = svg.selectAll('.node')
              .data(json.nodes)
              .enter().append('svg:g')
              .attr('class', 'node')
              .on('mouseover', mouseover(this))
              .on('mouseout', mouseout);

          node.append('svg:circle')
              .attr('r', (d) => rankScale(d.rank))
              .style('fill', config.nodeColor) // TODO in SASS styles
              .attr('rel', 'hide')
              .on('click', function() {
                  return toggleInfo(this) // TODO: one subscription on document
              })
              .attr('rank', function(d) {
                  return d.rank;
              })
              .attr('nodeTitle', function(d) {
                  return d.name;
              })
              .attr('cover', function(d) {
                  return d.cover;
              })
              .attr('genres', function(d) {
                  return d.genres;
              })
              .attr('description', function(d) {
                  return d.description;
              });

          node.append('text')
              .attr('dx', -2)
              .attr('dy', -5)
              .attr('class', 'title')
              .text(function(d) {
                  return d.name
              });


          setTimeout(function() {
              var n = link.length + node.length + 10;
              force.start();
              for (var i = n * n; i > 0; --i) force.tick();
              force.stop();

              link.attr('x1', function(d) {
                      return d.source.x;
                  })
                  .attr('y1', function(d) {
                      return d.source.y;
                  })
                  .attr('x2', function(d) {
                      return d.target.x;
                  })
                  .attr('y2', function(d) {
                      return d.target.y;
                  });

              node.attr('transform', function(d) {
                  return 'translate(' + d.x + ',' + d.y + ')';
              });

              loading.remove();

              json.links.forEach(function(d) {
                config.linkedByIndex[d.source.index + ',' + d.target.index] = 1;
              });
          }, 100);

      });

    return (
      <div id="animap">
        <svg width={config.width} height={config.height}>
          <g id="zoomableArea">
            <g id="canvas" onMouseDown={this.changeCursor} onMouseUp={this.changeCursor}>
              <rect id="overlay" className="overlay" width={config.width} height={config.height} />
            </g>
          </g>
        </svg>
      </div>
    );
  }
  changeCursor(event) {
    if (event.type === 'mousedown') {
      event.target.style.cursor = '-webkit-grabbing';
    }
    event.target.style.cursor = '-webkit-grab';
  }
}

export default Animap;


// {this.props.data.links.map((link, index) => {
//   return <g><line key={index + 1} className="link" color={config.strokeColor}> { link } </line></g>
// })}
// {this.props.data.nodes.map(function (node) {
//   return <g><circle className="node" key={node.id}> { node }</circle></g>
// })}
// const nodes = this.props.data.nodes.map((node) => {
//   return (<circle className="node" key={node.id}> { node }</circle>);
// });
//<div id="loading" className="loading">it''s going to be legen...wait for it</div>
//<text className="title" visibility="visible" x="300" y="300">This is a text</text>

// <circle r="3" rel="hide" rank="197" nodeTitle="Hokuto no Ken" cover="196-Hokuto-no-Ken.jpg" genres="Action,Drama,Martial Arts,Sci-Fi,Shounen" description="In the post-nuclear apocalyptic future in 199X, the human race has regressed. Weak villagers are reduced to slavery, while genetically enhanced giants rule the world. Gunpowder seems only a distant memory, and the martial arts is the only weapon a man can count on. Two schools face one another in the battle for dominion: Hokuto Shinken and Nanto Seiken. The series begins when the Hokuto successor, Kenshiro, travels the desert to confront Shin, a member of the Nanto Roku Seiken, their six ruling stars, who has taken his fiancee Yulia." style="fill: rgb(58, 143, 155); cursor: -webkit-grab;" transform="translate(466.96515326905575,719.8654945940283)"></circle>
