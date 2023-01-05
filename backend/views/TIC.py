from flask import Flask, request, Blueprint

TIC_Page = Blueprint('TIC_Page', __name__, template_folder='templates')
@TIC_Page.route('/tic_planet')
def show(page):
    pass