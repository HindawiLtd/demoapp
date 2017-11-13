from flask import Flask
from flask_restful import Api

app = Flask(__name__)
app.config['ALLOWED_EXTENSIONS'] = {'.pdf', '.txt', '.xml'}
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['UPLOAD_FOLDER'] = "uploads"
app.config['BUILD_FOLDER'] = "build"

from flask_cors import CORS
CORS(app)

api = Api(app)

from demoapi.resources.doi import Doi
from demoapi.resources.files import Files
from demoapi.resources.harvest import *
from demoapi.resources.index import Index

api.add_resource(Doi, '/doi', '/doi/', '/doi/<path:doi>')
api.add_resource(Files, '/files', '/files/', '/files/<path:path>')
api.add_resource(HarvestRecords, '/records', '/records/', '/records/<string:key>')
api.add_resource(HarvestFormats, '/formats', '/formats/', '/formats/<string:key>')
api.add_resource(HarvestSources, '/sources', '/sources/')
api.add_resource(Index, '/', '/<path:path>')

app.run(host='0.0.0.0')