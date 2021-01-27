import json
import os
from flask import (
    Blueprint, request
)
from flask_httpauth import HTTPTokenAuth
from newspaper import Article

auth = HTTPTokenAuth(scheme='Token')
bp = Blueprint('app', __name__)

@auth.verify_token
def verify_token(token):
    api_token = os.environ.get('HTTP_AUTH_TOKEN')

    if token == api_token:
        return True
    return False

@bp.route('/article/parse', methods=('GET', 'POST'))
@auth.login_required
def index():
    article_url = request.args.get('article_url')
    article = Article(article_url)
    article.download()
    article.parse()
    print(article.text)
    return json.dumps({"text": article.text})