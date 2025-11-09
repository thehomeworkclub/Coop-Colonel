import peewee as pw

db = pw.SqliteDatabase('db/detections.db')
class BaseModel(pw.Model):
    class Meta:
        database = db
class Detection(BaseModel):
    id = pw.AutoField()
    timestamp = pw.DateTimeField()
    chicken_count = pw.IntegerField()
    location = pw.CharField()
