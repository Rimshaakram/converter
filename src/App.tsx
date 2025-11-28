import React, { useState } from 'react';
import { ConversionCard } from './components/ConversionCard';
import { FileUpload } from './components/FileUpload';
import { FileInfo as FileInfoComponent } from './components/FileInfo';
import { ConversionProgress } from './components/ConversionProgress';
import { FileInfo, ConversionState } from './types';
import { ConversionType, CONVERSION_TYPES } from './types/conversions';
import { convertFile } from './services/conversionService';
import { getFileExtension } from './utils/fileHelpers';
import './App.css';

type AppStep = 'select-conversion' | 'upload-file' | 'converting' | 'complete';

function App() {
  const [step, setStep] = useState<AppStep>('select-conversion');
  const [selectedConversion, setSelectedConversion] = useState<ConversionType | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [conversionState, setConversionState] = useState<ConversionState>({
    status: 'idle',
    progress: 0,
    result: null,
    error: null,
  });

  const handleConversionSelect = (conversion: ConversionType) => {
    setSelectedConversion(conversion);
    setStep('upload-file');
    setFileInfo(null);
    setConversionState({
      status: 'idle',
      progress: 0,
      result: null,
      error: null,
    });
  };

  const handleFileSelect = (file: FileInfo) => {
    // Validate that the file matches the expected input format
    if (!selectedConversion) return;

    const fileExt = getFileExtension(file.name).toLowerCase();
    const expectedFormat = selectedConversion.inputFormat.toLowerCase();

    // Handle JPEG vs JPG
    const isValidFormat =
      fileExt === expectedFormat ||
      (expectedFormat === 'jpg' && fileExt === 'jpeg') ||
      (expectedFormat === 'jpeg' && fileExt === 'jpg');

    if (!isValidFormat) {
      setConversionState({
        status: 'error',
        progress: 0,
        result: null,
        error: `Please select a ${selectedConversion.inputFormat.toUpperCase()} file`,
      });
      return;
    }

    setFileInfo(file);
    setConversionState({
      status: 'idle',
      progress: 0,
      result: null,
      error: null,
    });
  };

  const handleRemoveFile = () => {
    setFileInfo(null);
    setConversionState({
      status: 'idle',
      progress: 0,
      result: null,
      error: null,
    });
  };

  const handleConvert = async () => {
    if (!fileInfo || !selectedConversion) return;

    setStep('converting');
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
      const result = await convertFile(
        fileInfo.file,
        selectedConversion.inputFormat,
        selectedConversion.outputFormat
      );

      clearInterval(progressInterval);

      if (result.success) {
        setConversionState({
          status: 'success',
          progress: 100,
          result,
          error: null,
        });
        setStep('complete');
      } else {
        setConversionState({
          status: 'error',
          progress: 0,
          result: null,
          error: result.error || 'Conversion failed',
        });
        setStep('upload-file');
      }
    } catch (error) {
      clearInterval(progressInterval);
      setConversionState({
        status: 'error',
        progress: 0,
        result: null,
        error: error instanceof Error ? error.message : 'Conversion failed',
      });
      setStep('upload-file');
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
    setStep('select-conversion');
    setSelectedConversion(null);
    setFileInfo(null);
    setConversionState({
      status: 'idle',
      progress: 0,
      result: null,
      error: null,
    });
  };

  const handleBackToCards = () => {
    setStep('select-conversion');
    setSelectedConversion(null);
    setFileInfo(null);
    setConversionState({
      status: 'idle',
      progress: 0,
      result: null,
      error: null,
    });
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">File Converter</h1>
          <p className="subtitle">
            {step === 'select-conversion'
              ? 'Choose a conversion type to get started'
              : selectedConversion
              ? `Converting ${selectedConversion.title}`
              : 'Convert between multiple file formats'}
          </p>
        </header>

        <main className="main">
          {/* Step 1: Select Conversion Type */}
          {step === 'select-conversion' && (
            <div className="conversion-grid">
              {CONVERSION_TYPES.map((conversion) => (
                <ConversionCard
                  key={conversion.id}
                  conversion={conversion}
                  onSelect={handleConversionSelect}
                />
              ))}
            </div>
          )}

          {/* Step 2: Upload File */}
          {step === 'upload-file' && selectedConversion && (
            <>
              <div className="selected-conversion-banner">
                <span className="banner-icon">{selectedConversion.icon}</span>
                <div className="banner-content">
                  <h3>{selectedConversion.title}</h3>
                  <p>{selectedConversion.description}</p>
                </div>
                <button className="banner-back-btn" onClick={handleBackToCards}>
                  ← Back
                </button>
              </div>

              {!fileInfo ? (
                <FileUpload onFileSelect={handleFileSelect} disabled={false} />
              ) : (
                <>
                  <FileInfoComponent fileInfo={fileInfo} onRemove={handleRemoveFile} />

                  <div className="actions">
                    <button className="btn btn-primary" onClick={handleConvert}>
                      Convert to {selectedConversion.outputFormat.toUpperCase()}
                    </button>
                  </div>
                </>
              )}

              {conversionState.status === 'error' && conversionState.error && (
                <div className="error-message">
                  <span className="error-icon">✗</span>
                  <span>{conversionState.error}</span>
                </div>
              )}
            </>
          )}

          {/* Step 3: Converting */}
          {step === 'converting' && selectedConversion && (
            <>
              <div className="converting-container">
                <div className="converting-icon">{selectedConversion.icon}</div>
                <h2 className="converting-title">Converting your file...</h2>
                <p className="converting-subtitle">
                  {selectedConversion.inputFormat.toUpperCase()} →{' '}
                  {selectedConversion.outputFormat.toUpperCase()}
                </p>

                <ConversionProgress
                  status={conversionState.status}
                  progress={conversionState.progress}
                  error={conversionState.error}
                />
              </div>
            </>
          )}

          {/* Step 4: Complete */}
          {step === 'complete' && selectedConversion && conversionState.result && (
            <>
              <div className="success-container">
                <div className="success-icon-large">✓</div>
                <h2 className="success-title">Conversion Successful!</h2>
                <p className="success-subtitle">
                  Your file has been converted from{' '}
                  {selectedConversion.inputFormat.toUpperCase()} to{' '}
                  {selectedConversion.outputFormat.toUpperCase()}
                </p>

                <div className="success-file-info">
                  <span className="file-icon-large">📄</span>
                  <span className="file-name-large">{conversionState.result.fileName}</span>
                </div>

                <div className="result-actions">
                  <button className="btn btn-success btn-large" onClick={handleDownload}>
                    ⬇ Download File
                  </button>
                  <button className="btn btn-secondary" onClick={handleReset}>
                    Convert Another File
                  </button>
                </div>
              </div>
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
