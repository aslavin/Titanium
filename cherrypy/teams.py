# Teams Controller

import json
import cherrypy

class teamsController:

	def __init__(self, teamdb):
		self.teamdb = teamdb
	
	# return list of all teams
	def GET_TEAMS(self):
		return json.dumps(self.teamdb.get_teams())
		
	# delete all teams from db
	def DELETE_TEAMS(self):
		self.teamdb.delete_teams()
		return json.dumps({"result": "success"})

	# get an existing team's info
	def GET_TEAM(self, team_id):
		return json.dumps(self.teamdb.get_team(team_id))

	# create a new team
	def POST_TEAM(self, team_id):
		msg = json.loads(cherrypy.request.body.read())
		self.teamdb.set_team(team_id, msg)
		return json.dumps({"result": "success"})

	# update an existing team
	def PUT_TEAM(self, team_id):
		msg = json.loads(cherrypy.request.body.read())
		self.teamdb.set_team(team_id, msg)
		return json.dumps({"result": "success"})

	# delete an existing team
	def DELETE_TEAM(self, team_id):
		self.teamdb.delete_team(team_id)
		return json.dumps({"result": "success"})
