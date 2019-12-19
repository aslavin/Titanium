# main.py
# Andrew Slavin

# this file describes all possible endpoints and the controllers that will manage those endpoints
# it tells which controller will manage each end point and which method in that controller will fire
# when that endpoint is hit

import cherrypy
import json
from MySQLdb import _mysql
from _user_database import _user_database
from _league_database import _league_database
from _team_database import _team_database
from _sport_database import _sport_database
from _pool_database import _pool_database
from _game_database import _game_database
from users import usersController
from leagues import leaguesController
from teams import teamsController
from sports import sportsController
from pools import poolsController
from games import gamesController
from search import searchController

# set up cors
class optionsController:
    def OPTIONS(self, *args, **kwargs):
        return "" # return empty string

def CORS():
    cherrypy.response.headers["Access-Control-Allow-Origin"] = "*"
    cherrypy.response.headers["Access-Control-Allow-Methods"] = "GET, PUT, POST, DELETE, OPTIONS"
    cherrypy.response.headers["Access-Control-Allow-Credentials"] = "*"

cherrypy.tools.CORS = cherrypy.Tool('before_handler', CORS)

# create new backend
db = _mysql.connect("localhost", "root", "Andy_slavin_1234", "mydb")
userdb = _user_database(db) # shared across all controllers
leaguedb = _league_database(db)
teamdb = _team_database(db)
sportdb = _sport_database(db)
pooldb = _pool_database(db)
gamedb = _game_database(db)

# load all data
dispatcher = cherrypy.dispatch.RoutesDispatcher()

# create configuration, which is a dict
conf = { 'global': {'server.socket_host': 'project01.cse.nd.edu',
             'server.socket_port': 51069},
             '/': {'request.dispatch':dispatcher,
                    'tools.CORS.on': True} # tells it to use the dispatcher on any path
        }

# initialize controllers
usersController = usersController(userdb)
leaguesController = leaguesController(leaguedb)
teamsController = teamsController(teamdb)
sportsController = sportsController(sportdb)
poolsController = poolsController(pooldb)
gamesController = gamesController(gamedb)
searchController = searchController(leaguedb, teamdb, userdb)

# generic handlers for setting/deleting all users
dispatcher.connect('getUsers', '/users/', controller=usersController, action='GET_USERS', conditions=dict(method=['GET']))
dispatcher.connect('deleteUsers', '/users/', controller=usersController, action='DELETE_USERS', conditions=dict(method=['DELETE']))

# specific users handlers
dispatcher.connect('getUser', '/users/:user_id', controller=usersController, action='GET_USER', conditions=dict(method=['GET']))
dispatcher.connect('postUser', '/users/', controller=usersController, action='POST_USER', conditions=dict(method=['POST']))
dispatcher.connect('putUser', '/users/:user_id', controller=usersController, action='PUT_USER', conditions=dict(method=['PUT']))
dispatcher.connect('deleteUser', '/users/:user_id', controller=usersController, action='DELETE_USER', conditions=dict(method=['DELETE']))

dispatcher.connect('getUser', '/users/email/:email', controller=usersController, action='GET_USER_EMAIL', conditions=dict(method=['GET']))

dispatcher.connect('validateUser', '/users/validate/', controller=usersController, action='VALIDATE_USER', conditions=dict(method=['POST']))

dispatcher.connect('postUserTeam', '/users/:user_id/team/:team_id', controller=usersController, action='ADD_USER_TEAM', conditions=dict(method=['POST']))

dispatcher.connect('getNotifications', '/users/notification/:user_id', controller=usersController, action='GET_USER_NOTIFICATIONS', conditions=dict(method=['GET']))

dispatcher.connect('sendNotification', '/users/notification/', controller=usersController, action='POST_USER_NOTIFICATIONS', conditions=dict(method=['POST']))

# generic league handlers
dispatcher.connect('getLeagues', '/leagues/', controller=leaguesController, action='GET_LEAGUES', conditions=dict(method=['GET']))
dispatcher.connect('postLeague', '/leagues/', controller=leaguesController, action='POST_LEAGUE', conditions=dict(method=['POST']))

# specific league handlers
dispatcher.connect('getLeague', '/leagues/:league_id', controller=leaguesController, action='GET_LEAGUE', conditions=dict(method=['GET']))
dispatcher.connect('putLeague', '/leagues/:league_id', controller=leaguesController, action='PUT_LEAGUE', conditions=dict(method=['PUT']))
dispatcher.connect('deleteLeague', '/leagues/:league_id', controller=leaguesController, action='DELETE_LEAGUE', conditions=dict(method=['DELETE']))

dispatcher.connect('getLeagueTeams', '/leagues/:league_id/teams', controller=teamsController, action='GET_TEAMS_LEAGUE', conditions=dict(method=['GET']))

