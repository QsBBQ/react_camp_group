# https://blogs.rdoproject.org/7625/build-your-restful-api-web-service-in-5-minutes

from eve import Eve
from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import column_property, relationship

from eve_sqlalchemy import SQL
from eve_sqlalchemy.decorators import registerSchema
from eve_sqlalchemy.validation import ValidatorSQL

Base = declarative_base()

class CommonColumns(Base):
    __abstract__ = True
    _created = Column(DateTime,  default=func.now())
    _updated = Column(
        DateTime,
        default=func.now(),
        onupdate=func.now())
    _etag = Column(String)
    _id = Column(Integer, primary_key=True, autoincrement=True)

@registerSchema('group')
class Group(CommonColumns):
    __tablename__ = 'group'
    # id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(120))
    # awards =
    # campers = relationship("Camper", back_populates="group")

@registerSchema('camper')
class Camper(CommonColumns):
    __tablename__ = 'camper'
    # id = Column(Integer, primary_key=True, autoincrement=True)
    fullname = Column(String(256))
    group_id = Column(Integer, ForeignKey('group._id'))
    # balance
    # awards =
    # group = relationship("Group", back_populates="camper")

SETTINGS = {
    'DEBUG': True,
    'SQLALCHEMY_DATABASE_URI': 'sqlite://',
    'RESOURCE_METHODS': ['POST', 'GET'],
    'ITEM_METHODS': ['GET', 'PATCH', 'DELETE'],
    'PAGINATION': False,
    'X_DOMAINS': '*',
    'IF_MATCH': False,
    'DOMAIN': {
        'camper': Camper._eve_schema['camper'],
        'group': Group._eve_schema['group']
        },
}

app = Eve(auth=None, settings=SETTINGS, validator=ValidatorSQL, data=SQL)

# bind SQLAlchemy
db = app.data.driver
Base.metadata.bind = db.engine
db.Model = Base
db.create_all()

# Insert some example data in the db

from faker import Faker
fake = Faker()
for _ in range(0,10):
    group = Group(name=fake.company())
    db.session.add(group)
    db.session.commit()
    for _ in range(0,100):
        camper = Camper(fullname=fake.name(), group_id=group._id)
        db.session.add(camper)
        db.session.commit()

# if not db.session.query(Camper).count():
#     for item in test_data:
#         db.session.add(Camper.from_tuple(item))
#     db.session.commit()

app.run(debug=True, use_reloader=False)
# using reloader will destroy in-memory sqlite db

# curl -H 'Content-Type: application/json' -vvv -X POST -d '{"fullname":"Jack Bauer","group_id":"1"}' http://127.0.0.1:5000/camper
