from urllib.request import urlopen
from PIL import Image
import numpy as np

from utils.middy_decorators import middy_decorator
from utils.img.utils import get_dimensions_with_label


@middy_decorator
def handler(event, context):
    url = event["body"]["url"]
    img = Image.open(urlopen(url)).convert("RGB")
    width, height = img.size
    width, height = get_dimensions_with_label((width, height))

    mean_rgb = int(np.array(img).mean())

    return {"width": width, "height": height, "mean_rgb": mean_rgb}
