from flask import Flask, jsonify
import mysql.connector as mysql

service = Flask(__name__)

IS_ALIVE = "yes"
DEBUG = True
PAGE_SIZE = 8

MYSQL_SERVER = "database"
MYSQL_USER = "root"
MYSQL_PASS = "admin"
MYSQL_BASE_NAME = "keep_learning"

def get_bd_connection():
    connection = mysql.connect(
        host=MYSQL_SERVER, user=MYSQL_USER, password=MYSQL_PASS, database=MYSQL_BASE_NAME
    )
    return connection
def generate_comments(record):
    comment = {
            "_id": record["id"],
                "course_id": record["course_id"],
                "user": {
                    "email": record["user_email"],
                    "name": record["user_name"]
                },
            "datetime": record["date"],
            "comment": record["comment"]
        }
    
    return comment

@service.route("/comments/<int:page>/<int:feedId>")
def get_comments(page, feedId):
    comments = []
    
    connection = get_bd_connection()
    cursor = connection.cursor(dictionary=True)
    
    cursor.execute(
        "SELECT id, comment, date, user_name, user_email, course_id "+
        "FROM comments_for_comments_screen "+
        "WHERE course_id = " + str(feedId) + " " +
        "LIMIT " + str((page - 1) * PAGE_SIZE) + ", " + str(PAGE_SIZE)
        )
    
    result = cursor.fetchall()
    for record in result:
        comments.append(generate_comments(record))
    
    return jsonify(comments)

if __name__ == "__main__":
    service.run(
        host="0.0.0.0",
        debug=DEBUG
    )

#TIMMEEE 1:00:00