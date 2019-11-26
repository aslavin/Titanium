from MySQLdb import _mysql
from _league_database import _league_database
from _pool_database import _pool_database
from _sport_database import _sport_database
from _team_database import _team_database
from _user_database import _user_database
from users import usersController
import json

db = _mysql.connect("localhost", "root", "Andy_slavin_1234", "mydb")

league_db = _league_database(db)
pool_db = _pool_database(db)
sport_db = _sport_database(db)
team_db = _team_database(db)
user_db = _user_database(db)

user_data = {
		'pass_hash': 'test_hash',
		'netid': 'sminer',
		'first_name': 'Sebastian',
		'last_name': 'Miner',
		'is_undergrad' : 'true',
		'is_admin': 'false',
		'gender': 'male',
		'residence_hall': 'Stanford'}

user_id = user_db.set_user(user_data)

sport_data = {
	'name': 'Football'
}

sport_id = sport_db.set_sport(sport_data)

league_data = {
	'sport_id': sport_id,
	'name': 'Men\\\'s interhall football'
}

league_id = league_db.set_league(league_data)

pool_data = {
	'league_id': league_id,
	'name': 'Pool A'
}

pool_id = pool_db.set_pool(pool_data)

team_data = {
	'league_id': league_id,
	'pool_id': pool_id,
	'name': 'Dankins\\\'s Disciples'
}

team_id = team_db.set_team(team_data)
user_db.add_user_to_team(20, 6)

team_db.update_team(team_id, {'name': 'New team name'})
pool_db.update_pool(pool_id, {'name': 'New pool name'})
league_db.update_league(league_id, {'name': 'New league name'})
sport_db.update_sport(sport_id, {'name': 'New sport name'})
user_db.update_user(user_id, {'first_name': 'New user name'})

print(json.dumps(team_db.get_team(team_id)))
print(json.dumps(pool_db.get_pool(pool_id)))
print(json.dumps(league_db.get_league(league_id)))
print(json.dumps(sport_db.get_sport(sport_id)))
print(json.dumps(user_db.get_user(user_id)))
print(json.dumps(user_db.get_teams_by_user(21)))
print(json.dumps(team_db.get_users_by_team(6)))
