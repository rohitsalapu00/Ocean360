# SIH 2026: Ocean 360  // CSE 471

## Marine Oil Spill Detection and Vessel Identification System

**Problem Statement ID:** SIH26143  
**Theme:** Disaster Management  

## Project Overview

Ocean 360 is a satellite-based marine oil spill detection and vessel identification system developed for the Smart India Hackathon 2026.

The project aims to detect possible oil spills using Sentinel-1 Synthetic Aperture Radar (SAR) imagery, estimate their probable source regions using ocean-current and wind data, and identify potentially relevant vessels by correlating historical Automatic Identification System (AIS) data.

The system combines deep learning, satellite image processing, geospatial analysis, and vessel tracking to support marine pollution monitoring and investigation.

## Key Features

- Sentinel-1 SAR image analysis
- Oil-spill and no-oil image classification
- Oil-spill segmentation using U-Net
- Spill boundary identification
- Spill area and geographic location estimation
- Ocean-current and wind-based source tracing
- Historical AIS vessel correlation
- Candidate vessel ranking
- Interactive dashboard for visualization

## System Architecture

The system follows a three-tier architecture:

### 1. Presentation Layer
Provides the user interface, maps, visualizations, and alerts.

### 2. Application Layer
Performs image classification, segmentation, spill characterization, source tracing, AIS integration, and vessel ranking.

### 3. Data Layer
Provides satellite imagery, oceanographic data, weather data, AIS information, and geospatial data.

## AI Models

### EfficientNet-B0: Binary Classification

EfficientNet-B0 is used for image classification.

The classification task distinguishes between:

- Oil
- No Oil

The classifier is designed to analyze grayscale Sentinel-1 SAR image patches from the CSIRO dataset.

### U-Net: Semantic Segmentation

U-Net is used for semantic image segmentation.

It identifies the suspected oil-spill region at the pixel level and helps generate a segmentation mask representing the spill boundary.

The U-Net implementation is based on the PyTorch U-Net architecture by milesial.

Original implementation:
https://github.com/milesial/Pytorch-UNet

## Project Workflow

1. Acquire Sentinel-1 SAR imagery.
2. Preprocess the satellite images.
3. Classify image patches using EfficientNet-B0.
4. Segment suspected spill regions using U-Net.
5. Extract spill characteristics such as area, centroid, and geographic location.
6. Perform backward trajectory analysis using ocean-current and wind information.
7. Correlate the probable source region and time with historical AIS vessel tracks.
8. Rank potentially relevant vessels using available evidence.
9. Display the results through the Ocean 360 dashboard.

## Dataset

### CSIRO Sentinel-1 SAR Dataset

The CSIRO Sentinel-1 SAR dataset is used for binary oil-spill classification.

The classification task uses grayscale SAR image patches.

**Classes:**
- Oil
- No Oil

### Segmentation Dataset

The U-Net segmentation model requires satellite images and corresponding oil-spill masks.

Each image must have a corresponding ground-truth mask identifying the spill region.

Dataset preparation must ensure that images and masks are correctly matched and formatted.

## Installation

Clone the project repository:

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

Install the required Python dependencies:

```bash
pip install -r requirements.txt
```

Use the Python and PyTorch versions supported by the project's dependencies.

## Training

### EfficientNet-B0 Classification

Run the CSIRO binary classification training script:

```bash
python train_csiro.py
```

This script trains the classification model using the configured CSIRO dataset.

### U-Net Segmentation

The U-Net training process requires satellite images and their corresponding segmentation masks.

If the segmentation training script is configured for the project's SAR dataset, run:

```bash
python train.py
```

Check the training script and its command-line options before running it.

**Important:** The original U-Net repository uses Carvana-specific data preparation. Its original dataset downloader and training configuration must not be used unchanged for oil-spill segmentation.

## Prediction

For U-Net prediction, the original implementation supports commands such as:

```bash
python predict.py -i image.jpg -o output.jpg
```

The input image, model checkpoint, image dimensions, and preprocessing must match the trained oil-spill segmentation model.

Refer to the prediction script's help options for the exact configuration.

## Technology Stack

| Component | Technology |
|---|---|
| Programming language | Python |
| Deep learning framework | PyTorch |
| Classification model | EfficientNet-B0 |
| Segmentation model | U-Net |
| Satellite imagery | Sentinel-1 SAR |
| Environmental data | Ocean currents and wind |
| Vessel tracking | AIS |
| Geospatial analysis | Geographic data processing |
| Frontend | React, Vite, Tailwind CSS |
| Backend | Python |

## Limitations

- Weather and ocean conditions can affect satellite image interpretation.
- Dark-water regions may resemble oil spills.
- Limited labeled data can affect model performance.
- Large satellite images may require substantial processing resources.
- Geolocation accuracy depends on image processing and available data.
- Vessel attribution identifies candidate vessels, not confirmed responsibility.
- Spill movement predictions depend on environmental data and modeling assumptions.

## Future Scope

- Improve classification and segmentation accuracy.
- Integrate additional satellite imagery sources.
- Improve source tracing and trajectory modeling.
- Integrate more comprehensive AIS information.
- Support wider geographical coverage.
- Add real-time monitoring and alerting capabilities.

## Research and References

### U-Net

Ronneberger, O., Fischer, P., and Brox, T.

U-Net: Convolutional Networks for Biomedical Image Segmentation.

https://arxiv.org/abs/1505.04597

Original PyTorch implementation:

https://github.com/milesial/Pytorch-UNet

### Sentinel-1 SAR

Copernicus Sentinel satellite information:

https://scihub.copernicus.eu/

### Copernicus Marine Service

https://data.marine.copernicus.eu/products

### ERA5 Weather Data

https://cds.climate.copernicus.eu/

## Deployment

Frontend:

https://sih-ocean-trace.vercel.app/

Backend:

https://sih-backend-8fk1.onrender.com

## Acknowledgements

We acknowledge the authors of the referenced research papers, open-source projects, and publicly available datasets that support the development of Ocean 360.
