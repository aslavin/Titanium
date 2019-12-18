# backend will send calls to database

from MySQLdb import _mysql
import util

class _sport_database:
	
	# initialize databse
	def __init__(self, db):
		self.db = db
	
	# return dictionary of sports
	def get_sports(self):
		self.db.query('select * from Sports')
		r = self.db.store_result()
		return util.get_dict_from_query(r.fetch_row(maxrows=0, how=1))

	# set a new sport
	def set_sport(self, data):
		sport_id = None # keeping this variable in case we need it later
		data = util.clean_query_input(data, "Sports")

		if sport_id is None:
			self.db.query('''insert into Sports(
				name) values (
				{})'''.format(
				data['name']))
		else:
			self.db.query('''update Sports set
				name = {}
				where sport_id = {}'''.format(
				data['name'],
				sport_id))

		self.db.query('select last_insert_id()')
		r = self.db.store_result()
		return util.get_dict_from_query(r.fetch_row(how=1))['last_insert_id()']

	def update_sport(self, sport_id, data):
		data = util.clean_query_input(data, "Sports", set_nulls=False)
		for key in data:
			self.db.query('''update Sports set
				{} = {}
				where sport_id = {}'''.format(
				key, data[key], sport_id))

	# get a specific sport by id
	# return None if sport not found
	def get_sport(self, sport_id):
		
		self.db.query('''select * from Sports
			where sport_id = {}'''.format(sport_id))
		r = self.db.store_result()
		return_dict = util.get_dict_from_query(r.fetch_row(how=1))

		self.db.query('''select league_id from Leagues
			where sport_id = {}'''.format(sport_id))
		leagues_in_sport = util.get_dict_from_query(self.db.store_result().fetch_row(maxrows=0, how=1))
		if type(leagues_in_sport) is dict: # only returned one item
			return_dict.update({"leagues": [leagues_in_sport["league_id"]]})
		else: # returned multiple items
			return_dict.update({"leagues": [sql_return["league_id"] for sql_return in leagues_in_sport]})

		return return_dict

	# remove sport from database
	def delete_sport(self, sport_id):
		self.db.query('''delete from Sports
			where sport_id = {}'''.format(sport_id))
