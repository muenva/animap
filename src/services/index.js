import config from '../config';
import cacheService from './cache';

let cachedNode;
let cachedTitle;

function isConnected(first, second) {
  return cacheService.linkedByIndex[first.index + ',' + second.index]
  || cacheService.linkedByIndex[second.index + ',' + first.index]
  || first.index == second.index;
}

function styleConnectedNodes(nodeId, d3Nodes, d3Links) {
    const target = { index: nodeId };
    d3Nodes.classed('is-connected', source => isConnected(target, source));
    d3Links.classed('is-connected', source => source.source.id === nodeId || source.target.id === nodeId);
}

export function toggleGenre(genre) {
  if (!genre) {
    return false;
  }
  //toggle class 'is-opaque'
}


export function toggleMyList() {
  //TODO: add editing a list
}

//   var myRankVisible = false;
//
//   export function toggleMyRank() {
//       if (!myRankVisible) {
//           d3.selectAll('circle').transition()
//               .duration(1000)
//               .attr('r', function(d, i) {
//                   return i % 25 == 0 ? (Math.random() * 20) + 3 : this.getAttribute('r');
//               });
//           myRankVisible = true;
//       } else {
//           var rankScale = d3.scale.linear()
//               .domain([1, 100])
//               .range([3, 35]);
//           d3.selectAll('circle').transition()
//               .duration(1000)
//               .attr('r', function(d, i) {
//                   return i % 25 == 0 ? rankScale(d.rank) : this.getAttribute('r');
//               });
//           myRankVisible = false;
//       }
//   }

export function mouseover(element, d3Nodes, d3Links) {
  if (!element || typeof element.id === 'undefined') {
    return;
  }
  cachedNode = document.getElementById(config.nodeIdPrefix + element.id);
  cachedTitle = cachedNode.querySelector('.title');
  cachedNode.classList.add('is-highlighted');
  cachedTitle.classList.add('is-visible');
  document.body.classList.add('highlight-only-selected-nodes');
  styleConnectedNodes(element.id, d3Nodes, d3Links);
}

export function mouseout(element, d3Nodes, d3Links) {
  if (!element) {
    return;
  }
  cachedNode.classList.remove('is-highlighted');
  cachedTitle.classList.remove('is-visible');
  document.body.classList.remove('highlight-only-selected-nodes');
  d3Nodes.classed('is-connected', false);
  d3Links.classed('is-connected', false);
  cachedNode = null;
  cachedTitle = null;
}
