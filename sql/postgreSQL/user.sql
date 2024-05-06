CREATE TABLE public.users (
	id serial,
	firstname varchar(32) NULL,
	lastname varchar(32) NULL,
	username varchar(16) NOT NULL,
	about text NULL,
	dateregistered timestamp NOT NULL DEFAULT now(),
	"password" varchar(32) NULL,
	passwordsalt varchar(16) NULL,
	email varchar(64) NOT NULL,
	avatarurl varchar(64) NULL,
  role text, 
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id),
	CONSTRAINT users_username_key UNIQUE (username)
);



INSERT INTO users (username, email, password, role) VALUES
	('alice', 'alice@example.com', '123456', 'admin'),
	('bob', 'bob@example.com','123456', 'user'),
	('colin', 'colin@example.com','123456', 'user'),
	('cycheng', 'cycheng@example.com','654321', 'admin');
  