# backend will send calls to database

import os
import requests
import json

POOL_FILE = 'pools.json'

class _pool_database:
	
	# initialize databse
	def __init__(self):
		try:
			pool_file = open(POOL_FILE, 'r')
			self.pools = json.loads(pool_file.read())
			pool_file.close()
		except IOError:
			self.pools = {}

	# set a new pool
	def set_pool(self, pool_id, data):
		self.pools[str(pool_id)] = data
		self.flush()

	# get a specific pool by id
	# return None if pool not found
	def get_pool(self, pool_id):
		if pool_id not in self.pools:
			return None
		return self.pools[str(pool_id)]

	# remove pool from database
	def delete_pool(self, pool_id):
		if pool_id in self.pools:
			del self.pools[str(pool_id)]
			self.flush()

	def flush(self):
		with open(POOL_FILE, 'w') as pool_file:
			pool_file.write(json.dumps(self.pools))
