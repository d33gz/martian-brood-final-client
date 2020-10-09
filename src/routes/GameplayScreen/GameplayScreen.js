import React, { Component } from 'react';
import config from '../../config';
import AlienList from '../../components/AlienList/AlienList';
import StructureList from '../../components/StructureList/StructureList';
import AlienSpawner from '../../components/AlienSpawner/AlienSpawner';
import StructureConstructor from '../../components/StructureConstructor/StructureConstructor';
import Tasks from '../../components/Tasks/Tasks';
import Reactions from '../../components/Reactions/Reactions';
import './GameplayScreen.css';

class GameplayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disableButtons: false,
      spawnMode: false,
      constructMode: false,
      taskMode: false,
      status: [],
      aliens: [],
      aliensCost: 0,
      aliensSynapse: 0,
      structures: [],
      structuresCost: 0,
      structuresSynapse: 0,
      reactionsSpawn: 0,
      reactionsConstruct: 0
    };
  };

  //GET OUR DATABASES
  componentDidMount() {
    this.GETmaster();
  };

  //GETS IT
  GETmaster() {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/status`)
    ])
      .then(([statusRes]) => {
        if (!statusRes.ok)
          return statusRes.json().then(event => Promise.reject(event))
        return Promise.all([
          statusRes.json(),
        ])
      })
      .then(([status]) => {
        this.setState({ status })
      })
      .catch(error => {
        console.log({error})
      })

    Promise.all([
      fetch(`${config.API_ENDPOINT}/aliens`)
    ])
      .then(([aliensRes]) => {
        if (!aliensRes.ok)
          return aliensRes.json().then(event => Promise.reject(event))
        return Promise.all([
          aliensRes.json(),
        ])
      })
      .then(([aliens]) => {
        this.setState({ aliens })
      })
      .catch(error => {
        console.log({error})
      })

    Promise.all([
      fetch(`${config.API_ENDPOINT}/structures`)
    ])
      .then(([structuresRes]) => {
        if (!structuresRes.ok)
          return structuresRes.json().then(event => Promise.reject(event))
        return Promise.all([
          structuresRes.json(),
        ])
      })
      .then(([structures]) => {
        this.setState({ structures })
      })
      .catch(error => {
        console.log({error})
      })
  };

  //CHANGING THE CONDITIONALS
  handleChangeCondition(changing) {
    if (changing === 'spawning') {
      this.setState({disableButtons: true});
      this.setState({spawnMode: true});
      this.setState({constructMode: false});
    } else if (changing === 'constructing') {
      this.setState({disableButtons: true});
      this.setState({spawnMode: false});
      this.setState({constructMode: true});
    } else if (changing === 'tasks') {
      this.setState({disableButtons: true});
      this.setState({spawnMode: false});
      this.setState({constructMode: false});
      this.setState({taskMode: true});
    } else if (changing === 'reactions') {
      this.setState({disableButtons: true});
      this.setState({spawnMode: false});
      this.setState({constructMode: false});
      this.setState({taskMode: false});
      this.setState({reactionMode: true});
    }else if (changing === 'cancel') {
      this.setState({disableButtons: false});
      this.setState({spawnMode: false});
      this.setState({constructMode: false});
      this.setState({taskMode: false});
      this.setState({reactionMode: false});
    } else {
      alert('check your conditionals');
    };
  };

  handleClickSpawner = () => {
    let changing = 'spawning';
    this.handleChangeCondition(changing);
  };

  handleClickConstructor = () => {
    let changing = 'constructing';
    this.handleChangeCondition(changing);
  };

  handleClickTasks = () => {
    let changing = 'tasks';
    this.handleChangeCondition(changing);
  };

  handleClickCommit = () => {
    let changing = 'reactions';
    this.handleChangeCondition(changing);
  };

  handleClickCancel = () => {
    let changing = 'cancel';
    this.handleChangeCondition(changing);
  };

  //UPDATE PLAYER STATUS
  //SOLAR DAY
  updateSolarDay = () => {
    this.setState( prevState => {
      let newDay = prevState.status[0]
        newDay.solar_day = (newDay.solar_day += 1);
        return {
          status: [newDay]
        }
      });
  };

  //SPAWNING
  setSpawns = (toSpawn) => {
    this.setState( prevState => {
      let toSpawnAlien = prevState.aliens[0]
        toSpawnAlien.spawning_count = toSpawn;
        return {
          aliens: [toSpawnAlien]
        }
      });
    this.handleClickCancel();
  };

  resetSpawns() {
    this.setState( prevState => {
      let zeroAlien = prevState.aliens[0]
        zeroAlien.spawning_count = 0;
        return {
          aliens: [zeroAlien]
        }
      });
      this.handleClickCommit();
  };

  finalSpawning = (spawning) => {
    this.setState( prevState => {
      let spawningAlien = prevState.aliens[0]
        spawningAlien.brood_count += spawning;
        return {
          aliens: [spawningAlien]
        }
      });
    this.reactionsSpawn(spawning);
    this.resetSpawns();
  };

  reactionsSpawn(spawning) {
    this.setState({reactionsSpawn: spawning})
  };

  //CONSTRUCTING
  setOrders = (orders) => {
    this.setState( prevState => {
      let toConstructStructure = prevState.structures[0]
        toConstructStructure.constructing_count = orders;
        return {
          structures: [toConstructStructure]
        }
      });
    this.handleClickCancel();
  };

  resetOrders() {
    this.setState( prevState => {
      let zeroStructure = prevState.structures[0]
        zeroStructure.constructing_count = 0;
        return {
          structures: [zeroStructure]
        }
      });
      this.handleClickCommit();
  };

  finalOrders = (constructing) => {
    this.setState( prevState => {
      let constructingStructure = prevState.structures[0]
        constructingStructure.brood_count += constructing;
        return {
          structures: [constructingStructure]
        }
      });
    this.reactionsConstruct(constructing);
    this.resetOrders();
  };

  reactionsConstruct(constructing) {
    this.setState({reactionsConstruct: constructing})
  };

  //BIOMASS COSTS
  setBiomass = (biomass) => {
    this.setState({aliensCost: biomass});
  };

  resetBiomass() {
    this.setState({aliensCost: 0});
  };

  finalBiomass = (biomass) => {
    this.setState( prevState => {
      let newStatus = prevState.status[0]
        newStatus.biomass -= biomass;
        return {
          status: [newStatus]
        }
      });
    this.resetBiomass();
  };

  setStructuresBiomass = (biomass) => {
    this.setState({structuresCost: biomass});
  };

  resetStructuresBiomass() {
    this.setState({structuresCost: 0});
  };

  finalStructuresBiomass = (biomass) => {
    this.setState( prevState => {
      let newStatus = prevState.status[0]
        newStatus.biomass -= biomass;
        return {
          status: [newStatus]
        }
      });
    this.resetStructuresBiomass();
  };

  //SYNAPSE DISTRIBUTION
  setSynapse = (synapse) => {
    this.setState({aliensSynapse: synapse});
  };

  setStructuresSynapse = (synapse) => {
    this.setState({structuresSynapse: synapse});
  };

  resetSynapses() {
    this.setState({aliensSynapse: 0});
    this.setState({structuresSynapse: 0});
  };

  finalSynapse = (required, produced) => {
    this.setState( prevState => {
      let newStatus = prevState.status[0]
        newStatus.synapse_required += required;
        newStatus.synapse_produced += produced;
        return {
          status: [newStatus]
        }
      });
    this.resetSynapses();
  };

  //RENDERING FUNCTIONS
  renderSpawnerButton() {
    if (this.state.disableButtons === true) {
      return (<button className='build-aliens-button' disabled>Spawn Aliens</button>);
    } else {
      return (<button className='build-aliens-button' onClick={() => this.handleClickSpawner()}>Spawn Aliens</button>);
    };
  };

  renderConstructorButton() {
    if (this.state.disableButtons === true) {
      return (<button className='build-structures-button' disabled>Build Alien Stuctures</button>);
    } else {
      return (<button className='build-structures-button' onClick={() => this.handleClickConstructor()}>Build Alien Stuctures</button>);
    };
  };

  renderTaskButton() {
    if (this.state.disableButtons === true) {
      return (<button className='task-button' disabled>Set Tasks</button>)
    } else {
      return (<button className='task-button' onClick={() =>  this.handleClickTasks()}>Set Tasks</button>);
    };
  };

  renderBuilders() {
    if (this.state.spawnMode === true) {
      return (
        <AlienSpawner aliens={this.state.aliens} setSpawns={this.setSpawns} setBiomass={this.setBiomass}
        setSynapse={this.setSynapse} handleClickCancel={this.handleClickCancel}
        />
      );
    } else if (this.state.constructMode === true) {
      return (
        <StructureConstructor structures={this.state.structures} setStructuresBiomass={this.setStructuresBiomass} setOrders={this.setOrders}
          setStructuresSynapse={this.setStructuresSynapse} handleClickCancel={this.handleClickCancel}
        />
      );
    } else if (this.state.taskMode === true) {
      return (
        <Tasks status={this.state.status} aliens={this.state.aliens} structures={this.state.structures}
          aliensCost={this.state.aliensCost} structuresCost={this.state.structuresCost}
            aliensSynapse={this.state.aliensSynapse} structuresSynapse={this.state.structuresSynapse} updateSolarDay={this.updateSolarDay} 
              finalSpawning={this.finalSpawning} finalBiomass={this.finalBiomass} finalSynapse={this.finalSynapse} finalOrders={this.finalOrders}
                handleClickSpawner={this.handleClickSpawner} handleClickConstructor={this.handleClickConstructor} 
                  handleClickCancel={this.handleClickCancel}
        />
      );
    } else if (this.state.reactionMode === true) {
      return (
        <Reactions status={this.state.status} aliens={this.state.aliens}  structures={this.state.structures}
          reactionsSpawn={this.state.reactionsSpawn} reactionsConstruct={this.state.reactionsConstruct}
           handleClickCancel={this.handleClickCancel}
        />
      );
    } else {
      return
    }
  };

  //MAIN RENDER
  render() {
    const { status, aliens, structures, aliensCost, aliensSynapse, structuresCost, structuresSynapse } = this.state

    return (
      <div>
        {status.map(report => (
          <header className='status-bar'>
            <div className='status-bar-major' >
              <span className='far-left-major'></span>
              <span className='left-major'>
                <h4>Biomass: {report.biomass}</h4>
              </span>
              <span className='center'>
                <h3>Brood Name: {report.brood_name}</h3>
              </span>
              <div className='right-major'>
                <h4>Synapse:</h4>
                <h4 className='orange'>{report.synapse_required}</h4>
                <h4 className='gold'>{report.synapse_produced}</h4>
              </div>
              <span className='far-right-major'></span>
            </div>
            <div className='status-bar-minor'>
              <span className='far-left-minor'></span>
              <span className='center-minor'><h4>Solar Day: {report.solar_day}</h4></span>
              <span className='far-right-minor'></span>
            </div>
          </header>
        ))}
        <section className='gameplay-style reaction-mode'>
            <AlienList aliens={aliens} status={status} aliensCost={aliensCost} aliensSynapse={aliensSynapse} />
          <div className='right alien-structures-box'>
          <h2>Structures</h2>
            <StructureList structures={structures} status={status} structuresCost={structuresCost} structuresSynapse={structuresSynapse} />

          </div>
          <div>{this.renderBuilders()}</div>
        </section>
        <footer className='game-footer'>
          <span>{this.renderSpawnerButton()}</span>
          <span>{this.renderTaskButton()}</span>
          <span>{this.renderConstructorButton()}</span>
        </footer>
      </div>
    )
  };
};

export default GameplayScreen;