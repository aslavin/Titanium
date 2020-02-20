# backend will send calls to database

from MySQLdb import _mysql
import util
from datetime import datetime

class _league_database:
    
    # initialize databse
    def __init__(self, db):
        self.db = db

    # return dictionary of leagues
    def get_leagues(self):
        self.db.query('select l.league_id, l.level, l.sport from Leagues l order by l.sport ASC')
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
        self.db.query('''select Leagues.*, Pools.pool_id, Pools.day, cast(Pools.pool_time as char) as time, Teams_In_Pools.num_teams
            from Leagues, Pools, (select Teams.pool_id, count(*) as num_teams from Teams group by Teams.pool_id) as Teams_In_Pools
            where Leagues.league_id = {}
            and Pools.league_id = {}
            and Pools.pool_id = Teams_In_Pools.pool_id'''.format(league_id, league_id))
        
        return_list = util.get_dict_from_query(self.db.store_result().fetch_row(maxrows=0, how=1))
        if type(return_list) is dict:
            return_list = [return_list]
        pool_list = [{'pool_id': pool['pool_id'], 'day': pool['day'], 'time': pool['time'], 'num_teams': pool['num_teams']} for pool in return_list]
        return_dict = return_list[0]
        for key in ['pool_id', 'day', 'time', 'num_teams']:
            del return_dict[key]
        return_dict['start_time'] = return_dict['start_time'].strftime("%m/%d/%Y")
        return_dict['end_time'] = return_dict['end_time'].strftime("%m/%d/%Y")
        return_dict['pools'] = pool_list

        return return_dict

    def get_league_users(self, league_id):
        self.db.query('''SELECT user_id FROM Users_Teams WHERE team_id IN (SELECT team_id FROM Teams WHERE pool_id IN (SELECT pool_id FROM Pools WHERE league_id = {}))'''.format(league_id))
        users_in_league = util.get_dict_from_query(self.db.store_result().fetch_row(how=1))
        if(len(users_in_league) == 0):
            return {}
        returner = {'users': [sql_return['user_id'] for sql_return in users_in_league]}
        return returner

    def search_leagues(self, query):
        q = query.lower()
        mycursor = self.db.cursor()
        sql_query = f'SELECT level, sport FROM Leagues WHERE LOWER(Leagues.sport) LIKE \'%{q}%\''
        mycursor.execute(sql_query)
        return mycursor.fetchall()

    # remove league from database
    def delete_league(self, league_id):
        self.db.query('''delete from Leagues
            where league_id = {}'''.format(league_id))
