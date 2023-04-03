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
import jumbotronImg from '../images/background.jpg'

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
  // const { loading, data } = useQuery(QUERY_CARDS, {
  //   variables: { cardName: searchInput },
  // });
  const [fetch, { loading: searchLoading, data: searchData }] = useLazyQuery(QUERY_CARDS, {
    variables: { name: searchInput },
  });

  useEffect(() => {
    saveCardIds(savedCardIds);
  }, [savedCardIds]);

  useEffect(() => {
    console.log(searchData);
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
      // if (searchData && searchData.searchCards) {
      // setSearchedCards(searchData.searchCards);
      fetch({ name: searchInput });
      setSearchInput('');
      // }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCard = async (cardId) => {
    const cardToSave = searchedCards.find((card) => card.id === cardId);
    console.log("handling save card");
    console.log(cardToSave);
    if (!cardToSave) {
      return;
    }
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return;
    }
    try {
      await saveCard({
        variables: { cardId: cardToSave.id },
      });
      setSavedCardIds([...savedCardIds, cardToSave.id]);
    } catch (err) {
      console.error(err);
    }

  };

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark"
            style={{
              backgroundImage: `url(${jumbotronImg})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
            }}>
        <Container>
          <h1 className="text-center mb-4 text-dark">Find Your Favorite Pokemon Cards!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={9} className="mb-2 mb-md-0">
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a card"
                  className="shadow-none"
                />
              </Col>
              <Col xs={12} md={3}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  block
                  className="shadow-none"
                >
                  Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>
  
      <Container>
        <h2 className="text-center mb-4">
          {searchedCards.length
            ? `Viewing ${searchedCards.length} results:`
            : 'Search for a card to begin'}
        </h2>
  
        <CardColumns>
          {searchedCards.map((card) => {
            return (
              <Card key={card.id} border="primary" className="mb-4">
                {card.images.small ? (
                  <Card.Img
                    src={card.images.small}
                    alt={`The card titled ${card.name}`}
                    variant="top"
                    className="card-img-top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title className="text-center mb-4">
                    {card.name}
                  </Card.Title>
                  <Button
                    disabled={savedCardIds?.some(
                      (savedCardId) => savedCardId === card.id
                    )}
                    onClick={() => handleSaveCard(card.id)}
                    className="btn-primary btn-block shadow-none"
                  >
                    {savedCardIds?.some(
                      (savedCardId) => savedCardId === card.id
                    )
                      ? 'This card has already been saved!'
                      : 'Save This Card!'}
                  </Button>
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
