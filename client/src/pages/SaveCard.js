import React from 'react';
import {
    Jumbotron,
    Container,
    CardColumns,
    Card,
    Button,
    // Row,
    // Col
} from 'react-bootstrap';

//getMe and deleteCard inside Utils/api
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_CARD } from '../utils/mutations';
import { removeCardId } from '../utils/localStorage';

import Auth from '../utils/auth';

const SavedCards = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const [removeCard, { error }] = useMutation(REMOVE_CARD);

  const userData = data?.me || {};

  // create function that accepts the card's mongo _id value as param and deletes the card from the database
  const handleDeleteCard = async (cardId) => {
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeCard({
        variables: { cardId },
      });

      // upon success, remove card's id from localStorage
      removeCardId(cardId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing {userData.username}'s cards!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedCards?.length
            ? `Viewing ${userData.savedCards.length} saved ${
                userData.savedCards.length === 1 ? 'card' : 'cards'
              }:`
            : 'You have no saved cards!'}
        </h2>
        <CardColumns>
          {userData.savedCards?.map((card) => {
            return (
              <Card key={card.id} border="dark">
                {card.images.small ? (
                  <Card.Img
                    src={card.images.small}
                    alt={`The cover for ${card.name}`}
                    variant="top"
                    className="card-img-top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{card.title}</Card.Title>
                  <p className="small">: {card.authors}</p>
                  <Card.Text>{card.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteCard(card.id)}
                  >
                    Delete this Card!
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

export default SavedCards;
