from datetime import datetime, timedelta

from flask_restful import Resource, reqparse
from sickle import Sickle

DEFAULT_COUNT = 3
OAI_ENDPOINTS = [
    {'key': 'uni', 'name': 'University of Northern Iowa', 'endpoint': 'http://scholarworks.uni.edu/do/oai/'},
    {'key': 'hdw', 'name': 'Hindawi', 'endpoint': 'https://www.hindawi.com/oai-pmh/oai.aspx'},
]


class HarvestRecords(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('count', type=int, location='args')

    def get(self, key=''):
        arg = self.parser.parse_args()['count']
        count = arg if arg != None else DEFAULT_COUNT
        source = _find_endpoint(key)
        return _fetch_records(source, count) if source != '' else []


class HarvestFormats(Resource):
    def get(self, key=''):
        source = _find_endpoint(key)
        return _fetch_formats(source) if source != '' else {}


class HarvestSources(Resource):
    def get(self, key=''):
        return OAI_ENDPOINTS


def _find_endpoint(key):
    source = next((x for x in OAI_ENDPOINTS if x['key'] == key), None)
    return source['endpoint'] if source != None else ''


def _fetch_records(endpoint, count):
    subset = []
    sickle = Sickle(endpoint)
    records = sickle.ListRecords(metadataPrefix='oai_dc', ignore_deleted=True)
    for idx, rec in enumerate(records):
        if idx == count:
            break
        subset.append(rec.metadata)
    return subset


def _fetch_formats(endpoint):
    sickle = Sickle(endpoint)
    formats = sickle.ListMetadataFormats()
    return sorted([f.metadataPrefix for f in formats])


def _days_ago(n):
    datetime.now() - timedelta(days=n)
