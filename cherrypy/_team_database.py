# backend will send calls to database

from MySQLdb import _mysql
import util

class _team_database:
	
	# initialize databse
	def __init__(self, db):
		self.db = db
	
	# return dictionary of teams
	def get_teams(self):
		self.db.query('select * from Teams')
		r = self.db.store_result()
		return util.get_dict_from_query(r.fetch_row(maxrows=0, how=1))

	# set a new team
	def set_team(self, data):
		team_id = None # keeping this variable in case we need it later
		data = util.clean_query_input(data, "Teams")

		if team_id is None:
			self.db.query('''insert into Teams(
				league_id,
				pool_id,
				name,
				wins,
				losses,
				ties,
				max_members) values (
				{},{},{},{},{},{},{})'''.format(
				data['league_id'],
				data['pool_id'],
				data['name'],
				data['wins'],
				data['losses'],
				data['ties'],
				data['max_members']))
		else:
			self.db.query('''update Teams set
				league_id = {},
				pool_id = {},
				name = {},
				wins = {},
				losses = {},
				ties = {},
				max_members = {}
				where team_id = {}'''.format(
				data['league_id'],
				data['pool_id'],
				data['name'],
				data['wins'],
				data['losses'],
				data['ties'],
				data['max_members'],
				team_id))

		self.db.query('select last_insert_id()')
		r = self.db.store_result()
		return util.get_dict_from_query(r.fetch_row(how=1))['last_insert_id()']

	def update_team(self, team_id, data):
		data = util.clean_query_input(data, "Teams", set_nulls=False)
		for key in data:
			self.db.query('''update Teams set
				{} = {}
				where team_id = {}'''.format(
				key, data[key], team_id))

	# get a specific team by id
	# return None if team not found
	def get_team(self, team_id):
		self.db.query('''select * from Teams
			where team_id = {}'''.format(team_id))
		r = self.db.store_result()
		return_dict = util.get_dict_from_query(r.fetch_row(how=1))

		self.db.query('''select user_id from Users_Teams
			where team_id = {}'''.format(team_id))
		teams_in_pool = util.get_dict_from_query(self.db.store_result().fetch_row(maxrows=0, how=1))
		print(teams_in_pool)
		if type(teams_in_pool) is dict: # only returned one item
			return_dict.update({"users": [teams_in_pool["user_id"]]})
		else: # returned multiple items
			return_dict.update({"useres": [sql_return["user_id"] for sql_return in teams_in_pool]})
		
		return return_dict

	# remove team from database
	def delete_team(self, team_id):
		self.db.query('''delete from Teams
			where team_id = {}'''.format(team_id))

	def get_users_by_team(self, team_id):
		self.db.query('''select user_id from Users_Teams
			where team_id = {}'''.format(team_id))
		r = self.db.store_result()
		return util.get_dict_from_query(r.fetch_row(maxrows=0, how=1))
