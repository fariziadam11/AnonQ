import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const ProfileSettingsPage: React.FC = () => {
  const { profile, uploadProfileImage } = useProfile();
  const { user, updatePassword, deleteUser, signOut } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      return await uploadProfileImage(file);
    },
  });

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-300 dark:bg-gray-900">
        <div className="text-center border-8 border-black rounded-3xl p-8 bg-white dark:bg-gray-800 shadow-[8px_8px_0px_0px_#000]">
          <h1 className="text-3xl font-black mb-2 text-red-500">Unauthorized</h1>
          <p className="text-gray-700 dark:text-gray-200 font-bold">You must be logged in to access profile settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-300 dark:bg-gray-900">
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
          <button type="submit" className="w-full py-2 px-4 bg-green-400 border-2 border-black rounded-lg font-black text-lg shadow-[2px_2px_0px_0px_#000] hover:bg-green-500 transition-all duration-150" disabled={uploadMutation.isPending}>Upload</button>
          {uploadMutation.isPending && <div className="mt-2 text-base font-bold text-blue-600">Uploading...</div>}
          {uploadMutation.isSuccess && <div className="mt-2 text-base font-black text-green-600">Image uploaded!</div>}
          {uploadMutation.isError && <div className="mt-2 text-base font-black text-red-600">{(uploadMutation.error as any)?.message || 'Failed to upload image'}</div>}
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
        {/* Delete User */}
        <button
          className="w-full py-2 px-4 bg-red-400 border-2 border-black rounded-lg font-black text-lg shadow-[2px_2px_0px_0px_#000] hover:bg-red-500 transition-all duration-150"
          disabled={deleting}
          onClick={async () => {
            if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
            setDeleting(true);
            try {
              await deleteUser();
              await signOut();
              navigate('/');
            } catch (err: any) {
              alert(err.message || 'Failed to delete user');
            } finally {
              setDeleting(false);
            }
          }}
        >Delete Account</button>
      </div>
    </div>
  );
};

export default ProfileSettingsPage; 