'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchableCountrySelect } from '@/components/ui/searchable-country-select';
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';
import {
  WOOD_TYPES,
  TIMBER_CATEGORIES,
  PRODUCT_CATEGORIES,
  UNITS,
  GRADES,
  type ListingType,
  type Listing,
} from '@/types';
import { createClient } from '@/lib/supabase/client';

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const listingId = params.id as string;
  const { user, profile, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [listingType, setListingType] = useState<ListingType>('timber');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [countryOrigin, setCountryOrigin] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [woodType, setWoodType] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('');
  const [grade, setGrade] = useState('');
  const [status, setStatus] = useState('active');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch existing listing data
  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId || !user) return;

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', listingId)
          .single();

        if (error) {
          console.error('Failed to fetch listing:', error);
          setSubmitError('Failed to load listing');
          return;
        }

        if (data.seller_id !== user.id) {
          setSubmitError('You do not have permission to edit this listing');
          return;
        }

        // Pre-fill form with existing data
        setListingType(data.listing_type || 'timber');
        setTitle(data.title || '');
        setDescription(data.description || '');
        setWoodType(data.wood_type || '');
        setCategory(data.category || '');
        setPrice(data.price?.toString() || '');
        setQuantity(data.quantity?.toString() || '');
        setUnit(data.unit || '');
        setCountryOrigin(data.country_origin || '');
        setGrade(data.grade || '');
        setStatus(data.status || 'active');
        setImages(data.images || []);
      } catch (error) {
        console.error('Failed to fetch listing:', error);
        setSubmitError('Failed to load listing');
      } finally {
        setFetching(false);
      }
    };

    if (!authLoading && user) {
      fetchListing();
    } else if (!authLoading && !user) {
      setFetching(false);
    }
  }, [listingId, user, authLoading]);

  // Redirect buyers away from this page
  useEffect(() => {
    if (!authLoading && profile?.role === 'buyer') {
      router.replace('/dashboard');
    }
  }, [authLoading, profile, router]);

  const categories = listingType === 'timber' ? TIMBER_CATEGORIES : PRODUCT_CATEGORIES;

  // Show loading while fetching
  if (authLoading || fetching || profile?.role === 'buyer') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-wood" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError('');

    if (!title || !description || !price || !quantity) {
      setSubmitError('Please fill in all required fields');
      return;
    }

    if (!woodType) {
      setSubmitError('Please select a wood type');
      return;
    }

    if (!category) {
      setSubmitError('Please select a category');
      return;
    }

    if (!unit) {
      setSubmitError('Please select a unit');
      return;
    }

    if (!countryOrigin) {
      setSubmitError('Please select a country of origin');
      return;
    }

    setLoading(true);

    const listingData = {
      listing_type: listingType,
      title: title.trim(),
      description: description.trim(),
      wood_type: woodType,
      category: category,
      price: Number(price),
      quantity: Number(quantity),
      unit: unit,
      country_origin: countryOrigin,
      grade: grade || null,
      status: status,
      images: images,
    };

    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listingData),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result.error || result.details || 'Failed to update listing';
        setSubmitError(errorMsg);
        setLoading(false);
        return;
      }

      alert('Listing updated successfully!');
      router.push('/dashboard/listings');
    } catch (err) {
      console.error('Submit error:', err);
      setSubmitError('Failed to update listing. Please try again.');
      setLoading(false);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'listings');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setUploadError(data.error || 'Upload failed');
        return;
      }

      setImages([...images, data.url]);
    } catch {
      setUploadError('Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/listings"
          className="p-2 hover:bg-muted rounded-md"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-wood-dark">Edit Listing</h1>
          <p className="text-muted-foreground">
            Update your timber or wood product listing
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="listing_type">Listing Type</Label>
                  <Select
                    value={listingType}
                    onValueChange={(v) => setListingType(v as ListingType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="timber">Timber / Raw Material</SelectItem>
                      <SelectItem value="wood_product">Finished Wood Product</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Premium Oak Lumber - Kiln Dried"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your product in detail..."
                    rows={5}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wood_type">Wood Type</Label>
                    <Select value={woodType} onValueChange={setWoodType} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select wood type" />
                      </SelectTrigger>
                      <SelectContent>
                        {WOOD_TYPES.map((wood) => (
                          <SelectItem key={wood} value={wood}>
                            {wood}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Quantity */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Quantity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (USD)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="0"
                      step="0.01"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select value={unit} onValueChange={setUnit} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {UNITS.map((u) => (
                          <SelectItem key={u} value={u}>
                            {u}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country_origin">Country of Origin</Label>
                    <SearchableCountrySelect
                      name="country_origin"
                      placeholder="Search countries..."
                      value={countryOrigin}
                      onValueChange={setCountryOrigin}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade (Optional)</Label>
                    <Select value={grade} onValueChange={setGrade}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADES.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent>
                {uploadError && (
                  <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-md">
                    {uploadError}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-muted rounded-lg relative overflow-hidden"
                    >
                      <Image
                        src={image}
                        alt={`Listing image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={uploading}
                      className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-wood hover:bg-wood/5 transition-colors disabled:opacity-50"
                    >
                      {uploading ? (
                        <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
                      ) : (
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {uploading ? 'Uploading...' : 'Add Image'}
                      </span>
                    </button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload up to 5 images. First image will be the cover.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active (Published)</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {submitError && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md mb-2">
                    {submitError}
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    className="w-full bg-wood hover:bg-wood-dark"
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Listing
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Use clear, descriptive titles</li>
                  <li>• Add detailed specifications</li>
                  <li>• Upload high-quality images</li>
                  <li>• Set competitive pricing</li>
                  <li>• Specify accurate quantities</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
