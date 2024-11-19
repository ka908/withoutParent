const knex = require("../database.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const resolvers = {
  Query: {
    async getAllPosts(_, args) {
      try {
        const data = await knex("posts").select("*");
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async getCombined(parent, { input }) {
      try {
        const { email } = input;
        console.log(input);
        const user = await knex("usersWithPosts")
          .select("*")
          .where({ email: input.email })
          .first();
        console.log(user.id);
        const posts = await knex("posts")
          .select("*")
          .where({ userId: user.id });
        console.log(posts);
        return [
          {
            id: user.id,
            name: user.name,
            email: user.email,
            posts,
          },
        ];
      } catch (e) {
        throw new Error(e.message);
      }
    },
    async getUserPosts(_, args) {
      try {
        const data = await knex("posts as p")
          .join("usersWithPosts as u", "p.userId", "u.id")
          .where("u.id", args.id)
          .select(
            "u.id as userId",
            "u.name",
            "u.email",
            "p.id as id",
            "p.title",
            "p.content"
          );
        const userWithPosts = {
          id: data[0].userId,
          name: data[0].name,
          email: data[0].email,
          posts: data.map((post) => ({
            id: post.id,
            userId: post.userId,
            title: post.title,
            content: post.content,
          })),
        };
        return [userWithPosts];
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    async updatePosts(_, { input }) {
      try {
        console.log("hhhh", input);
        const data = await knex("posts")
          .update({ content: input.content })
          .where({ id: input.id })
          .returning("*");
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async deletePosts(_, { input }) {
      try {
        console.log("hhhh", input.id);
        const data = await knex("posts")
          .select("*")
          .where({ id: input.id })
          .first();
        console.log(typeof data);
        if (!data || data.length === 0) {
          return {
            message: "Record already deleted or does not exist",
            deletedPost: null,
          };
        }
        const data1 = await knex("posts")
          .delete()
          .where({ id: input.id })
          .returning("*");
        return {
          message: "Record successfully deleted",
          deletedPost: data1,
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async insertPost(parent, { input }) {
      try {
        console.log(parent);
        const { title, content, userId } = input;
        console.log("datainput", input);
        const data = await knex("posts")
          .insert({ title: title, content: content, userId: userId })
          .returning("*");
        console.log("data", data);
        return data[0];
      } catch (e) {
        throw new Error(e.message);
      }
    },
    async registrationUPosts(parent, { input }) {
      try {
        const { name, email, password } = input;
        console.log(input.name);
        const check1 = await knex("usersWithPosts")
          .select("*")
          .where({ email: email })
          .first();
        console.log(check1);
        const hashedPassword = await bcrypt.hash(password, 10);
        if (!check1) {
          const data = await knex("usersWithPosts")
            .insert({
              name: input.name,
              email: input.email,
              password: hashedPassword,
            })
            .returning("*");
          return data;
        }
      } catch (e) {
        throw new Error(e.message);
      }
    },
    async loginUPosts(_, { input }) {
      try {
        const { email, password } = input;
        const verification = await knex("usersWithPosts")
          .where({ email: email })
          .first();
        if (verification) {
          const isValid = await bcrypt.compare(
            password,
            verification["password"]
          );
          if (isValid) {
            const token = jwt.sign(
              { id: verification["id"] },
              process.env.SECRET
            );
            return data;
          }
        }
      } catch (e) {
        throw new Error(e.message);
      }
    },
  },
  // UP: {
  //   posts: async (parent) => {
  //     const a = await knex("posts").where({ userId: parent.id });
  //     console.log("hello", a);
  //     return a;
  //   },
  // },
};

module.exports = resolvers;
