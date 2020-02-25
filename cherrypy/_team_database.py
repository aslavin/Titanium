# backend will send calls to database

from MySQLdb import _mysql
import util
from threading import Lock, Thread
lock = Lock()

class _team_database:
    
    # initialize databse
    def __init__(self, db):
        self.db = db
    
    # return dictionary of teams
    def get_teams(self):
        self.db.query('''select t.team_id, t.name as team_name, cast(p.pool_time as char) as pool_time, t.wins, t.losses, t.ties, l.sport 
                from Teams t natural join Pools p natural join Leagues l 
                order by team_name''')
        r = self.db.store_result()
        return util.get_dict_from_query(r.fetch_row(maxrows=0, how=1))

    # set a new team
    def set_team(self, data):
        team_id = None # keeping this variable in case we need it later
        data = util.clean_query_input(data, "Teams")

        if team_id is None:
            self.db.query('''insert into Teams(
                league_id,
                pool_id,
                name,
                wins,
                losses,
                ties,
                max_members) values (
                {},{},{},{},{},{},{})'''.format(
                data['league_id'],
                data['pool_id'],
                data['name'],
                data['wins'],
                data['losses'],
                data['ties'],
                data['max_members']))
        else:
            self.db.query('''update Teams set
                league_id = {},
                pool_id = {},
                name = {},
                wins = {},
                losses = {},
                ties = {},
                max_members = {}
                where team_id = {}'''.format(
                data['league_id'],
                data['pool_id'],
                data['name'],
                data['wins'],
                data['losses'],
                data['ties'],
                data['max_members'],
                team_id))

        self.db.query('select last_insert_id()')
        r = self.db.store_result()
        return util.get_dict_from_query(r.fetch_row(how=1))['last_insert_id()']

    def update_team(self, team_id, data):
        data = util.clean_query_input(data, "Teams", set_nulls=False)
        for key in data:
            self.db.query('''update Teams set
                {} = {}
                where team_id = {}'''.format(
                key, data[key], team_id))

    # get a specific team by id
    # return None if team not found
    def get_team(self, team_id):
        
        # get team metadata
        self.db.query('''select Teams.name as teamName, Teams.wins as teamWins, Teams.losses as teamLosses, Teams.ties as teamTies, Teams.capt_id,
                cast(Pools.pool_time as char) as poolTime, Pools.day as poolDay, Pools.pool_id as poolId,
                Leagues.location as poolLocation, concat(Leagues.level, " ", Leagues.sport) as leagueName, Leagues.league_id as leagueId
            from Teams, Pools, Leagues
            where Teams.pool_id = Pools.pool_id
                and Pools.league_id = Leagues.league_id
                and Teams.team_id = {}'''.format(team_id))
        r = self.db.store_result()
        return_dict = util.get_dict_from_query(r.fetch_row(how=1))

        # TODO: calculate team's rank in pool
        return_dict["teamRankInPool"] = 1 # hard-coded for now

        # get users on team
        self.db.query('''select Users.user_id, Users.first_name, Users.last_name, Users.email, Users.gender
            from Users, Users_Teams
            where Users.user_id = Users_Teams.user_id
                and Users_Teams.team_id = {}'''.format(team_id))
        users_on_team = util.get_dict_from_query(self.db.store_result().fetch_row(maxrows=0, how=1))
        if type(users_on_team) is dict: # only returned one item
            if len(users_on_team) == 0:
                return_dict.update({'roster': []})
            else:
                return_dict.update({"roster": [users_on_team]})
        else: # returned multiple items
            return_dict.update({"roster": users_on_team})
        return_dict["malePlayers"] = sum([1 for player in return_dict["roster"] if player["gender"] == "Male"])
        return_dict["femalePlayers"] = sum([1 for player in return_dict["roster"] if player["gender"] == "Female"])
        for player in return_dict["roster"]:
            if player["user_id"] == return_dict["capt_id"]:
                player["is_capt"] = True
            else:
                player["is_capt"] = False


        # get number of teams in pool
        self.db.query('''select count(*) as teamsInPool
            from Teams
            where Teams.pool_id = (select pool_id from Teams where team_id={})'''.format(team_id))
        r = self.db.store_result()
        return_dict["teamsInPool"] = util.get_dict_from_query(r.fetch_row(how=1))["teamsInPool"]

        # get team's games
        self.db.query('''select Games.game_id as game_id, cast(Games.date as char) as date, Games.team1_score as team1Score, Games.team2_score as team2Score,
            Team1.name as team1Name, Team1.team_id as team1Id, 
            Team2.name as team2Name, Team2.team_id as team2Id
            from Games, Teams as Team1, Teams as Team2
            where Games.team1_id = Team1.team_id
                and Games.team2_id = Team2.team_id
                and (Team1.team_id = {} or Team2.team_id = {})
            order by date'''.format(team_id, team_id))
        games = util.get_dict_from_query(self.db.store_result().fetch_row(maxrows=0, how=1))
        if type(games) is dict and games:
            games = [games]
        elif type(games) is dict and not games:
            games = []
        for game in games:
            if game["team1Id"] == int(team_id):
                game["opponentId"] = game["team2Id"]
                game["opponentName"] = game["team2Name"]
                game["yourScore"] = game["team1Score"]
                game["opponentScore"] = game["team2Score"]
            elif game["team2Id"] == int(team_id):
                game["opponentId"] = game["team1Id"]
                game["opponentName"] = game["team2Name"]
                game["yourScore"] = game["team2Score"]
                game["opponentScore"] = game["team1Score"]
        schedule = [{"date": game["date"], "opponentId": game["opponentId"], "opponentName": game["opponentName"], "yourScore": game["yourScore"], "opponentScore": game["opponentScore"]} for game in games]

        return_dict["schedule"] = schedule
        return return_dict


    # get all teams in a league
    def get_teams_league(self, league_id):
        self.db.query('''SELECT team_id, name FROM Teams WHERE league_id = {}'''.format(league_id))
        r = self.db.store_result()
        return util.get_dict_from_query(r.fetch_row(maxrows=0, how=1))


    # remove team from database
    def delete_team(self, team_id):
        self.db.query('''delete from Teams
            where team_id = {}'''.format(team_id))

    def get_users_by_team(self, team_id):
        self.db.query('''select user_id from Users_Teams
            where team_id = {}'''.format(team_id))
        r = self.db.store_result()
        return util.get_dict_from_query(r.fetch_row(maxrows=0, how=1))
    
    def search_teams(self, query):
        q = query.lower()
        mycursor = self.db.cursor()
        sql_query = f'SELECT name, team_id from Teams WHERE LOWER(Teams.name) LIKE \'%{q}%\''
        mycursor.execute(sql_query)
        return mycursor.fetchall()
