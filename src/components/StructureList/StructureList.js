import React, { Component } from 'react';
import './StructureList.css';

class StructureList extends Component {
  render() {
    const { structures } = this.props

    return (
      <div className='list-box-structures'>
        <div className='top-row'>
          <span><h4>Name</h4></span>
          <span><h4>Brood Count</h4></span>
          <span><h4>To Construct</h4></span>
        </div>
        {structures.map(structure => (
          <ul className='left-list'>
            <li className='item'>{structure.structure_name}</li>
            <li className='item'>{structure.brood_count}</li>
            <li className='item'>{structure.toConstruct}</li>
          </ul>
        ))}
         <div className='bottom-row'>
          <h4>Biomass Cost</h4>
          <h4>Synapse Produced</h4>
        </div>
      </div>
    )   
  };
};

export default StructureList;