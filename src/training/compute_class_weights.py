from pathlib import Path

import pandas as pd
import torch


TRAIN_CSV = Path(
    r"D:\ML_Data\DisasterDiff\metadata\train.csv"
)


# ============================================================
# LOAD TRAINING DATA
# ============================================================

df = pd.read_csv(TRAIN_CSV)


# ============================================================
# CLASS COUNTS
# ============================================================

class_counts = (
    df["label"]
    .value_counts()
    .sort_index()
)

print("Class counts:")
print(class_counts)


# ============================================================
# BALANCED CLASS WEIGHTS
#
# weight_i =
# total_samples / (num_classes * class_count_i)
# ============================================================

num_samples = len(df)
num_classes = len(class_counts)

weights = (
    num_samples
    /
    (
        num_classes
        * class_counts.values
    )
)


class_weights = torch.tensor(
    weights,
    dtype=torch.float32
)


print("\nClass weights:")

for class_index, weight in enumerate(class_weights):
    print(
        f"Class {class_index}: "
        f"{weight.item():.4f}"
    )


print("\nTensor:")
print(class_weights)