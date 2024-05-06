CREATE TABLE articles (
      ID INT NOT NULL AUTO_INCREMENT,  
      title VARCHAR(32) NOT NULL,  
      allText TEXT NOT NULL,
      summary TEXT,
      dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
      dateModified DATETIME ON UPDATE CURRENT_TIMESTAMP,
      imageURL VARCHAR(2048),  
      published BOOL,
      authorID INT,
      PRIMARY KEY (ID),
      FOREIGN KEY (authorID) REFERENCES users (ID)
);

INSERT INTO articles (title, allText, authorID) VALUES
	("title 1", "some stuff", 1),
	("another title", "interesting", 1),
	("last one", "ok", 1),
	("this title is good", "some text", 3);
