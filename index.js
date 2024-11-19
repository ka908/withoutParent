const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const typeDefs = require("./schema.graphql/schema.js");
const resolvers = require("./schema.graphql/resolvers.js");
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
(async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: ({ req }) => {
      try {
        const queryType = req.body?.operationName;
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return {};
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
          return {};
        }
        if (
          queryType === "Login" ||
          queryType === "registration" ||
          queryType === "loginUPosts" ||
          queryType === "insertPost"
        ) {
          return {};
        }
        const decoded = jwt.verify(token, process.env.SECRET);
        return { user: { id: decoded.id } };
      } catch (error) {
        console.warn("Authorization error:", error.message);
        return {};
      }
    },
  });

  console.log(`🚀  Server ready at: ${url}`);
})();
