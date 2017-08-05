import React from 'react';
import GameCard from './GameCard';

class GameBoard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='well' style={style}>
          Gameboard<br/>
          <GameCard />
      </div>
    )
  }
};

const style = {
  margin: 50,
};

export default GameBoard;