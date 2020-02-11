# Titanium

This is the Titanium web app, which will be used to coordinate intramural sports at the University of Notre Dame.

Developed by Tommy Clare, Patrick Fischer, Sebastian Miner, and Andy Slavin

Course: Software Development Principles, Fall 2019

Setup:
1. Clone entire repository
2. Navigate to the cherrypy directory with `cd cherrypy`
3. Create a new python virtual environment with `python3 -m venv myenv`
4. Whenever you want to run the server, activate the virtual environment with `source myenv/bin/activate`
5. Once the venv is activated, install dependencies with `pip3 install -r requirements.txt`
6. Run the server with `python3 main.py

Database setup:
Export database with `mysqldump -u username -p dbname > dbexport.sql`.
Import database with `mysql -u username -p dbname < dbexport.sql`.
