/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("usuarios", {
    id: { type: "serial", primaryKey: true },
    nome: { type: "varchar(255)", notNull: true },
    email: { type: "varchar(255)", notNull: true, unique: true },
    criado_em: { type: "timestamp", default: pgm.func("NOW()") },
  });
};

exports.down = (pgm) => {};
