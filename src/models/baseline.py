import torch.nn as nn

from torchvision.models import (
    resnet18,
    ResNet18_Weights
)


class BaselineResNet18(nn.Module):
    """
    Baseline model using only the post-disaster image.
    """

    def __init__(
        self,
        num_classes=4,
        freeze_backbone=True
    ):
        super().__init__()

        # --------------------------------------------
        # Load pretrained ResNet18
        # --------------------------------------------

        self.model = resnet18(
            weights=ResNet18_Weights.DEFAULT
        )

        # Number of features entering original FC layer
        num_features = self.model.fc.in_features

        # --------------------------------------------
        # Optional backbone freezing
        # --------------------------------------------

        if freeze_backbone:

            for parameter in self.model.parameters():
                parameter.requires_grad = False

        # --------------------------------------------
        # Replace ImageNet classifier
        #
        # Original:
        # 512 → 1000 ImageNet classes
        #
        # Ours:
        # 512 → 4 damage classes
        # --------------------------------------------

        self.model.fc = nn.Sequential(
            nn.Dropout(p=0.3),
            nn.Linear(
                num_features,
                num_classes
            )
        )

        # The newly created classifier is trainable
        for parameter in self.model.fc.parameters():
            parameter.requires_grad = True


    def forward(
        self,
        image
    ):

        return self.model(
            image
        )