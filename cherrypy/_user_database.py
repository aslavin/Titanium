# backend will send calls to database

from MySQLdb import _exceptions
from MySQLdb import _mysql
import copy
import util
import json
import hashlib
import os

class _user_database:
    
    # initialize databse
    def __init__(self, db):
        self.db = db

    # return dictionary of users
    def get_users(self):
        self.db.query('select user_id, first_name, last_name from Users order by last_name')
        r = self.db.store_result()
        d = util.get_dict_from_query(r.fetch_row(maxrows=0, how=1))
        for m in range(len(d)):
            if os.path.isfile("../data/userPictures/{}.jpg".format(d[m]["user_id"])):
                d[m]["profilePicExists"] = 1;
            else: 
                d[m]["profilePicExists"] = 0;
        return d;

    # delete all users
    def delete_users(self):
        self.db.query('delete from Users')

    def set_notification(self, data):
        data = json.loads(data);
        team_id = data['team_id']
        league_id = data['league_id']
        captain_id = data['captain_id']
        new_member_id = data['new_member_id']
        invited = data['invited']
        accepted = data['accepted']

        self.db.query('''INSERT INTO Team_Requests values (
        {},
        {},
        {},
        {},
        {},
        {})'''.format(team_id, league_id, captain_id, new_member_id, invited, accepted)
        )

    # set a new user
    def set_user(self, data):
        user_id = None # keeping this variable in case we need it later
        pass_hash = hashlib.sha256()
        pass_hash.update(data['pass_hash'].encode(encoding='ascii'))
        pass_hash = pass_hash.digest().hex()
        data['pass_hash'] = pass_hash
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
        #    self.db.query('''update Users set
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
    
    def get_user_notifications(self, user_id):

        # get player Notifications

        notification_query = '''select distinct Teams.name as team_name, Teams.team_id as team_id,
            Leagues.league_id as league_id, Leagues.level as league_level, Leagues.sport as league_sport, concat(Leagues.level, " ", Leagues.sport) as league_name,
            Users.first_name, Users.last_name
            from Team_Requests, Teams, Leagues, Pools, Users 
            where Teams.team_id = Team_Requests.team_id
            and Users.user_id = Teams.capt_id
            and Pools.pool_id = Teams.pool_id
            and Leagues.league_id = Pools.league_id
            and Team_Requests.new_member_invited = 1
            and Team_Requests.new_member_accepted = 0
            and Team_Requests.new_member_id = {}'''.format(user_id);

        self.db.query(notification_query)
        playerNotifications = util.get_dict_from_query(self.db.store_result().fetch_row(maxrows=0, how=1))

        # get pending notifications
        self.db.query('''select distinct Teams.name as team_name, Teams.team_id as team_id,
            Users.first_name, Users.last_name
            from Team_Requests, Teams, Users 
            where Teams.team_id = Team_Requests.team_id
            and Users.user_id = Teams.capt_id
            and Team_Requests.new_member_invited = 0
            and Team_Requests.new_member_accepted = 0
            and Team_Requests.new_member_id = {};
            '''.format(user_id))
        pendingNotifications = util.get_dict_from_query(self.db.store_result().fetch_row(maxrows=0, how=1))

        # get captain notifications
        self.db.query('''select distinct Teams.name as team_name, Teams.team_id, 
            Users.first_name, Users.last_name, Users.user_id
            from Team_Requests, Teams, Leagues, Users 
            where Teams.team_id = Team_Requests.team_id
            and Users.user_id = Team_Requests.new_member_id
            and Team_Requests.new_member_invited = 0
            and Team_Requests.new_member_accepted = 0
            and Teams.capt_id = {};
            '''.format(user_id))
        captainNotifications = util.get_dict_from_query(self.db.store_result().fetch_row(maxrows=0, how=1))
        
        # get game notifications
        self.db.query('''select Games.game_id, DATE_FORMAT(Games.date, '%Y-%m-%d') as date, Games.team1_id, Games.team2_id, 
            cast(Pools.pool_time as char) as time, 
            Leagues.location as location, concat(Leagues.level, " ", Leagues.sport) as league, Leagues.league_id,
            Teams1.name as team1Name, Teams1.wins as team1Wins, Teams1.losses as team1Losses, Teams1.ties as team1Ties, 
            Teams2.name as team2Name, Teams2.wins as team2Wins, Teams2.losses as team2Losses, Teams2.ties as team2Ties
            from Games, Teams as Teams1, Teams as Teams2, Pools, Leagues
            where (
                Games.team1_id =
                (select Users_Teams.team_id from Users_Teams where Users_Teams.user_id = {})
                or Games.team2_id = 
                (select Users_Teams.team_id from Users_Teams where Users_Teams.user_id = {})
            )
            and Teams1.team_id = Games.team1_id
            and Teams2.team_id = Games.team2_id
            and Teams1.pool_id = Pools.pool_id
            and Pools.league_id = Leagues.league_id
            and Games.date <= DATE_ADD(curdate(), interval 1 month)
            order by Games.date
            ;
            '''.format(user_id, user_id))
        gameNotifications = util.get_dict_from_query(self.db.store_result().fetch_row(maxrows=0, how=1)) 


        # get user's first name to welcome them
        self.db.query('''select first_name from Users where user_id = {}'''.format(user_id));
        firstName = util.get_dict_from_query(self.db.store_result().fetch_row(maxrows=0, how=1)) 

        if type(playerNotifications) is dict and playerNotifications:
            playerNotifications = [playerNotifications]
        elif type(playerNotifications) is dict and not playerNotifications:
            playerNotifications = []

        if type(pendingNotifications) is dict and pendingNotifications:
            pendingNotifications = [pendingNotifications]
        elif type(pendingNotifications) is dict and not pendingNotifications:
            pendingNotifications = []

        if type(captainNotifications) is dict and captainNotifications:
            captainNotifications = [captainNotifications]
        elif type(captainNotifications) is dict and not captainNotifications:
            captainNotifications = []

        if type(gameNotifications) is dict and gameNotifications:
            gameNotifications = [gameNotifications]
        elif type(gameNotifications) is dict and not gameNotifications:
            gameNotifications = []
            
        return {"playerNotifications": playerNotifications, "pendingNotifications": pendingNotifications, "captainNotifications": captainNotifications, "gameNotifications": gameNotifications, "profilePicExists": os.path.exists("../data/userPictures/{}.jpg".format(user_id)), "first_name": firstName["first_name"]}

    # remove user from database
    def delete_user(self, user_id):
        self.db.query('''delete from Users
            where user_id = {}'''.format(user_id))

    def add_user_to_team(self, user_id, team_id):
        r = ''
        try:
            self.db.query('''insert into Users_Teams(
                user_id, team_id) values (
                {}, {})'''.format(user_id, team_id))
            r = self.db.store_result()
            return json.dumps({'result':'success'})
        except _exceptions.IntegrityError:
            return json.dumps({'result':'failure', 'message':'Integrity Error!'})

    def get_teams_by_user(self, user_id):
        self.db.query('''select team_id from Users_Teams
            where user_id = {}'''.format(user_id))
        r = self.db.store_result()
        return util.get_dict_from_query(r.fetch_row(maxrows=0, how=1))

    def search_users(self, query):
        q = query.lower()
        mycursor = self.db.cursor()
        sql_query = f'SELECT * from Users WHERE LOWER(Users.first_name) LIKE \'%{q}%\' OR LOWER(Users.last_name) LIKE \'%{q}%\''
        mycursor.execute(sql_query)
        return mycursor.fetchall()

    def validate_user(self, email, password):
        pass_hash = hashlib.sha256()
        pass_hash.update(password.encode(encoding='ascii'))
        pass_hash = pass_hash.digest().hex()
        self.db.query('''select user_id, pass_hash, is_admin
            from Users where email = \'{}\''''.format(email))
        r = self.db.store_result()
        result = util.get_dict_from_query(r.fetch_row(maxrows=0, how=1))

        if not result:
            return {"status": "failure", "reason": "email not in system"}
        if result['pass_hash'] == pass_hash:
            return {"status" :"success", "user_id": result['user_id'], "is_admin": result['is_admin']}
        else:
            return {"status":"failure", "reason": "unknown"}
