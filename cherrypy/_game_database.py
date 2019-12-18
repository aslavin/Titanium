from MySQLdb import _mysql
import util

class _game_database:
    
    # initialize databse
    def __init__(self, db):
        self.db = db

    # return dictionary of leagues
    def get_games(self, date):
        self.db.query('''select date, t1.name as t1_name, t2.name as t2_name, location
        from Games, Teams t1, Teams t2 
        where date(date) = \"{}\" and t1.team_id = Games.team1_id and t2.team_id = Games.team2_id'''.format(date))
        return util.get_dict_from_query(self.db.store_result().fetch_row(maxrows=0, how=1)) # return all rows as a dictionary
