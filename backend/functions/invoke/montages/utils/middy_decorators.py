import json

def event_parser(event):
    if event.get('Records') is not None:

        if event['Records'][0].get('eventSource') == 'aws:sqs':
            event['body'] = event['Records'][0]['body']
        elif event['Records'][0].get('EventSource') == 'aws:sns':
            event['body'] = event['Records'][0]['Sns']['Message']
        
    if event.get('body') is not None:
        event['body'] = json.loads(event['body']) if type(event['body']) == str else event['body']
    else:
        #* This ensures body always exists
        event['body'] = {}

def response_formatter(response):
        return {'statusCode': 200, 'body': json.dumps(response)}

def middy_decorator(func):         
    def wrapper(event, context):  
        event_parser(event)
        response = func(event, context)
        return response_formatter(response)
    
    return wrapper