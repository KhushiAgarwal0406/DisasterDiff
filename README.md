# DisasterDiff

## Explainable Building Damage Assessment Using Pre- and Post-Disaster Satellite Imagery

DisasterDiff is a deep learning system for predicting building damage severity by comparing satellite imagery captured before and after a disaster.

The project uses transfer learning and a Siamese ResNet18 architecture with shared weights.

## Damage Classes

- No Damage
- Minor Damage
- Major Damage
- Destroyed

## Live Demo

**Web Application:**  
https://disasterdiff-production.up.railway.app/

**Interactive API Do## Live Demo

**Web Application:**  
https://disasterdiff-production.up.railway.app/

**Interactive API Documentation:**  
https://disasterdiff-production.up.railway.app/docs

**Health Check:**  
https://disasterdiff-production.up.railway.app/healthcumentation:**  
https://disasterdiff-production.up.railway.app/docs

**Health Check:**  
https://disasterdiff-production.up.railway.app/health

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

## Model Results

| Model | Test Accuracy | Macro Precision | Macro Recall | Macro F1 |
|---|---:|---:|---:|---:|
| Post-only ResNet18 | 80.94% | 62.14% | 75.78% | 66.76% |
| Siamese ResNet18 | 78.49% | 65.84% | 75.84% | **67.77%** |

Although the post-only ResNet18 baseline achieved higher overall test accuracy,
the Siamese ResNet18 achieved better Macro Precision and the best Macro F1 score.

Because the dataset is highly class-imbalanced, Macro F1 was selected as the
primary evaluation metric. Unlike overall accuracy, Macro F1 gives equal
importance to all four damage classes.

### Final Siamese Test Performance

- **Test Accuracy:** 78.49%
- **Macro Precision:** 65.84%
- **Macro Recall:** 75.84%
- **Macro F1:** 67.77%

### Per-Class Performance

| Damage Class | Precision | Recall | F1 Score |
|---|---:|---:|---:|
| No Damage | 98.12% | 79.79% | 88.01% |
| Minor Damage | 33.00% | 81.41% | 46.96% |
| Major Damage | 69.07% | 62.59% | 65.67% |
| Destroyed | 63.16% | 79.58% | 70.42% |

The model performs particularly well at identifying no-damage and destroyed
buildings. Minor damage remains the most challenging class, with high recall
but lower precision.

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