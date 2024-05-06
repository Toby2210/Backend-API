CREATE TABLE users (
      ID INT NOT NULL AUTO_INCREMENT,  
      firstName VARCHAR(32),  
      lastName VARCHAR(32),
      username VARCHAR(16) UNIQUE NOT NULL,
      about TEXT,
      dateRegistered DATETIME DEFAULT CURRENT_TIMESTAMP,
      password VARCHAR(32),  
      passwordSalt VARCHAR(16),  
      email VARCHAR(64) UNIQUE NOT NULL,
      avatarURL VARCHAR(64),
      PRIMARY KEY (ID)
);

INSERT INTO users (username, email) VALUES
	("alice", "alice@example.com"),
	("bob", "bob@example.com"),
	("colin", "colin@example.com");
