from _league_database import _league_database
from _pool_database import _pool_database
from _sport_database import _sport_database
from _team_database import _team_database
from _user_database import _user_database

league_db = _league_database()
pool_db = _pool_database()
sport_db = _sport_database()
team_db = _team_database()
user_db = _user_database()

league_db.set_league(1, "data here")
league_db.get_leagues()
league_db.get_league(1)
league_db.delete_league(1)

pool_db.set_pool(1, "data here")
pool_db.get_pool(1)
pool_db.delete_pool(1)

sport_db.set_sport(1, "data here")
sport_db.get_sports()
sport_db.get_sport(1)
sport_db.delete_sport(1)

team_db.set_team(1, "data here")
team_db.get_teams()
team_db.get_team(1)
team_db.delete_team(1)

user_db.set_user(1, "data here")
user_db.get_users()
user_db.get_user(1)
user_db.delete_users()
user_db.set_user(2, "data Here")
user_db.delete_user(2)
