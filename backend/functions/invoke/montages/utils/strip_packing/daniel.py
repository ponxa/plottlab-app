# %%
# Importar Librerias
from .objects import Rectangle
from .spp.ph import phsppog
import numpy as np


def uniform_rotation_heuristic(demands, strip_width):
    # demands is a list of Demand class objects
    boxes = []

    # ? phsppog does not rotate by itself and assumes that all rectangles fit inside the strip
    # ? So we do not allow any rectangles that are wider than the strip in both dimensions
    assert all(d.w <= strip_width or d.h <= strip_width for d in demands)

    # Some demands have a width greater than the strip width, so they MUST be rotated
    mandatory_rotations = [d for d in demands if d.w > strip_width]
    for d in mandatory_rotations:
        for _ in range(d.qty):
            boxes.append([d.h, d.w])

    # Some demands have a height greater than the strip width, so they CANNOT be rotated
    unable_to_rotate = [d for d in demands if d.h > strip_width]
    for d in unable_to_rotate:
        for _ in range(d.qty):
            boxes.append([d.w, d.h])

    # The remaining demands can be rotated, this is where the random sampling helps
    #! If this set is small, the heuristic will be not very helpful, because there will be little variation of input.
    #! Thus little variation of output.
    able_to_rotate = [
        d for d in demands if d not in mandatory_rotations and d not in unable_to_rotate
    ]
    for d in able_to_rotate:
        # Select a random number of rectangles to rotate
        q_rot = np.random.choice(range(d.qty + 1))
        for _ in range(q_rot):
            boxes.append([d.h, d.w])
        for _ in range(d.qty - q_rot):
            boxes.append([d.w, d.h])

    # Solve rotated instance
    height, rectangles = phsppog(strip_width, boxes, sorting="width")
    return height, [strip_width, height, rectangles]


# %%
def strip_packing(demands, width, n_instances):
    # PRUEBAS OPCION 2 PARA 1000 SIMULACIONES
    solutions = []
    objectives = []
    for i in range(n_instances):
        objective, solution = uniform_rotation_heuristic(demands, width)
        solutions.append(solution)
        objectives.append(objective)

    # RESULTADO PARA PRUEBAS OPCION 2
    opt = np.argmin(objectives)

    rects = []
    for rect in solutions[opt][2]:
        for d in demands:
            if (rect.w, rect.h) == (d.w, d.h) or (rect.w, rect.h) == (d.h, d.w):
                shape = (d.w, d.h)

                if (rect.w, rect.h) == (d.w, d.h):
                    rot = 0
                else:
                    rot = 1

        rects.append(Rectangle(x=rect.x, y=rect.y, shape=shape, rotated=rot))

    return objectives[opt], rects
