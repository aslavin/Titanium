# leagues Controller

import json
import cherrypy

class searchController:

    def __init__(self, leaguedb, sportdb, userdb):
        self.leaguedb = leaguedb
        self.sportdb = sportdb
        self.userdb = userdb
    
    # return list of all leagues
    def SEARCH_LEAGUES(self):
        msg = json.loads(cherrypy.request.body.read())
        query = msg['query']
        return json.dumps(self.leaguedb.search_leagues(query))
        
    def SEARCH_TEAMS(self):
        msg = json.loads(cherrypy.request.body.read())
        query = msg['query']
        return json.dumps(self.teamdb.search_teams(query))

    def SEARCH_USERS(self):
        msg = json.loads(cherrypy.request.body.read())
        query = msg['query']
        return json.dumps(self.userdb.search_users(query))

    def SEARCH_ALL(self):
        msg = json.loads(cherrypy.request.body.read())
        query = msg['query']
        leagues = self.leaguedb.search_leagues(query)
        teams = self.teamdb.search_teams(query)
        users = self.userdb.search_users(query)
        return json.dumps({
            'leagues': leagues,
            'teams': teams,
            'users': users
        })
