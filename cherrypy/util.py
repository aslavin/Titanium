import copy

def get_dict_from_query(output_dict):
	if not output_dict:
		return {}
	if len(output_dict) == 1:
		r = copy.deepcopy(output_dict[0])
		for key in r:
			if isinstance(r[key], bytes):
				r[key] = r[key].decode("ascii")
	else:
		r = []
		for row in output_dict:
			for key in row:
				if isinstance(row[key], bytes):
					row[key] = row[key].decode("ascii")
			r.append(row)
	return r

def clean_query_input(input_dict, db_name, set_nulls=True):
	data = copy.deepcopy(input_dict)
	if db_name == 'Users':
		keys = ['pass_hash', 'netid', 'first_name', 'last_name', 'is_undergrad', 'is_admin', 'gender', 'residence_hall', 'wins', 'losses', 'ties']
		str_keys = ['pass_hash', 'netid', 'first_name', 'last_name', 'gender', 'residence_hall']
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
