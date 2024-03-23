from concurrent.futures import ThreadPoolExecutor

from utils.middy_decorators import middy_decorator
from utils.strip_packing.objects import Demand
from utils.strip_packing.daniel import strip_packing
import json
import os
import boto3

client = boto3.client("lambda")

make_sheet_from_rects_name = os.environ["MAKE_SHEET_FROM_RECT_NAME"]


def invoke_client(functionName, payload):
    response = client.invoke(
        FunctionName=functionName,
        Payload=json.dumps({"body": payload}),
        InvocationType="RequestResponse",
    )

    payload = json.loads(response["Payload"].read())

    return json.loads(payload["body"]) if payload.get("body") is not None else None


def make_sheets_from_images(imgs, strip_width, max_sheet_height):
    # Make single copies of images and shapes for Strip Packing
    single_imgs = sum([[img] * 1 for img in imgs], [])
    single_imgs = sorted(single_imgs, key=lambda i: -i["mean_rgb"])
    shapes = [img["shape"] for img in single_imgs]

    # Apply Strip-Packing
    demands = [Demand(shapes.count(shape), shape) for shape in set(shapes)]
    # TODO: Assert strip can contain image
    total_height, rects = strip_packing(demands, strip_width, n_instances=1000)
    assert len(rects) == len(single_imgs)

    # Assign img to rect (for each rect, assign the first image that matches its shape)
    for rect in rects:
        for i, img in enumerate(single_imgs):
            if rect.shape == img["shape"]:
                rect.img_source = img["url"]
                rect.img_description = f""
                break
        del single_imgs[i]

    # Distribute images on separate sheets
    sheets = []
    remaining = rects
    while remaining:
        sheet_rects = [r for r in remaining if r.y_end() < max_sheet_height]
        remaining = [r for r in remaining if r.y_end() >= max_sheet_height]

        # Save sheet in sheets
        sheets.append(sheet_rects)

        # Reset remaining strip origin
        if not remaining:
            break

        reset_origin_offset = min(r.y for r in remaining)
        for r in remaining:
            r.y -= reset_origin_offset

    return total_height, sheets


def get_sheets_urls(sheets, strip_width, creation_date):
    def logic(sheet):
        json_rects = [r.to_json() for r in sheet]
        response = invoke_client(
            make_sheet_from_rects_name,
            {
                "json_rects": json_rects,
                "strip_width": strip_width,
                "creation_date": creation_date,
            },
        )
        return response["url"]

    with ThreadPoolExecutor(max_workers=len(sheets)) as executor:
        futures = [executor.submit(logic, sheet) for sheet in sheets]
        return [future.result() for future in futures]


@middy_decorator
def handler(event, context):
    creation_date = event["body"]["creation_date"]
    imgs = event["body"]["imgs"]
    strip_width_in_cm = event["body"]["strip_width_in_cm"]

    for img in imgs:
        img["shape"] = tuple(img["shape"])
        img["mean_rgb"] = int(img["mean_rgb"])

    strip_width = int((strip_width_in_cm / 2.54) * 150)  # 150ppi
    max_sheet_height = 29527  # 500cm in pixels @150ppi
    total_height, sheets = make_sheets_from_images(imgs, strip_width, max_sheet_height)
    montage_urls = get_sheets_urls(sheets, strip_width, creation_date)
    return {"montageUrls": montage_urls}
