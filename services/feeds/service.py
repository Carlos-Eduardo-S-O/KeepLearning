from flask import Flask, jsonify
import mysql.connector as mysql

service = Flask(__name__)

IS_ALIVE = "yes"
DEBUG = True
PAGE_SIZE = 4

MYSQL_SERVER = "database"
MYSQL_USER = "root"
MYSQL_PASS = "admin"
MYSQL_BASE_NAME = "keep_learning"

def get_bd_connection():
    connection = mysql.connect(
        host=MYSQL_SERVER, user=MYSQL_USER, password=MYSQL_PASS, database=MYSQL_BASE_NAME
    )
    return connection

def generate_feeds(record):
    feed = {
            "_id": record["feedId"],
            "site": {
                "name": record["site"],
                "avatar": record["avatar"],  
            },
            "course": {
                "name": record["course"],
                "description": record["description"],
                "blobs": [
                    {
                        "type": "image",
                        "file": record["image1"]
                    }
                ]  
            }
        }
    
    return feed

@service.route("/feeds/<int:page>")
def get_feeds(page):
    feeds = []
    
    connection = get_bd_connection()
    cursor = connection.cursor(dictionary=True)
    
    cursor.execute(
        "SELECT feedId, course, site, description, image1, avatar "+
        "FROM feeds_for_feeds_screen " +
        "LIMIT " + str((page - 1) * PAGE_SIZE) + ", " + str(PAGE_SIZE)
        )
    
    result = cursor.fetchall()
    for record in result:
        feeds.append(generate_feeds(record))
    
    return jsonify(feeds)

@service.route("/feeds_per_course/<string:course_name>/<int:page>")
def get_feeds_per_course(course_name, page):
    feeds = []
    
    connection = get_bd_connection()
    cursor = connection.cursor(dictionary=True)
    
    cursor.execute(
        "SELECT feedId, course, site, description, image1, avatar "+
        "FROM feeds_for_feeds_screen " +
        "WHERE course LIKE '%" + course_name + "%' " +
        "LIMIT " + str((page - 1) * PAGE_SIZE) + ", " + str(PAGE_SIZE)
        )
    
    result = cursor.fetchall()
    for record in result:
        feeds.append(generate_feeds(record))
    
    return jsonify(feeds)
if __name__ == "__main__":
    service.run(
        host="0.0.0.0",
        debug=DEBUG
    )
