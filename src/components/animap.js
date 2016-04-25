import React, { Component } from 'react';
import d3 from 'd3';
import { mouseover, mouseout } from '../services';
import cacheService from '../services/cache';
import config from '../config';

class Animap extends Component {
  render() {
    const self = this;
    const svg = d3.select('#canvas');
    this.isLoading(true);
    this.setupZoomableArea(svg);

    d3.json('/src/static/data.json', function(json) {
      const distanceScale = d3.scale.linear()
        .domain([1, d3.max(json.links, (d) => d.value)])
        .range([100, 10]);
      const strokeWidthScale = d3.scale.linear()
        .domain([1, d3.max(json.links, (d) => d.value)])
        .range([0.1, 8]);
      const nodeRadiusScale = d3.scale.linear()
        .domain([1, d3.max(json.nodes, d => d.rank)])
        .range([3, 35]);

      const force = d3.layout.force()
        .nodes(json.nodes)
        .links(json.links)
        .gravity(.1)
        .linkDistance(d => distanceScale(d.value))
        //.linkStrength( function(d) { return strengthScale(d.value); })
        .charge(-120)
        .size([config.width, config.height]);

      const allLinks = svg.selectAll('.link')
          .data(json.links)
        .enter().append('line')
          .attr('class', 'link')
          .style('stroke-width', d => strokeWidthScale(d.value))
          .attr('visibility', config.linkVisible)
          .attr('source', d => d.source)
          .attr('target', d => d.target);

      const allNodes = svg.selectAll('.node')
          .data(json.nodes)
        .enter().append('svg:g')
          .attr('class', 'node')
          .attr('id', d => config.nodeIdPrefix + d.id)
          //TODO: save genre as classes
          .on('mouseover', source => mouseover(source, allNodes, allLinks))
          .on('mouseout', source => mouseout(source, allNodes, allLinks));

      allNodes.append('svg:circle')
        .attr('r', d => nodeRadiusScale(d.rank))
        .attr('id', d => d.id)
        .attr('rank', d => d.rank);

      allNodes.append('text')
        .attr('dx', d => { nodeRadiusScale(d.rank) - 10 })
        .attr('dy', d => { nodeRadiusScale(d.rank) - 15 })
        .attr('class', 'title')
        .text(d => d.name);

      setTimeout(() => {
          const n = allLinks.length + allNodes.length + 51;
          force.start();
          for (let i = n * n; i > 0; --i) force.tick();
          force.stop();

          allLinks.attr('x1', d => d.source.x)
              .attr('y1', d => d.source.y)
              .attr('x2', d => d.target.x)
              .attr('y2', d => d.target.y);

          allNodes.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
          json.links.forEach(d => cacheService.linkedByIndex[d.source.index + ',' + d.target.index] = 1);

          self.isLoading(false);
      }, 10);

      });

    return (
      <div>
        <div id="loading" className="loading">simulating...</div>
        <div id="animap">
          <svg width={config.width} height={config.height}>
            <g id="zoomableArea">
              <g id="canvas" onMouseDown={this.changeCursor} onMouseUp={this.changeCursor} onClick={this.showMoreDetails}>
                <rect id="overlay" className="overlay" width={config.width} height={config.height} />
              </g>
            </g>
          </svg>
        </div>
      </div>
    );
  }

  changeCursor(event) {
    if (event.target.id !== 'canvas') {
      return false;
    }
    if (event.type === 'mousedown') {
      event.target.style.cursor = '-webkit-grabbing';
    }
    event.target.style.cursor = '-webkit-grab';
  }

  showMoreDetails(event) {
    if (event.target && event.target.nodeName === 'circle') {
      const selectedInfo = cacheService.nodes.findNodeById(event.target.id);
      //TODO implement popupish more details
      console.log('selectedInfo', selectedInfo);
    }
  }

  isLoading(isLoading) {
    const element = document.getElementById('loading');
    if (!element) {
      return false;
    }
    if (isLoading) {
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden')
    }
  }

  setupZoomableArea(svg) {
    const xScale = d3.scale.linear().domain([0, config.width]).range([0, config.width * 2]);
    const yScale = d3.scale.linear().domain([0, config.height]).range([config.height * 2, 0]);
    const zoom = d3.behavior.zoom().x(xScale).y(yScale).scaleExtent([0, 25]);
    const maxTextSize = 20;
    let textSize = 13;

    d3.select(config.selectors.zoomableArea).call(zoom);
    zoom.on('zoom', () => {
      svg.attr('transform', 'translate(' + d3.event.translate + ')' + ' scale(' + d3.event.scale + ')');
      if (textSize * zoom.scale() > maxTextSize) {
        d3.selectAll('text').style('font-size', maxTextSize / zoom.scale());
      } else {
        d3.selectAll('text').style('font-size', textSize);
      }
    });
  }
}

export default Animap;
