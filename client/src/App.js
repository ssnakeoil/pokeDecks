import { React, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import "./App.css";
import SearchCard from "./pages/SearchCard";
import SaveCard from "./pages/SaveCard";
import Navbar from "./components/Navbar";
// import pokeballBg from "./images/pokeball_bg.png";
import searchcard from "./images/searchcard.png";

// GraphQL API endpoint
const httpLink = createHttpLink({
  uri: "http://localhost:3001/graphql",
});

// Retrieve the token from local storage
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Create a new Apollo client using the `authLink` and `httpLink` created above

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const BG = {
  backgroundImage: `url(${searchcard})`,
  backgroundSize: "100%",
  backgroundPosition: "center center",
  minHeight: "100vh",
  padding: "10px",
  topMargin: "10px",
};

function App() {
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
     setIsHover(true);
  };
  const handleMouseLeave = () => {
     setIsHover(false);
  };
  const appContainer = {
    background: "black",
    backgroundPosition: "center center",
    maxWidth: "1000px",
    padding: "15px",
    margin: "0 auto",
    minHeight: "50vh",
    maxHeight: "70vh",
    overflow: "auto",
    opacity: isHover ? "99%" : "90%",
    transition: "all 0.5s ease-in-out",
    borderRight: "solid 10px #AC0A0A",
    borderLeft: "solid 10px #AC0A0A",
  };

  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <div style={BG}>
          <Navbar />
              <div 
                style={appContainer}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
              <Routes>
                <Route path="/" element={<SearchCard />} />
                <Route path="/saved" element={<SaveCard />} />
                <Route
                  path="*"
                  element={<h1 className="display-2">Wrong page!</h1>}
                />
              </Routes>
            </div>
            <footer
            style={{
            background: "#AC0A0A",
            maxWidth: "1000px",
            margin: "0 auto",
            height: "150px",
            borderRadius: "0px 0px 30px 30px",
            color: "#FFF",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          ><a href="https://github.com/ssnakeoil/pokeDecks" style={{ color: '#FFF' }}>Follow Our GitHub Repository!</a>
          <p>Made with love 🖤 2023</p>
          <p>This project was a collaboration between <a href="https://github.com/jessikea" style={{ color: '#FFF' }}>Jessica Tran</a>, <a href="https://github.com/ssnakeoil" style={{ color: '#FFF' }}>Stefi Lao</a>, <a href="https://github.com/Tochio12" style={{ color: '#FFF' }}>Tochio Herrera</a>, and <a href="https://github.com/FrancisLao9" style={{ color: '#FFF' }}>Francis Lao</a></p></footer>
          </div>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
