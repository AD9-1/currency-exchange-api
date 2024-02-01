exports.seed = async function (knex) {
  await knex("registerUser").del();
  await knex("registerUser").insert([
    {
      id: 1,
      name: "Aparna",
      email: "aparna@gmail.com",
      password: "aparna",
      dob: "1991-09-29",
    },
    {
      id: 2,
      name: "John",
      email: "john@gmail.com",
      password: "john",
      dob: "1982-08-24",
    },
    {
      id: 3,
      name: "Jack",
      email: "jack@gmail.com",
      password: "Jacki",
      dob: "2000-05-01",
    },
  ]);
};
