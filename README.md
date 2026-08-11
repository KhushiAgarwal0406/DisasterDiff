# DisasterDiff

## Explainable Building Damage Assessment Using Pre- and Post-Disaster Satellite Imagery

DisasterDiff is a deep learning system for predicting building damage severity by comparing satellite imagery captured before and after a disaster.

The project uses transfer learning and a Siamese ResNet18 architecture with shared weights.

## Damage Classes

- No Damage
- Minor Damage
- Major Damage
- Destroyed

## Dataset

The project uses the xBD / xView2 disaster damage dataset.

After preprocessing, 158,213 valid pre- and post-disaster building image pairs were extracted.

## Models

### Baseline Model

A pretrained ResNet18 using only post-disaster imagery.

### Proposed Model

A Siamese ResNet18 processes both pre- and post-disaster images.

The classifier uses:

- Before-image features
- After-image features
- Absolute feature difference
- Element-wise feature interaction

## Training Strategy

Training is performed in two stages:

1. Freeze the pretrained backbone and train the classifier.
2. Unfreeze the final ResNet block (`layer4`) and fine-tune it using a smaller learning rate.

## Evaluation

Primary metric:

- Macro F1 Score

Additional metrics:

- Accuracy
- Precision
- Recall
- Confusion Matrix

## Explainability

Grad-CAM is used to visualize regions that influence the model's predictions.

## FastAPI Backend

Available endpoints:

- `GET /`
- `GET /health`
- `POST /predict`

The prediction endpoint accepts a pre-disaster and post-disaster image and returns the predicted damage class, confidence score, and class probabilities.

## Project Structure

```text
DisasterDiff/
├── app/
├── models/
├── notebooks/
├── reports/
├── src/
├── requirements.txt
├── .gitignore
└── README.md