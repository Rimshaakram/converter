# Multi-Format File Converter

A comprehensive Python-based file converter that supports conversions between various image, PDF, and document formats.

## Supported Conversions

| From | To |
|------|-----|
| **JPG/JPEG** | PNG, PDF |
| **PNG** | JPG, PDF |
| **PDF** | JPG, Word (DOCX) |
| **Word (DOCX)** | PDF |

## Features

- ✅ **JPG ↔ PNG**: Convert between JPG and PNG image formats
- ✅ **PDF → JPG**: Extract all pages from PDF as separate JPG images
- ✅ **JPG/PNG → PDF**: Convert single or multiple images to PDF
- ✅ **PDF ↔ Word**: Convert PDF to Word documents and vice versa
- ✅ Easy-to-use command-line interface
- ✅ Batch processing support
- ✅ High-quality conversions with customizable settings

## Installation

### Prerequisites

**For Linux (Ubuntu/Debian):**
```bash
# Install system dependencies
sudo apt-get update
sudo apt-get install -y python3 python3-pip poppler-utils libreoffice
```

**For macOS:**
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install poppler python3
```

**For Windows:**
- Install Python 3.7+ from [python.org](https://www.python.org/downloads/)
- Download and install [Poppler for Windows](http://blog.alivate.com.au/poppler-windows/)
- Add Poppler's `bin` directory to your system PATH

### Install Python Dependencies

```bash
# Clone or download this repository
cd converter

# Install required Python packages
pip install -r requirements.txt
```

## Usage

### Basic Syntax

```bash
python converter.py <input_file> -f <output_format>
# or
python converter.py <input_file> -o <output_file>
```

### Examples

#### Image Conversions

**Convert JPG to PNG:**
```bash
python converter.py image.jpg -f png
# Output: image.png
```

**Convert PNG to JPG:**
```bash
python converter.py photo.png -f jpg
# Output: photo.jpg
```

**Convert with custom output name:**
```bash
python converter.py image.jpg -o my_converted_image.png
```

#### PDF to Image

**Convert PDF to JPG (all pages):**
```bash
python converter.py document.pdf -f jpg
# Output: document_images/ directory with page_1.jpg, page_2.jpg, etc.
```

#### Image to PDF

**Convert single JPG to PDF:**
```bash
python converter.py photo.jpg -f pdf
# Output: photo.pdf
```

**Convert PNG to PDF:**
```bash
python converter.py image.png -f pdf
# Output: image.pdf
```

#### PDF and Word Conversions

**Convert PDF to Word:**
```bash
python converter.py document.pdf -f docx
# Output: document.docx
```

**Convert Word to PDF:**
```bash
python converter.py report.docx -f pdf
# Output: report.pdf
```

### List All Supported Conversions

```bash
python converter.py --list
```

### Help

```bash
python converter.py --help
```

## Command-Line Options

| Option | Description |
|--------|-------------|
| `input` | Input file path (required) |
| `-f, --format` | Output format (png, jpg, pdf, docx) |
| `-o, --output` | Custom output file path |
| `-l, --list` | List all supported conversions |
| `-h, --help` | Show help message |

## How It Works

### Image Conversions (JPG ↔ PNG)
- Uses **Pillow (PIL)** library for image processing
- Handles transparency properly when converting PNG to JPG
- Maintains image quality and metadata

### PDF to Images
- Uses **pdf2image** library with Poppler backend
- Converts each PDF page to a separate high-resolution image
- Default DPI: 200 (customizable)

### Images to PDF
- Uses **Pillow** library to combine images into PDF
- Supports multiple images in a single PDF
- Automatically handles color mode conversions

### PDF to Word
- Uses **pdf2docx** library
- Preserves text, formatting, and layout
- Best for text-based PDFs

### Word to PDF
- **Linux**: Uses LibreOffice in headless mode
- **Windows/macOS**: Uses docx2pdf library
- Maintains document formatting and styles

## Project Structure

```
converter/
├── converter.py              # Main CLI application
├── image_converter.py        # JPG/PNG conversion module
├── pdf_image_converter.py    # PDF/Image conversion module
├── pdf_word_converter.py     # PDF/Word conversion module
├── requirements.txt          # Python dependencies
├── README.md                 # This file
└── .gitignore               # Git ignore rules
```

## Dependencies

- **Pillow (PIL)**: Image processing
- **pdf2image**: PDF to image conversion
- **img2pdf**: Image to PDF conversion
- **python-docx**: Word document handling
- **pdf2docx**: PDF to Word conversion
- **docx2pdf**: Word to PDF conversion (Windows/macOS)
- **pypdf2**: PDF manipulation

## Troubleshooting

### "poppler-utils not found" Error
- **Linux**: `sudo apt-get install poppler-utils`
- **macOS**: `brew install poppler`
- **Windows**: Download and install Poppler, add to PATH

### "LibreOffice not found" Error (Linux)
```bash
sudo apt-get install libreoffice
```

### Permission Denied
```bash
chmod +x converter.py
```

### Module Import Errors
```bash
pip install --upgrade -r requirements.txt
```

## Limitations

- **PDF to Word**: Works best with text-based PDFs; scanned documents may not convert well
- **Word to PDF on Linux**: Requires LibreOffice installation
- **Large Files**: Very large PDF files may take time to process
- **Image Quality**: PDF to image conversion quality depends on DPI setting

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is open source and available for personal and commercial use.

## Support

For issues, questions, or feature requests, please open an issue in the repository.

---

**Happy Converting! 🚀**
