import numpy as np
from types import SimpleNamespace as sn

class Levels:
    def __init__(self, black, gamma, white):
        self.black = black
        self.gamma = gamma
        self.white = white

class Reference:
    def __init__(self, filename, levels, agg_histogram, channel_histograms):
        self.filename = filename
        self.agg_histogram = agg_histogram
        self.channel_histograms = channel_histograms
        self.levels = levels

    def to_dict(self):
        return {
            'filename': self.filename,
            'levels': {
                'black': self.levels.black,
                'gamma': self.levels.gamma,
                'white': self.levels.white,
            },
            'agg_histogram': self.agg_histogram.tolist(),
            'channel_histograms': {
                'red': self.channel_histograms.red.tolist(),
                'green': self.channel_histograms.green.tolist(),
                'blue': self.channel_histograms.blue.tolist()
            }
        }

    @classmethod
    def from_dict(cls, d):
        levels = Levels(d['levels']['black'], d['levels']['gamma'], d['levels']['white'])
        return cls(
            filename = d['filename'],
            levels = levels,
            agg_histogram = np.array(d['agg_histogram']),
            channel_histograms = sn(
                red = d['channel_histograms']['red'],
                green = d['channel_histograms']['green'],
                blue = d['channel_histograms']['blue']
            )
        )
