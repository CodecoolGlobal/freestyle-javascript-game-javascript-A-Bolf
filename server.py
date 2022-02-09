from flask import Flask, request, redirect, render_template

app = Flask(__name__)


@app.route('/')
def main():
    return render_template('main.html')
