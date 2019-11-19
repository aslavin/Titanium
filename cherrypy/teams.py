# Teams Controller

import json
import cherrypy

class teamsController:

	def __init__(self, teamdb):
		self.teamdb = teamdb
	
	# return list of all teams
	def GET_TEAMS(self):
		return json.dumps(self.teamdb.get_teams())
		
	# get an existing team's info
	def GET_TEAM(self, team_id):
		return json.dumps(self.teamdb.get_team(team_id))

	# create a new team
	# any keys not included in request body will be set to
	#  null in the database
	def POST_TEAM(self, team_id):
		msg = json.loads(cherrypy.request.body.read())
		self.teamdb.set_team(team_id, msg)
		return json.dumps({"result": "success"})

	# update an existing team
	# any keys not included in request body will not have
	#  their values changed in the database
	def PUT_TEAM(self, team_id):
		msg = json.loads(cherrypy.request.body.read())
		self.teamdb.update_team(team_id, msg)
		return json.dumps({"result": "success"})

	# delete an existing team
	def DELETE_TEAM(self, team_id):
		self.teamdb.delete_team(team_id)
		return json.dumps({"result": "success"})
