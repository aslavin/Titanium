# backend will send calls to database

import os
import requests
import json

SPORT_FILE = 'sports.json'

class _sport_database:
	
	# initialize databse
	def __init__(self):
		try:
			sport_file = open(SPORT_FILE, 'r')
			self.sports = json.loads(sport_file.read())
			sport_file.close()
		except IOError:
			self.sports = {}
	
	# return dictionary of sports
	def get_sports(self):
		return self.sports

	# set a new sport
	def set_sport(self, sport_id, data):
		self.sports[str(sport_id)] = data
		self.flush()

	# get a specific sport by id
	# return None if sport not found
	def get_sport(self, sport_id):
		if sport_id not in self.sports:
			return None
		return self.sports[str(sport_id)]

	# remove sport from database
	def delete_sport(self, sport_id):
		if sport_id in self.sports:
			del self.sports[str(sport_id)]
			self.flush()

	def flush(self):
		with open(SPORT_FILE, 'w') as sport_file:
			sport_file.write(json.dumps(self.sports))
