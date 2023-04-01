import React, { useState, useEffect } from 'react';
import {
  Jumbotron,
  Container,
  Col,
  Form,
  Button,
  Card,
  CardColumns,
} from 'react-bootstrap';

import { useMutation, useLazyQuery } from '@apollo/client';
import { SAVE_CARD } from '../utils/mutations';
import { saveCardIds, getSavedCardIds } from '../utils/localStorage';
import { QUERY_CARDS } from '../utils/queries';

import Auth from '../utils/auth';


const SearchCards = () => {
  const [searchedCards, setSearchedCards] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedCardIds, setSavedCardIds] = useState(getSavedCardIds());
  const [saveCard, { error }] = useMutation(SAVE_CARD);
  const [fetch, { loading: searchLoading, data: searchData }] = useLazyQuery(QUERY_CARDS, {
    variables: { name: searchInput },
  });

  useEffect(() => {
    saveCardIds(savedCardIds);
  }, [savedCardIds]);

  useEffect(() => {
    if (searchData && searchData.card) {
      setSearchedCards(searchData.card);
    }
  }, [searchData]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!searchInput) {
      return;
    }
    try {
      fetch({ name: searchInput });
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCard = async (cardId) => {
    const cardToSave = searchedCards.find((card) => card.cardId === cardId);
    if (!cardToSave) {
      return;
    }
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return;
    }
    // Check if the card is already saved
    if (savedCardIds.includes(cardId)) {
      console.log("This card has already been saved!");
      return;
    }
    try {
      await saveCard({
        variables: { cardData: cardToSave },
      });
      setSavedCardIds([...savedCardIds, cardToSave.cardId]);
    } catch (err) {
      console.error(err);
    }
  };
  
  


  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Search for Cards!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a card"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedCards.length
            ? `Viewing ${searchedCards.length} results:`
            : 'Search for a card to begin'}
        </h2>

        <CardColumns>
          {searchedCards.map((card) => {
            return (
              <Card key={`searchCards-${card.cardId || card.id}`} border="dark">

                {card.images.small ? (
                  <Card.Img src={card.images.small} alt={`The card titled ${card.name}`} variant="top" />
                ) : null}
                <Card.Body>
                  <Card.Title>{card.name}</Card.Title>
                </Card.Body>
                <Card.Footer>
                  <Button
                    disabled={savedCardIds?.some((savedCardId) => savedCardId === card.cardId)}
                    className='btn-block btn-info'
                    onClick={() => handleSaveCard(card.cardId)}>
                    {savedCardIds?.some((savedCardId) => savedCardId === card.cardId)
                      ? 'This card has already been saved!'
                      : 'Save This Card!'}
                  </Button>
                </Card.Footer>
              </Card>
            );
          })}

        </CardColumns>
      </Container>

    </>

  );
};

export default SearchCards;
