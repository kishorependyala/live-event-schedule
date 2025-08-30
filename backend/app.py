from flask import Flask, jsonify

app = Flask(__name__)

# Sample performance data
PERFORMANCES = [
    {
        "title": "Opening Ceremony",
        "duration": "30 min",
        "coordinator": "John Smith",
        "performers": [
            {"name": "Alice", "img": "alice.jpg"}
        ]
    },
    {
        "title": "Keynote: The Future of Tech",
        "duration": "45 min",
        "coordinator": "Jane Doe",
        "performers": [
            {"name": "Bob", "img": "bob.jpg"}
        ]
    },
    {
        "title": "Networking Lunch",
        "duration": "60 min",
        "coordinator": "Mike Lee",
        "performers": [
            {"name": "Carol", "img": "carol.jpg"}
        ]
    },
    {
        "title": "Workshop: AI in Practice",
        "duration": "90 min",
        "coordinator": "Sara Kim",
        "performers": [
            {"name": "Dave", "img": "dave.jpg"},
            {"name": "Eve", "img": "eve.jpg"}
        ]
    },
    {
        "title": "Panel Discussion",
        "duration": "60 min",
        "coordinator": "Tom Brown",
        "performers": [
            {"name": "Frank", "img": "frank.jpg"}
        ]
    },
    {
        "title": "Closing Remarks",
        "duration": "30 min",
        "coordinator": "Anna White",
        "performers": [
            {"name": "Alice", "img": "alice.jpg"},
            {"name": "Bob", "img": "bob.jpg"}
        ]
    }
]

@app.route('/api/performances', methods=['GET'])
def get_performances():
    return jsonify(PERFORMANCES)

if __name__ == '__main__':
    app.run(debug=True)
