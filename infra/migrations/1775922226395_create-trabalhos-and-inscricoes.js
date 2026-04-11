/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Criando a tabela 'Trabalho' da modelagem
  pgm.createTable("trabalhos", {
    id: { type: "serial", primaryKey: true },
    ong_id: {
      type: "integer",
      notNull: true,
      references: '"ongs"',
      onDelete: "cascade",
    },
    titulo: { type: "varchar(255)", notNull: true },
    descricao: { type: "text", notNull: true },
    n_vagas: { type: "integer", notNull: true },
    categoria: { type: "varchar(100)", notNull: true },
    disponibilidade: { type: "varchar(100)", notNull: true },
    carga_horaria: { type: "integer", notNull: true }, // em horas
    criado_em: { type: "timestamp", default: pgm.func("NOW()") },
  });

  // Criando a tabela de relacionamento "Trabalha em" (Inscricoes) do diagrama
  pgm.createTable("inscricoes", {
    id: { type: "serial", primaryKey: true },
    voluntario_id: {
      type: "integer",
      notNull: true,
      references: '"usuarios"',
      onDelete: "cascade",
    },
    trabalho_id: {
      type: "integer",
      notNull: true,
      references: '"trabalhos"',
      onDelete: "cascade",
    },
    status: { type: "varchar(50)", default: "pendente" },
    dt_inscricao: { type: "timestamp", default: pgm.func("NOW()") },
  });

  // Garantir que o mesmo voluntário não se inscreva duas vezes na mesma vaga
  pgm.addConstraint("inscricoes", "unique_inscricao", {
    unique: ["voluntario_id", "trabalho_id"],
  });
};

exports.down = (pgm) => {
  pgm.dropTable("inscricoes");
  pgm.dropTable("trabalhos");
};
