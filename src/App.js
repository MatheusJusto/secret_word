//react
import {useState, useEffect, useCallback } from 'react'

//css
import './App.css';

//data
import { wordsList } from './data/words'

//components
import StartScreen from './components/start/StartScreen'
import GameScreen from './components/game/GameScreen'
import GameOverScreen from './components/end/GameOverScreen'

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"}
]

const guessesNmbr = 3

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState('')
  const [pickedCategory, setPickedCategory] = useState('')
  const [letters, setLetters] = useState('')
  const [guessedLetters,setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses,setGuesses] = useState(guessesNmbr)
  const [score, setScore] = useState(0)

  const pickedWordAndCategory = useCallback(() => {
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return {word, category}
  }, [words])


const startGame = useCallback(() => {
      clearLettersState()
      const { word, category } = pickedWordAndCategory()
      setGameStage(stages[1].name)
      let wordLetters = word.split('')
          wordLetters = wordLetters.map( (i) => ( i.toLowerCase()))
      
      setLetters(wordLetters)   
      setPickedCategory(category)
      setPickedWord(word) 
    }, [pickedWordAndCategory])
  

  function verifyLetter(letter) {
    const normalizedLetter = letter.toLowerCase()

    if(guessedLetters.includes(normalizedLetter) ||
    wrongLetters.includes(normalizedLetter)) {
      return
    }

    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [...actualGuessedLetters, normalizedLetter])
      
    } else {
      setWrongLetters((actualWrongLetters) => [...actualWrongLetters, normalizedLetter])
      setGuesses( (actualGuesses) => actualGuesses - 1)
    }
  }

  function clearLettersState() {
    setGuessedLetters([])
    setWrongLetters([])
  }
  useEffect(() => {
    if(guesses <= 0) {
      setGameStage( stages[2].name)
      clearLettersState()
      
    }
  },[guesses])

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]
    if(guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name) {
      setScore((actualScore) => (actualScore += 100))
      startGame()
    }
  },[guessedLetters, startGame,letters])

  function retry() {
    setGameStage(stages[0].name)
    setGuesses(guessesNmbr)
    setScore(0)
    
  }

  return (
    <div className="App">
     { gameStage === "start" && <StartScreen startGame={startGame} /> }
     { gameStage === "game" && (
      <GameScreen 
        verifyLetter={verifyLetter}
        pickedWord={pickedWord}
        pickedCategory={pickedCategory}
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
      />
    )}
     { gameStage === "end" && <GameOverScreen retry={retry} score={score}/> }
    </div>
  );
}

export default App;
