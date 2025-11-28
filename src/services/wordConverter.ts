import jsPDF from 'jspdf';
import mammoth from 'mammoth';

/**
 * Word document conversion utilities
 * Handles DOCX -> PDF conversions with text extraction
 */

/**
 * Convert Word document to PDF
 * Extracts text content from DOCX and creates a PDF with the actual content
 */
export const wordToPdf = async (file: File): Promise<Blob> => {
  try {
    // Read the file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Extract text from Word document using mammoth
    const result = await mammoth.extractRawText({ arrayBuffer });
    const extractedText = result.value;

    // Check if we extracted any text
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text content found in the Word document');
    }

    // Create a new PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Set font
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');

    // Split text into lines that fit within the page width
    const lines = pdf.splitTextToSize(extractedText, maxWidth);

    // Add lines to PDF, creating new pages as needed
    lines.forEach((line: string) => {
      // Check if we need a new page
      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      // Add the line
      pdf.text(line, margin, yPosition);
      yPosition += 7; // Line height
    });

    // Convert to blob
    const pdfBlob = pdf.output('blob');
    return pdfBlob;
  } catch (error) {
    console.error('Word to PDF conversion error:', error);
    throw new Error(
      `Failed to convert Word to PDF: ${error instanceof Error ? error.message : 'Unable to extract content from document'}`
    );
  }
};

/**
 * Alternative: Convert Word document to PDF with HTML rendering
 * This provides better formatting preservation
 */
export const wordToPdfWithHtml = async (file: File): Promise<Blob> => {
  try {
    // Read the file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Extract HTML from Word document
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const html = result.value;

    // Check if we extracted any content
    if (!html || html.trim().length === 0) {
      throw new Error('No content found in the Word document');
    }

    // Create a new PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Parse HTML and extract text (simple approach)
    // Remove HTML tags and convert to plain text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';

    // Set font
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');

    // Split text into paragraphs
    const paragraphs = textContent.split('\n').filter((p) => p.trim().length > 0);

    paragraphs.forEach((paragraph) => {
      // Split paragraph into lines that fit
      const lines = pdf.splitTextToSize(paragraph, maxWidth);

      lines.forEach((line: string) => {
        // Check if we need a new page
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }

        // Add the line
        pdf.text(line, margin, yPosition);
        yPosition += 7;
      });

      // Add spacing between paragraphs
      yPosition += 3;
    });

    // Convert to blob
    const pdfBlob = pdf.output('blob');
    return pdfBlob;
  } catch (error) {
    console.error('Word to PDF (HTML) conversion error:', error);
    // Fallback to simple text extraction
    return wordToPdf(file);
  }
};
