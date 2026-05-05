from flask import Flask, render_template, request, jsonify, session
import json

app = Flask(__name__)
app.secret_key = "tictactoe-secret"


def check_winner(board):
    lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ]
    for a, b, c in lines:
        if board[a] and board[a] == board[b] == board[c]:
            return board[a], [a, b, c]
    return None, []


def is_full(board):
    return all(cell != "" for cell in board)


def minimax(board, is_maximizing):
    winner, _ = check_winner(board)
    if winner == "O":
        return 1
    if winner == "X":
        return -1
    if is_full(board):
        return 0

    if is_maximizing:
        best = -2
        for i in range(9):
            if board[i] == "":
                board[i] = "O"
                best = max(best, minimax(board, False))
                board[i] = ""
        return best
    else:
        best = 2
        for i in range(9):
            if board[i] == "":
                board[i] = "X"
                best = min(best, minimax(board, True))
                board[i] = ""
        return best


def best_move(board):
    best_score = -2
    move = -1
    for i in range(9):
        if board[i] == "":
            board[i] = "O"
            score = minimax(board, False)
            board[i] = ""
            if score > best_score:
                best_score = score
                move = i
    return move


@app.route("/")
def index():
    session["board"] = [""] * 9
    return render_template("index.html")


@app.route("/move", methods=["POST"])
def move():
    data = request.get_json()
    board = session.get("board", [""] * 9)
    cell = data["cell"]

    if board[cell] != "":
        return jsonify({"error": "Cell taken"}), 400

    winner, winning_line = check_winner(board)
    if winner or is_full(board):
        return jsonify({"error": "Game over"}), 400

    board[cell] = "X"
    winner, winning_line = check_winner(board)

    if winner:
        session["board"] = board
        return jsonify({"board": board, "winner": "X", "winning_line": winning_line, "computer_move": None})

    if is_full(board):
        session["board"] = board
        return jsonify({"board": board, "winner": "draw", "winning_line": [], "computer_move": None})

    computer_cell = best_move(board)
    board[computer_cell] = "O"
    winner, winning_line = check_winner(board)

    session["board"] = board

    if winner:
        return jsonify({"board": board, "winner": "O", "winning_line": winning_line, "computer_move": computer_cell})

    if is_full(board):
        return jsonify({"board": board, "winner": "draw", "winning_line": [], "computer_move": computer_cell})

    return jsonify({"board": board, "winner": None, "winning_line": [], "computer_move": computer_cell})


@app.route("/reset", methods=["POST"])
def reset():
    session["board"] = [""] * 9
    return jsonify({"board": [""] * 9})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
