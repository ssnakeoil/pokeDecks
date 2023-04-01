import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_CARD, SAVE_CARD } from '../utils/mutations';
import Auth from '../utils/auth';

const SavedCards = () => {
  const { loading, data: userData, refetch } = useQuery(QUERY_ME);

  const [saveCard] = useMutation(SAVE_CARD, {
    refetchQueries: [{ query: QUERY_ME }]
  });

  const [removeCard] = useMutation(REMOVE_CARD, {
    refetchQueries: [{ query: QUERY_ME }]
  });

  const handleSaveCard = async (cardId) => {
    try {
      await saveCard({ variables: { cardId } });
      // Call some function or display a message indicating that the card was saved
    } catch (e) {
      console.error(e);
    }
  };
  

  const handleDeleteCard = async (cardId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeCard({ variables: { cardId } });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  const savedCards = userData?.me?.savedCards;

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing {userData?.me?.username}'s cards!</h1>
        </Container>
      </Jumbotron>
      <Container>
        {savedCards && savedCards.length ? (
          <>
            <h2>Viewing {savedCards.length} saved {savedCards.length === 1 ? 'card' : 'cards'}:</h2>
            <CardColumns>
              {savedCards.map((card) => (
                <Card key={card.id} border="dark">
                  <Card.Title>{card.name}</Card.Title>
                  <p className="small">Rarity: {card.rarity}</p>
                  <Card.Text>{card.series}</Card.Text>
                  <Button className="btn-block btn-danger" onClick={() => handleDeleteCard(card.id)}>Delete this Card!</Button>
                </Card>
              ))}
            </CardColumns>
          </>
        ) : (
          <h2>You have no saved cards!</h2>
        )}
      </Container>
    </>
  );
};

export default SavedCards;
