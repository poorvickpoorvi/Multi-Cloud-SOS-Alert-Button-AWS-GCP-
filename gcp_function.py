from google.cloud import firestore
from flask import jsonify, Request
import datetime

db = firestore.Client()
collection_name = "sos_alerts"

def sos_handler(request: Request):
    try:
        data = request.get_json()
        name = data.get("name")
        location = data.get("location")
        message = data.get("message")

        if not all([name, location, message]):
            return jsonify({"error": "Missing fields"}), 400

        doc_ref = db.collection(collection_name).document()
        doc_ref.set({
            "name": name,
            "location": location,
            "message": message,
            "timestamp": datetime.datetime.utcnow().isoformat()
        })

        return jsonify({"message": "SOS stored in Firestore"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
