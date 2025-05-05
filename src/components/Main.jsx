import React, {useState} from "react"
import clsx from "clsx"
import words from "../words"
import Confetti from "react-confetti"
export default function Main(){

    const lives = ["❤️","❤️","❤️","❤️","❤️"]
    const alpha = "abcdefghijklmnopqrstuvwxyz"


    const [guessed,setGuessed]=useState([])
    const [word,setWord] = useState(() => getRandomWord())
    
    function getRandomWord(){
        const randomWord = words[Math.floor(Math.random() * words.length)];
        console.log("Chosen word:", randomWord);
        return randomWord;
    }
    
    const letters = word.split('').map(letter=>{
        return letter.toUpperCase();
    })

    const wrongGuessCount = guessed.filter(letter=> !letters.includes(letter.toUpperCase()) ).length
    const isGameWon = word.split('').every(letter => guessed.includes(letter));
    const isGameLost = wrongGuessCount >= lives.length
    const isGameOver = isGameWon || isGameLost

    function handleGuess(letter){
        setGuessed(prevGuess=> prevGuess.includes(letter)? prevGuess :[...prevGuess, letter])  
    }

    const statusClassName = clsx("statusBox",{
        won:isGameWon,
        lost:isGameLost,
    }) 

    function renderGameStatus() {
        if (!isGameOver) {
          return null;
        }
      
        if (isGameWon) {
          return (
            <>
              <h2>You win!</h2>
              <p>Winner Winner Chicken dinner</p>
            </>
          );
        } else {
          return (
            <>
              <h2>Game over!</h2>
              <p>Womp Womp So lose yet so far</p>
            </>
          );
        }
      }
      
    function startNewGame(){
        setWord(getRandomWord)
        setGuessed([])
    }

    return(
        <main>

        {
            isGameWon &&
            <Confetti
                recycle={false}
                numberOfPieces={1000}
            />
        }

        <section className={statusClassName}>
        { renderGameStatus() }
        </section>

            <section className="chances">
                <div>
                    {lives.map((heart, index) => (<span key={index} className={`heart ${index < wrongGuessCount ? "lost" : ""}`}>{heart}</span>))}
                </div>
            </section>

            <section className="guessArea">
                {   
                    
                    letters.map((letter,index) =>{
                        const shouldRevealElements = isGameLost || guessed.includes(letter.toLowerCase())
                        const isGuessed = guessed.includes(letter.toLowerCase());
                        return <span className="letter" key={index}>{shouldRevealElements?letter:""}</span>

                    })
                }
            </section>

            <section className="keyboard-space">
                <div className="keyboard">
                    {
                        alpha.split("").map((key,index) =>{

                            const isGuessed = guessed.includes(key);
                            const isCorrect = isGuessed && word.includes(key)
                            const isWrong = isGuessed && !word.includes(key)
                            const className = clsx(
                                {
                                    correct: isCorrect,
                                    wrong : isWrong
                                }
                            )
                            // console.log(className)
                            return(<button 
                                key={index} 
                                onClick={()=>handleGuess(key)}
                                className={className}
                                disabled={isGameOver}
                            >{key.toUpperCase()}</button>
                        )})
                    }
                </div>
            </section>

            <section className="newGame">
                {isGameOver && <button onClick={startNewGame} >New Game</button>}
            </section>
           
        </main>
    )
}