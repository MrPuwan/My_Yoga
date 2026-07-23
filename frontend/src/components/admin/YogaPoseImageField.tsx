import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import fallbackImage from '../../assets/hero.png';
import { uploadYogaPoseImage } from '../../services/uploads.service';
import { getApiErrorMessage } from '../../utils/api-error';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface YogaPoseImageFieldProps {
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  onUploadingChange: (uploading: boolean) => void;
}

export default function YogaPoseImageField({
  imageUrl,
  onImageUrlChange,
  onUploadingChange,
}: YogaPoseImageFieldProps) {
  const [previewUrl, setPreviewUrl] = useState(imageUrl);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const localPreviewRef = useRef<string | null>(null);

  useEffect(() => {
    if (!localPreviewRef.current) setPreviewUrl(imageUrl);
  }, [imageUrl]);

  useEffect(
    () => () => {
      if (localPreviewRef.current) {
        URL.revokeObjectURL(localPreviewRef.current);
      }
    },
    [],
  );

  const releaseLocalPreview = () => {
    if (localPreviewRef.current) {
      URL.revokeObjectURL(localPreviewRef.current);
      localPreviewRef.current = null;
    }
  };

  const selectFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setError('');
    if (!ALLOWED_TYPES.has(file.type)) {
      setError('Choose a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('The image must be 5 MB or smaller.');
      return;
    }

    releaseLocalPreview();
    const localPreview = URL.createObjectURL(file);
    localPreviewRef.current = localPreview;
    setPreviewUrl(localPreview);
    setProgress(0);
    setUploading(true);
    onUploadingChange(true);

    try {
      const secureUrl = await uploadYogaPoseImage(file, setProgress);
      releaseLocalPreview();
      setPreviewUrl(secureUrl);
      onImageUrlChange(secureUrl);
      setProgress(100);
    } catch (requestError) {
      releaseLocalPreview();
      setPreviewUrl(imageUrl);
      setError(
        getApiErrorMessage(requestError, 'Unable to upload this image.'),
      );
    } finally {
      setUploading(false);
      onUploadingChange(false);
    }
  };

  const updateManualUrl = (url: string) => {
    releaseLocalPreview();
    setPreviewUrl(url);
    onImageUrlChange(url);
    setError('');
  };

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-slate-700">Pose image</legend>

      <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
          <img
            src={previewUrl || fallbackImage}
            alt="Yoga pose preview"
            className="aspect-[4/3] h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = fallbackImage;
            }}
          />
        </div>

        <div className="flex flex-col justify-center">
          <label className="inline-flex w-fit cursor-pointer items-center rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900">
            {uploading ? 'Uploading...' : previewUrl ? 'Replace image' : 'Choose image'}
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              disabled={uploading}
              onChange={(event) => void selectFile(event)}
              className="sr-only"
            />
          </label>
          <p className="mt-2 text-xs text-slate-500">
            JPG, PNG, or WebP. Maximum size 5 MB.
          </p>

          {uploading && (
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs text-slate-600">
                <span>Uploading image</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-[width]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <details className="text-sm">
        <summary className="cursor-pointer font-medium text-slate-600">
          Use a manual image URL instead
        </summary>
        <input
          type="url"
          value={imageUrl}
          disabled={uploading}
          onChange={(event) => updateManualUrl(event.target.value)}
          placeholder="https://example.com/pose.jpg"
          className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </details>
    </fieldset>
  );
}
