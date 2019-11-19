# backend will send calls to database

from MySQLdb import _mysql

class _pool_database:
	
	# initialize databse
	def __init__(self, db):
		self.db = db

	# set a new pool
	def set_pool(self, pool_id, data):
		keys = ['league_id', 'name', 'pool_time', 'max_size']

		# set unspecified keys to null
		for key in keys:
			if key not in data:
				data[key] = 'null'

		if pool_id is None:
			self.db.query('''insert into pools(
				league_id,
				name,
				pool_time,
				max_size)
				values (
				{},{},{},{}'''.format(
				data['league_id'],
				data['name'],
				data['pool_time'],
				data['max_size']))
		else:
			self.db.query('''update pools set
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

	# get a specific pool by id
	# return {} if pool not found
	def get_pool(self, pool_id):
		self.db.query('''select * from pools
			where pool_id = {}'''.format(pool_id))
		r = self.db.store_result()
		return r.fetch_row(how=1)

	# remove pool from database
	def delete_pool(self, pool_id):
		self.db.query('''delete from pools
			where pool_id = {}'''.format(pool_id))
