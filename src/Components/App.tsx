import { useEffect, useState } from "react";
import CardSwipe from "./CardSwipe";
import PokemonCard from "./PokemonCard";

const getRandomPokemonNumber = () => Math.ceil(Math.random() * 649);

function App() {
  const [cards, setCards] = useState([
    getRandomPokemonNumber(),
    getRandomPokemonNumber(),
  ]);

  useEffect(() => {
    if (cards.length <= 1) {
      setCards((cards) => [...cards, getRandomPokemonNumber()]);
    }
  }, [cards.length]);

  return (
    <>
      {cards.slice(0, 2).map((card, index) => (
        <CardSwipe
          active={index == 0}
          key={card}
          onSwipeLeft={() => setCards((cards) => cards.slice(1))}
          onSwipeRight={() => setCards((cards) => cards.slice(1))}
        >
          {(timeline) => <PokemonCard pokeIndex={card} timeline={timeline} />}
        </CardSwipe>
      ))}
    </>
  );
}

export default App;
