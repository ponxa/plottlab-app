from urllib.request import urlopen
from PIL import Image

# Transform image
from utils.auto_levels.methods import agg_channels_knn
from utils.img.utils import add_text_label, add_border
from utils.middy_decorators import middy_decorator

# Upload image to S3
import os
import boto3
from uuid import uuid4
from io import BytesIO

@middy_decorator
def handler(event, context):

    img_url = event['body']['img_url']
    img_description = event['body']['img_description']
    creation_date = event['body']['creation_date']

    original = Image.open(urlopen(img_url)).convert("RGB")

    edited = agg_channels_knn(original, k=3)
    # edited = add_text_label(edited, img_description)
    # edited = add_border(edited, border_width = 1)

    buffer = BytesIO()
    edited.save(buffer, 'JPEG', quality = 95, dpi = (150, 150), icc_profile = original.info.get('icc_profile',''))
    buffer.seek(0) # rewind pointer back to start

    # Upload buffer to S3
    s3 = boto3.client('s3')
    bucket_name = os.environ['MONTAGES_BUCKET_NAME']
    key = f'{creation_date}/singles/{uuid4()}.jpg'
    s3.put_object(
        Bucket = bucket_name,
        Key = key,
        Body = buffer,
        ContentType='image/jpeg',
    )
    edited_img_url = f'{s3.meta.endpoint_url}/{bucket_name}/{key}'

    return { 'edited_img_url': edited_img_url }