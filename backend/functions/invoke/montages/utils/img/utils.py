from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

LABEL_THICKNESS = 42

def get_dimensions_with_label(original_dimensions):
    # original_dimensions must be a tuple (width, height)
    width, height = original_dimensions
    if width > height:
        return (width + LABEL_THICKNESS, height)
    else:
        return (width, height + LABEL_THICKNESS)

def add_text_label(img, txt):
    padding = 5
    txt = f'▼ {txt} ▼'
    original = img

    # Determine shortest side
    width, height = original.size
    w_gt_h = width > height

    if w_gt_h:
        shortest_dim = height
        width = width + LABEL_THICKNESS
        rot = 90
    else:
        shortest_dim = width
        height = height + LABEL_THICKNESS
        rot = 0

    labeled_im = Image.new("RGB", (width, height), color = (255, 255, 255))
    labeled_im.paste( original, (width - original.width, height - original.height) )

    # Write label
    font_path = str( (Path(__file__).parent / './assets/hack-regular.ttf').absolute() )
    font = ImageFont.truetype(font = font_path, size = int(LABEL_THICKNESS * 0.6) )

    txt_layer = Image.new('RGB', (font.getsize(txt)[0] + 2*padding, LABEL_THICKNESS), (255, 255, 255))

    draw = ImageDraw.Draw(txt_layer)
    draw.text( (padding, padding), txt, fill = 0, font = font )

    txt_layer_w = min(font.getsize(txt)[0] + 2*padding, shortest_dim)
    txt_layer = txt_layer.resize((txt_layer_w, LABEL_THICKNESS))
    txt_layer = ImageOps.mirror(txt_layer)
    txt_layer = txt_layer.rotate(rot, expand = True)

    txt_position = (0, original.height - txt_layer.height) if w_gt_h else (0, 0)
    labeled_im.paste( txt_layer, txt_position )

    return labeled_im

def add_border(img, border_width = 1):
    width, height = img.size

    border = ImageOps.invert(img)

    img = img.crop((border_width, border_width, width - border_width, height - border_width))
    border.paste(img, (border_width, border_width))

    return border