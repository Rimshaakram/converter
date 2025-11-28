# File Converter - React & TypeScript Edition

A modern, web-based file converter built with **React 18**, **TypeScript**, and **Vite**. Convert files between JPG, PNG, and PDF formats entirely in your browser with a beautiful, responsive UI.

## ✨ Features

- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations
- 🔄 **Client-Side Conversions**: No server needed for most conversions
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- 🌓 **Dark Mode**: Automatic theme switching based on system preferences
- ⚡ **Fast & Lightweight**: Built with Vite for optimal performance
- 🔒 **Privacy First**: All conversions happen in your browser
- 📦 **Type Safe**: Built entirely with TypeScript

## 🚀 Supported Conversions

| From | To | Status |
|------|-----|--------|
| **JPG/JPEG** | PNG | ✅ Client-side |
| **PNG** | JPG | ✅ Client-side |
| **JPG/PNG** | PDF | ✅ Client-side |
| **PDF** | JPG/PNG | ⚠️ Requires additional setup |

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** or **pnpm**

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd converter
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

## 🎯 Usage

### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

Create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## 📁 Project Structure

```
converter/
├── src/
│   ├── components/          # React components
│   │   ├── FileUpload.tsx   # Drag & drop file upload
│   │   ├── FileInfo.tsx     # File information display
│   │   ├── FormatSelector.tsx # Output format selector
│   │   └── ConversionProgress.tsx # Progress indicator
│   ├── services/            # Conversion services
│   │   ├── imageConverter.ts # JPG/PNG conversion
│   │   ├── pdfConverter.ts  # PDF conversion
│   │   └── conversionService.ts # Main service
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   ├── constants.ts     # App constants
│   │   └── fileHelpers.ts   # File helper functions
│   ├── App.tsx              # Main application component
│   ├── App.css              # Application styles
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── .eslintrc.cjs            # ESLint configuration
```

## 🎨 How to Use the App

1. **Upload a File**
   - Click the upload area or drag and drop a file
   - Supported formats: JPG, PNG, PDF (max 10MB)

2. **Select Output Format**
   - Choose your desired output format from the available options
   - Only compatible formats will be shown

3. **Convert**
   - Click the "Convert File" button
   - Watch the progress bar as your file converts

4. **Download**
   - Once complete, click the download button
   - Your converted file will be saved to your downloads folder

## 🔧 Technical Details

### Technologies Used

- **React 18**: Modern React with hooks and concurrent features
- **TypeScript 5**: Full type safety throughout the application
- **Vite 5**: Lightning-fast build tool and dev server
- **jsPDF**: Client-side PDF generation
- **Canvas API**: Image format conversion

### Conversion Methods

#### Image Conversions (JPG ↔ PNG)
- Uses HTML5 Canvas API for pixel-perfect conversions
- Handles transparency properly when converting PNG to JPG
- Maintains original image quality and dimensions

#### Image to PDF
- Uses jsPDF library for client-side PDF generation
- Automatically calculates optimal dimensions for A4 pages
- Supports both portrait and landscape orientations

#### PDF to Image (Future Enhancement)
- Requires pdf.js integration for proper implementation
- Currently shows placeholder message for future development

### Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## 🚧 Limitations

- **Maximum File Size**: 10MB per file (configurable in constants.ts)
- **PDF to Image**: Requires additional library integration (pdf.js)
- **Word Documents**: Not supported in client-side version (requires backend)
- **Batch Processing**: Single file at a time

## 📦 Dependencies

### Production Dependencies
- `react` - UI library
- `react-dom` - React DOM renderer
- `jspdf` - PDF generation
- `pdf-lib` - PDF manipulation

### Development Dependencies
- `vite` - Build tool and dev server
- `typescript` - Type checking
- `@vitejs/plugin-react` - React support for Vite
- `eslint` - Code linting
- `@typescript-eslint/*` - TypeScript linting rules

## 🔒 Privacy & Security

- **No Data Upload**: All conversions happen locally in your browser
- **No Tracking**: No analytics or tracking scripts
- **Secure**: Files never leave your device
- **Open Source**: Full transparency in how your files are processed

## 🎯 Future Enhancements

- [ ] PDF to Image conversion with pdf.js
- [ ] Batch file processing
- [ ] Image compression options
- [ ] Custom output dimensions
- [ ] File format validation improvements
- [ ] Drag & drop multiple files
- [ ] Conversion history
- [ ] Share converted files

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available for personal and commercial use.

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Type Errors

```bash
# Check TypeScript configuration
npx tsc --noEmit
```

### Port Already in Use

```bash
# Change port in vite.config.ts or use:
npm run dev -- --port 3001
```

## 📞 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Check existing issues for solutions
- Contribute improvements via pull requests

## 🎉 Acknowledgments

- Built with ❤️ using React and TypeScript
- Inspired by the need for privacy-focused file conversion
- Community feedback and contributions

---

**Happy Converting! 🚀**

Made with React, TypeScript, and Vite
