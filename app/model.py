from pathlib import Path

import torch
import torch.nn as nn

from torchvision.models import (
    resnet18,
    ResNet18_Weights
)

from app.preprocessing import preprocess_image


CLASS_NAMES = [
    "no-damage",
    "minor-damage",
    "major-damage",
    "destroyed"
]


DEVICE = torch.device(
    "cuda"
    if torch.cuda.is_available()
    else "cpu"
)


MODEL_PATH = Path(
    "models/best_siamese_resnet18.pth"
)


class SiameseResNet18(nn.Module):

    def __init__(
        self,
        num_classes=4
    ):
        super().__init__()

        self.backbone = resnet18(
            weights=None
        )

        feature_dim = (
            self.backbone.fc.in_features
        )

        self.backbone.fc = nn.Identity()

        combined_dim = (
            feature_dim * 4
        )

        self.classifier = nn.Sequential(

            nn.Linear(
                combined_dim,
                512
            ),

            nn.ReLU(),

            nn.Dropout(0.4),

            nn.Linear(
                512,
                num_classes
            )
        )


    def forward(
        self,
        before,
        after
    ):

        before_features = self.backbone(
            before
        )

        after_features = self.backbone(
            after
        )

        difference = torch.abs(
            after_features
            - before_features
        )

        interaction = (
            after_features
            * before_features
        )

        combined = torch.cat(
            [
                before_features,
                after_features,
                difference,
                interaction
            ],
            dim=1
        )

        return self.classifier(
            combined
        )


_model = None


def get_model():

    global _model

    if _model is not None:
        return _model

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model checkpoint not found: {MODEL_PATH}"
        )

    model = SiameseResNet18(
        num_classes=4
    )

    checkpoint = torch.load(
        MODEL_PATH,
        map_location=DEVICE
    )

    model.load_state_dict(
        checkpoint["model_state_dict"]
    )

    model.to(DEVICE)

    model.eval()

    _model = model

    return _model


@torch.no_grad()
def predict_damage(
    before_bytes: bytes,
    after_bytes: bytes
):

    model = get_model()

    before = preprocess_image(
        before_bytes
    ).to(DEVICE)

    after = preprocess_image(
        after_bytes
    ).to(DEVICE)

    logits = model(
        before,
        after
    )

    probabilities = torch.softmax(
        logits,
        dim=1
    )[0]

    predicted_index = int(
        torch.argmax(
            probabilities
        ).item()
    )

    confidence = float(
        probabilities[
            predicted_index
        ].item()
    )

    probability_dict = {
        CLASS_NAMES[i]:
            round(
                float(probabilities[i].item()),
                4
            )

        for i in range(
            len(CLASS_NAMES)
        )
    }

    return {
        "prediction":
            CLASS_NAMES[predicted_index],

        "confidence":
            round(confidence, 4),

        "probabilities":
            probability_dict
    }