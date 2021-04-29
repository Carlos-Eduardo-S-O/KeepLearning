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
                "languages": record["languages"],
                "duration": record["duration"],
                "level": record["level"],
                "url": record["url"],
                "blobs": [
                    {
                        "type": "image",
                        "file": record["image1"]
                    },
                    {
                        "type": "image",
                        "file": record["image2"]
                    },
                    {
                        "type": "image",
                        "file": record["image3"]
                    }
                ]  
            }
        }
    
    return feed

@service.route("/feedDetails/<int:id>")
def get_feed(id):
    feed = {}
    
    connection = get_bd_connection()
    cursor = connection.cursor(dictionary=True)
    
    cursor.execute(
        "SELECT * "+
        "FROM feeds_for_details "+
        "WHERE feedId = " + str(id)
        )
    
    feeds = cursor.fetchall()
    
    if len(feeds):
        languages = []
        for feed in feeds:
            languages.append(feed["language"])
        feed["languages"] = languages
    
    feed = generate_feeds(feed)
    
    return jsonify(feed)

if __name__ == "__main__":
    service.run(
        host="0.0.0.0",
        debug=DEBUG
    )

