Multi-Cloud SOS Alert System (AWS + GCP)

This project is a simple multi-cloud application that allows users to send emergency SOS alerts through a web interface.
The alerts are stored in AWS DynamoDB (via AWS Lambda) and Google Firestore (via Google Cloud Function).
It demonstrates how a single frontend can interact with multiple cloud platforms using serverless technologies.

Project Overview

Tech Stack:

Frontend: HTML, CSS, JavaScript

AWS: Lambda, API Gateway, DynamoDB

GCP: Cloud Function, Firestore

This project is designed to run entirely within the free tiers of AWS and GCP.

Folder Structure
sos-alert-system/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── aws_lambda/
│   │   ├── lambda_function.py
│   │   └── requirements.txt
│   │
│   └── gcp_function/
│       ├── main.py
│       └── requirements.txt
│
└── README.md

1. Setting up the Frontend

Open the frontend/script.js file.

Replace the placeholder endpoints with your actual deployed AWS and GCP function URLs:

const awsEndpoint = "https://your-aws-api.execute-api.us-east-1.amazonaws.com/dev/sos";
const gcpEndpoint = "https://your-gcp-function-url/sos";


Open index.html in your browser to test the form locally.

Once working, host the frontend using one of these free options:

GitHub Pages

AWS S3 (Static Website Hosting)

Firebase Hosting

2. Deploying the AWS Backend
Step 1: Create DynamoDB Table

Go to the AWS Management Console → DynamoDB → Create Table.

Table name: SOS_Alerts

Primary key: id (String)

Leave other settings as default and create the table.

Step 2: Create Lambda Function

Navigate to AWS Lambda → Create function → Author from scratch.

Function name: sos_alert_lambda

Runtime: Python 3.9 or later.

Execution role: Create a new role with basic Lambda permissions.

Paste the code from backend/aws_lambda/lambda_function.py.

Step 3: Add Permissions

Go to IAM → Roles → select your Lambda role.

Attach the AmazonDynamoDBFullAccess policy.

Also ensure AWSLambdaBasicExecutionRole is attached (for CloudWatch logs).

Step 4: Add Environment Variable

Under Configuration → Environment variables:

Key: SOS_TABLE
Value: SOS_Alerts

Step 5: Create API Gateway

Go to API Gateway → Create API → REST API.

Create a new resource /sos and method POST.

Integrate it with your Lambda function.

Deploy the API with a new stage (e.g., dev).

Copy the public endpoint URL.

Step 6: Test the Endpoint

Use Postman or curl:

curl -X POST https://your-api-url/dev/sos \
-H "Content-Type: application/json" \
-d '{"name": "John", "location": "New York", "message": "Help needed"}'


Check DynamoDB for the stored data.

Common Errors

AccessDeniedException → Missing DynamoDB permission. Attach correct IAM policy.

Timeout or 500 Error → Check CloudWatch logs for JSON decoding issues or missing environment variable.

CORS Error in browser → Enable CORS in API Gateway under “CORS configuration”.

3. Deploying the GCP Backend
Step 1: Enable Required Services

Enable the following in your Google Cloud project:

Cloud Functions

Firestore (in Native mode)

Cloud Build

IAM API

Step 2: Initialize Firestore

Go to Firestore → Create database → Native mode.

Choose region (preferably same as Cloud Function region).

Step 3: Deploy Cloud Function

Go to Cloud Functions → Create function.

Function name: sos_handler

Trigger: HTTP

Runtime: Python 3.9 or later.

Entry point: sos_handler

Paste the code from backend/gcp_function/main.py.

Add dependencies from requirements.txt.

Step 4: Deploy and Copy Endpoint

After successful deployment, copy the trigger URL.

This will be your GCP endpoint for the frontend.

Step 5: Test

Use Postman or cURL:

curl -X POST https://your-gcp-function-url \
-H "Content-Type: application/json" \
-d '{"name":"Alex", "location":"LA", "message":"Emergency"}'


Check Firestore for the new document under the sos_alerts collection.

Common Errors

PermissionDenied: Missing IAM Role → Ensure Firestore API is enabled and your account has Cloud Functions Invoker permission.

500 Internal Error → Check function logs for missing field names or invalid JSON.

Deployment Error (Timeout) → Verify that you have the correct region and that Firestore is initialized in the same project.

4. Connecting the Frontend

Update the API URLs in script.js with your AWS and GCP endpoints.

Host the frontend/ folder as a static website.

Submit an alert to confirm both clouds receive the data.

5. Testing

You can verify that the data is being stored correctly:

AWS: Check DynamoDB table SOS_Alerts

GCP: Check Firestore collection sos_alerts

Try sending alerts multiple times — you should see them appear in both databases depending on the endpoint selected.

6. Troubleshooting Summary
Problem	Cause	Solution
CORS error in browser	API Gateway or GCP HTTP trigger not allowing requests	Enable CORS and redeploy
Access denied in AWS	Missing DynamoDB permissions	Attach AmazonDynamoDBFullAccess
Firestore not updating	Firestore not in Native mode	Recreate Firestore in Native mode
HTTP 400 (Bad Request)	Missing name, location, or message	Ensure frontend sends all fields
Network error	Incorrect endpoint	Verify correct API URLs in script.js
7. Free Tier Summary
Cloud	Service	Free Tier
AWS	Lambda	1M requests/month
AWS	DynamoDB	25GB storage free
GCP	Cloud Function	2M invocations/month
GCP	Firestore	1GB storage free

All services used here operate comfortably within the free usage limits.

8. Project Goals

Demonstrate multi-cloud integration with minimal cost.

Teach how to use serverless functions for real-time alert handling.

Showcase cross-cloud communication with a simple web frontend.


