exports.up = function (knex) {
  return knex.schema
    .createTable("registerUser", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("email").notNullable().unique();
      table.string("password").notNullable();
      table.date("dob").notNullable();
      table.decimal("send_money",10, 2); // Use decimal or integer based on your needs
      table.string("currency");
    })
    .createTable("userInfo", (table) => {
      table.increments("id").primary();
      table
        .integer("userId")
        .unsigned()
        .notNullable()
        .references("registerUser.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("name").notNullable();
      table.decimal("send_money",10, 2);
      table.string("currency");
      table.timestamp("transaction_time").defaultTo(knex.fn.now())
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("userInfo").dropTable("registerUser");
};
