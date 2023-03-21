import React, { useState, useEffect } from 'react';
import {
    Container,
    Card,
    Button,
    Row,
    Col
} from 'react-bootstrap';

//getMe and deleteCard inside Utils/api
import { getMe, deleteCard } from '../utils/api';
import Auth from '../utils/auth';
import { removeCardId } from '../utils/localStorage';

const SaveCard = () => {
    const [userData, setUserData] = useState({});
    const userDataLength = Object.keys(userData).length;

    useEffect(() => {
        const getUserData = async () => {
            try {
                const token = Auth.loggedIn() ? Auth.getToken() : null;

                if (!token) {
                    return false;
                }
                const response = await getMe(token);
                if (!response.ok) {
                    throw new Error('something went wrong!');
                }

                const user = await response.json();
                setUserData(user);
            } catch (err) {
                console.error(err);
            }
        };
        getUserData();
    }, [userDataLength]);

    const handleDeleteCard = async (cardId) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }

        try {
            const response = await deleteCard(cardId, token);
            if (!response.ok) {
                throw new Error('Something went wrong Ref:deleteCard');
            }
            const updatedUser = await response.json();
            setUserData(updatedUser);
            removeCardId(cardId);
        } catch (err) {
            console.error(err);
        }
    };

    if (!userDataLength) {
        return <h2>Loading...</h2>;
    }

    return (
        <>
            {/* insert css/className here */}
            <div fluid className = ''>
                <Container>
                    <h1>Viewing Your Collection</h1>
                </Container>
            </div>
            <Container>
                {/* Title css/className */}
                <h2 className=''>
                    {userData.SaveCard.length
                        ? `Viewing ${userData.SaveCard.length} saved ${userData.SaveCard.length === 1 ? 'card' : 'cards'}:`
                        : 'You have no saved cards...'}
                </h2>
                <Row>
                    {userData.SaveCard.map((card) => {
                        return (
                            <Col md='4'>
                                <Card key={card.cardId}>
                                    {card.image ? <Card.Img src={card.image} /> :null }
                                    <Card.body>
                                        <Card.Title>{card.title}</Card.Title>
                                        <Card.Text>{card.description}</Card.Text>
                                        {/* Button */}
                                        <Button className='btn' onClick={() => handleDeleteCard(card.cardId)}>
                                            Remove Card
                                        </Button>
                                    </Card.body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </>
    )
}

export default SaveCard;