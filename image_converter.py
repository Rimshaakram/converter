"""Image format converter (JPG <-> PNG)"""
from PIL import Image
import os


def jpg_to_png(input_path, output_path=None):
    """
    Convert JPG image to PNG format

    Args:
        input_path: Path to input JPG file
        output_path: Path to output PNG file (optional)

    Returns:
        Path to converted PNG file
    """
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Input file not found: {input_path}")

    if output_path is None:
        output_path = os.path.splitext(input_path)[0] + '.png'

    try:
        img = Image.open(input_path)
        # Convert to RGB if necessary (JPG doesn't support transparency)
        if img.mode in ('RGBA', 'LA', 'P'):
            img = img.convert('RGB')
        img.save(output_path, 'PNG')
        print(f"Successfully converted {input_path} to {output_path}")
        return output_path
    except Exception as e:
        raise Exception(f"Error converting JPG to PNG: {str(e)}")


def png_to_jpg(input_path, output_path=None, quality=95):
    """
    Convert PNG image to JPG format

    Args:
        input_path: Path to input PNG file
        output_path: Path to output JPG file (optional)
        quality: JPG quality (1-100, default 95)

    Returns:
        Path to converted JPG file
    """
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Input file not found: {input_path}")

    if output_path is None:
        output_path = os.path.splitext(input_path)[0] + '.jpg'

    try:
        img = Image.open(input_path)
        # Convert RGBA to RGB (JPG doesn't support transparency)
        if img.mode in ('RGBA', 'LA', 'P'):
            # Create white background
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')

        img.save(output_path, 'JPEG', quality=quality)
        print(f"Successfully converted {input_path} to {output_path}")
        return output_path
    except Exception as e:
        raise Exception(f"Error converting PNG to JPG: {str(e)}")
