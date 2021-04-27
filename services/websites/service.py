from flask import Flask, jsonify
import mysql.connector as mysql

service = Flask(__name__)

IS_ALIVE = "yes"
DEBUG = True

MYSQL_SERVER = "database"
MYSQL_USER = "root"
MYSQL_PASS = "admin"
MYSQL_BASE_NAME = "keep_learning"

def get_bd_connection():
    connection = mysql.connect(
        host=MYSQL_SERVER, user=MYSQL_USER, password=MYSQL_PASS, database=MYSQL_BASE_NAME
    )
    return connection

def generate_websites(record):
    websites = {
            "_id": record["id"],
            "name": record["name"],
            "avatar": record["avatar"]
        }
    
    return websites

@service.route("/websites/")
def get_feeds():
    websites = []
    
    connection = get_bd_connection()
    cursor = connection.cursor(dictionary=True)
    
    cursor.execute(
        "SELECT id, name, avatar FROM websites"
        )
    
    result = cursor.fetchall()
    for record in result:
        websites.append(generate_websites(record))
    
    return jsonify(websites)

if __name__ == "__main__":
    service.run(
        host="0.0.0.0",
        debug=DEBUG
    )
