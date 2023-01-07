from flask import Flask, request
from datetime import datetime, timezone
import psycopg2
import os

CREATE_ROOMS_TABLE = (
    "CREATE TABLE IF NOT EXISTS rooms (id SERIAL PRIMARY KEY, name TEXT);"
)
CREATE_TEMPS_TABLE = """CREATE TABLE IF NOT EXISTS temperatures (room_id INTEGER, temperature REAL, 
                        date TIMESTAMP, FOREIGN KEY(room_id) REFERENCES rooms(id) ON DELETE CASCADE);"""

INSERT_ROOM_RETURN_ID = "INSERT INTO rooms (name) VALUES (%s) RETURNING id;"
INSERT_TEMP = (
    "INSERT INTO temperatures (room_id, temperature, date) VALUES (%s, %s, %s);"
)

ROOM_NAME = """SELECT name FROM rooms WHERE id = (%s)"""

ROOM_NUMBER_OF_DAYS = """SELECT COUNT(DISTINCT DATE(date)) AS days FROM temperatures WHERE room_id = (%s);"""
ROOM_ALL_TIME_AVG = (
    "SELECT AVG(temperature) as average FROM temperatures WHERE room_id = (%s);"
)


ROOM_TERM = """SELECT DATE(temperatures.date) as reading_date,
AVG(temperatures.temperature)
FROM temperatures
WHERE temperatures.room_id = (%s)
GROUP BY reading_date
HAVING DATE(temperatures.date) > (SELECT MAX(DATE(temperatures.date))-(%s) FROM temperatures);"""

GLOBAL_NUMBER_OF_DAYS = (
    """SELECT COUNT(DISTINCT DATE(date)) AS days FROM temperatures;"""
)
GLOBAL_AVG = """SELECT AVG(temperature) as average FROM temperatures;"""


url = os.environ.get("DATABASE_URL")
connection = psycopg2.connect(url)
app = Flask(__name__)


# {"name": "Room name"}
@app.post("/api/room")
def create_room():
    data = request.get_json()
    name = data["name"]
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_ROOMS_TABLE)
            cursor.execute(INSERT_ROOM_RETURN_ID, (name,))
            room_id = cursor.fetchone()[0]
    return {"id": room_id, "message": f"Room {name} created."}, 201


# {"temperature": 15.9, "room": 2 "date": "%m-%d-%Y %H:%M:%S"} date is optional
@app.post("/api/temperature")
def add_temp():
    data = request.get_json()
    temperature = data["temperature"]
    room_id = data["room"]
    try:
        date = datetime.strptime(data["date"], "%m-%d-%Y %H:%M:%S")
    except KeyError:
        date = datetime.now(timezone.utc)
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_TEMPS_TABLE)
            cursor.execute(INSERT_TEMP, (room_id, temperature, date))
    return {"message": "Temperature added."}, 201


@app.get("/api/room/<int:room_id>")
def get_room_all(room_id):
    args = request.args
    term = args.get("term")
    if term is not None:
        return get_room_term(room_id, term)
    else:
        with connection:
            with connection.cursor() as cursor:
                cursor.execute(ROOM_NAME, (room_id,))
                name = cursor.fetchone()[0]
                cursor.execute(ROOM_ALL_TIME_AVG, (room_id,))
                average = cursor.fetchone()[0]
                cursor.execute(ROOM_NUMBER_OF_DAYS, (room_id,))
                days = cursor.fetchone()[0]
        return {"name": name, "average": round(average, 2), "days": days}


def get_room_term(room_id, term):
    terms = {"week": 7, "month": 30}
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(ROOM_NAME, (room_id,))
            name = cursor.fetchone()[0]
            cursor.execute(ROOM_TERM, (room_id, terms[term]))
            dates_temperatures = cursor.fetchall()
    average = sum(day[1] for day in dates_temperatures) / len(dates_temperatures)
    return {
        "name": name,
        "temperatures": dates_temperatures,
        "average": round(average, 2),
    }


@app.get("/api/average")
def get_global_avg():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GLOBAL_AVG)
            average = cursor.fetchone()[0]
            cursor.execute(GLOBAL_NUMBER_OF_DAYS)
            days = cursor.fetchone()[0]
    return {"average": round(average, 2), "days": days}