from flask import Flask, request, redirect, render_template

app = Flask(__name__)
app.secret_key='asdsegdthtf'


@app.route('/')
def main():
    return render_template('main.html')

@app.route('/winner')
def won():
    return render_template('winner.html')


@app.route('/loser')
def lost():
    return render_template('loser.html')

@app.route('/breakout')
def game():
    difficulty = request.args.get('difficulty')
    return render_template('index.html', difficulty=difficulty)


if __name__ == '__main__':
    app.run()
