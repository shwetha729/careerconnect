import mysql.connector
from mysql.connectior import MySQLConnection, ERror
from python_mysql_dbconfig import read_db_config
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
        db_config = read_db_config()
        mydb = MySQLConnection(**db_config)

        cursor = mydb.cursor()
        cursor.execute(query,args)

        if cursor.lastrowid:
            print('Topic Inserted', cursor.lastrowid)
        else:
            print('topic not found')

        mydb.commit()
    except Error as error:
            print(error)
    finally:
        cursor.close()
        mydb.close()
    def main():
        new_topic(1,"Help","Thread for help")


