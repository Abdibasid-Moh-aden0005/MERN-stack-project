import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ images, setImages, existingImages = [], onDeleteExisting }) => {
  const [previews, setPreviews] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-text-dim uppercase tracking-widest">Car Images</label>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Existing Images */}
        {existingImages.map((img, index) => (
          <div key={`existing-${index}`} className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group">
            <img 
              src={`http://localhost:5000${img}`} 
              alt="Car" 
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onDeleteExisting(img)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
            >
              <X size={14} />
            </button>
            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-bold text-white/70">
              Existing
            </div>
          </div>
        ))}

        {/* New Previews */}
        {previews.map((preview, index) => (
          <div key={`new-${index}`} className="relative aspect-video rounded-2xl overflow-hidden border border-primary/30 group">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeNewImage(index)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
            >
              <X size={14} />
            </button>
            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary/60 backdrop-blur-md rounded-md text-[10px] font-bold text-white">
              New
            </div>
          </div>
        ))}

        {/* Upload Button */}
        {(existingImages.length + previews.length) < 5 && (
          <label className="relative aspect-video rounded-2xl border-2 border-dashed border-white/10 hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-primary/5 group">
            <Upload className="text-text-dim group-hover:text-primary transition-colors" size={24} />
            <span className="text-[10px] font-bold text-text-dim mt-2 uppercase tracking-widest group-hover:text-primary">Add Image</span>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </label>
        )}
      </div>
      <p className="text-[10px] text-text-dim italic">Maximum 5 images allowed. Professional shots recommended.</p>
    </div>
  );
};

export default ImageUpload;
