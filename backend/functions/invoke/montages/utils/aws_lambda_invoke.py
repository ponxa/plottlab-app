import json
import os
import boto3

lambda_client = boto3.client('lambda')

def lambda_invoke(service_name, function_name, payload, InvocationType = 'RequestResponse'): # Other options: "Event" for fire and forget, "DryRun" for parameter and role validations
    response = lambda_client.invoke(
        FunctionName = f'arn:aws:lambda:sa-east-1:935538565875:function:{service_name}-{os.environ["STAGE"]}-{function_name}',
        Payload = json.dumps({'body':payload}),
        InvocationType = InvocationType
    )
    
    if InvocationType == 'RequestResponse':
        payload = json.loads(response['Payload'].read())
        if payload['statusCode'] < 300:
            return json.loads(payload['body']) if payload.get('body') is not None else None
        
        raise Exception(f'statusCode: ${payload["statusCode"]}, message: ${payload["body"]}')
    else: 
       return response