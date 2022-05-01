import mysql.connector

fourm = mysql.connector.connect(
    user="root"
    passwd = "abcdefg"
    db= "forum"
) #change to whatever the host of the mysql server is

cursorObj = forum.cursor()

users = """CREATE TABLE USER ( 
           user_id INT NOT NULL,
           username VARCHAR(16) NOT NULL,
           email VARCHAR(255),
           PASSWORD VARCHAR(32) NOT NULL,
           create_time TIMESTAMP
           PRIMARY KEY('user_id')
           )"""

topics = """CREATE TABLE TOPICS (
           topic_id INT NOT NULL,
           subject VARCHAR(255)
           body TEXT
           create_time TIMESTAMP
           PRIMARY KEY('topic_id')
           )"""

posts = """CREATE TABLE POSTS (
           post_id INT NOT NULL,
           topic_id INT NOT NULL,
           user_id INT NOT NULL
           title TEXT NOT NULL
           body TEXT NOT NULL
           create_time TIMESTAMP
           PRIMARY KEY('post_id')
           FOREIGN KEY('topic_id') REFERENCES TOPIC('topic_id')
           FOREIGN KEY('user_id') REFERENCES USER('user_id')
           )"""

posts = """CREATE TABLE REPLIES (
           reply_id INT NOT NULL,
           post_id INT NOT NULL,
           topic_id INT NOT NULL,
           user_id INT NOT NULL
           title TEXT NOT NULL
           body TEXT NOT NULL
           create_time TIMESTAMP
           PRIMARY KEY('reply_id')
           FOREIGN KEY('topic_id') REFERENCES TOPIC('topic_id')
           FOREIGN KEY ('post_id') REFERENCES POSTS('post_id')
           FOREIGN KEY('user_id') REFERENCES USER('user_id')
           )"""
           



            
cursorObj.execute(users)
cursorObj.execute(topics)
cursorObj.execute(posts)
cursorObj.execute(replies)

forum.close()
