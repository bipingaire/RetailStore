'use client';

import { useState } from 'react';
import { Upload, Loader2, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';
import OpenAI from 'openai';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

type ScanStatus = 'idle' | 'converting' | 'scanning' | 'review' | 'committing' | 'complete';

interface ExtractedItem {
    product_name: string;
    quantity: number;
    unit_cost: number;
    line_total: number;
    expiry_date?: string;
}

interface InvoiceData {
    supplier_name: string;
    invoice_number: string;
    invoice_date: string;
    total_amount: number;
    items: ExtractedItem[];
}

export default function InvoiceScannerPage() {
    const [status, setStatus] = useState<ScanStatus>('idle');
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [statusText, setStatusText] = useState('');
    const [extractedData, setExtractedData] = useState<InvoiceData | null>(null);
    const [apiKey, setApiKey] = useState('');
    const [loadingKey, setLoadingKey] = useState(true);

    // Fetch API key from backend on mount
    useEffect(() => {
        fetchApiKey();
    }, []);

    const fetchApiKey = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/config/openai-key`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'X-Subdomain': localStorage.getItem('subdomain') || '',
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.available) {
                    setApiKey(data.api_key);
                } else {
                    toast.error('OpenAI API key not configured on server');
                }
            }
        } catch (error) {
            console.error('Failed to fetch API key:', error);
            toast.error('Failed to load configuration');
        } finally {
            setLoadingKey(false);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!apiKey) {
            toast.error('OpenAI API key not available. Please configure OPENAI_API_KEY in .env');
            return;
        }

        if (file.type !== 'application/pdf') {
            toast.error('Please upload a PDF file');
            return;
        }

        try {
            await processPDF(file);
        } catch (error: any) {
            console.error('Error processing PDF:', error);
            toast.error(`Failed to process PDF: ${error.message}`);
            setStatus('idle');
        }
    };

    const processPDF = async (file: File) => {
        // Step 1: Convert PDF to images
        setStatus('converting');
        setStatusText('Converting PDF to images...');

        const images = await convertPDFToImages(file);

        // Step 2: Extract data using OpenAI
        setStatus('scanning');
        setProgress({ current: 0, total: images.length });

        const extractedItems: any[] = [];
        let headerInfo: any = {};

        for (let i = 0; i < images.length; i++) {
            setProgress({ current: i + 1, total: images.length });
            setStatusText(`Scanning page ${i + 1} of ${images.length}...`);

            const pageData = await extractDataFromImage(images[i], apiKey);

            // First page usually has header info
            if (i === 0) {
                headerInfo = {
                    supplier_name: pageData.supplier_name || '',
                    invoice_number: pageData.invoice_number || '',
                    invoice_date: pageData.invoice_date || '',
                    total_amount: pageData.total_amount || 0,
                };
            }

            // Collect items from all pages
            if (pageData.items && Array.isArray(pageData.items)) {
                extractedItems.push(...pageData.items);
            }
        }

        // Combine all data
        const invoiceData: InvoiceData = {
            ...headerInfo,
            items: extractedItems,
        };

        setExtractedData(invoiceData);
        setStatus('review');
        setStatusText('Extraction complete! Review the data below.');
        toast.success(`Extracted ${extractedItems.length} items from ${images.length} pages`);
    };

    const convertPDFToImages = async (file: File): Promise<string[]> => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const images: string[] = [];

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 2.0 });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d')!;
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({
                canvasContext: context,
                viewport: viewport,
            }).promise;

            const imageData = canvas.toDataURL('image/jpeg', 0.95);
            images.push(imageData);
        }

        return images;
    };

    const extractDataFromImage = async (imageData: string, apiKey: string): Promise<any> => {
        const openai = new OpenAI({
            apiKey: apiKey,
            dangerouslyAllowBrowser: true, // Client-side usage
        });

        const prompt = `
Analyze this invoice image. Extract the following fields in JSON format:
- supplier_name (string)
- invoice_number (string)
- invoice_date (YYYY-MM-DD)
- total_amount (number)
- items (array of objects):
    - product_name (string)
    - quantity (number)
    - unit_cost (number)
    - line_total (number)
    - expiry_date (YYYY-MM-DD, if visible, otherwise null)

Extract ALL line items from the table. If a field is not found, return null.
RETURN ONLY RAW JSON. NO MARKDOWN.
`;

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: prompt },
                            {
                                type: 'image_url',
                                image_url: { url: imageData },
                            },
                        ],
                    },
                ],
                max_tokens: 2000,
            });

            const content = response.choices[0].message.content || '{}';
            const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleaned);
        } catch (error) {
            console.error('OpenAI API error:', error);
            return { items: [] };
        }
    };

    const handleItemChange = (index: number, field: keyof ExtractedItem, value: any) => {
        if (!extractedData) return;

        const updatedItems = [...extractedData.items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };

        setExtractedData({ ...extractedData, items: updatedItems });
    };

    const handleCommit = async () => {
        if (!extractedData) return;

        setStatus('committing');
        setStatusText('Saving to database...');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/invoices/commit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'X-Subdomain': localStorage.getItem('subdomain') || '',
                },
                body: JSON.stringify(extractedData),
            });

            if (!response.ok) {
                throw new Error('Failed to commit invoice');
            }

            const result = await response.json();

            setStatus('complete');
            toast.success(`Invoice committed! ${result.items_committed} items added to inventory.`);

            // Reset after 3 seconds
            setTimeout(() => {
                setStatus('idle');
                setExtractedData(null);
                setProgress({ current: 0, total: 0 });
            }, 3000);
        } catch (error: any) {
            console.error('Commit error:', error);
            toast.error(`Failed to commit: ${error.message}`);
            setStatus('review');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Invoice Scanner</h1>
                    <p className="text-gray-600">Upload invoice PDFs for automated extraction and inventory updates</p>
                </div>

                {/* Loading Key */}
                {loadingKey && (
                    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                        <div className="flex items-center gap-3">
                            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                            <span className="text-gray-600">Loading configuration...</span>
                        </div>
                    </div>
                )}

                {/* Upload Section */}
                {!loadingKey && status === 'idle' && (
                    <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                        <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Invoice PDF</h3>
                        <p className="text-gray-600 mb-6">AI will extract all items and prices automatically</p>

                        <label className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition">
                            <FileText className="mr-2 h-5 w-5" />
                            Choose PDF File
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </label>
                    </div>
                )}

                {/* Progress Section */}
                {(status === 'converting' || status === 'scanning') && (
                    <div className="bg-white rounded-lg shadow-sm border p-8">
                        <div className="flex items-center justify-center mb-4">
                            <Loader2 className="h-8 w-8 text-blue-600 animate-spin mr-3" />
                            <span className="text-lg font-medium text-gray-900">{statusText}</span>
                        </div>

                        {progress.total > 0 && (
                            <div className="mt-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>Page {progress.current} of {progress.total}</span>
                                    <span>{Math.round((progress.current / progress.total) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Review Section */}
                {status === 'review' && extractedData && (
                    <div className="space-y-6">
                        {/* Invoice Header */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-xl font-bold mb-4">Invoice Details</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Supplier</label>
                                    <input
                                        type="text"
                                        value={extractedData.supplier_name}
                                        onChange={(e) => setExtractedData({ ...extractedData, supplier_name: e.target.value })}
                                        className="mt-1 w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Invoice Number</label>
                                    <input
                                        type="text"
                                        value={extractedData.invoice_number}
                                        onChange={(e) => setExtractedData({ ...extractedData, invoice_number: e.target.value })}
                                        className="mt-1 w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Date</label>
                                    <input
                                        type="date"
                                        value={extractedData.invoice_date}
                                        onChange={(e) => setExtractedData({ ...extractedData, invoice_date: e.target.value })}
                                        className="mt-1 w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Total Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={extractedData.total_amount}
                                        onChange={(e) => setExtractedData({ ...extractedData, total_amount: parseFloat(e.target.value) })}
                                        className="mt-1 w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                            <div className="p-4 border-b bg-gray-50">
                                <h2 className="text-xl font-bold">Extracted Items ({extractedData.items.length})</h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Cost</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {extractedData.items.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={item.product_name}
                                                        onChange={(e) => handleItemChange(index, 'product_name', e.target.value)}
                                                        className="w-full px-2 py-1 border rounded text-sm"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                                                        className="w-20 px-2 py-1 border rounded text-sm"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={item.unit_cost}
                                                        onChange={(e) => handleItemChange(index, 'unit_cost', parseFloat(e.target.value))}
                                                        className="w-24 px-2 py-1 border rounded text-sm"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 font-medium">
                                                    ${(item.quantity * item.unit_cost).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="date"
                                                        value={item.expiry_date || ''}
                                                        onChange={(e) => handleItemChange(index, 'expiry_date', e.target.value)}
                                                        className="w-36 px-2 py-1 border rounded text-sm"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCommit}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
                                >
                                    <CheckCircle className="mr-2 h-5 w-5" />
                                    Save & Commit to Inventory
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success State */}
                {status === 'complete' && (
                    <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                        <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Invoice Committed!</h3>
                        <p className="text-gray-600">Items have been added to your inventory</p>
                    </div>
                )}
            </div>
        </div>
    );
}
