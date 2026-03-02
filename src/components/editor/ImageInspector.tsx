"use client";

import { useState, useEffect } from "react";
import { Image, Link, Upload, X, Check } from "lucide-react";

interface ImageData {
  src: string;
  alt: string;
  element: string;
}

interface ImageInspectorProps {
  htmlContent: string;
  onUpdate: (newHtml: string) => void;
  selectedElement: HTMLElement | null;
}

export function ImageInspector({ htmlContent, onUpdate, selectedElement }: ImageInspectorProps) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [newUrl, setNewUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Extract all images from HTML
  useEffect(() => {
    const extractImages = () => {
      const imgList: ImageData[] = [];
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");
      
      // Find all img tags
      doc.querySelectorAll("img").forEach((img, index) => {
        imgList.push({
          src: img.src,
          alt: img.alt || `Image ${index + 1}`,
          element: img.outerHTML
        });
      });
      
      // Find background images
      doc.querySelectorAll("*").forEach((el, index) => {
        const style = (el as HTMLElement).style;
        if (style.backgroundImage && style.backgroundImage !== "none") {
          const url = style.backgroundImage.replace(/url\(["']?([^"')]+)["']?\)/, "$1");
          if (url && !imgList.find(img => img.src === url)) {
            imgList.push({
              src: url,
              alt: `Background ${index + 1}`,
              element: el.outerHTML
            });
          }
        }
      });
      
      setImages(imgList);
    };
    
    extractImages();
  }, [htmlContent]);

  // Handle double-click on image
  useEffect(() => {
    const handleDoubleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG" || target.style.backgroundImage) {
        const imgSrc = target.tagName === "IMG" 
          ? (target as HTMLImageElement).src 
          : target.style.backgroundImage.replace(/url\(["']?([^"')]+)["']?\)/, "$1");
        
        const imgData = images.find(img => img.src === imgSrc);
        if (imgData) {
          setSelectedImage(imgData);
          setNewUrl(imgData.src);
          setIsOpen(true);
        }
      }
    };

    document.addEventListener("dblclick", handleDoubleClick);
    return () => document.removeEventListener("dblclick", handleDoubleClick);
  }, [images]);

  const handleUpdate = () => {
    if (!selectedImage || !newUrl) return;
    
    // Replace image URL in HTML
    const updatedHtml = htmlContent.replace(
      new RegExp(selectedImage.src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
      newUrl
    );
    
    onUpdate(updatedHtml);
    setIsOpen(false);
    setSelectedImage(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed right-4 top-20 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-dark-800 hover:bg-dark-700 text-white p-3 rounded-lg shadow-lg border border-dark-700 transition-colors"
          title="Image Inspector"
        >
          <Image className="w-5 h-5" />
          <span className="ml-2 text-sm">{images.length} Images</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed right-4 top-20 z-50 w-80 bg-dark-800 border border-dark-700 rounded-lg shadow-xl">
      <div className="p-4 border-b border-dark-700 flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Image className="w-4 h-4" />
          Image Inspector
        </h3>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-dark-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-4 max-h-96 overflow-y-auto">
        {selectedImage ? (
          <div className="space-y-4">
            <div className="text-sm text-dark-300">
              <p className="mb-2">Editing: {selectedImage.alt}</p>
              <img 
                src={selectedImage.src} 
                alt="Preview" 
                className="w-full h-32 object-contain bg-dark-900 rounded mb-2"
              />
            </div>
            
            <div>
              <label className="block text-xs text-dark-400 mb-1">Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="flex-1 bg-dark-900 border border-dark-700 rounded px-3 py-2 text-sm text-white"
                  placeholder="https://example.com/image.png"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-dark-400 mb-1">Or Upload</label>
              <label className="flex items-center gap-2 bg-dark-900 border border-dark-700 border-dashed rounded px-3 py-2 cursor-pointer hover:bg-dark-700 transition-colors">
                <Upload className="w-4 h-4 text-dark-400" />
                <span className="text-sm text-dark-400">Choose file...</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-primary-600 hover:bg-primary-500 text-white py-2 rounded text-sm flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Update
              </button>
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setNewUrl("");
                }}
                className="flex-1 bg-dark-700 hover:bg-dark-600 text-white py-2 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-dark-400 mb-3">
              Double-click any image in the preview to edit it
            </p>
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedImage(img);
                  setNewUrl(img.src);
                }}
                className="flex items-center gap-3 p-2 bg-dark-900 rounded cursor-pointer hover:bg-dark-700 transition-colors"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-12 h-12 object-contain bg-dark-800 rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{img.alt}</p>
                  <p className="text-xs text-dark-400 truncate">{img.src.split("/").pop()}</p>
                </div>
                <Link className="w-4 h-4 text-dark-400" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
