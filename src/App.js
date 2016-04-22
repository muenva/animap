import React, { Component } from 'react';
import Animap from './components/animap';
import Controls from './components/controls';
import animeData from './static/data';

require('./sass/main.scss');

export default class App extends Component {
  render() {
    return (
      <div>
        <Controls />
        <Animap data={ animeData } />
      </div>
    );
  }
}
