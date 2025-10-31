import json
import boto3
import os
from datetime import datetime

DYNAMO_TABLE = os.environ.get("SOS_TABLE", "SOS_Alerts")

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(DYNAMO_TABLE)

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        name = body.get("name")
        location = body.get("location")
        message = body.get("message")

        if not all([name, location, message]):
            return {"statusCode": 400, "body": json.dumps({"error": "Missing fields"})}

        item = {
            "id": str(datetime.utcnow().timestamp()),
            "name": name,
            "location": location,
            "message": message,
            "timestamp": datetime.utcnow().isoformat()
        }

        table.put_item(Item=item)

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "SOS stored in DynamoDB"})
        }

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
