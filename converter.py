#!/usr/bin/env python3
"""
Multi-Format File Converter
Supports: JPG <-> PNG, PDF <-> JPG, PDF <-> Word
"""
import argparse
import os
import sys
from image_converter import jpg_to_png, png_to_jpg
from pdf_image_converter import pdf_to_jpg, jpg_to_pdf, png_to_pdf
from pdf_word_converter import pdf_to_word, word_to_pdf


SUPPORTED_CONVERSIONS = {
    'jpg': ['png', 'pdf'],
    'jpeg': ['png', 'pdf'],
    'png': ['jpg', 'pdf'],
    'pdf': ['jpg', 'docx', 'doc'],
    'docx': ['pdf'],
    'doc': ['pdf']
}


def get_file_extension(file_path):
    """Get file extension without the dot"""
    return os.path.splitext(file_path)[1][1:].lower()


def validate_conversion(input_ext, output_ext):
    """Validate if conversion is supported"""
    if input_ext not in SUPPORTED_CONVERSIONS:
        return False, f"Input format '{input_ext}' is not supported"

    if output_ext not in SUPPORTED_CONVERSIONS[input_ext]:
        return False, f"Conversion from '{input_ext}' to '{output_ext}' is not supported"

    return True, "Valid conversion"


def convert_file(input_path, output_path=None, output_format=None):
    """
    Convert file from one format to another

    Args:
        input_path: Path to input file
        output_path: Path to output file (optional)
        output_format: Desired output format (optional, used if output_path not provided)

    Returns:
        Path to converted file
    """
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Input file not found: {input_path}")

    input_ext = get_file_extension(input_path)

    # Determine output format
    if output_path:
        output_ext = get_file_extension(output_path)
    elif output_format:
        output_ext = output_format.lower().replace('.', '')
        output_path = os.path.splitext(input_path)[0] + '.' + output_ext
    else:
        raise ValueError("Either output_path or output_format must be provided")

    # Validate conversion
    valid, message = validate_conversion(input_ext, output_ext)
    if not valid:
        raise ValueError(message)

    # Perform conversion
    print(f"\nConverting {input_path} from {input_ext.upper()} to {output_ext.upper()}...")

    try:
        # Image conversions
        if input_ext in ['jpg', 'jpeg'] and output_ext == 'png':
            return jpg_to_png(input_path, output_path)

        elif input_ext == 'png' and output_ext in ['jpg', 'jpeg']:
            return png_to_jpg(input_path, output_path)

        # PDF to Image conversions
        elif input_ext == 'pdf' and output_ext in ['jpg', 'jpeg']:
            output_folder = os.path.splitext(output_path)[0] + '_images'
            return pdf_to_jpg(input_path, output_folder)

        # Image to PDF conversions
        elif input_ext in ['jpg', 'jpeg'] and output_ext == 'pdf':
            return jpg_to_pdf(input_path, output_path)

        elif input_ext == 'png' and output_ext == 'pdf':
            return png_to_pdf(input_path, output_path)

        # PDF to Word conversions
        elif input_ext == 'pdf' and output_ext in ['docx', 'doc']:
            return pdf_to_word(input_path, output_path)

        # Word to PDF conversions
        elif input_ext in ['docx', 'doc'] and output_ext == 'pdf':
            return word_to_pdf(input_path, output_path)

        else:
            raise ValueError(f"Conversion from {input_ext} to {output_ext} is not implemented")

    except Exception as e:
        print(f"Error during conversion: {str(e)}", file=sys.stderr)
        raise


def list_supported_formats():
    """Print all supported conversion formats"""
    print("\n=== Supported File Conversions ===\n")
    for input_format, output_formats in SUPPORTED_CONVERSIONS.items():
        print(f"{input_format.upper():6} -> {', '.join([f.upper() for f in output_formats])}")
    print()


def main():
    parser = argparse.ArgumentParser(
        description='Multi-Format File Converter - Convert between JPG, PNG, PDF, and Word documents',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s input.jpg -f png                    # Convert JPG to PNG
  %(prog)s input.png -f jpg                    # Convert PNG to JPG
  %(prog)s input.pdf -f jpg                    # Convert PDF to JPG images
  %(prog)s input.jpg -f pdf                    # Convert JPG to PDF
  %(prog)s input.pdf -f docx                   # Convert PDF to Word
  %(prog)s input.docx -f pdf                   # Convert Word to PDF
  %(prog)s input.jpg -o output.png             # Convert with custom output name
  %(prog)s --list                              # List all supported conversions
        """
    )

    parser.add_argument('input', nargs='?', help='Input file path')
    parser.add_argument('-o', '--output', help='Output file path (optional)')
    parser.add_argument('-f', '--format', help='Output format (e.g., png, jpg, pdf, docx)')
    parser.add_argument('-l', '--list', action='store_true', help='List all supported conversions')

    args = parser.parse_args()

    # Show supported formats
    if args.list:
        list_supported_formats()
        return 0

    # Validate arguments
    if not args.input:
        parser.print_help()
        return 1

    if not args.output and not args.format:
        print("Error: Either --output or --format must be specified", file=sys.stderr)
        parser.print_help()
        return 1

    try:
        result = convert_file(args.input, args.output, args.format)
        print(f"\n✓ Conversion successful!")
        if isinstance(result, list):
            print(f"  Created {len(result)} file(s)")
        else:
            print(f"  Output: {result}")
        return 0
    except Exception as e:
        print(f"\n✗ Conversion failed: {str(e)}", file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
