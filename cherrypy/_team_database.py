# backend will send calls to database

import os
import requests
import json

TEAM_FILE = 'teams.json'

class _team_database:
	
	# initialize databse
	def __init__(self):
		try:
			team_file = open(TEAM_FILE, 'r')
			self.teams = json.loads(team_file.read())
			team_file.close()
		except IOError:
			self.teams = {}
	
	# return dictionary of teams
	def get_teams(self):
		return self.teams

	# set a new team
	def set_team(self, team_id, data):
		self.teams[str(team_id)] = data
		self.flush()

	# get a specific team by id
	# return None if team not found
	def get_team(self, team_id):
		if team_id not in self.teams:
			return None
		return self.teams[str(team_id)]

	# remove team from database
	def delete_team(self, team_id):
		if team_id in self.teams:
			del self.teams[str(team_did)]
			self.flush()

	def flush(self):
		with open(TEAM_FILE, 'w') as team_file:
			team_file.write(json.dumps(self.teams))
