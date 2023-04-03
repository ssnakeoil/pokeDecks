const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");

const { signToken } = require("../utils/auth");
const { findCardbyName, findCardById } = require("../utils/tcgPokemon");
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );

        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },
    card: async (parent, { name }) => {
      console.log("hello");
      const cardData = await findCardbyName(name);
      return cardData;
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }, context) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
    //   //saveCard
    saveCard: async (parent, { cardId }, context) => {
      try {
        if (context.user) {
          const card = await findCardById(cardId);
          const updatedUser = await User.findOneAndUpdate(
            { _id: context?.user?._id ?? "642370fc731d177d0a31a309" },
            { $addToSet: { savedCards: card } },
            { new: true }
          );

          return updatedUser;
        }
        throw new AuthenticationError("You need to be logged in!");
      } catch (error) {
        console.log(error);
      }
    },

    removeCard: async (parent, { cardId }, context) => {
      if (context.user) {
        const card = await findCardById(cardId);
        const updatedUser = await User.findOneAndUpdate(
          { _id: context?.user?._id ?? "642370fc731d177d0a31a309" },
          { $pull: { savedCards: { cardId: card.cardId } } },
          { new: true }
        );

        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
