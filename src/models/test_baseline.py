import sys
from pathlib import Path

import torch


CURRENT_DIR = Path(
    __file__
).resolve().parent

sys.path.append(
    str(CURRENT_DIR)
)


from baseline import BaselineResNet18


# ============================================================
# DEVICE
# ============================================================

device = torch.device(
    "cuda"
    if torch.cuda.is_available()
    else "cpu"
)

print(
    "Device:",
    device
)


# ============================================================
# MODEL
# ============================================================

model = BaselineResNet18(
    num_classes=4,
    freeze_backbone=True
)

model = model.to(
    device
)


# ============================================================
# FAKE BATCH
# ============================================================

fake_images = torch.randn(
    8,
    3,
    224,
    224
).to(device)


# ============================================================
# FORWARD PASS
# ============================================================

with torch.no_grad():

    outputs = model(
        fake_images
    )


print(
    "Input shape :",
    fake_images.shape
)

print(
    "Output shape:",
    outputs.shape
)


assert outputs.shape == (
    8,
    4
)


# ============================================================
# TRAINABLE PARAMETERS
# ============================================================

trainable = sum(
    parameter.numel()
    for parameter in model.parameters()
    if parameter.requires_grad
)

total = sum(
    parameter.numel()
    for parameter in model.parameters()
)


print(
    f"\nTrainable parameters: {trainable:,}"
)

print(
    f"Total parameters: {total:,}"
)

print(
    f"Trainable percentage: "
    f"{100 * trainable / total:.2f}%"
)


print(
    "\n✓ Baseline model test passed."
)