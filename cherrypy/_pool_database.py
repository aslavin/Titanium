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
		return util.get_dict_from_query(r.fetch_row(how=1))

	# remove pool from database
	def delete_pool(self, pool_id):
		self.db.query('''delete from Pools
			where pool_id = {}'''.format(pool_id))
