from flask_restful import Resource
from flask import send_from_directory, current_app as app
from os.path import join, splitext

from demoapi.main import api

class Index(Resource):
    def get(self, path='index.html'):
        # def no_index(x): return x != 'index'

        # def prefix_slash(x): return '/' + x

        # endpoints = list(map(prefix_slash, filter(no_index, api.endpoints)))
        # return {"urls": endpoints}

        files_root = join(app.root_path, "..", "build")
        return send_from_directory(files_root, path)
