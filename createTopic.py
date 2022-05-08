import mysql.connector
from mysql.connectior import MySQLConnection, Error
import create_time
import datetime

def getTime():
    ts = time.time()
    timestamp = datetime.datetime.fromtimestamp(ts).strftime('%m-%d-%Y %H:%M:%S')
def new_topic(topic_id, subj, body):
    date = getTime()
    query = "INSERT INTO Topics(topic_id, subj, body, create_time) " \
            "VALUES(%s,%s,%s,%s)"
    args = (topic_id, subj, body, date)

    try:
        conn = mysql.connector.connect(user='root',password='password', host='127.0.0.1',database='mydb')

        cursor = conn.cursor()
        cursor.execute(query,args)

        if cursor.lastrowid:
            print('Topic Inserted', cursor.lastrowid)
        else:
            print('topic not found')

        conn.commit()
    except Error as error:
            print(error)
    finally:
        cursor.close()
        conn.close()
    def main():
        new_topic(1,"Help","Thread for help")


