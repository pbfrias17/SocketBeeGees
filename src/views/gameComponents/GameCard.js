import React from 'react';
import { ResolveEffect } from '../../game/cards'; 

class GameCard extends React.Component {
  constructor(props) {
    super(props);

    this.prereqs = [];
    this.effectsResolved = 0;
    this.card = { 
      effects: [
        { effect: 'move 1 deck hand' },
        { effect: 'choose discard draw' }, 
        { prereq: 1, effect: 'move 1 hand discard others' }
      ],
    };

    this.handleClick = this.handleClick.bind(this);
    this.effectResolvedCallback = this.effectResolvedCallback.bind(this);
  }

  handleClick = (e) => {
    this.playCard();
  };

  playCard = () => {
    if (this.card.effects) {
      var firstEffect = this.card.effects[0];
      ResolveEffect(firstEffect, this.effectResolvedCallback);
    }
  };

  effectResolvedCallback = (result) => {
    console.log('callback: ' + result);
    this.prereqs[this.effectsResolved] = result;
    this.effectsResolved++;
    var nextEffect = this.card.effects[this.effectsResolved];

    if (nextEffect.prereq && !this.prereqs[nextEffect.prereq]) {
      console.log('cannot resolve next effect: prereq not met');
    } else {
      ResolveEffect(nextEffect, this.effectResolvedCallback);
    }
  };

  render() {
    return (
      <button className='panel' onClick={this.handleClick}>
        <img src={require('../../../assets/captain-card.jpg')} />
      </button>
    );
  }
}

const power0 = [
  'move 1 deck hand',
  'choose discard draw', 
  { prereq: 1,
    effect: 'move 1 hand discard others'
  }
];
const power1 = [
  'move 1 deck hand',
  'move 1 hand discard',
  { prereq: 1,
    effect: 'move 2 deck hand' 
  }
];

export default GameCard;