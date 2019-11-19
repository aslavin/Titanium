# backend will send calls to database

from MySQLdb import _mysql

class _sport_database:
	
	# initialize databse
	def __init__(self, db):
		self.db = db
	
	# return dictionary of sports
	def get_sports(self):
		self.db.query('select * from sports')
		r = self.db.store_result()
		return r.fetch_row(maxrows=0, how=1)

	# set a new sport
	def set_sport(self, sport_id, data):
		keys = ['name']

		# set unspecified keys to null
		for key in keys:
			if key not in data:
				data[key] = 'null'

		if sport_id is None:
			self.db.query('''insert into sports(
				name) values (
				{})'''.format(
				data['name']))
		else:
			self.db.query('''update sports set
				name = {}
				where sport_id = {}'''.format(
				data['name'],
				sport_id))

	def update_sport(self, sport_id, data):
		for key in data:
			self.db.query('''update sports set
				{} = {}
				where sport_id = {}'''.format(
				key, data[key], sport_id))

	# get a specific sport by id
	# return None if sport not found
	def get_sport(self, sport_id):
		self.db.query('''select * from sports
			where sport_id = {}'''.format(sport_id))
		r = self.db.store_result()
		return r.fetch_row(how=1)

	# remove sport from database
	def delete_sport(self, sport_id):
		self.db.query('''delete from sports
			where sport_id = {}'''.format(sport_id))
