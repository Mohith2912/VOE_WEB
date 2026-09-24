import math
import random

import cv2
import numpy as np


SOURCE = r"C:\Users\jmohi\AppData\Local\Temp\codex-clipboard-d32a5904-367b-44ed-97b7-2fc83691fc9e.png"
OUTPUT = r"E:\VOE_WEBSITE\output\voe-logo-reveal.mp4"
WIDTH, HEIGHT, FPS, DURATION = 1920, 1080, 30, 6.3


def ease_in_out(value):
    value = max(0.0, min(1.0, value))
    return value * value * (3.0 - 2.0 * value)


def paste_center(base, layer, center, alpha=1.0):
    height, width = layer.shape[:2]
    x0 = int(center[0] - width / 2)
    y0 = int(center[1] - height / 2)
    x1, y1 = x0 + width, y0 + height
    sx0, sy0 = max(x0, 0), max(y0, 0)
    sx1, sy1 = min(x1, base.shape[1]), min(y1, base.shape[0])
    if sx1 <= sx0 or sy1 <= sy0:
        return
    lx0, ly0 = sx0 - x0, sy0 - y0
    crop = layer[ly0:ly0 + (sy1 - sy0), lx0:lx0 + (sx1 - sx0)]
    mask = np.full(crop.shape[:2], alpha, dtype=np.float32)
    base[sy0:sy1, sx0:sx1] = (
        base[sy0:sy1, sx0:sx1] * (1.0 - mask[..., None]) + crop * mask[..., None]
    ).astype(np.uint8)


def add_glow(canvas, center, radius, color, strength):
    yy, xx = np.ogrid[:HEIGHT, :WIDTH]
    distance = np.sqrt((xx - center[0]) ** 2 + (yy - center[1]) ** 2)
    alpha = np.clip(1 - distance / radius, 0, 1) ** 2 * strength
    colored = np.empty_like(canvas)
    colored[:] = color
    return (canvas * (1 - alpha[..., None]) + colored * alpha[..., None]).astype(np.uint8)


def main():
    logo = cv2.imread(SOURCE, cv2.IMREAD_COLOR)
    if logo is None:
        raise FileNotFoundError(SOURCE)
    logo = cv2.cvtColor(logo, cv2.COLOR_BGR2RGB)
    logo = cv2.resize(logo, (1200, 1200), interpolation=cv2.INTER_LANCZOS4)

    random.seed(8)
    particles = [
        (random.uniform(0, WIDTH), random.uniform(0, HEIGHT), random.uniform(1.2, 3.8), random.uniform(0.2, 1.0), random.uniform(0, math.tau))
        for _ in range(115)
    ]

    writer = cv2.VideoWriter(
        OUTPUT,
        cv2.VideoWriter_fourcc(*"mp4v"),
        FPS,
        (WIDTH, HEIGHT),
    )
    if not writer.isOpened():
        raise RuntimeError("Could not open MP4 output")

    total_frames = int(FPS * DURATION)
    for frame_index in range(total_frames):
        time = frame_index / FPS
        canvas = np.zeros((HEIGHT, WIDTH, 3), dtype=np.uint8)

        # Deep emerald cinematic background.
        canvas[:] = (2, 13, 10)
        canvas = add_glow(canvas, (WIDTH * 0.5, HEIGHT * 0.47), 920, (4, 87, 58), 0.72)
        canvas = add_glow(canvas, (WIDTH * 0.52, HEIGHT * 0.50), 520, (120, 83, 2), 0.42)

        # Fine floating gold / jade particles.
        particle_fade = ease_in_out((time - 0.25) / 1.0)
        for x, y, size, speed, phase in particles:
            px = int((x + math.sin(time * speed + phase) * 38) % WIDTH)
            py = int((y - time * (13 + speed * 19)) % HEIGHT)
            pulse = 0.45 + 0.55 * math.sin(time * 2.2 + phase) ** 2
            color = (225, 184, 56) if int(phase * 10) % 2 else (47, 174, 119)
            cv2.circle(canvas, (px, py), max(1, int(size)), color, -1, cv2.LINE_AA)
            if particle_fade < 1:
                cv2.circle(canvas, (px, py), max(1, int(size + 2)), color, 1, cv2.LINE_AA)

        center = (WIDTH // 2, HEIGHT // 2 - 10)
        arrival = ease_in_out((time - 0.2) / 1.65)
        settle = ease_in_out((time - 1.55) / 2.0)
        logo_scale = 0.50 + arrival * 0.31 + settle * 0.045
        logo_scale += math.sin(time * 1.7) * 0.006
        rotation = (1.0 - arrival) * -7.0 + math.sin(time * 1.1) * 0.55
        rendered_size = int(1200 * logo_scale)
        scaled = cv2.resize(logo, (rendered_size, rendered_size), interpolation=cv2.INTER_LANCZOS4)
        matrix = cv2.getRotationMatrix2D((rendered_size / 2, rendered_size / 2), rotation, 1.0)
        rotated = cv2.warpAffine(scaled, matrix, (rendered_size, rendered_size), borderValue=(0, 0, 0))

        # Soft ring energy behind the badge.
        ring_alpha = int(65 + 75 * arrival)
        ring_radius = int(rendered_size * 0.53 + math.sin(time * 2.5) * 10)
        for offset, color, thickness in [(0, (222, 183, 55), 3), (18, (13, 139, 92), 2), (35, (222, 183, 55), 1)]:
            cv2.ellipse(canvas, center, (ring_radius + offset, ring_radius + offset), time * 9, 0, 360, color, thickness, cv2.LINE_AA)

        # A wider, blurred halo makes the logo feel lit, without changing its artwork.
        halo = cv2.GaussianBlur(rotated, (0, 0), 28)
        paste_center(canvas, halo, center, 0.11 * arrival)
        paste_center(canvas, rotated, center, arrival)

        # Brief gold light sweep at the reveal peak.
        sweep = max(0.0, 1.0 - abs(time - 3.2) / 0.7)
        if sweep:
            sweep_x = int(WIDTH * (0.15 + (time - 2.5) / 1.4 * 0.7))
            overlay = canvas.copy()
            cv2.line(overlay, (sweep_x - 160, 0), (sweep_x + 370, HEIGHT), (255, 232, 150), 18, cv2.LINE_AA)
            canvas = cv2.addWeighted(canvas, 1.0, overlay, 0.20 * sweep, 0)

        # Vignette retains focus on the emblem.
        yy, xx = np.ogrid[:HEIGHT, :WIDTH]
        vignette = ((xx - WIDTH / 2) / (WIDTH * 0.74)) ** 2 + ((yy - HEIGHT / 2) / (HEIGHT * 0.70)) ** 2
        canvas = (canvas * np.clip(1.13 - vignette[..., None] * 0.36, 0.58, 1.0)).astype(np.uint8)
        writer.write(cv2.cvtColor(canvas, cv2.COLOR_RGB2BGR))

    writer.release()
    print(OUTPUT)


if __name__ == "__main__":
    main()
