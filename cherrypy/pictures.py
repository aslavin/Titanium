# picture Controller

import json
import cherrypy

class picturesController:
    def __init__(self, picturedb):
        self.picturedb = picturedb


    def PUT_USER_PICTURE(self, user_id):
        print("PUT_USER_PICTURE")
        msg = cherrypy.request.body.read() 
        return json.dumps(self.picturedb.put_user_picture(user_id, msg))
