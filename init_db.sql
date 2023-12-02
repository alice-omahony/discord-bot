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