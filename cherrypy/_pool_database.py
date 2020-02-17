# backend will send calls to database

from MySQLdb import _mysql
import util
from datetime import timedelta

class _pool_database:
    
    # initialize databse
    def __init__(self, db):
        self.db = db

    def get_pools(self):
        self.db.query('select * from Pools')
        r = self.db.store_result()
        return util.get_dict_from_query(r.fetch_row(maxrows=0, how=1))

    # set a new pool
    def set_pool(self, data):
        pool_id = None # keeping this variable in case we need it later
        data = util.clean_query_input(data, "Pools")

        if pool_id is None:
            query = '''insert into Pools(
                league_id,
                day,
                pool_time,
                max_size)
                values (
                {}, \"{}\", \"{}\", {})'''.format(
                data['league_id'],
                data['day'],
                data['pool_time'],
                data['max_size'])
            self.db.query(query)
        else: 
            self.db.query('''update Pools set
                league_id = {},
                day = {},
                pool_time = {},
                max_size = {}
                where pool_id = {}'''.format(
                data['league_id'],
                data['pool_time'],
                data['max_size'],
                pool_id))

        self.db.query('select last_insert_id()')
        r = self.db.store_result()
        return util.get_dict_from_query(r.fetch_row(how=1))['last_insert_id()']

    def update_pool(self, pool_id, data):
        data = util.clean_query_input(data, "Pools", set_nulls=False)
        for key in data:
            self.db.query('''update Pools set
                {} = {}
                where pool_id = {}'''.format(
                key, data[key], pool_id))

    # get a specific pool by id
    # return {} if pool not found
    def get_pool(self, pool_id):

        self.db.query('''select Pools.league_id, Pools.pool_id, Pools.day as poolDay, cast(Pools.pool_time as char) as poolTime, 
            Leagues.level as leagueLevel, Leagues.sport as leagueSport, Leagues.location as leagueLocation, 
            Teams.team_id, Teams.name as team_name, Teams.wins, Teams.losses, Teams.ties
        from Pools, Teams, Leagues 
        where Pools.league_id = Leagues.league_id 
            and Teams.pool_id = Pools.pool_id
            and Pools.pool_id = {}'''.format(pool_id))
        
        r = self.db.store_result()
        return_list = util.get_dict_from_query(r.fetch_row(maxrows=0, how=1))
        if type(return_list) is dict and return_list: # only one team in pool
            return_list = [return_list]
        elif type(return_list ) is dict and not return_list: # league is empty, so just return metadata
            self.db.query('''select Pools.league_id, Pools.pool_id, Pools.day as poolDay, cast(Pools.pool_time as char) as poolTime, 
                Leagues.level as leagueLevel, Leagues.sport as leagueSport, Leagues.location as leagueLocation
            from Pools, Leagues 
            where Pools.league_id = Leagues.league_id 
                and Pools.pool_id = {}'''.format(pool_id))
            r = self.db.store_result()
            return_dict = util.get_dict_from_query(r.fetch_row(maxrows=0, how=1))
            return return_dict

        first_entry = return_list[0]
        return_dict = {'leagueLevel': first_entry['leagueLevel'], 'leagueSport': first_entry['leagueSport'], 'leagueLocation': first_entry['leagueLocation'], 'poolDay': first_entry['poolDay'], 'poolTime': first_entry['poolTime']}

        # for each team, apppend id, name, wins, losses, ties
        teams = [{'team_id': team['team_id'], 'team_name': team['team_name'], 'wins': team['wins'], 'losses': team['losses'], 'ties': team['ties']} for team in return_list]
        return_dict['teams'] = teams
       
        return return_dict

    # remove pool from database
    def delete_pool(self, pool_id):
        self.db.query('''delete from Pools
            where pool_id = {}'''.format(pool_id))
