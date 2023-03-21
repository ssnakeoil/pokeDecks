import React, { useState, useEfgetSavedCardIdsfect } from 'react';
import {
  Jumbotron,
  Container,
  Col,
  Form,
  Button,
  Card,
  CardColumns,
} from 'react-bootstrap';

import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import { saveCardIds, getSavedCardIds } from '../utils/localStorage';

import Auth from '../utils/auth';

const SearchCards = () => {
    // create state for holding returned google api data
    const [searchedCards, setSearchedCards] = useState([]);
    // create state for holding our search field data
    const [searchInput, setSearchInput] = useState('');
  
    // create state to hold saved cardId values
    const [savedCardIds, setSavedCardIds] = useState(getSavedCardIds());
  
    const [saveCard, { error }] = useMutation(SAVE_BOOK);
  
    // set up useEffect hook to save `savedCardIds` list to localStorage on component unmount
    // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
    useEffect(() => {
      return () => saveCardIds(savedCardIds);
    });
  
    // create method to search for cards and set state on form submit
    const handleFormSubmit = async (event) => {
      event.preventDefault();
  
      if (!searchInput) {
        return false;
      }
  
      try {
        const response = await fetch(
          `https://www.googleapis.com/cards/v1/volumes?q=${searchInput}`
        );
  
        if (!response.ok) {
          throw new Error('something went wrong!');
        }
  
        const { items } = await response.json();
  
        const cardData = items.map((card) => ({
          cardId: card.id,
          authors: card.volumeInfo.authors || ['No author to display'],
          title: card.volumeInfo.title,
          description: card.volumeInfo.description,
          image: card.volumeInfo.imageLinks?.thumbnail || '',
        }));
  
        setSearchedCards(cardData);
        setSearchInput('');
      } catch (err) {
        console.error(err);
      }
    };
  
    // create function to handle saving a card to our database
    const handleSaveCard = async (cardId) => {
      // find the card in `searchedCards` state by the matching id
      const cardToSave = searchedCards.find((card) => card.cardId === cardId);
  
      // get token
      const token = Auth.loggedIn() ? Auth.getToken() : null;
  
      if (!token) {
        return false;
      }
  
      try {
        const { data } = await saveCard({
          variables: { cardData: { ...cardToSave } },
        });
        console.log(savedCardIds);
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
                    Submit Search
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
                <Card key={card.cardId} border="dark">
                  {card.image ? (
                    <Card.Img
                      src={card.image}
                      alt={`The cover for ${card.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{card.title}</Card.Title>
                    <p className="small">Authors: {card.authors}</p>
                    <Card.Text>{card.description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedCardIds?.some(
                          (savedId) => savedId === card.cardId
                        )}
                        className="btn-block btn-info"
                        onClick={() => handleSaveCard(card.cardId)}
                      >
                        {savedCardIds?.some((savedId) => savedId === card.cardId)
                          ? 'Card Already Saved!'
                          : 'Save This Card!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              );
            })}
          </CardColumns>
        </Container>
      </>
    );
  };
  
  export default SearchCards;
  