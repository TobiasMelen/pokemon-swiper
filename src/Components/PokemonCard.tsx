import { css } from "goober";
import { useEffect, useRef, useState } from "react";

export default function PokemonCard({
  pokeIndex,
  timeline,
}: {
  pokeIndex: number;
  timeline: any;
}) {
  const [pokemon, setPokemon] = useState<{ name: string }>();
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokeIndex}`)
      .then((res) => res.json())
      .then(setPokemon);
    const animation = cardRef.current?.animate(
      {
        transform: ["rotate(30deg)", "rotate(-30deg)"],
      },
      {
        duration: 1,
        fill: "forwards",
        //@ts-ignore
        timeline,
      }
    );
    return () => {
      animation?.cancel();
    };
  }, []);
  return (
    <div
      ref={cardRef}
      className={css`
        background: white;
        border: 0.5vmin solid black;
        width: 90vw;
        max-width: 500px;
        max-height: 90vh;
        aspect-ratio: 1/1.5;
        transform-origin: center center;
        border-radius: 5vmin;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.7);
        position: relative;
      `}
    >
      <div
        className={css`
          position: absolute;
          height: 93%;
          width: 88%;
          border: min(0.75vw, 5px) solid black;
          border-radius: 5vmin;
          background-clip: border-box;
          mask: rect();
          &::after,
          &::before {
            content: "${String(pokeIndex).padStart(3, "0")}";
            background: white;
            color: black;
            position: absolute;
            font-size: min(4vw, 1.3em);
            line-height: 1;
            padding: 1% 0;
            font-weight: 900;
            font-family: system-ui;
          }
          &::before {
            top: 5%;
            left: -5%;
          }
          &::after {
            bottom: 5%;
            right: -5%;
            transform: rotate(180deg);
          }
        `}
      />
      <img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokeIndex}.svg`}
        className={css`
          height: 60%;
          width: 60%;
        `}
      />
      <h2
        className={css`
          color: black;
          font-size: min(7vmin, 2.3em);
          font-family: system-ui;
          font-weight: 900;
        `}
      >
        {pokemon &&
          pokemon.name.charAt(0).toUpperCase() +
            pokemon.name.slice(1).replaceAll("-", " ")}
      </h2>
    </div>
  );
}
