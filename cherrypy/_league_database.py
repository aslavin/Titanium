# backend will send calls to database

from MySQLdb import _mysql
import util

class _league_database:
    
    # initialize databse
    def __init__(self, db):
        self.db = db

    # return dictionary of leagues
    def get_leagues(self):
        self.db.query('select * from Leagues')
        return util.get_dict_from_query(self.db.store_result().fetch_row(maxrows=0, how=1)) # return all rows as a dictionary

    # set a new league
    def set_league(self, data):
        league_id = None # keeping this variable in case we need it later
        data = util.clean_query_input(data, "Leagues")
        

        # TODO: update sport id to grab from page rather than hard-coding in 1
        if league_id is None:
            self.db.query('''insert into Leagues(
                sport_id,
                name,
                start_time,
                end_time,
                team_size) 
                values (
                {},\"{}\",\"{}\",\"{}\",{})'''.format(
                #data['sport_id'],
                1,
                data['leagueName'],
                data['startDate'],
                data['endDate'],
                #data['team_size']))
                10))
        else:
            self.db.query('''update Leagues set 
                sport_id = {},
                name = {},
                start_time = {},
                end_time = {},
                team_size = {}
                where league_id = {}'''.format(
                data['sport_id'],
                data['name'],
                data['start_time'],
                data['end_time'],
                data['team_size'],
                league_id))
    
        self.db.query('select last_insert_id()')
        r = self.db.store_result()
        return util.get_dict_from_query(r.fetch_row(how=1))['last_insert_id()']

    def update_league(self, league_id, data):
        data = util.clean_query_input(data, "Leagues", set_nulls=False)
        for key in data:
            self.db.query('''update Leagues set
                {} = {}
                where league_id = {}'''.format(
                key, data[key], league_id))

    # get a specific league by id
    def get_league(self, league_id):

        self.db.query('''select * from Leagues
            where league_id = {}'''.format(league_id))
        return_dict = util.get_dict_from_query(self.db.store_result().fetch_row(how=1))

        self.db.query('''select pool_id from Pools
            where league_id = {}'''.format(league_id))
        pools_in_league = util.get_dict_from_query(self.db.store_result().fetch_row(maxrows=0, how=1))
        if type(pools_in_league) is dict: # only returned one item
            return_dict.update({"pools": [pools_in_league["pool_id"]]})
        else: # returned multiple items
            return_dict.update({"pools": [sql_return["pool_id"] for sql_return in pools_in_league]})
        
        return return_dict

    def get_league_users(self, league_id):
        self.db.query('''SELECT user_id FROM Users_Teams WHERE team_id IN (SELECT team_id FROM Teams WHERE pool_id IN (SELECT pool_id FROM Pools WHERE league_id = {}))'''.format(league_id))
        users_in_league = util.get_dict_from_query(self.db.store_result().fetch_row(maxrows=0, how=1))
        returner = {'users': [sql_return['user_id'] for sql_return in users_in_league]}
        return returner

    def search_leagues(self, query):
        q = query.lower()
        sql_query = f'SELECT Leagues.league_id, Leagues.name FROM Leagues, Sports WHERE Leagues.sport_id = Sports.sport_id AND (LOWER(Leagues.name) LIKE \'%{q}%\' OR (LOWER(Sports.name) LIKE \'%{q}%\'))'
        self.db.query(sql_query)
        return util.get_dict_from_query(self.db.store_result().fetch_row(maxrows=0, how=1))

    # remove league from database
    def delete_league(self, league_id):
        self.db.query('''delete from Leagues
            where league_id = {}'''.format(league_id))
