# Distribute image enhancing
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO

# Sheet composition
from urllib.request import urlopen
from PIL import Image
from utils.strip_packing.objects import Rectangle
from utils.middy_decorators import middy_decorator

# S3 upload
import json
import os
import boto3
from uuid import uuid4

APPLY_EFFECTS_ARN = os.environ['APPLY_EFFECTS_TO_IMAGE_URL_NAME']

client = boto3.client('lambda')
def invoke_client(functionName, payload): 
    response = client.invoke(FunctionName = functionName,
        Payload = json.dumps({'body':payload}),
        InvocationType = 'RequestResponse')
    
    payload = json.loads(response['Payload'].read())
   
    return json.loads(payload['body']) if payload.get('body') is not None else None
    
def download_imgs_to_rects(rects, creation_date):
    def logic(rect):
        # TODO: Make an Img class and make this a method
        # Apply auto-levels
        #! try to change this lambda invkoke call for other shit
        response = invoke_client(   
            APPLY_EFFECTS_ARN,
            { 'img_url': rect.img_source, 'img_description': rect.img_description, 'creation_date': creation_date }
            )
        rect.im = Image.open(urlopen(response['edited_img_url'])).convert("RGB")

    with ThreadPoolExecutor(max_workers=len(rects)) as executor:
        futures = [executor.submit(logic, rect) for rect in rects]
        return [future.result() for future in futures]

@middy_decorator
def handler(event, context):
    # Read params
    json_rects = event['body']['json_rects']
    strip_width = event['body']['strip_width']
    creation_date = event['body']['creation_date']

    # Load rectangles and append each its image
    rects = [Rectangle.from_json(json_rect) for json_rect in json_rects]
    download_imgs_to_rects(rects, creation_date)

    # Init sheet image object
    sheet_height = max(r.y_end() for r in rects)    #Determine sheet height from images
    sheet = Image.new( 'RGB', (strip_width, sheet_height), (255, 255, 255) )

    # Paste each rect image on its position
    for rect in rects:
        rect.im = rect.im.rotate(90, expand = True) if rect.rotated else rect.im
        sheet.paste( rect.im, box = (rect.x, rect.y) )
        del rect.im

    # Save image buffer
    buffer = BytesIO()
    sheet.save(buffer, 'JPEG', quality = 95, dpi = (150, 150))
    buffer.seek(0) # rewind pointer back to start
    
    # Upload buffer to S3
    s3 = boto3.client('s3')
    bucket_name = os.environ['MONTAGES_BUCKET_NAME']
    key = f'{creation_date}/{uuid4()}.jpg'
    s3.put_object(
        Bucket = bucket_name,
        Key = key,
        Body = buffer,
        ContentType='image/jpeg',
    )
    url = f'{s3.meta.endpoint_url}/{bucket_name}/{key}'
    return { 'url': url }