# backend will send calls to database

from MySQLdb import _mysql

class _league_database:
	
	# initialize databse
	def __init__(self, db):
		self.db = db

	# return dictionary of leagues
	def get_leagues(self):
		self.db.query('select * from leagues')
		return self.db.store_result().fetch_row(maxrows=0, how=1) # return all rows as a dictionary

	# set a new league
	def set_league(self, league_id, data):
		keys = ['sport_id', 'name', 'start_time', 'end_time', 'gender', 'team_size']
		# set unspecified keys to null
		for key in keys:
			if key not in data:
				data[key] = 'null'

		if league_id is None:
			self.db.query('''insert into leagues(
				sport_id,
				name,
				start_time,
				end_time,
				gender,
				team_size) 
				values (
				{},\'{}\',{},{},\'{}\',{})'''.format(
				data['sport_id'],
				data['name'],
				data['start_time'],
				data['end_time'],
				data['gender'],
				data['team_size']))
		else:
			self.db.query('''update leagues set 
				sport_id = {},
				name = \'{}\',
				start_time = {},
				end_time = {},
				gender = \'{}\',
				team_size = {}
				where league_id = {}'''.format(
				data['sport_id'],
				data['name'],
				data['start_time'],
				data['end_time'],
				data['gender'],
				data['team_size'],
				league_id))

	def update_league(self, league_id, data):
		for key in data:
			if key == 'name' or key == 'gender':
				data[key] = '\'' + data[key] + '\''
			self.db.query('''update leagues set
				{} = {}
				where league_id = {}'''.format(
				key, data[key], league_id))

	# get a specific league by id
	def get_league(self, league_id):
		self.db.query('''select * from leagues
			where league_id = {}'''.format(league_id))
		return self.db.store_result().fetch_row(how=1)
		
	# remove league from database
	def delete_league(self, league_id):
		self.db.query('''delete from leagues
			where league_id = {}'''.format(league_id))
