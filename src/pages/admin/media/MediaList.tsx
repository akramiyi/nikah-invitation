import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './MediaList.module.css';

interface Media {
  id: string;
  invitation_id: string;
  media_type: string;
  file_url: string;
  file_name: string | null;
  sort_order: number;
  created_at: string;
}

interface Invitation {
  id: string;
  groom_name: string;
  bride_name: string;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

const MediaList: React.FC = () => {
  const { role, user } = useAuth();
  
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [selectedInvitationId, setSelectedInvitationId] = useState<string>('');
  const [mediaList, setMediaList] = useState<Media[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Upload Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadInvitationId, setUploadInvitationId] = useState<string>('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchInvitations();
  }, [role, user]);

  useEffect(() => {
    if (selectedInvitationId) {
      fetchMedia(selectedInvitationId);
    } else {
      setMediaList([]);
    }
  }, [selectedInvitationId]);

  const fetchInvitations = async () => {
    if (!role) return;
    setLoading(true);
    try {
      if (role === 'super_admin') {
        const { data, error } = await supabase
          .from('invitations')
          .select('id, groom_name, bride_name')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setInvitations(data || []);
        if (data && data.length > 0) {
          setSelectedInvitationId(data[0].id);
        }
      } else if (role === 'friend' && user) {
        const { data, error } = await supabase
          .from('invitation_members')
          .select('invitation_id, invitation:invitations(id, groom_name, bride_name)')
          .eq('user_id', user.id);

        if (error) throw error;
        
        const assignedInvs = (data || []).map((m: any) => m.invitation).filter(Boolean);
        setInvitations(assignedInvs);
        
        if (assignedInvs.length > 0) {
          setSelectedInvitationId(assignedInvs[0].id);
        }
      }
    } catch (err: any) {
      console.error('Error fetching invitations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedia = async (invitationId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('invitation_id', invitationId)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMediaList(data || []);
    } catch (err: any) {
      console.error('Error fetching media:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openUploadModal = () => {
    setUploadInvitationId(selectedInvitationId || (invitations.length > 0 ? invitations[0].id : ''));
    setUploadFile(null);
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0]);
      setUploadError(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError('Please select a file.');
      return;
    }
    if (!uploadInvitationId) {
      setUploadError('Please select an invitation.');
      return;
    }

    // Validate type and size
    const isImage = ALLOWED_IMAGE_TYPES.includes(uploadFile.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(uploadFile.type);
    
    if (!isImage && !isVideo) {
      setUploadError(`Unsupported file type: ${uploadFile.type}`);
      return;
    }

    if (isImage && uploadFile.size > MAX_IMAGE_SIZE) {
      setUploadError(`Image exceeds maximum size of 5MB.`);
      return;
    }
    
    if (isVideo && uploadFile.size > MAX_VIDEO_SIZE) {
      setUploadError(`Video exceeds maximum size of 50MB.`);
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    let storagePath = '';

    try {
      // 1. Upload to Storage
      const fileExt = uploadFile.name.split('.').pop();
      const uniqueFileName = `${crypto.randomUUID()}.${fileExt}`;
      storagePath = `invitations/${uploadInvitationId}/${uniqueFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('invitation-media')
        .upload(storagePath, uploadFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw new Error(`Storage Error: ${uploadError.message}`);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('invitation-media')
        .getPublicUrl(storagePath);

      // 2. Insert into public.media
      const { error: dbError } = await supabase.from('media').insert({
        invitation_id: uploadInvitationId,
        media_type: isImage ? 'image' : 'video',
        file_url: publicUrl,
        file_name: uploadFile.name,
        sort_order: mediaList.length // Append to end
      }).select().single();

      if (dbError) {
        // Attempt cleanup if DB insert fails
        await supabase.storage.from('invitation-media').remove([storagePath]);
        throw new Error(`Database Error: ${dbError.message}`);
      }

      // Success
      setIsModalOpen(false);
      if (uploadInvitationId === selectedInvitationId) {
        fetchMedia(selectedInvitationId);
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      setUploadError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (media: Media) => {
    if (!window.confirm(`Are you sure you want to delete "${media.file_name || 'this media'}"?`)) return;
    
    try {
      // 1. Delete Storage Object first if it's from our bucket
      if (media.file_url.includes('invitation-media')) {
        // Extract path from public URL
        const urlParts = media.file_url.split('/invitation-media/');
        if (urlParts.length > 1) {
          const storagePath = urlParts[1];
          const { error: storageError } = await supabase.storage
            .from('invitation-media')
            .remove([storagePath]);
            
          if (storageError) {
             throw new Error(`Failed to delete storage file: ${storageError.message}`);
          }
          // Some Supabase versions return an empty array if the object was not found, which is fine, 
          // as long as it didn't explicitly throw a permissions/network error.
        }
      }

      // 2. Delete DB Record
      const { error: dbError } = await supabase
        .from('media')
        .delete()
        .eq('id', media.id);

      if (dbError) throw dbError;
      
      // Refresh
      fetchMedia(selectedInvitationId);
    } catch (err: any) {
      console.error('Delete failed:', err);
      alert(`Failed to delete media: ${err.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Media Management</h1>
          <p className={styles.subtitle}>Manage images and videos for your invitations.</p>
        </div>
        <button 
          className={styles.uploadBtn} 
          onClick={openUploadModal}
          disabled={invitations.length === 0}
        >
          Upload Media
        </button>
      </div>

      {error && <div className={styles.errorText}>Error: {error}</div>}

      <div className={styles.controls}>
        <select 
          className={styles.select}
          value={selectedInvitationId}
          onChange={(e) => setSelectedInvitationId(e.target.value)}
        >
          <option value="" disabled>Select Invitation</option>
          {invitations.map(inv => (
            <option key={inv.id} value={inv.id}>
              {inv.groom_name} & {inv.bride_name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className={styles.loadingState}>Loading Media...</div>
      ) : mediaList.length === 0 ? (
        <div className={styles.emptyState}>No media uploaded yet.</div>
      ) : (
        <div className={styles.grid}>
          {mediaList.map(media => (
            <div key={media.id} className={styles.card}>
              <div className={styles.mediaPreview}>
                {media.media_type === 'image' ? (
                  <img src={media.file_url} alt={media.file_name || 'Media'} loading="lazy" />
                ) : (
                  <video src={media.file_url} controls preload="metadata" />
                )}
              </div>
              <div className={styles.cardBody}>
                <div className={styles.mediaMeta}>
                  <span className={styles.badge}>{media.media_type}</span>
                  Order: {media.sort_order}
                </div>
                <p className={styles.mediaName} title={media.file_name || ''}>
                  {media.file_name || 'Unnamed file'}
                </p>
                <div style={{ fontSize: '11px', color: '#a0aec0', marginTop: '4px' }}>
                  {new Date(media.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button 
                  className={styles.actionBtn}
                  onClick={() => window.open(media.file_url, '_blank')}
                >
                  Preview
                </button>
                <button 
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  onClick={() => handleDelete(media)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Upload Media</h2>
            
            <form onSubmit={handleUploadSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Invitation</label>
                <select 
                  required
                  value={uploadInvitationId}
                  onChange={(e) => setUploadInvitationId(e.target.value)}
                  className={styles.select}
                  style={{ width: '100%' }}
                >
                  <option value="" disabled>-- Select an Invitation --</option>
                  {invitations.map(inv => (
                    <option key={inv.id} value={inv.id}>
                      {inv.groom_name} & {inv.bride_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Select File</label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className={styles.fileInput}
                  accept={ALLOWED_IMAGE_TYPES.concat(ALLOWED_VIDEO_TYPES).join(',')}
                  required
                />
                <div style={{ fontSize: '12px', color: '#718096', marginTop: '8px' }}>
                  Supported: JPEG, PNG, WEBP, GIF (Max 5MB) | MP4, WEBM (Max 50MB)
                </div>
              </div>

              {uploadError && <div className={styles.errorText}>{uploadError}</div>}

              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className={styles.cancelBtn}
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className={styles.uploadBtn}
                  disabled={isUploading || !uploadFile}
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaList;
