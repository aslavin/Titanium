# backend will send calls to database

from MySQLdb import _mysql
import util

class _league_database:
	
	# initialize databse
	def __init__(self, db):
		self.db = db

	# return dictionary of leagues
	def get_leagues(self):
		self.db.query('select * from Leagues')
		return util.get_dict_from_query(self.db.store_result().fetch_row(maxrows=0, how=1)) # return all rows as a dictionary

	# set a new league
	def set_league(self, data):
		league_id = None # keeping this variable in case we need it later
		data = util.clean_query_input(data, "Leagues")

		if league_id is None:
			self.db.query('''insert into Leagues(
				sport_id,
				name,
				start_time,
				end_time,
				gender,
				team_size) 
				values (
				{},{},{},{},{},{})'''.format(
				data['sport_id'],
				data['name'],
				data['start_time'],
				data['end_time'],
				data['gender'],
				data['team_size']))
		else:
			self.db.query('''update Leagues set 
				sport_id = {},
				name = {},
				start_time = {},
				end_time = {},
				gender = {},
				team_size = {}
				where league_id = {}'''.format(
				data['sport_id'],
				data['name'],
				data['start_time'],
				data['end_time'],
				data['gender'],
				data['team_size'],
				league_id))
	
		self.db.query('select last_insert_id()')
		r = self.db.store_result()
		return util.get_dict_from_query(r.fetch_row(how=1))['last_insert_id()']

	def update_league(self, league_id, data):
		data = util.clean_query_input(data, "Leagues", set_nulls=False)
		for key in data:
			self.db.query('''update Leagues set
				{} = {}
				where league_id = {}'''.format(
				key, data[key], league_id))

	# get a specific league by id
	def get_league(self, league_id):

		self.db.query('''select * from Leagues
			where league_id = {}'''.format(league_id))
		return_dict = util.get_dict_from_query(self.db.store_result().fetch_row(how=1))

		self.db.query('''select pool_id from Pools
			where league_id = {}'''.format(league_id))
		pools_in_league = util.get_dict_from_query(self.db.store_result().fetch_row(maxrows=0, how=1))
		if type(pools_in_league) is dict: # only returned one item
			return_dict.update({"pools": [pools_in_league["pool_id"]]})
		else: # returned multiple items
			return_dict.update({"pools": [sql_return["pool_id"] for sql_return in pools_in_league]})
		
		return return_dict
		
	# remove league from database
	def delete_league(self, league_id):
		self.db.query('''delete from Leagues
			where league_id = {}'''.format(league_id))
