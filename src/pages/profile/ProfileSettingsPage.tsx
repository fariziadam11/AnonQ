import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { useAuth } from '../../context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { supabase } from '../../lib/supabase';

export const ProfileSettingsPage: React.FC = () => {
  const { profile, uploadProfileImage, deleteProfileImage } = useProfile();
  const { user, updatePassword, signOut } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const navigate = useNavigate();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      return await uploadProfileImage(file);
    },
    onSuccess: () => toast.success('Profile image updated!'),
    onError: (error: any) => toast.error(error.message || 'Failed to upload image'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProfileImage,
    onSuccess: () => {
      toast.success('Profile image removed!');
    },
    onError: (error: any) => toast.error(error.message || 'Failed to remove image'),
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async (password: string) => {
      if (!user) throw new Error('No user to delete');
      
      // Verify password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: password
      });
      
      if (signInError) {
        throw new Error('Password is incorrect');
      }
      
      // Delete avatar from storage if exists
      if (profile?.avatar) {
        const filePath = profile.avatar.split('/').pop();
        if (filePath) {
          await supabase.storage.from('avatars').remove([filePath]);
        }
      }
      
      // Call the database function to delete user account
      const { error } = await supabase.rpc('delete_user_account', {
        user_uuid: user.id
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Account deleted successfully');
      signOut();
      navigate('/');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete account');
      setDeleting(false);
    },
  });

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center border-8 border-black rounded-3xl p-8 bg-white dark:bg-gray-800 shadow-[8px_8px_0px_0px_#000]">
          <h1 className="text-3xl font-black mb-2 text-red-500">Unauthorized</h1>
          <p className="text-gray-700 dark:text-gray-200 font-bold">You must be logged in to access profile settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg mx-auto border-8 border-black rounded-3xl p-8 bg-white dark:bg-gray-800 shadow-[12px_12px_0px_0px_#000]">
        <h2 className="text-3xl font-black mb-8 text-center text-purple-700 dark:text-yellow-300 drop-shadow-[2px_2px_0px_#000]">Profile Settings</h2>
        {/* Avatar Preview */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-28 h-28 rounded-full border-4 border-black bg-purple-200 dark:bg-yellow-400 flex items-center justify-center overflow-hidden shadow-[4px_4px_0px_0px_#000] mb-2">
            {profile.avatar ? (
              <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-black text-black dark:text-white">
                {profile.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span className="font-bold text-black dark:text-white">@{profile.username}</span>
        </div>
        {/* Upload Image */}
        <form className="mb-8 border-4 border-black rounded-2xl p-4 bg-purple-100 dark:bg-yellow-200 shadow-[4px_4px_0px_0px_#000]" onSubmit={async e => {
          e.preventDefault();
          const file = (e.target as any).image.files[0];
          if (!file) return;
          uploadMutation.mutate(file);
        }}>
          <label className="block mb-2 font-black text-lg text-black">Upload Profile Image</label>
          <input type="file" name="image" accept="image/*" className="mb-2 w-full border-2 border-black rounded-lg px-3 py-2 bg-white font-bold" />
          <div className="flex gap-2">
            <button type="submit" className="w-full py-2 px-4 bg-green-400 border-2 border-black rounded-lg font-black text-lg shadow-[2px_2px_0px_0px_#000] hover:bg-green-500 transition-all duration-150" disabled={uploadMutation.isPending}>
              {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
            </button>
            {profile.avatar && (
              <button 
                type="button" 
                onClick={() => setIsConfirmModalOpen(true)}
                className="w-full py-2 px-4 bg-red-400 border-2 border-black rounded-lg font-black text-lg shadow-[2px_2px_0px_0px_#000] hover:bg-red-500 transition-all duration-150" 
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Photo'}
              </button>
            )}
          </div>
          {uploadMutation.isPending && <div className="mt-2 text-base font-bold text-blue-600">Uploading...</div>}
        </form>
        {/* Update Password */}
        <form className="mb-8 border-4 border-black rounded-2xl p-4 bg-yellow-100 dark:bg-purple-200 shadow-[4px_4px_0px_0px_#000]" onSubmit={async e => {
          e.preventDefault();
          setPasswordMsg('');
          if (!oldPassword || !newPassword || !confirmPassword) {
            setPasswordMsg('All fields are required.');
            return;
          }
          if (newPassword !== confirmPassword) {
            setPasswordMsg('New password and confirmation do not match.');
            return;
          }
          setPasswordMsg('Updating...');
          try {
            await updatePassword({ oldPassword, newPassword });
            setPasswordMsg('Password updated!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
          } catch (err: any) {
            setPasswordMsg(err.message || 'Failed to update password');
          }
        }}>
          <label className="block mb-2 font-black text-lg text-black">Update Password</label>
          <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="mb-2 w-full border-2 border-black rounded-lg px-3 py-2 bg-white font-bold" placeholder="Current password" />
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mb-2 w-full border-2 border-black rounded-lg px-3 py-2 bg-white font-bold" placeholder="New password" />
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mb-2 w-full border-2 border-black rounded-lg px-3 py-2 bg-white font-bold" placeholder="Confirm new password" />
          <button type="submit" className="w-full py-2 px-4 bg-blue-400 border-2 border-black rounded-lg font-black text-lg shadow-[2px_2px_0px_0px_#000] hover:bg-blue-500 transition-all duration-150">Update</button>
          {passwordMsg && <div className="mt-2 text-base font-black text-purple-700 dark:text-purple-900">{passwordMsg}</div>}
        </form>
        {/* Delete Account */}
        <form className="border-4 border-black rounded-2xl p-4 bg-red-100 dark:bg-red-200 shadow-[4px_4px_0px_0px_#000]" onSubmit={async e => {
          e.preventDefault();
          const password = (e.target as any).password.value;
          if (!password) {
            toast.error('Please enter your password');
            return;
          }
          setDeleting(true);
          deleteAccountMutation.mutate(password);
        }}>
          <label className="block mb-2 font-black text-lg text-black">Delete Account</label>
          <p className="mb-4 text-sm text-black/80">This action cannot be undone. All your data will be permanently deleted.</p>
          <input type="password" name="password" placeholder="Enter your password" className="mb-4 w-full border-2 border-black rounded-lg px-3 py-2 bg-white font-bold" />
          <button type="submit" className="w-full py-2 px-4 bg-red-500 border-2 border-black rounded-lg font-black text-lg shadow-[2px_2px_0px_0px_#000] hover:bg-red-600 transition-all duration-150" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete Account'}
          </button>
        </form>
      </div>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
        title="Delete Profile Picture"
        message="Are you sure you want to permanently delete your profile picture? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
};

export default ProfileSettingsPage; 