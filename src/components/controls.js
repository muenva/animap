import React, { Component } from 'react';

class Controls extends Component {
  toggleAllAnimeTitles() {
    const titles = document.querySelectorAll('.title');
    if (!titles || titles.length === 0) {
      return false;
    }
    let titleVisibility = titles[0].getAttribute('visibility');

    if (titleVisibility === 'visible') {
      [].map.call(titles, function (title) { title.setAttribute('visibility', 'hidden')})
    } else {
      [].map.call(titles, function (title) { title.setAttribute('visibility', 'visible')})
    }
  }
  render() {
    return (
      <div className="modifiers">
        <input type="button" value="Names" onClick={this.toggleAllAnimeTitles} title="You can search only if you enabled the names. Look for the yellow patch." />
      </div>
    );
  }
}

export default Controls;

// <input type="button" value="Horror"   onclick="animap.toggleGenre('Horror')" title="Toggle horror anime" />
// <input type="button" value="Mystery"  onclick="animap.toggleGenre('Mystery')" title="Toggle mystery anime" />
// <input type="button" value="Watched"  onclick="animap.toggleMyList()" title="What have you watched (demo)" />
// <input type="button" value="My Ranks" onclick="animap.toggleMyRank()" title="How you ranked the anime (demo)" />
