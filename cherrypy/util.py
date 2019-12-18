import copy

def get_dict_from_query(output_dict):
    if not output_dict:
        return {}
    if len(output_dict) == 1:
        r = copy.deepcopy(output_dict[0])
        decode_list(r)
    else:
        r = []
        for row in output_dict:
            decode_list(row)
            r.append(row)
    return r

def decode_list(l):
    for key in l:
        if isinstance(l[key], bytes):
            l[key] = l[key].decode("ascii")

def clean_query_input(input_dict, db_name, set_nulls=True):
    data = copy.deepcopy(input_dict)
    if db_name == 'Users':
        keys = ['pass_hash', 'netid', 'email', 'first_name', 'last_name', 'is_undergrad', 'is_admin', 'gender', 'residence_hall', 'wins', 'losses', 'ties']
        str_keys = ['pass_hash', 'netid', 'email', 'first_name', 'last_name', 'gender', 'residence_hall']
    elif db_name == 'Leagues':      
        keys = ['name', 'start_time', 'end_time', 'gender', 'team_size']
        str_keys = ['name', 'gender']
    elif db_name == 'Pools':
        keys = ['name', 'pool_time', 'max_size']
        str_keys = ['name']
    elif db_name == 'Sports':
        keys = ['name']
        str_keys = ['name']
    elif db_name == 'Teams':
        keys = ['league_id', 'pool_id', 'name', 'wins', 'losses', 'ties', 'max_members']
        str_keys = ['name']

    for key in keys:
        if key not in data and set_nulls:
            data[key] = 'null'
        elif key in data and key in str_keys:
            data[key] = "'{}'".format(data[key])

    return data
