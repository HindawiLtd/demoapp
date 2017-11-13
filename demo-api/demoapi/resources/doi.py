import json
from os import makedirs
from os.path import join, exists
from subprocess import Popen, PIPE

from flask import request
from flask_restful import Resource
from habanero import Crossref

from demoapi.main import app

JSON_FILE = 'content.json'


class Doi(Resource):
    def get(self, doi=''):
        if doi == '':
            return [_read_json(file) for file in _list_json_files()]
        else:
            saved_data = _read_json(_local_file_path(doi))
            return saved_data if saved_data else Crossref().works(ids=[doi])

    def put(self, doi):
        _save_json(doi, request.json)
        return {}, 204


def _read_json(file):
    if not exists(file):
        return
    else:
        with open(file) as json_data:
            data = json.load(json_data)
        return data


def _save_json(doi, data):
    makedirs(_local_folder_name(doi), exist_ok=True)
    with open(_local_file_path(doi), 'w') as outfile:
        json.dump(data, outfile)


def _local_folder_name(doi):
    return join(app.config['UPLOAD_FOLDER'], doi)


def _local_file_path(doi):
    return join(_local_folder_name(doi), JSON_FILE)


def _list_json_files():
    cmd = f"find {app.config['UPLOAD_FOLDER']} -name {JSON_FILE}"
    out = Popen(cmd, shell=True, stdin=PIPE, stdout=PIPE, stderr=PIPE)

    (stdout, _) = out.communicate()
    return stdout.decode().split()