dispatcher.connect('getLeagueUsers', '/leagues/:league_id/users', controller = leaguesController, action='GET_LEAGUE_USERS', conditions=dict(method=['GET']))

# generic team handlers
dispatcher.connect('getTeams', '/teams/', controller=teamsController, action='GET_TEAMS', conditions=dict(method=['GET']))

# specific team handlers
dispatcher.connect('getTeam', '/teams/:team_id', controller=teamsController, action='GET_TEAM', conditions=dict(method=['GET']))
dispatcher.connect('postTeam', '/teams/', controller=teamsController, action='POST_TEAM', conditions=dict(method=['POST']))
dispatcher.connect('putTeam', '/teams/:team_id', controller=teamsController, action='PUT_TEAM', conditions=dict(method=['PUT']))
dispatcher.connect('deleteTeam', '/teams/:team_id', controller=teamsController, action='DELETE_TEAM', conditions=dict(method=['DELETE']))


# generic sports handlers
dispatcher.connect('getSports', '/sports/', controller=sportsController, action='GET_SPORTS', conditions=dict(method=['GET']))

# specific sport handlers
dispatcher.connect('getSport', '/sports/:sport_id', controller=sportsController, action='GET_SPORT', conditions=dict(method=['GET']))
dispatcher.connect('putSport', '/sports/:sport_id', controller=sportsController, action='PUT_SPORT', conditions=dict(method=['PUT']))
dispatcher.connect('deleteSport', '/sports/:sport_id', controller=sportsController, action='DELETE_SPORT', conditions=dict(method=['DELETE']))
dispatcher.connect('postSport', '/sports/:sport_id', controller=sportsController, action='POST_SPORT', conditions=dict(method=['POST']))

# specific pool handlers
dispatcher.connect('getPools', '/pools/', controller=poolsController, action='GET_POOLS', conditions=dict(method=['GET']))
dispatcher.connect('getPool', '/pools/:pool_id', controller=poolsController, action='GET_POOL', conditions=dict(method=['GET']))
dispatcher.connect('postPool', '/pools/', controller=poolsController, action='POST_POOLS', conditions=dict(method=['POST']))
dispatcher.connect('putPool', '/pools/:pool_id', controller=poolsController, action='PUT_POOL', conditions=dict(method=['PUT']))
dispatcher.connect('deletePool', '/pools/:pool_id', controller=poolsController, action='DELETE_POOL', conditions=dict(method=['DELETE']))

# specific game handlers
dispatcher.connect('getGames', '/games/:date', controller=gamesController, action='GET_GAMES', conditions=dict(method=['GET']))

# search handlers
dispatcher.connect('searchLeagues', '/search/leagues/', controller=searchController, action='SEARCH_LEAGUES', conditions=dict(method=['POST']))
dispatcher.connect('searchTeams', '/search/teams/', controller=searchController, action='SEARCH_TEAMS', conditions=dict(method=['POST']))
dispatcher.connect('searchUsers', '/search/users/', controller=searchController, action='SEARCH_USERS', conditions=dict(method=['POST']))
dispatcher.connect('searchAll', '/search/', controller=searchController, action='SEARCH_LEAGUES', conditions=dict(method=['POST']))

# options handlers - need one for each possible path definied above
dispatcher.connect('users_all_op', '/users/', controller=optionsController, action='OPTIONS', conditions=dict(method=['OPTIONS']))
dispatcher.connect('users_key_op', '/users/:user_id', controller=optionsController, action='OPTIONS', conditions=dict(method=['OPTIONS']))
dispatcher.connect('leagues_all_op', '/leagues/', controller=optionsController, action='OPTIONS', conditions=dict(method=['OPTIONS']))
dispatcher.connect('leagues_key_op', '/leagues/:league_id', controller=optionsController, action='OPTIONS', conditions=dict(method=['OPTIONS']))
dispatcher.connect('teams_all_op', '/teams/', controller=optionsController, action='OPTIONS', conditions=dict(method=['OPTIONS']))
dispatcher.connect('teams_key_op', '/teams/:team_id', controller=optionsController, action='OPTIONS', conditions=dict(method=['OPTIONS']))
dispatcher.connect('sports_all_op', '/sports/', controller=optionsController, action='OPTIONS', conditions=dict(method=['OPTIONS']))
dispatcher.connect('sports_key_op', '/sports/:sport_id', controller=optionsController, action='OPTIONS', conditions=dict(method=['OPTIONS']))
dispatcher.connect('pools_key_op', '/pools/:pool_id', controller=optionsController, action='OPTIONS', conditions=dict(method=['OPTIONS']))
dispatcher.connect('user_validate_all_op', '/users/validate/', controller=optionsController, action='OPTIONS', conditions=dict(method=['OPTIONS']))

cherrypy.config.update(conf) #tells library what the configuration is

# tell app what the configuration is
app = cherrypy.tree.mount(None, config=conf)
cherrypy.quickstart(app)

