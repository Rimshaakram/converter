"""PDF and Image converter (PDF -> JPG, JPG -> PDF)"""
from pdf2image import convert_from_path
import img2pdf
import os
from PIL import Image


def pdf_to_jpg(input_path, output_folder=None, dpi=200):
    """
    Convert PDF to JPG images (one image per page)

    Args:
        input_path: Path to input PDF file
        output_folder: Folder to save output JPG files (optional)
        dpi: Resolution for output images (default 200)

    Returns:
        List of paths to converted JPG files
    """
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Input file not found: {input_path}")

    if output_folder is None:
        output_folder = os.path.splitext(input_path)[0] + '_images'

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    try:
        # Convert PDF to images
        images = convert_from_path(input_path, dpi=dpi)
        output_paths = []

        base_name = os.path.splitext(os.path.basename(input_path))[0]

        for i, image in enumerate(images, start=1):
            output_path = os.path.join(output_folder, f'{base_name}_page_{i}.jpg')
            image.save(output_path, 'JPEG')
            output_paths.append(output_path)
            print(f"Converted page {i} to {output_path}")

        print(f"Successfully converted {len(images)} pages from {input_path}")
        return output_paths
    except Exception as e:
        raise Exception(f"Error converting PDF to JPG: {str(e)}")


def jpg_to_pdf(input_paths, output_path=None):
    """
    Convert JPG image(s) to PDF

    Args:
        input_paths: Single path or list of paths to input JPG files
        output_path: Path to output PDF file (optional)

    Returns:
        Path to converted PDF file
    """
    # Handle single path or list of paths
    if isinstance(input_paths, str):
        input_paths = [input_paths]

    # Verify all input files exist
    for path in input_paths:
        if not os.path.exists(path):
            raise FileNotFoundError(f"Input file not found: {path}")

    if output_path is None:
        base_name = os.path.splitext(input_paths[0])[0]
        output_path = base_name + '.pdf'

    try:
        # Open and prepare images
        images = []
        for path in input_paths:
            img = Image.open(path)
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                if img.mode == 'RGBA':
                    background.paste(img, mask=img.split()[-1])
                else:
                    background.paste(img)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            images.append(img)

        # Save as PDF
        if len(images) == 1:
            images[0].save(output_path, 'PDF')
        else:
            images[0].save(output_path, 'PDF', save_all=True, append_images=images[1:])

        print(f"Successfully converted {len(input_paths)} image(s) to {output_path}")
        return output_path
    except Exception as e:
        raise Exception(f"Error converting JPG to PDF: {str(e)}")


def png_to_pdf(input_paths, output_path=None):
    """
    Convert PNG image(s) to PDF

    Args:
        input_paths: Single path or list of paths to input PNG files
        output_path: Path to output PDF file (optional)

    Returns:
        Path to converted PDF file
    """
    # This uses the same logic as jpg_to_pdf since we handle format conversion
    return jpg_to_pdf(input_paths, output_path)
