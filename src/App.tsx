import React from "react";
import { useEffect, useState } from "react";

import { z } from "zod";

import "./App.css";
//Déclaration du typage avant la fonction pour éviter la redéclaration a chque passage dans la fonction.
const CharacterSchema = z.object({
  name: z.string(),
  image: z.string(),
  dateOfBirth: z.string(),
});
const CharacterListSchema = z.array(CharacterSchema);
type CharacterList = z.infer<typeof CharacterListSchema>;

function App() {
  const [data, setData] = useState<CharacterList | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://hp-api.herokuapp.com/api/characters"
        );
        console.log(response);

        const rawData = await response.json();
        // 👇🏼 Fait vérification que les données correspondent bien au typage
        const dataCharacters = CharacterListSchema.parse(rawData);
        // 👇🏼 Enregistre les datas dans le state
        setData(dataCharacters);
        //setData(response.data);
        setIsLoading(false);
      } catch (error: any) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  return isLoading ? (
    <p>En cours de chargement...</p>
  ) : (
    <div>
      <div className="header-container">
        <h1 className="title">Harry Potter Characters</h1>
      </div>
      <div className="home-container">
        {data?.map((character, index: number) => {
          return (
            <div className="characterCard" key={character.name + index}>
              <div
                className="card"
                key={`button_${character.dateOfBirth + index}`}
              >
                {character.name}
                <img
                  className="characterPicture"
                  src={character.image}
                  alt={character.image}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
