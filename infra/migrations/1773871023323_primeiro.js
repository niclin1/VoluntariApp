/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("usuarios", {
    id: { type: "serial", primaryKey: true },
    nome: { type: "varchar(255)", notNull: true },
    initials: { type: "varchar(16)" },

    email: { type: "varchar(255)", notNull: true, unique: true },
    city: { type: "varchar(255)", notNull: true },
    state: { type: "varchar(255)", notNull: true },
    interestArea: { type: "varchar(255)", notNull: true },
    memberSince: { type: "date", notNull: true },
    availability: { type: "varchar(255)", notNull: true },
    modality: { type: "varchar(255)", notNull: true },
    totalHours: { type: "integer", notNull: true, default: 0 },
    criado_em: { type: "timestamp", default: pgm.func("NOW()") },
  });
};

exports.down = (pgm) => {};
