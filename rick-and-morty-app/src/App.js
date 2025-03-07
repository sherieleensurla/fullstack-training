import React, { useState, useEffect } from "react";
import CharacterList from "./components/CharacterList";
import AppNavbar from "./components/AppNavbar";
import { fetchCharacters } from "./services/api";
import "./styles.css";

const App = () => {
  const [characters, setCharacters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [speciesFilter, setSpeciesFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  useEffect(() => {
    fetchCharacters().then((data) => setCharacters(data));
  }, []);

  // Filtering and Sorting Logic
  const filteredCharacters = characters
    .filter((char) =>
      char.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((char) => (speciesFilter ? char.species === speciesFilter : true))
    .filter((char) => (genderFilter ? char.gender === genderFilter : true))
    .sort((a, b) =>
      sortOrder === "asc" ? a.id - b.id : b.id - a.id
    );

  return (
    <div>
      <AppNavbar
        setSearchTerm={setSearchTerm}
        setSortOrder={setSortOrder}
        setSpeciesFilter={setSpeciesFilter}
        setGenderFilter={setGenderFilter}
      />
      <CharacterList characters={filteredCharacters} />
    </div>
  );
};

export default App;