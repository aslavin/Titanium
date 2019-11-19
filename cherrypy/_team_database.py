# backend will send calls to database

from MySQLdb import _mysql

class _team_database:
	
	# initialize databse
	def __init__(self, db):
		self.db = db
	
	# return dictionary of teams
	def get_teams(self):
		self.db.query('select * from teams')
		r = self.db.store_result()
		return r.fetch_row(maxrows=0, how=1)

	# set a new team
	def set_team(self, team_id, data):
		keys = ['league_id', 'pool_id', 'name', 'wins', 'losses', 'ties', 'max_members']

		# set unspecified keys to null
		for key in keys:
			if key not in data:
				data[key] = 'null'

		if team_id is None:
			self.db.query('''insert into teams(
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
			self.db.query('''update teams set
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

	# get a specific team by id
	# return None if team not found
	def get_team(self, team_id):
		self.db.query('''select * from teams
			where team_id = {}'''.format(team_id))
		r = self.db.store_result()
		return r.fetch_row(how=1)

	# remove team from database
	def delete_team(self, team_id):
		self.db.query('''delete from teams
			where team_id = {}'''.format(team_id))
