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
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_CARD } from '../utils/mutations';
import { removeCardId } from '../utils/localStorage';

import Auth from '../utils/auth';

const SavedCards = () => {
  const client = useApolloClient();
  const { loading, data } = useQuery(QUERY_ME);
  const [removeCard, { error }] = useMutation(REMOVE_CARD);

  const userData = data?.me || {};

  // create function that accepts the card's mongo _id value as param and deletes the card from the database
  const handleDeleteCard = async (cardId) => {
    try {
      // Call the removeCard mutation with the cardId variable
      await removeCard({
        variables: { cardId },
      });

      // Get the updated user data from the cache
      const { me } = client.readQuery({ query: QUERY_ME });

      // Filter the deleted card out of the savedCards list
      const updatedSavedCards = me.savedCards.filter((card) => card.id !== cardId);

      // Write the updated data back to the cache
      client.writeQuery({
        query: QUERY_ME,
        data: {
          me: {
            ...me,
            savedCards: updatedSavedCards,
          },
        },
      });
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
                  <Card.Title>{card.name}</Card.Title>
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
