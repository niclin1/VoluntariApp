/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('usuarios', {
    password: { type: 'varchar(255)', default: '' },
    role: { type: 'varchar(64)', notNull: true, default: 'volunteer' },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('usuarios', ['password', 'role']);
};
