import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import './App.css';

import SearchCard from './pages/SearchCard';
import SaveCard from './pages/SaveCard';
// import Navbar from './components/Navbar';

// GraphQL API endpoint
const httpLink = new HttpLink({
  uri: '/graphql',
});

// Retrieve the token from local storage
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Create a new Apollo client using the `authLink` and `httpLink` created above
const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          {/* <Navbar /> */}
          <Routes>
            <Route 
              path="/" 
              element={<SearchCard/>} 
            />
            <Route 
              path="/saved" 
              element={<SaveCard/>} 
            />
            <Route 
              path='*' 
              element={<h1 className="display-2">Wrong page!</h1>}
            />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
