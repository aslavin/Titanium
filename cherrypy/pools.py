# pools Controller

import json
import cherrypy

class poolsController:

	def __init__(self, pooldb):
		self.pooldb = pooldb
		
	# get an existing pool's info
	def GET_POOL(self, pool_id):
		return json.dumps(self.pooldb.get_pool(pool_id))

	# create a new pool
	def POST_POOL(self, pool_id):
		msg = json.loads(cherrypy.request.body.read())
		self.pooldb.set_pool(pool_id, msg)
		return json.dumps({"result": "success"})

	# update an existing pool
	def PUT_POOL(self, pool_id):
		msg = json.loads(cherrypy.request.body.read())
		self.pooldb.set_pool(pool_id, msg)
		return json.dumps({"result": "success"})

	# delete an existing pool
	def DELETE_POOL(self, pool_id):
		self.pooldb.delete_pool(pool_id)
		return json.dumps({"result": "success"})
