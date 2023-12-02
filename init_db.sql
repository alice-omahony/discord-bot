-- Create the discordbot database
CREATE DATABASE discordbot;

-- Connect to the discordbot database
\c discordbot;

CREATE TABLE auth (
  id varchar(255) PRIMARY KEY,
  token varchar(255) NOT NULL UNIQUE,
  expire integer NOT NULL,
  refresh_token varchar(255) NOT NULL UNIQUE,
  scopes jsonb NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE quotes (
  id varchar(255) PRIMARY KEY,
  name varchar(255) NOT NULL,
  content varchar(255) NOT NULL,
  reporter varchar(255) NOT NULL,
  reported_at timestamp NOT NULL
);

-- quotes {
--  messageId, name, quoter-name, timestamp, content
-- }