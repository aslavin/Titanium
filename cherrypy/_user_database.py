# backend will send calls to database

import os
import requests
import json

USER_FILE = 'users.json'

class _user_database:
	
	# initialize databse
	def __init__(self):
		try:
			user_file = open(USER_FILE, 'r')
			self.users = json.loads(user_file.read())
			user_file.close()
		except IOError:
			self.users = {}

	# return dictionary of users
	def get_users(self):
		return self.users

	# delete all users
	def delete_users(self):
		self.users = {}
		self.flush()

	# set a new user
	def set_user(self, user_id, data):
		self.users[str(user_id)] = data
		self.flush()

	# get a specific user by id
	# return None if user not found
	def get_user(self, user_id):
		if user_id not in self.users:
			return None
		return self.users[str(user_id)]

	# remove user from database
	def delete_user(self, user_id):
		if user_id in self.users:
			del self.users[str(user_id)]
			self.flush()

	def flush(self):
		with open(USER_FILE, 'w') as user_file:
			user_file.write(json.dumps(self.users))
