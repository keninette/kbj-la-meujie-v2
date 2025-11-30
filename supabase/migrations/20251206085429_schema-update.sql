CREATE TABLE IF NOT EXISTS adventure (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR NOT NULL
);

INSERT INTO adventure(name)
VALUES ('Le retour de Cyaegha');