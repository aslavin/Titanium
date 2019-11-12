# backend will send calls to database

import os
import requests
import json

LEAGUE_FILE = 'leagues.json'

class _league_database:
	
	# initialize databse
	def __init__(self):
		try:
			league_file = open(LEAGUE_FILE, 'r')
			self.leagues = json.loads(league_file.read())
			league_file.close()
		except IOError:
			self.leagues = {}

	# return dictionary of leagues
	def get_leagues(self):
		return self.leagues

	# set a new league
	def set_league(self, league_id, data):
		self.leagues[str(league_id)] = data
		self.flush()

	# get a specific league by id
	# return None if league not found
	def get_league(self, league_id):
		if str(league_id) not in self.leagues:
			return None
		return self.leagues[str(league_id)]

	# remove league from database
	def delete_league(self, league_id):
		if str(league_id) in self.leagues:
			del self.leagues[str(league_id)]
			self.flush()

	def flush(self):
		with open(LEAGUE_FILE, 'w') as league_file:
			league_file.write(json.dumps(self.leagues))
