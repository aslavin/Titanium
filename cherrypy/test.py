from MySQLdb import _mysql
from _league_database import _league_database
from _pool_database import _pool_database
from _sport_database import _sport_database
from _team_database import _team_database
from _user_database import _user_database
from users import usersController

db = _mysql.connect("localhost", "root", "Andy_slavin_1234", "mydb")

uc = usersController(db)

user_db = _user_database(db)

data = {
		'pass_hash': 'test_hash',
		'netid': 'sminer',
		'first_name': 'Sebastian',
		'last_name': 'Miner',
		'is_undergrad' : '1',
		'is_admin': '0',
		'gender': 'male',
		'residence_hall': 'Stanford'}

user_db.set_user(None, data)

print(user_db.get_user(1))
