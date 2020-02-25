from MySQLdb import _mysql
import util
import os

class _picture_database:
    
    # initialize databse
    def __init__(self, db):
        self.db = db
            
    def put_user_picture(self, user_id, img_data):

        ## delete any profile picture that currently exists
        try:
            os.remove('../data/userPictures/{}.jpg'.format(user_id))
        except OSError:
            pass

        ## save the img_data file as a .jpg corresponding to the user's id
        f = open('../data/userPictures/{}.jpg'.format(user_id),'wb')
        f.write(img_data)
        f.close()

        ## construct response
        return {"success": "ok"}
