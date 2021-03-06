# pools Controller

import json
import cherrypy

class poolsController:

    def __init__(self, pooldb):
        self.pooldb = pooldb
        
    def GET_POOLS(self):
        return json.dumps(self.pooldb.get_pools())
    
    # get an existing pool's info
    def GET_POOL(self, pool_id):
        return json.dumps(self.pooldb.get_pool(pool_id))

    # create a new pool
    # any keys not included in request body will be set to
    #  null in the database
    def POST_POOLS(self):
        msg = json.loads(cherrypy.request.body.read())
        for pool in msg['pools']:
            pool_id = self.pooldb.set_pool({"day": pool["day"], "league_id": msg["league_id"], "pool_time": pool["pool_time"], "max_size": msg["max_size"]})
        return json.dumps({"result": "success"})

    # update an existing pool
    # any keys not included in request body will not have
    #  their values changed in the database
    def PUT_POOL(self, pool_id):
        msg = json.loads(cherrypy.request.body.read())
        self.pooldb.update_pool(pool_id, msg)
        return json.dumps({"result": "success"})

    # delete an existing pool
    def DELETE_POOL(self, pool_id):
        self.pooldb.delete_pool(pool_id)
        return json.dumps({"result": "success"})
