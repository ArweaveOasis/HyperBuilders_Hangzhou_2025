import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Edit, Trash2, Upload, Save } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Brand {
  id: string;
  name: string;
  description: string;
  image: string;
  era: string;
}

interface ArchiveItem {
  id: string;
  title: string;
  brand: string;
  year: string;
  description: string;
  image: string;
  category: string;
}

export const AdminPanel: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [archiveItems, setArchiveItems] = useState<ArchiveItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [editingItem, setEditingItem] = useState<ArchiveItem | null>(null);
  const [uploading, setUploading] = useState(false);

  const [brandForm, setBrandForm] = useState({
    name: '',
    description: '',
    image: '',
    era: ''
  });

  const [itemForm, setItemForm] = useState({
    title: '',
    brand: '',
    year: '',
    description: '',
    image: '',
    category: ''
  });

  const categories = ['Dresses', 'Suits', 'Collections', 'Outerwear', 'Accessories'];
  const eras = ['Vintage', 'Classic', 'Modern', 'Contemporary'];

  // Fetch data from backend
  const fetchData = async () => {
    try {
      const [brandsRes, itemsRes] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-8aa26b6f/brands`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-8aa26b6f/archive-items`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        })
      ]);

      const brandsData = await brandsRes.json();
      const itemsData = await itemsRes.json();

      setBrands(brandsData.brands || []);
      setArchiveItems(itemsData.items || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Image upload function
  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-8aa26b6f/upload-image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        return data.imageUrl;
      } else {
        console.error('Upload failed:', data.error);
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Brand management functions
  const saveBrand = async () => {
    try {
      const url = editingBrand
        ? `https://${projectId}.supabase.co/functions/v1/make-server-8aa26b6f/brands/${editingBrand.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-8aa26b6f/brands`;

      const method = editingBrand ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(brandForm)
      });

      if (response.ok) {
        await fetchData();
        resetForms();
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error saving brand:', error);
    }
  };

  const deleteBrand = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-8aa26b6f/brands/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  // Archive item management functions
  const saveArchiveItem = async () => {
    try {
      const url = editingItem
        ? `https://${projectId}.supabase.co/functions/v1/make-server-8aa26b6f/archive-items/${editingItem.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-8aa26b6f/archive-items`;

      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(itemForm)
      });

      if (response.ok) {
        await fetchData();
        resetForms();
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error saving archive item:', error);
    }
  };

  const deleteArchiveItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this archive item?')) return;

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-8aa26b6f/archive-items/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error deleting archive item:', error);
    }
  };

  const resetForms = () => {
    setBrandForm({ name: '', description: '', image: '', era: '' });
    setItemForm({ title: '', brand: '', year: '', description: '', image: '', category: '' });
    setEditingBrand(null);
    setEditingItem(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'brand' | 'item') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      if (type === 'brand') {
        setBrandForm({ ...brandForm, image: imageUrl });
      } else {
        setItemForm({ ...itemForm, image: imageUrl });
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl">Fashion Heritage Admin</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForms}>
              <Plus className="w-4 h-4 mr-2" />
              Add Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBrand ? 'Edit Brand' : editingItem ? 'Edit Archive Item' : 'Add New Content'}
              </DialogTitle>
              <DialogDescription>
                {editingBrand 
                  ? 'Modify the details of this fashion brand.' 
                  : editingItem 
                  ? 'Update the archive item information.'
                  : 'Create new fashion brands or archive items for the heritage collection.'}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="brand" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="brand">Brand</TabsTrigger>
                <TabsTrigger value="item">Archive Item</TabsTrigger>
              </TabsList>
              
              <TabsContent value="brand" className="space-y-4">
                <div>
                  <Label htmlFor="brand-name">Brand Name</Label>
                  <Input
                    id="brand-name"
                    value={brandForm.name}
                    onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="brand-description">Description</Label>
                  <Textarea
                    id="brand-description"
                    value={brandForm.description}
                    onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="brand-era">Era</Label>
                  <Select value={brandForm.era} onValueChange={(value) => setBrandForm({ ...brandForm, era: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select era" />
                    </SelectTrigger>
                    <SelectContent>
                      {eras.map(era => (
                        <SelectItem key={era} value={era}>{era}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="brand-image">Image</Label>
                  <Input
                    id="brand-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'brand')}
                    disabled={uploading}
                  />
                  {brandForm.image && (
                    <img src={brandForm.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
                  )}
                </div>
                
                <Button onClick={saveBrand} disabled={uploading}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingBrand ? 'Update Brand' : 'Save Brand'}
                </Button>
              </TabsContent>
              
              <TabsContent value="item" className="space-y-4">
                <div>
                  <Label htmlFor="item-title">Title</Label>
                  <Input
                    id="item-title"
                    value={itemForm.title}
                    onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="item-brand">Brand</Label>
                  <Input
                    id="item-brand"
                    value={itemForm.brand}
                    onChange={(e) => setItemForm({ ...itemForm, brand: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="item-year">Year</Label>
                  <Input
                    id="item-year"
                    value={itemForm.year}
                    onChange={(e) => setItemForm({ ...itemForm, year: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="item-category">Category</Label>
                  <Select value={itemForm.category} onValueChange={(value) => setItemForm({ ...itemForm, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="item-description">Description</Label>
                  <Textarea
                    id="item-description"
                    value={itemForm.description}
                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="item-image">Image</Label>
                  <Input
                    id="item-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'item')}
                    disabled={uploading}
                  />
                  {itemForm.image && (
                    <img src={itemForm.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
                  )}
                </div>
                
                <Button onClick={saveArchiveItem} disabled={uploading}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingItem ? 'Update Item' : 'Save Item'}
                </Button>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="brands" className="w-full">
        <TabsList>
          <TabsTrigger value="brands">Brands ({brands.length})</TabsTrigger>
          <TabsTrigger value="items">Archive Items ({archiveItems.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="brands">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands.map((brand) => (
              <Card key={brand.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{brand.name}</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingBrand(brand);
                          setBrandForm(brand);
                          setIsOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteBrand(brand.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <img src={brand.image} alt={brand.name} className="w-full h-32 object-cover rounded mb-2" />
                  <p className="text-sm text-gray-600 mb-2">{brand.description}</p>
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    {brand.era} Era
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="items">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {archiveItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <img src={item.image} alt={item.title} className="w-full h-32 object-cover rounded mb-2" />
                  <h3 className="text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-600 mb-1">{item.brand} - {item.year}</p>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{item.category}</span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingItem(item);
                          setItemForm(item);
                          setIsOpen(true);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteArchiveItem(item.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};