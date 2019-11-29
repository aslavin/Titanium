# backend will send calls to database

from MySQLdb import _mysql
import util

class _pool_database:
	
	# initialize databse
	def __init__(self, db):
		self.db = db

	# set a new pool
	def set_pool(self, data):
		pool_id = None # keeping this variable in case we need it later
		data = util.clean_query_input(data, "Pools")

		if pool_id is None:
			query = '''insert into Pools(
				league_id,
				name,
				pool_time,
				max_size)
				values (
				{}, {}, {}, {})'''.format(
				data['league_id'],
				data['name'],
				data['pool_time'],
				data['max_size'])
			self.db.query(query)
		else:
			self.db.query('''update Pools set
				league_id = {},
				name = {},
				pool_time = {},
				max_size = {}
				where pool_id = {}'''.format(
				data['league_id'],
				data['name'],
				data['pool_time'],
				data['max_size'],
				pool_id))

		self.db.query('select last_insert_id()')
		r = self.db.store_result()
		return util.get_dict_from_query(r.fetch_row(how=1))['last_insert_id()']

	def update_pool(self, pool_id, data):
		data = util.clean_query_input(data, "Pools", set_nulls=False)
		for key in data:
			self.db.query('''update Pools set
				{} = {}
				where pool_id = {}'''.format(
				key, data[key], pool_id))

	# get a specific pool by id
	# return {} if pool not found
	def get_pool(self, pool_id):
		
		self.db.query('''select * from Pools
			where pool_id = {}'''.format(pool_id))
		r = self.db.store_result()
		return_dict = util.get_dict_from_query(r.fetch_row(how=1))

		self.db.query('''select team_id from Teams
			where pool_id = {}'''.format(pool_id))
		teams_in_pool = util.get_dict_from_query(self.db.store_result().fetch_row(maxrows=0, how=1))
		if type(teams_in_pool) is dict: # only returned one item
			return_dict.update({"teams": [teams_in_pool["team_id"]]})
		else: # returned multiple items
			return_dict.update({"teams": [sql_return["team_id"] for sql_return in teams_in_pool]})
		
		return return_dict

	# remove pool from database
	def delete_pool(self, pool_id):
		self.db.query('''delete from Pools
			where pool_id = {}'''.format(pool_id))
