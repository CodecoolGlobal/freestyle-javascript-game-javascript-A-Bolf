from flask import Flask, request, redirect, render_template

app = Flask(__name__)


@app.route('/')
def main():
    return render_template('main.html')


@app.route('/breakout')
def game():
    difficulty = request.args.get('difficulty')
    return render_template('index.html', difficulty=difficulty)