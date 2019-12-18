import json
import cherrypy

class gamesController:

    def __init__(self, gamedb):
        self.gamedb = gamedb
        
    def GET_GAMES(self, date):
        result = self.gamedb.get_games(date)
        if type(result) is dict:
            result = [result]
        print(result)
        return json.dumps(result)