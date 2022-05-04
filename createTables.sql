CREATE TABLE Users(
    user_id INT NOT NULL,
    username VARCHAR(16) NOT NULL,
    email VARCHAR(255) NOT NULL,
    firstname VARCHAR(32) NOT NULL,
    lastname VARCHAR(32) NOT NULL,
    password VARCHAR(32) NOT NULL,
    create_time TIMESTAMP,
    permission INT,
    PRIMARY KEY (username)
);

CREATE TABLE Events(
    event_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    descript TEXT,
    create_time TIMESTAMP,
    time_begin DATETIME,
    time_end DATETIME,
    PRIMARY KEY (event_id)
);

CREATE TABLE Attendants(
    list_id INT NOT NULL,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    confirmation VARCHAR(45),
    comments TEXT,
    PRIMARY KEY (list_id),
    FOREIGN KEY (event_id) REFERENCES Events(event_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Topics(
    topic_id INT NOT NULL,
    subj VARCHAR(255),
    body TEXT,
    create_time TIMESTAMP,
    PRIMARY KEY (topic_id)
);

CREATE TABLE Posts(
    post_id INT NOT NULL,
    topic_id INT NOT NULL,
    user_id INT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    create_time DATETIME,
    PRIMARY KEY (post_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (topic_id) REFERENCES Topics(topic_id)
);

CREATE TABLE Replies(
    reply_id INT NOT NULL,
    post_id INT NOT NULL,
    topic_id INT NOT NULL,
    user_id INT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    create_time DATETIME,
    PRIMARY KEY (reply_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (post_id) REFERENCES Posts(post_id)
);
