from flask import Flask, render_template, request, jsonify
import pandas as pd

app = Flask(__name__)

# Function to create and initialize the SQLite database
def init_db():
    pass

# Route to fetch and display all data from the database as JSON
@app.route('/data')
def get_data():
    # data = pd.read_csv('DataSets/model_county.csv')
    
    return jsonify('None') #jsonify(data)

# Route to visualize the data using D3.js (default index page)
@app.route('/')
def index():
    return render_template('index.html')

# Route with an input form
@app.route('/tempchg_map')
def tempchg_map():
    return render_template('tempchg_leaflet.html')

# Route to handle form submission and display input
@app.route('/submit', methods=['POST'])
def submit():
    user_input = request.form['user_input']
    return render_template('form.html', submitted_text=user_input)

if __name__ == '__main__':
    init_db()  # Initialize the database
    app.run(debug=True)
