# leagues Controller

import json
import cherrypy

class leaguesController:

	def __init__(self, leaguedb):
		self.leaguedb = leaguedb
	
	# return list of all leagues
	def GET_LEAGUES(self):
		return json.dumps(self.leaguedb.get_leagues())
		
	# delete all leagues from db
	def DELETE_LEAGUES(self):
		self.leaguedb.delete_leagues()
		return json.dumps({"result": "success"})

	# get an existing league's info
	def GET_LEAGUE(self, league_id):
		return json.dumps(self.leaguedb.get_league(league_id))

	# create a new league
	def POST_LEAGUE(self, league_id):
		msg = json.loads(cherrypy.request.body.read())
		self.leaguedb.set_league(league_id, msg)
		return json.dumps({"result": "success"})

	# update an existing league
	def PUT_LEAGUE(self, league_id):
		msg = json.loads(cherrypy.request.body.read())
		self.leaguedb.set_league(league_id, msg)
		return json.dumps({"result": "success"})

	# delete an existing league
	def DELETE_LEAGUE(self, league_id):
		self.leaguedb.delete_league(league_id)
		return json.dumps({"result": "success"})
