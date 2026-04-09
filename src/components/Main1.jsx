import React, { useState, useEffect } from "react"
import clsx from "clsx"
import Confetti from "react-confetti"

export default function Main(){

    const lives = ["❤️", "❤️", "❤️", "❤️", "❤️"]
    const alpha = "abcdefghijklmnopqrstuvwxyz"

    const [guessed, setGuessed] = useState([])
    const [word, setWord] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    function fetchNewWord() {
        setIsLoading(true);
        const API_URL = "https://random-word-api.herokuapp.com/word?length=7"; 

        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setWord(data[0]); 
                setGuessed([]);
            })
            .catch(error => {
                console.error("Failed to fetch word:", error);
                setWord("default"); 
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        fetchNewWord();
    }, []); 

    const letters = word ? word.split('').map(letter => letter.toUpperCase()) : [];

    const wrongGuessCount = guessed.filter(letter => !letters.includes(letter.toUpperCase()) ).length
    const isGameWon = word.split('').every(letter => guessed.includes(letter));
    const isGameLost = wrongGuessCount >= lives.length
    const isGameOver = isGameWon || isGameLost

    function handleGuess(letter){
        if (!isGameOver && !guessed.includes(letter)) {
            setGuessed(prevGuess => [...prevGuess, letter]);
        }
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
              <p>The word was: <span style={{fontWeight: 'bold'}}>{word.toUpperCase()}</span></p>
              <p>Womp Womp So lose yet so far</p>
            </>
          );
        }
    }
      
    function startNewGame(){
        fetchNewWord();
    }

    if (isLoading) {
        return <main className="loading"><h1>Loading new word... ⏳</h1></main>;
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
                        return <span className="letter" key={index}>{shouldRevealElements?letter:""}</span>
                    })
                }
            </section>

            <section className="keyboard-space">
                <div className="keyboard">
                    {
                        alpha.split("").map((key,index) =>{

                            const isGuessed = guessed.includes(key);
                            const isCorrect = isGuessed && word.toLowerCase().includes(key)
                            const isWrong = isGuessed && !word.toLowerCase().includes(key)
                            
                            const className = clsx(
                                {
                                    correct: isCorrect,
                                    wrong : isWrong,
                                    guessed: isGuessed
                                }
                            )
                            
                            return(<button 
                                key={index} 
                                onClick={()=>handleGuess(key)}
                                className={className}
                                disabled={isGameOver || isGuessed}
                            >{key.toUpperCase()}</button>
                            )
                        })
                    }
                </div>
            </section>

            <section className="newGame">
                {isGameOver && <button onClick={startNewGame} >New Game</button>}
            </section>
            
        </main>
    )
}