class RoastMyResume {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.selectedFile = null;
    }

    initializeElements() {
        this.uploadSection = document.getElementById('uploadSection');
        this.fileInput = document.getElementById('resumeFile');
        this.selectedFileDiv = document.getElementById('selectedFile');
        this.roastButton = document.getElementById('roastButton');
        this.loading = document.getElementById('loading');
        this.result = document.getElementById('result');
        this.roastContent = document.getElementById('roastContent');
        this.resetButton = document.getElementById('resetButton');
        this.errorDiv = document.getElementById('error');
    }

    setupEventListeners() {
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.uploadSection.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadSection.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadSection.addEventListener('drop', (e) => this.handleDrop(e));
        this.roastButton.addEventListener('click', () => this.analyzeResume());
        this.resetButton.addEventListener('click', () => this.resetForm());
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.processSelectedFile(file);
        }
    }

    handleDragOver(event) {
        event.preventDefault();
        this.uploadSection.classList.add('dragover');
    }

    handleDragLeave(event) {
        event.preventDefault();
        this.uploadSection.classList.remove('dragover');
    }

    handleDrop(event) {
        event.preventDefault();
        this.uploadSection.classList.remove('dragover');
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (this.validateFile(file)) {
                this.fileInput.files = files;
                this.processSelectedFile(file);
            }
        }
    }

    validateFile(file) {
        const allowedTypes = ['application/pdf', 'text/plain'];
        const maxSize = 5 * 1024 * 1024;
        if (!allowedTypes.includes(file.type)) {
            this.showError('Please select a PDF or TXT file.');
            return false;
        }
        if (file.size > maxSize) {
            this.showError('File size must be less than 5MB.');
            return false;
        }
        return true;
    }

    processSelectedFile(file) {
        if (!this.validateFile(file)) {
            return;
        }
        this.selectedFile = file;
        this.selectedFileDiv.textContent = `Selected: ${file.name} (${this.formatFileSize(file.size)})`;
        this.selectedFileDiv.style.display = 'block';
        this.roastButton.disabled = false;
        this.hideError();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async analyzeResume() {
        if (!this.selectedFile) {
            this.showError('Please select a file first.');
            return;
        }
        this.showLoading();
        this.hideError();
        this.roastButton.disabled = true;
        const formData = new FormData();
        formData.append('resume', this.selectedFile);
        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to analyze resume');
            }
            this.showResult(data.roast);
        } catch (error) {
            console.error('Error analyzing resume:', error);
            this.showError(error.message || 'An error occurred while analyzing your resume. Please try again.');
        } finally {
            this.hideLoading();
            this.roastButton.disabled = false;
        }
    }

    showLoading() {
        this.loading.classList.add('show');
        this.result.classList.remove('show');
    }

    hideLoading() {
        this.loading.classList.remove('show');
    }

    showResult(roastText) {
        this.roastContent.textContent = roastText;
        this.result.classList.add('show');
        this.result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    showError(message) {
        this.errorDiv.textContent = message;
        this.errorDiv.style.display = 'block';
    }

    hideError() {
        this.errorDiv.style.display = 'none';
    }

    resetForm() {
        this.selectedFile = null;
        this.fileInput.value = '';
        this.selectedFileDiv.style.display = 'none';
        this.roastButton.disabled = true;
        this.result.classList.remove('show');
        this.hideError();
        this.hideLoading();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RoastMyResume();
});