# Quick Setup Guide

## Installation Steps

### 1. Install System Dependencies (Linux/Ubuntu)
```bash
sudo apt-get update
sudo apt-get install -y python3 python3-pip poppler-utils libreoffice
```

### 2. Install Python Dependencies
```bash
pip3 install -r requirements.txt
```

### 3. Verify Installation
```bash
python3 converter.py --list
```

## Quick Start

```bash
# Convert JPG to PNG
python3 converter.py image.jpg -f png

# Convert PDF to JPG
python3 converter.py document.pdf -f jpg

# Convert PDF to Word
python3 converter.py document.pdf -f docx

# Convert Word to PDF
python3 converter.py document.docx -f pdf
```

See README.md for full documentation.
