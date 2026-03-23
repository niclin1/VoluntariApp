/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('usuarios', {
    initials: { type: 'varchar(16)' },
    city: { type: 'varchar(128)' },
    state: { type: 'varchar(64)' },
    member_since: { type: 'integer' },
    interest_area: { type: 'varchar(64)' },
    availability: { type: 'varchar(64)' },
    modality: { type: 'varchar(64)' },
    total_hours: { type: 'integer' },
  });
};

exports.down = (pgm) => {};
