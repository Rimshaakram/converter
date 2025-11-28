"""PDF and Word document converter (PDF <-> DOCX)"""
from pdf2docx import Converter
import os
import platform


def pdf_to_word(input_path, output_path=None):
    """
    Convert PDF to Word document (DOCX)

    Args:
        input_path: Path to input PDF file
        output_path: Path to output DOCX file (optional)

    Returns:
        Path to converted DOCX file
    """
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Input file not found: {input_path}")

    if output_path is None:
        output_path = os.path.splitext(input_path)[0] + '.docx'

    try:
        cv = Converter(input_path)
        cv.convert(output_path, start=0, end=None)
        cv.close()
        print(f"Successfully converted {input_path} to {output_path}")
        return output_path
    except Exception as e:
        raise Exception(f"Error converting PDF to Word: {str(e)}")


def word_to_pdf(input_path, output_path=None):
    """
    Convert Word document (DOCX) to PDF

    Args:
        input_path: Path to input DOCX file
        output_path: Path to output PDF file (optional)

    Returns:
        Path to converted PDF file
    """
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Input file not found: {input_path}")

    if output_path is None:
        output_path = os.path.splitext(input_path)[0] + '.pdf'

    try:
        system = platform.system()

        if system == "Linux":
            # On Linux, use LibreOffice if available
            import subprocess
            try:
                output_dir = os.path.dirname(output_path) or '.'
                result = subprocess.run(
                    ['libreoffice', '--headless', '--convert-to', 'pdf', '--outdir', output_dir, input_path],
                    capture_output=True,
                    text=True,
                    timeout=60
                )

                if result.returncode != 0:
                    raise Exception(f"LibreOffice conversion failed: {result.stderr}")

                # LibreOffice creates the file with the same base name
                expected_output = os.path.join(output_dir, os.path.splitext(os.path.basename(input_path))[0] + '.pdf')

                # Rename if needed
                if expected_output != output_path and os.path.exists(expected_output):
                    os.rename(expected_output, output_path)

                print(f"Successfully converted {input_path} to {output_path}")
                return output_path
            except FileNotFoundError:
                raise Exception("LibreOffice is not installed. Please install it: sudo apt-get install libreoffice")

        elif system == "Windows":
            # On Windows, use docx2pdf
            from docx2pdf import convert
            convert(input_path, output_path)
            print(f"Successfully converted {input_path} to {output_path}")
            return output_path

        elif system == "Darwin":  # macOS
            # On macOS, use docx2pdf
            from docx2pdf import convert
            convert(input_path, output_path)
            print(f"Successfully converted {input_path} to {output_path}")
            return output_path

        else:
            raise Exception(f"Unsupported platform: {system}")

    except Exception as e:
        raise Exception(f"Error converting Word to PDF: {str(e)}")
