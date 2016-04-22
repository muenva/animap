import $ from 'jquery';
import d3 from 'd3';
// import config from '../config';

// let count = 0;
export function showMoreDetails(element) {
  console.log('showMoreDetails element', element);
    // //hide tooltip
    // if ($(ele).attr('rel') === 'show') {
    //     $(ele).tipsy('hide');
    //     $(ele).attr('rel', 'hide');
    //     count--;
    // }
    // //swap tooltips
    // else if ($(ele).attr('rel') === 'hide' && count === 1) {
    //     $('.tipsy').remove();
    //     $(ele).tipsy('show');
    //     $(ele).attr('rel', 'show');
    //     count = 0;
    // }
    // //show tooltip
    // else {
    //     $(ele).tipsy('show');
    //     $(ele).attr('rel', 'show');
    //     count++;
    //
    // }
    // $('.tipsy').click(function() {
    //     $('.tipsy').remove();
    // });
    // return false;
}

export function toggleConnections(linkVisible) {
    if (linkVisible == 'visible') {
        $('.link').attr('visibility', 'hidden');
        linkVisible = 'hidden';
    } else {
        $('.link').attr('visibility', 'visible');
        linkVisible = 'visible';
    }
}

export function findNext() {
    var str = document.getElementById('findInput').value;
    if (str == '') {
        alert('Please enter some text to search!');
        return;
    }

    if (window.find) { // Firefox, Google Chrome, Safari
        var found = window.find(str);
        if (!found) {
            alert('The following text was not found:\n' + str);
        }
    }
}

let alreadySelected;
export function toggleGenre(theGenre) {
    if (!alreadySelected) {
        d3.selectAll('circle')
            .transition().duration(1000).style('opacity', function(d) {
                return d.genres.filter(function(item) {
                    return typeof item == 'string' && item.indexOf(theGenre) > -1;
                }) == theGenre ? 1 : 0.2;
            });

    } else if (alreadySelected) {
        $('circle').transition().duration(1000).style('opacity', '1');
    }
    alreadySelected = !alreadySelected;
}

// let myListVisible;
//   export function toggleMyList() {
//       if (!myListVisible) {
//           $('circle').transition()
//               .duration(1000)
//               .style('fill', function(d, i) {
//                 return i % 25 == 0 ? highlight : strokeColor;
//               });
//           myListVisible = true;
//       } else {
//           $('circle').transition()
//               .duration(1000)
//               .style('fill', nodeColor);
//           myListVisible = false;
//       }
//   }
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

// $(document).ready(function() {
//     $('.videoLink').fancybox({
//         'width': '80%',
//         'height': '80%',
//         'autoScale': false,
//         'transitionIn': 'none',
//         'transitionOut': 'none',
//         'type': 'iframe'
//     });
// });


export function mouseover(element) {
  if (!element) {
    return;
  }
  console.log('mouseover element', element);
  console.log('mouseover arguments', arguments);
  const title = element.querySelector('.title');
  title.setAttribute('visibility', 'visible');
  // const self = d3.select(this);
  // console.log('over, this', self);
  // d3.select(this).select('circle').transition().duration(150).style('fill', config.highlightColor);
  // d3.select(this).select('circle').each(function (node) {
  //   fade(node, .1)
  // });
  // d3.select(this).selectAll('.link').attr('stroke', config.highlightColor);
  // d3.select(this).select('text').each(showTitles(self, 'hidden'));
}

export function mouseout(element) {
  if (!element) {
    return;
  }
  console.log('mouseout element', element);
  console.log('mouseover arguments', arguments);
  const title = element.querySelector('.title');
  title.setAttribute('visibility', 'hidden');
  // const self = d3.select(this);
  // console.log('out, this', self);
  // d3.select(this).select('circle').transition()
  //     .duration(150)
  //     .style('fill', config.nodeColor);
  // d3.select(this).select('circle').each(fade(1));
  // d3.select(this).selectAll('.link').attr('stroke', config.strokeColor);
  // d3.select(this).select('text').each(showTitles(self, 'visible'));
}

// function fade(opacity, node, link) {
//     return function(d) {
//         node.style('opacity', function(o) {
//                 const thisOpacity = isConnected(d, o) ? 1 : opacity;
//                 this.setAttribute('opacity', thisOpacity);
//                 return thisOpacity;
//             });
//         link.style('stroke-opacity', opacity)
//             .style('stroke-opacity', function(o) {
//                 return o.source === d || o.target === d ? 1 : opacity;
//             });
//     };
// }
//
// function showTitles(node, visibilityProperty) {
//     return function(d) {
//         node.select('text')
//             .attr('visibility', function(o) {
//                 const thisVisibility = isConnected(d, o) ? 'visible' : visibilityProperty;
//                 //this.setAttribute('fill-opacity', thisOpacity);
//                 this.setAttribute('visibility', thisVisibility);
//                 return thisVisibility;
//             });
//     }
// }
// function isConnected(first, second) {
//   return config.linkedByIndex[first.index + ',' + second.index]
//   || config.linkedByIndex[second.index + ',' + first.index]
//   || first.index == second.index;
// }
