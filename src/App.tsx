import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { FileInfo as FileInfoComponent } from './components/FileInfo';
import { FormatSelector } from './components/FormatSelector';
import { ConversionProgress } from './components/ConversionProgress';
import { FileInfo, FileFormat, ConversionState } from './types';
import { convertFile } from './services/conversionService';
import { validateConversion, downloadFile } from './utils/fileHelpers';
import './App.css';

function App() {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [outputFormat, setOutputFormat] = useState<FileFormat | null>(null);
  const [conversionState, setConversionState] = useState<ConversionState>({
    status: 'idle',
    progress: 0,
    result: null,
    error: null,
  });

  const handleFileSelect = (file: FileInfo) => {
    setFileInfo(file);
    setOutputFormat(null);
    setConversionState({
      status: 'idle',
      progress: 0,
      result: null,
      error: null,
    });
  };

  const handleRemoveFile = () => {
    setFileInfo(null);
    setOutputFormat(null);
    setConversionState({
      status: 'idle',
      progress: 0,
      result: null,
      error: null,
    });
  };

  const handleFormatSelect = (format: FileFormat) => {
    setOutputFormat(format);
    setConversionState({
      status: 'idle',
      progress: 0,
      result: null,
      error: null,
    });
  };

  const handleConvert = async () => {
    if (!fileInfo || !outputFormat) return;

    // Validate conversion
    const validation = validateConversion(fileInfo.extension, outputFormat);
    if (!validation.valid) {
      setConversionState({
        status: 'error',
        progress: 0,
        result: null,
        error: validation.error || 'Invalid conversion',
      });
      return;
    }

    // Start conversion
    setConversionState({
      status: 'converting',
      progress: 0,
      result: null,
      error: null,
    });

    // Simulate progress
    const progressInterval = setInterval(() => {
      setConversionState((prev) => ({
        ...prev,
        progress: Math.min(prev.progress + 10, 90),
      }));
    }, 100);

    try {
      const result = await convertFile(fileInfo.file, fileInfo.extension, outputFormat);

      clearInterval(progressInterval);

      if (result.success) {
        setConversionState({
          status: 'success',
          progress: 100,
          result,
          error: null,
        });
      } else {
        setConversionState({
          status: 'error',
          progress: 0,
          result: null,
          error: result.error || 'Conversion failed',
        });
      }
    } catch (error) {
      clearInterval(progressInterval);
      setConversionState({
        status: 'error',
        progress: 0,
        result: null,
        error: error instanceof Error ? error.message : 'Conversion failed',
      });
    }
  };

  const handleDownload = () => {
    if (conversionState.result?.outputUrl && conversionState.result?.fileName) {
      const link = document.createElement('a');
      link.href = conversionState.result.outputUrl;
      link.download = conversionState.result.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    handleRemoveFile();
  };

  const canConvert = fileInfo && outputFormat && conversionState.status !== 'converting';

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">File Converter</h1>
          <p className="subtitle">Convert between JPG, PNG, and PDF formats</p>
        </header>

        <main className="main">
          {!fileInfo ? (
            <FileUpload
              onFileSelect={handleFileSelect}
              disabled={conversionState.status === 'converting'}
            />
          ) : (
            <>
              <FileInfoComponent fileInfo={fileInfo} onRemove={handleRemoveFile} />

              <FormatSelector
                inputFormat={fileInfo.extension}
                selectedFormat={outputFormat}
                onFormatSelect={handleFormatSelect}
                disabled={conversionState.status === 'converting'}
              />

              {outputFormat && (
                <div className="actions">
                  <button
                    className="btn btn-primary"
                    onClick={handleConvert}
                    disabled={!canConvert}
                  >
                    {conversionState.status === 'converting' ? 'Converting...' : 'Convert File'}
                  </button>
                </div>
              )}

              <ConversionProgress
                status={conversionState.status}
                progress={conversionState.progress}
                error={conversionState.error}
              />

              {conversionState.status === 'success' && conversionState.result && (
                <div className="result-actions">
                  <button className="btn btn-success" onClick={handleDownload}>
                    ⬇ Download {conversionState.result.fileName}
                  </button>
                  <button className="btn btn-secondary" onClick={handleReset}>
                    Convert Another File
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        <footer className="footer">
          <p>
            Supports: JPG ↔ PNG • JPG/PNG → PDF
            {' • '}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              View on GitHub
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
