# sports Controller

import json
import cherrypy

class sportsController:

	def __init__(self, sportdb):
		self.sportdb = sportdb
	
	# return list of all sports
	def GET_SPORTS(self):
		return json.dumps(self.sportdb.get_sports())
		
	# get an existing sport's info
	def GET_SPORT(self, sport_id):
		return json.dumps(self.sportdb.get_sport(sport_id))

	# create a new sport
	# any keys not included in request body will be set to
	#  null in the database
	def POST_SPORT(self):
		msg = json.loads(cherrypy.request.body.read())
		sport_id = self.sportdb.set_sport(msg)
		return json.dumps({"result": "success", "sport_id": sport_id})

	# update an existing sport
	# any keys not included in request body will not have
	#  their values changed in the database
	def PUT_SPORT(self, sport_id):
		msg = json.loads(cherrypy.request.body.read())
		self.sportdb.update_sport(sport_id, msg)
		return json.dumps({"result": "success"})

	# delete an existing sport
	def DELETE_SPORT(self, sport_id):
		self.sportdb.delete_sport(sport_id)
		return json.dumps({"result": "success"})
