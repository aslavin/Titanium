# leagues Controller

import json
import cherrypy

class leaguesController:

    def __init__(self, leaguedb):
        self.leaguedb = leaguedb
    
    # return list of all leagues
    def GET_LEAGUES(self):
        return json.dumps(self.leaguedb.get_leagues())
        
    # get an existing league's info
    def GET_LEAGUE(self, league_id):
        return json.dumps(self.leaguedb.get_league(league_id))

    # create a new league
    # any keys not included in request body will be set to
    #  null in the database
    def POST_LEAGUE(self):
        msg = json.loads(cherrypy.request.body.read())
        league_id = self.leaguedb.set_league(msg)
        return json.dumps({"result": "success", "league_id": league_id})

    # update an existing league
    # any keys not included in request body will not have
    #  their values changed in the database
    def PUT_LEAGUE(self, league_id):
        msg = json.loads(cherrypy.request.body.read())
        self.leaguedb.update_league(league_id, msg)
        return json.dumps({"result": "success"})

    def GET_LEAGUE_USERS(self, league_id):
        return json.dumps(self.leaguedb.get_league_users(league_id))

    # delete an existing league
    def DELETE_LEAGUE(self, league_id):
        self.leaguedb.delete_league(league_id)
        return json.dumps({"result": "success"})
