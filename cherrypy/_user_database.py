# backend will send calls to database

from MySQLdb import _mysql

class _user_database:
	
	# initialize databse
	def __init__(self, db):
		self.db = db

	# return dictionary of users
	def get_users(self):
		self.db.query('select * from users')
		r = self.db.store_result()
		return r.fetch_row(maxrows=0, how=1)

	# delete all users
	def delete_users(self):
		self.db.query('delete from users')

	# set a new user
	def set_user(self, user_id, data):
		keys = ['netid', 'first_name', 'last_name', 'is_undergrad', 'is_admin', 'gender', 'residence_hall', 'wins', 'losses', 'ties']

		# set unspecified keys to null
		for key in keys:
			if key not in data:
				data[key] = 'null'

		if user_id is None:
			self.db.query('''insert into users(
				netid,
				first_name,
				last_name,
				is_undergrad,
				is_admin,
				gender,
				residence_hall,
				wins,
				losses,
				ties) values (
				{},{},{},{},{},{},{},{},{},{})'''.format(
				data['netid'],
				data['first_name'],
				data['last_name'],
				data['is_undergrad'],
				data['is_admin'],
				data['gender'],
				data['residence_hall'],
				data['wins'],
				data['losses'],
				data['ties']))
		else:
			self.db.query('''update users set
				netid = {},
				first_name = {},
				last_name = {},
				is_undergrad = {},
				is_admin = {},
				gender = {},
				residence_hall = {},
				wins = {},
				losses = {},
				ties = {}
				where user_id = {}'''.format(
				data['netid'],
				data['first_name'],
				data['last_name'],
				data['is_undergrad'],
				data['is_admin'],
				data['gender'],
				data['residence_hall']
				data['wins'],
				data['losses'],
				data['ties'],
				user_id))

	# get a specific user by id
	def get_user(self, user_id):
		self.db.query('''select * users
			where user_id = {}'''.format(user_id))
		r = self.db.store_result()
		return r.fetch_row(how=1)

	# remove user from database
	def delete_user(self, user_id):
		self.db.query('''delete from users
			where user_id = {}'''.format(user_id))
