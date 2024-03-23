import json

class Rectangle:

    def __init__(self, x, y, shape, rotated, img_source = None, img_description = ''):
        self.x = x
        self.y = y
        self.shape = shape
        self.rotated = rotated
        self.img_source = img_source
        self.img_description = img_description

    def y_end(self):
        if self.rotated:
            return self.y + self.shape[0]
        else:
            return self.y + self.shape[1]

    def __str__(self):
        return str( (self.x, self.y, self.shape, self.rotated) )

    def to_json(self):
        return json.dumps({
            'x': self.x,
            'y': self.y,
            'shape': self.shape,
            'rotated': self.rotated,
            'img_source': self.img_source,
            'img_description': self.img_description
        })
    
    @classmethod
    def from_json(cls, json_str):
        d = json.loads(json_str)
        return cls(
            x = d['x'],
            y = d['y'],
            shape = d['shape'],
            rotated = d['rotated'],
            img_source = d['img_source'],
            img_description = d['img_description']
        )

class Demand:
    def __init__(self, qty, shape):
        self.qty = qty
        self.shape = shape
        self.w = shape[0]
        self.h = shape[1]