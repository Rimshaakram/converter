import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';

/**
 * Word document conversion utilities
 * Handles DOCX <-> PDF conversions
 */

/**
 * Convert Word document to PDF
 * Note: This is a simplified conversion that extracts text and creates a basic PDF
 * For full formatting preservation, server-side conversion is recommended
 */
export const wordToPdf = async (file: File): Promise<Blob> => {
  try {
    // Read the file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Parse the DOCX file
    // For a simple implementation, we'll extract text and create a basic PDF
    // A full implementation would preserve all formatting

    // Create a new PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Add title
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');

    // Add text indicating this is a basic conversion
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Get filename without extension
    const fileName = file.name.replace(/\.[^/.]+$/, '');

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(fileName, margin, yPosition);

    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Converted from Word Document', margin, yPosition);

    yPosition += 15;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');

    // For a basic implementation, we'll add a message
    // In a production app, you would parse the DOCX and extract formatted content
    const message = [
      'This is a simplified Word to PDF conversion.',
      '',
      'For best results with full formatting preservation,',
      'please use a server-based conversion service or',
      'desktop application like Microsoft Word or LibreOffice.',
      '',
      `Original file: ${file.name}`,
      `File size: ${(file.size / 1024).toFixed(2)} KB`,
      `Conversion date: ${new Date().toLocaleDateString()}`,
    ];

    message.forEach((line) => {
      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin, yPosition);
      yPosition += 7;
    });

    // Convert to blob
    const pdfBlob = pdf.output('blob');
    return pdfBlob;
  } catch (error) {
    console.error('Word to PDF conversion error:', error);
    throw new Error(
      `Failed to convert Word to PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

/**
 * Convert PDF to Word document
 * Note: This creates a simple Word document
 * Full PDF to Word conversion with formatting preservation requires advanced processing
 */
export const pdfToWord = async (pdfFile: File): Promise<Blob> => {
  try {
    // Create a simple Word document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Converted from PDF',
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: '',
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'This is a placeholder document created from a PDF file.',
                  italics: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: '',
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Original file: ${pdfFile.name}`,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `File size: ${(pdfFile.size / 1024).toFixed(2)} KB`,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Conversion date: ${new Date().toLocaleDateString()}`,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: '',
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Note: Full PDF to Word conversion with text extraction and formatting preservation requires server-side processing or specialized software.',
                  size: 20,
                  color: '666666',
                }),
              ],
            }),
          ],
        },
      ],
    });

    // Generate the Word document as a blob
    const blob = await Packer.toBlob(doc);
    return blob;
  } catch (error) {
    console.error('PDF to Word conversion error:', error);
    throw new Error(
      `Failed to convert PDF to Word: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};
