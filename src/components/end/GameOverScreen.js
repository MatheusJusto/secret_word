import React from 'react'

const GameOverScreen = ({retry, score}) => {
  return (
    <div className="game">
      <h1>Game over</h1>
      <p>a sua pontuação foi: <span>{score}</span></p>
      <button onClick={retry}>Reiniciar jogo</button>
    </div>
  )
}

export default GameOverScreen