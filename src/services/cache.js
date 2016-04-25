import data from '../static/data';

export default {
  linkedByIndex: {}, //TODO. manipulate it here
  nodes: {
    data: data.nodes,
    findNodeById(id) {
      if (typeof id === 'string') {
        id = parseInt(id, 10)
      }
      return this.data.find(d => d.id === id);
    }
  },
  links: {
    data: data.links
  }
}
