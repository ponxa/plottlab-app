import numpy as np
from types import SimpleNamespace as sn

def agg_channels_histogram(image):
    rgb_channels = image.split()            # Image split into R, G and B channels
    channel_hists = [np.array(channel.histogram()) for channel in rgb_channels]     # List of histograms for R, G and B channels
    agg_hist = sum(channel_hists)           # Sum of histograms
    agg_hist = agg_hist / agg_hist.sum()    # Normalize to sum 1
    return agg_hist

def normalized_channel_histograms(image):
    rgb_channels = image.split()            # Image split into R, G and B channels
    channel_hists = [np.array(channel.histogram()) for channel in rgb_channels]     # List of histograms for R, G and B channels
    channel_hists = [hist/hist.sum() for hist in channel_hists] # Normalize histograms
    channel_hists = sn(
        red = channel_hists[0],
        green = channel_hists[1],
        blue = channel_hists[2]
        )
    return channel_hists