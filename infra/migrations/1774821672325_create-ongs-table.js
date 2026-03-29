/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("ongs", {
    id: { type: "serial", primaryKey: true },
    nome: { type: "varchar(255)", notNull: true },
    localidade: { type: "varchar(255)", notNull: true },
    email: { type: "varchar(255)", notNull: true, unique: true },
    telefone: { type: "varchar(50)", notNull: true },
    criado_em: { type: "timestamp", default: pgm.func("NOW()") },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("ongs");
};

