from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template("home.html")

@app.route('/about')
def about():
    return render_template("about.html")

@app.route('/cursos')
def cursos():
    return render_template("cursos.html")

@app.route('/login')
def login():
    return render_template("login.html")

@app.route('/registro')
def registro():
    return render_template("registro.html")

@app.route('/post')
def post():
    return render_template("post.html")

@app.route('/otra_pagina')
def otra_pagina():
    return render_template("otra_pagina.html")

if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5001, debug=True)
