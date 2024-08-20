# Chronos
A basic time-rapporting system in AWS. Below is a quick guide on how to set it up.

## Prerequisites
1. AWS Account: Ensure you have an AWS account.
2. AWS CLI: Install and configure the AWS CLI.
3. Terraform: Install Terraform on your local machine.
4. IAM User/Role: Ensure you have an IAM user or role with sufficient permissions to create resources.

## Step 1: Define Requirements
1. Data Storage: Use Amazon DynamoDB for storing time entries.
2. API Gateway: Use Amazon API Gateway to expose APIs for CRUD operations.
3. Lambda Functions: Use AWS Lambda for backend logic.
4. Authentication: Use Amazon Cognito for user authentication.

# Testing the API

curl -X POST -H "Content-Type: application/json" \
     -d '{"clientId": "client1", "duration": 120}' \
     https://<api-id>.execute-api.<region>.amazonaws.com/dev/time-entry

# Front end
Tools and frameworks
1. NextJS
2. AWS Cognito
3. AWS Amplify or AWS S3 + Cloudfront

# Deploy steps

The terraform project need to be initialized first.
`terraform init`

Deploy the project and perform the resource changes by using apply.
`terraform apply`
