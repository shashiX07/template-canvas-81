import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Image as ImageIcon, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { freelancerTemplateStorage } from '@/lib/storage';
import type { FreelancerTemplate } from '@/lib/storage';
import { fileToBase64 } from '@/lib/freelancerUtils';
import { toast } from 'sonner';
import JSZip from 'jszip';

interface FreelancerUploadProps {
  freelancerId: string;
}

const CATEGORIES = ['Business', 'Portfolio', 'E-commerce', 'Landing Page', 'Blog', 'Dashboard', 'Other'];

export default function FreelancerUpload({ freelancerId }: FreelancerUploadProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Step 1
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [cssFiles, setCssFiles] = useState<Record<string, string>>({});
  const [jsFiles, setJsFiles] = useState<Record<string, string>>({});
  const [assets, setAssets] = useState<Record<string, string>>({});

  // Step 2
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [version, setVersion] = useState('1.0.0');

  // Step 3
  const [isPremium, setIsPremium] = useState(false);
  const [price, setPrice] = useState(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'zip' | 'thumbnail') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'zip') {
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size must be less than 50MB');
        return;
      }
      if (!file.name.endsWith('.zip')) {
        toast.error('File must be a ZIP archive');
        return;
      }
      
      try {
        const zip = new JSZip();
        const contents = await zip.loadAsync(file);
        
        // Look for index.html (root or inside a folder)
        let indexFile = contents.file("index.html");
        if (!indexFile) {
          const folders = Object.keys(contents.files).filter(name => {
            const f = contents.files[name];
            return f.dir && !name.includes('/');
          });
          for (const folder of folders) {
            const nestedIndex = contents.file(`${folder}/index.html`);
            if (nestedIndex) {
              indexFile = nestedIndex;
              break;
            }
          }
        }
        
        if (!indexFile) {
          toast.error("ZIP must contain an index.html file");
          return;
        }

        const html = await indexFile.async("string");
        setHtmlContent(html);
        
        // Extract all CSS files
        const extractedCss: Record<string, string> = {};
        const cssPromises: Promise<void>[] = [];
        contents.forEach((relativePath, f) => {
          if (!f.dir && relativePath.endsWith('.css')) {
            cssPromises.push(
              f.async("string").then(content => {
                const filename = relativePath.split('/').pop() || relativePath;
                extractedCss[filename] = content;
              })
            );
          }
        });
        await Promise.all(cssPromises);
        setCssFiles(extractedCss);
        
        // Extract all JS files
        const extractedJs: Record<string, string> = {};
        const jsPromises: Promise<void>[] = [];
        contents.forEach((relativePath, f) => {
          if (!f.dir && relativePath.endsWith('.js')) {
            jsPromises.push(
              f.async("string").then(content => {
                const filename = relativePath.split('/').pop() || relativePath;
                extractedJs[filename] = content;
              })
            );
          }
        });
        await Promise.all(jsPromises);
        setJsFiles(extractedJs);
        
        // Extract all assets
        const extractedAssets: Record<string, string> = {};
        const assetPromises: Promise<void>[] = [];
        const assetExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'mp4', 'webm', 'ogg', 'woff', 'woff2', 'ttf', 'eot'];
        
        contents.forEach((relativePath, f) => {
          if (!f.dir) {
            const ext = relativePath.split('.').pop()?.toLowerCase();
            if (ext && assetExtensions.includes(ext)) {
              assetPromises.push(
                f.async("base64").then(content => {
                  let mimeType = 'application/octet-stream';
                  if (ext === 'png') mimeType = 'image/png';
                  else if (ext === 'jpg' || ext === 'jpeg') mimeType = 'image/jpeg';
                  else if (ext === 'gif') mimeType = 'image/gif';
                  else if (ext === 'svg') mimeType = 'image/svg+xml';
                  else if (ext === 'webp') mimeType = 'image/webp';
                  else if (ext === 'ico') mimeType = 'image/x-icon';
                  else if (ext === 'mp4') mimeType = 'video/mp4';
                  else if (ext === 'webm') mimeType = 'video/webm';
                  else if (ext === 'woff') mimeType = 'font/woff';
                  else if (ext === 'woff2') mimeType = 'font/woff2';
                  else if (ext === 'ttf') mimeType = 'font/ttf';
                  
                  const filename = relativePath.split('/').pop() || relativePath;
                  extractedAssets[filename] = `data:${mimeType};base64,${content}`;
                  extractedAssets[relativePath] = `data:${mimeType};base64,${content}`;
                })
              );
            }
          }
        });
        await Promise.all(assetPromises);
        setAssets(extractedAssets);
        
        setZipFile(file);
        toast.success(`Template extracted: ${Object.keys(extractedCss).length} CSS, ${Object.keys(extractedJs).length} JS, ${Object.keys(extractedAssets).length / 2} assets`);
      } catch (error) {
        toast.error("Error processing ZIP file");
        console.error(error);
      }
    } else if (type === 'thumbnail') {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Thumbnail must be less than 2MB');
        return;
      }
      const base64 = await fileToBase64(file);
      setThumbnail(base64);
      toast.success('Thumbnail uploaded');
    }
  };

  const handleSubmit = () => {
    const template: FreelancerTemplate = {
      id: `template-${Date.now()}`,
      title,
      description,
      thumbnail,
      category,
      tags,
      htmlContent: htmlContent || '<html><body><h1>Template</h1></body></html>',
      cssFiles,
      jsFiles,
      assets,
      isPublic: false,
      isPremium,
      price: isPremium ? price : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: freelancerId,
      downloads: 0,
      rating: 0,
      freelancerId,
      submissionStatus: 'submitted',
      earnings: 0,
      salesCount: 0,
      version,
      submittedAt: new Date().toISOString(),
    };

    freelancerTemplateStorage.save(template);
    toast.success('Template submitted for review!');
    
    // Reset form
    setStep(1);
    setZipFile(null);
    setThumbnail('');
    setHtmlContent('');
    setCssFiles({});
    setJsFiles({});
    setAssets({});
    setTitle('');
    setDescription('');
    setCategory('');
    setTags([]);
    setVersion('1.0.0');
    setIsPremium(false);
    setPrice(0);
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Upload New Template</h1>
        <p className="text-muted-foreground">Share your work with the community</p>
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      <Card className="p-6">
        {/* Step 1: Files */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Upload className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="text-2xl font-bold">Upload Files</h2>
              <p className="text-muted-foreground">Upload your template ZIP file and thumbnail</p>
            </div>

            <div>
              <Label>Template ZIP File *</Label>
              {!zipFile ? (
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-12 cursor-pointer hover:border-primary transition-colors mt-2">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload ZIP file</span>
                  <span className="text-xs text-muted-foreground">Max 50MB</span>
                  <input
                    type="file"
                    accept=".zip"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'zip')}
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5 mt-2">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">{zipFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(zipFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setZipFile(null)}>Replace</Button>
                </div>
              )}
            </div>

            <div>
              <Label>Thumbnail * (1200x800px recommended)</Label>
              {!thumbnail ? (
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-12 cursor-pointer hover:border-primary transition-colors mt-2">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload thumbnail</span>
                  <span className="text-xs text-muted-foreground">JPG, PNG, WebP (Max 2MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'thumbnail')}
                  />
                </label>
              ) : (
                <div className="mt-2">
                  <img src={thumbnail} alt="Thumbnail" className="w-full max-h-64 object-cover rounded-lg" />
                  <Button variant="outline" onClick={() => setThumbnail('')} className="mt-2">
                    Replace
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Template Details</h2>
              <p className="text-muted-foreground">Provide information about your template</p>
            </div>

            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Modern Business Landing Page"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your template, its features, and what makes it special..."
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 1000))}
                rows={5}
              />
              <p className="text-xs text-muted-foreground mt-1">{description.length}/1000</p>
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                placeholder="1.0.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 3: Pricing */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Pricing & Licensing</h2>
              <p className="text-muted-foreground">Set your pricing options</p>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="premium"
                checked={isPremium}
                onCheckedChange={(checked) => setIsPremium(checked as boolean)}
              />
              <Label htmlFor="premium">This is a premium template</Label>
            </div>

            {isPremium && (
              <div>
                <Label htmlFor="price">Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                />
              </div>
            )}

            <Card className="p-4 bg-muted">
              <h3 className="font-medium mb-2">Earnings</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• You earn 70% of each sale</li>
                <li>• Free templates help build your reputation</li>
                <li>• Premium templates generate revenue</li>
              </ul>
            </Card>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Check className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="text-2xl font-bold">Review & Submit</h2>
              <p className="text-muted-foreground">Review your template before submitting</p>
            </div>

            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Template Files</h3>
                <p className="text-sm text-muted-foreground">ZIP: {zipFile?.name}</p>
                <img src={thumbnail} alt="Thumbnail" className="w-full max-h-32 object-cover rounded mt-2" />
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-2">Details</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Title:</strong> {title}</p>
                  <p><strong>Category:</strong> {category}</p>
                  <p><strong>Version:</strong> {version}</p>
                  <p><strong>Type:</strong> {isPremium ? `Premium - $${price}` : 'Free'}</p>
                </div>
              </Card>
            </div>

            <Card className="p-4 bg-primary/5 border-primary/20">
              <h3 className="font-semibold mb-2">Submission Process</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>1. Your template will be reviewed by our team</li>
                <li>2. Review typically takes 2-3 business days</li>
                <li>3. You'll be notified of the decision via email</li>
                <li>4. Once approved, your template will be published</li>
              </ul>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {step < totalSteps ? (
            <Button
              onClick={() => {
                if (step === 1 && (!zipFile || !thumbnail)) {
                  toast.error('Please upload both ZIP file and thumbnail');
                  return;
                }
                if (step === 2 && (!title || !description || !category)) {
                  toast.error('Please fill in all required fields');
                  return;
                }
                setStep(step + 1);
              }}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              <Check className="w-4 h-4 mr-2" />
              Submit for Review
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
