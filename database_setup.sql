create table Users(
	user_id int,
	pass_hash varchar(255),
	netid varchar(255),
	first_name varchar(255),
	last_name varchar(255),
	is_undergrad bit,
	is_admin bit,
	gender varchar(255),
	residence_hall varchar(255),
	wins int,
	losses int,
	ties int,
	primary key (user_id)
);

create table Sports(
	sport_id int,
	name varchar(255),
	primary key (sport_id)
);

create table Leagues(
	league_id int,
	sport_id int,
	name varchar(255),
	start_time datetime,
	end_time datetime,
	gender varchar(255),
	team_size int,
	primary key (league_id),
	foreign key (sport_id) references Sports(sport_id)
);

create table Pools(
	pool_id int,
	league_id int,
	name varchar(255),
	pool_time time(0),
	max_size int,
	primary key (pool_id),
	foreign key (league_id) references Leagues(league_id)
);

create table Teams(
	team_id int,
	league_id int,
	pool_id int,
	name varchar(255),
	wins int,
	losses int,
	ties int,
	max_members int,
	primary key (team_id),
	foreign key (league_id) references Leagues(league_id),
	foreign key (pool_id) references Pools(pool_id)
);

create table Games(
	game_id int,
	team1_id int,
	team2_id int,
	location varchar(255),
	primary key (game_id),
	foreign key (team1_id) references Teams(team_id),
	foreign key (team2_id) references Teams(team_id)
);

create table Users_Teams(
	user_id int,
	team_id int,
	foreign key (user_id) references Users(user_id),
	foreign key (team_id) references Teams(team_id)
);

create index idx_users_teams
on Users_Teams (user_id, team_id);
