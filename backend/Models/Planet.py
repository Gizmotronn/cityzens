class Planet(db.document):
    planet_id = db.IntField()
    name = db.StringField()
    moonNumber = db.IntField()

    def to_json(self): # convert the specified planet into a json class
        return {
            "planet_id": self.planet_id,
            "name": self.name,
            "moonNumber": self.moonNumber,
        }