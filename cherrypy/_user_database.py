# backend will send calls to database

from MySQLdb import _exceptions
from MySQLdb import _mysql
import copy
import util

class _user_database:
    
    # initialize databse
    def __init__(self, db):
        self.db = db

    # return dictionary of users
    def get_users(self):
        self.db.query('select * from Users')
        r = self.db.store_result()
        return util.get_dict_from_query(r.fetch_row(maxrows=0, how=1))

    # delete all users
    def delete_users(self):
        self.db.query('delete from Users')

    # set a new user
    def set_user(self, data):
        user_id = None # keeping this variable in case we need it later
        data = util.clean_query_input(data, "Users")
        
        if user_id is None:
            self.db.query('''insert into Users(
                pass_hash,
                netid,
                email,
                first_name,
                last_name,
                is_undergrad,
                is_admin,
                gender,
                residence_hall,
                wins,
                losses,
                ties) values (
                {},{},{},{},{},{},{},{},{},{},{},{})'''.format(
                data['pass_hash'],
                data['netid'],
                data['email'],
                data['first_name'],
                data['last_name'],
                data['is_undergrad'],
                data['is_admin'],
                data['gender'],
                data['residence_hall'],
                data['wins'],
                data['losses'],
                data['ties']))
        #else:
        #    self.db.query('''update users set
        #        pass_hash = {},
        #        netid = {},
        #        email = {},
        #        first_name = {},
        #        last_name = {},
        #        is_undergrad = {},
        #        is_admin = {},
        #        gender = {},
        #        residence_hall = {},
        #        wins = {},
        #        losses = {},
        #        ties = {}
        #        where user_id = {}'''.format(
        #        data['pass_hash'],
        #        data['netid'],
        #        data['email'],
        #        data['first_name'],
        #        data['last_name'],
        #        data['is_undergrad'],
        #        data['is_admin'],
        #        data['gender'],
        #        data['residence_hall'],
        #        data['wins'],
        #        data['losses'],
        #        data['ties'],
        #        user_id))

        self.db.query('select last_insert_id()')
        r = self.db.store_result()
        return util.get_dict_from_query(r.fetch_row(how=1))['last_insert_id()']

    def update_user(self, user_id, data):
        data = util.clean_query_input(data, "Users", set_nulls=False)
        for key in data:
            query = '''update Users set
                {} = {}
                where user_id = {}'''.format(
                key, data[key], user_id)
            self.db.query(query)

    # get a specific user by id
    def get_user(self, user_id):
        self.db.query('''select * from Users
            where user_id = {}'''.format(user_id))
        r = self.db.store_result()
        return util.get_dict_from_query(r.fetch_row(how=1))

    def get_user_email(self, email):
        self.db.query("select * from Users where email = '{}'".format(email))
        r = self.db.store_result()
        return util.get_dict_from_query(r.fetch_row(how=1))

    # remove user from database
    def delete_user(self, user_id):
        self.db.query('''delete from Users
            where user_id = {}'''.format(user_id))

    def add_user_to_team(self, user_id, team_id):
        try:
            self.db.query('''insert into Users_Teams(
                user_id, team_id) values (
                {}, {})'''.format(user_id, team_id))
        except _exceptions.IntegrityError:
            return

    def get_teams_by_user(self, user_id):
        self.db.query('''select team_id from Users_Teams
            where user_id = {}'''.format(user_id))
        r = self.db.store_result()
        return util.get_dict_from_query(r.fetch_row(maxrows=0, how=1))
