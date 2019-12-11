# users Controller

import json
import cherrypy

class usersController:

    def __init__(self, userdb):
        self.userdb = userdb
    
    # return list of all users
    def GET_USERS(self):
        return json.dumps(self.userdb.get_users())
        
    # delete all users from db
    def DELETE_USERS(self):
        self.userdb.delete_users()
        return json.dumps({"result": "success"})

    # get an existing user's info
    def GET_USER(self, user_id):
        return json.dumps(self.userdb.get_user(user_id))

    def GET_USER_EMAIL(self, email):
        return json.dumps(self.userdb.get_user_email(email))

    def GET_USER_NOTIFICATIONS(self, user_id):
        return json.dumps(self.userdb.get_user_notifications(user_id))

    # create a new user
    # any keys not included in request body will be set to
    #  null in the database
    def POST_USER(self):
        msg = json.loads(cherrypy.request.body.read())
        user_id = self.userdb.set_user(msg)
        return json.dumps({"result": "success", "user_id": user_id})

    # update an existing user
    # any keys not included in request body will not have
    #  their values changed in the database
    def PUT_USER(self, user_id):
        msg = json.loads(cherrypy.request.body.read())
        self.userdb.update_user(user_id, msg)
        return json.dumps({"result": "success"})

    def ADD_USER_TEAM(self, user_id, team_id):
        return self.userdb.add_user_to_team(user_id, team_id)

    # delete an existing user
    def DELETE_USER(self, user_id):
        self.userdb.delete_user(user_id)
        return json.dumps({"result": "success"})
