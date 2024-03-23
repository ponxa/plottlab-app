from PIL import Image
import numpy as np

def img_to_np(image):
    return np.array(image).astype(np.float64)

def np_to_img(arr):
    return Image.fromarray(arr.astype(np.uint8))

def apply_levels_np(arr, black, gamma, white):
    # arr is a numpy array with pixel information
    assert black >= 0 and black <= 255
    assert gamma > 0
    assert white >= 0 and white <= 255


    # Apply black and white stretch
    new = 255 * (arr - black) / (white - black)

    # Clip values out of bounds
    new[new>255] = 255
    new[new<0] = 0

    # Apply gamma
    new = 255 * (new/255) ** (1/gamma)

    return new

def apply_levels(image, black, gamma, white):
    # image is a Pillow Image object
    image_arr = img_to_np(image)
    new_image_arr = apply_levels_np(image_arr, black, gamma, white)
    new_image = np_to_img(new_image_arr)
    return new_image