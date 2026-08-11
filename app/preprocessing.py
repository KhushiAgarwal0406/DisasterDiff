from io import BytesIO

import torch
from PIL import Image
from torchvision import transforms


IMAGENET_MEAN = [
    0.485,
    0.456,
    0.406
]

IMAGENET_STD = [
    0.229,
    0.224,
    0.225
]


transform = transforms.Compose([
    transforms.Resize((224, 224)),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=IMAGENET_MEAN,
        std=IMAGENET_STD
    )
])


def preprocess_image(image_bytes: bytes):

    image = Image.open(
        BytesIO(image_bytes)
    ).convert("RGB")

    image = transform(image)

    # [3,224,224] -> [1,3,224,224]
    image = image.unsqueeze(0)

    return image