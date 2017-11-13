import re
import time
from os import makedirs, listdir, rmdir, replace
from os.path import join, splitext

from flask import send_from_directory, current_app as app
from flask_restful import Resource, reqparse
from werkzeug.datastructures import FileStorage

from demoapi.main import api


class Files(Resource):
    parser = reqparse.RequestParser()
    # <input type="file" name="file">
    parser.add_argument('file', required=True, type=FileStorage, location='files')

    def get(self, path=''):
        if path == '':
            return {}
        else:
            # /path/to/demo-api/demoapi/ => /path/to/demo-api/uploads/
            files_root = join(app.root_path, "..", app.config['UPLOAD_FOLDER'])
            return send_from_directory(files_root, path)

    def post(self):
        file: FileStorage = self.parser.parse_args()['file']
        if not _allowed_file(file.filename):
            extensions = ' '.join(app.config['ALLOWED_EXTENSIONS'])
            return {"message": f"Could not process '{file.filename}'. Only accepts file extensions: {extensions}"}

        tmp_folder = _save_file(file)
        doi = _parse_doi(_parse_pdf(file)) if _ext(file.filename) == '.pdf' else ''
        new_folder = _rename_folder(old=tmp_folder, new=doi)
        file_url = _url_path(new_folder, file)

        DOI_FOUND = f"Saved file '{file.filename}'"
        DOI_MISSING = f"Did not find any DOI in '{file.filename}'"
        return {"message": DOI_FOUND if doi != '' else DOI_MISSING, "doi": doi, "file": file_url}


def _allowed_file(filename):
    return _ext(filename) in app.config['ALLOWED_EXTENSIONS']


def _ext(filename):
    return splitext(filename)[1].lower()


def _parse_pdf(file):
    """
    See https://euske.github.io/pdfminer/programming.html
    See https://stackoverflow.com/questions/26494211/
    """
    from io import StringIO
    from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
    from pdfminer.converter import TextConverter
    from pdfminer.layout import LAParams
    from pdfminer.pdfpage import PDFPage

    buffer = StringIO()
    rsrcmgr = PDFResourceManager()
    device = TextConverter(rsrcmgr, buffer, laparams=LAParams())
    interpreter = PDFPageInterpreter(rsrcmgr, device)

    for page in PDFPage.get_pages(file):
        interpreter.process_page(page)

    text = buffer.getvalue()
    device.close()
    buffer.close()
    return text


def _parse_doi(text):
    regex = "(doi\.org/|doi: ?|DOI: ?|DOI )(10\.[A-Za-z0-9_~:/#@&',;=%\.\?\[\]\(\)\*\+\!\$\-]*[A-Za-z0-9])"
    match = re.search(regex, text, re.MULTILINE)
    return match.group(2) if match else ''


def _save_file(file):
    tmp_folder = time.strftime('%Y%m%d%H%M%S')
    local_folder = join(app.config['UPLOAD_FOLDER'], tmp_folder)
    makedirs(local_folder, exist_ok=True)
    file.save(join(local_folder, _local_file_name(file)))
    return tmp_folder


def _rename_folder(old, new):
    if new == '':
        return old
    else:
        old_folder = join(app.config['UPLOAD_FOLDER'], old)
        new_folder = join(app.config['UPLOAD_FOLDER'], new)
        makedirs(new_folder, exist_ok=True)

        files = listdir(old_folder)
        for f in files:
            replace(join(old_folder, f), join(new_folder, f))
        rmdir(old_folder)
        return new


def _url_path(new_folder, file):
    return api.url_for(Files, path=join(new_folder, _local_file_name(file)))


def _local_file_name(file):
    return f"content{_ext(file.filename)}"
