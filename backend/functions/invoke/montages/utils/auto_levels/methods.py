from .distances import wasserstein_distance
import numpy as np
import heapq

import json
import gzip
from pathlib import Path

from .objects import Levels, Reference
from .descriptors import normalized_channel_histograms, agg_channels_histogram
from .img_utils import apply_levels, img_to_np, np_to_img

# Read reference images info
refs_path = Path(__file__).parent / './data/references.gzip'
with gzip.open(refs_path.resolve(), 'r') as f:
    dict_refs = json.loads(f.read().decode('utf-8'))
    refs = [Reference.from_dict(d) for d in dict_refs]

def split_channels_knn(image, k = 3, method = 'average_params'):
    # Get Levels
    img_channel_histograms = normalized_channel_histograms(image)
    knns = heapq.nlargest(k, refs, key = lambda s: -(wasserstein_distance(img_channel_histograms.red, s.channel_histograms.red) + wasserstein_distance(img_channel_histograms.green, s.channel_histograms.green) + wasserstein_distance(img_channel_histograms.blue, s.channel_histograms.blue)))
    # knns = sorted(refs, key = lambda s: wasserstein_distance(img_channel_histograms.red, s.channel_histograms.red) + wasserstein_distance(img_channel_histograms.green, s.channel_histograms.green) + wasserstein_distance(img_channel_histograms.blue, s.channel_histograms.blue))
    knns = knns[:k]

    if method == 'average_params':
        average_levels =  Levels(
            black = np.mean([n.levels.black for n in knns]),
            gamma = np.mean([n.levels.gamma for n in knns]),
            white = np.mean([n.levels.white for n in knns])
            )

        # Apply Levels
        return apply_levels(image, average_levels.black, average_levels.gamma, average_levels.white)

    elif method == 'average_transforms':
        transforms = [apply_levels(image, n.levels.black, n.levels.gamma, n.levels.white) for n in knns]
        transforms = [img_to_np(t) for t in transforms]
        average_transform = np.mean(transforms, axis = 0)
        assert average_transform.shape == transforms[0].shape
        return np_to_img(average_transform)


    # for n in knns: print(n.filename, wasserstein_distance(img_channel_histograms.red, n.channel_histograms.red) + wasserstein_distance(img_channel_histograms.green, n.channel_histograms.green) + wasserstein_distance(img_channel_histograms.blue, n.channel_histograms.blue), (n.levels.black, n.levels.gamma, n.levels.white))

def agg_channels_knn(image, k = 3):
    img_agg_histogram = agg_channels_histogram(image)
    knns = heapq.nlargest(k, refs, key = lambda s: -wasserstein_distance(img_agg_histogram, s.agg_histogram))
    # knns = sorted(refs, key = lambda s: wasserstein_distance(img_agg_histogram, s.agg_histogram))
    knns = knns[:k]
    # print([n.levels.white for n in knns])
    pred_levels =  Levels(
        black = np.mean([n.levels.black for n in knns]),
        gamma = np.mean([n.levels.gamma for n in knns]),
        white = np.mean([n.levels.white for n in knns])
        )

    # Apply Levels
    return apply_levels(image, pred_levels.black, pred_levels.gamma, pred_levels.white)