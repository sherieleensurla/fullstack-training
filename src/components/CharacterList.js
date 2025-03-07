import React, { useEffect, useState } from "react";
import { fetchCharacters } from "../services/api";
import CharacterCard from "./CharacterCard";
import { Container, Row, Col, Form } from "react-bootstrap";

const CharacterList = () => {
  const [characters, setCharacters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  useEffect(() => {
    const getCharacters = async () => {
      const data = await fetchCharacters();
      setCharacters(data);
    };
    getCharacters();
  }, []);

  // Search characters by name
  const filteredCharacters = characters
    .filter((char) => char.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((char) => (selectedSpecies ? char.species === selectedSpecies : true))
    .filter((char) => (selectedGender ? char.gender === selectedGender : true))
    .sort((a, b) => (sortOrder === "asc" ? a.id - b.id : b.id - a.id));

  return (
    <Container>
      {/* Search and Filter */}
      <Form className="mb-4">
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Form.Group>
        <Row className="mt-3">
          <Col>
            <Form.Select onChange={(e) => setSortOrder(e.target.value)}>
              <option value="asc">Sort by ID (Ascending)</option>
              <option value="desc">Sort by ID (Descending)</option>
            </Form.Select>
          </Col>
          <Col>
            <Form.Select onChange={(e) => setSelectedSpecies(e.target.value)}>
              <option value="">All Species</option>
              <option value="Human">Human</option>
              <option value="Alien">Alien</option>
            </Form.Select>
          </Col>
          <Col>
            <Form.Select onChange={(e) => setSelectedGender(e.target.value)}>
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      {/* Character List */}
      <Row>
        {filteredCharacters.map((character) => (
          <Col key={character.id} xs={6} md={3}>
            <CharacterCard character={character} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CharacterList;