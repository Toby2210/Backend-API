CREATE TABLE public.articles (
	id serial,
	title varchar(32) NOT NULL,
	alltext text NOT NULL,
	summary text NULL,
	datecreated timestamp NOT NULL DEFAULT now(),
	datemodified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	imageurl varchar(2048) NULL,
	published bool NULL,
	authorid int4 NULL,
	description text NULL,
	CONSTRAINT articles_pkey PRIMARY KEY (id),
  CONSTRAINT fk_articles FOREIGN KEY (authorid) REFERENCES users (id)
);


INSERT INTO articles (title, alltext, imageurl, authorid, description) VALUES
	('title 1', 'some stuff','http://localhost:10888/api/v1/images/70332330-2744-4013-8752-048045222afd',	 1,'The selection process was fair for the Panel of Judges led by Professor Ir CY CHENG in view of the distinctive achievements of individual candidates.'),
	('another title', 'interesting','http://localhost:10888/api/v1/images/d3abd3a9-1af4-4baa-a0d6-fe75df2627f1',	 4,'The selection process was fair for the Panel of Judges led by Professor Ir CY CHENG in view of the distinctive achievements of individual candidates.'),
	('last one', 'ok','http://localhost:10888/api/v1/images/2e308af4-625e-41b2-904a-fe73fd07ff28',	 1,'The selection process was fair for the Panel of Judges led by Professor Ir CY CHENG in view of the distinctive achievements of individual candidates.' ),
	('this title is good', 'some text', 'http://localhost:10888/api/v1/images/c9cc3159-ed87-4109-a918-d6964c04784e	',	4,'The selection process was fair for the Panel of Judges led by Professor Ir CY CHENG in view of the distinctive achievements of individual candidates.');
