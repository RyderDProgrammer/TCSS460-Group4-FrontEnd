// Change password form component - UI only (not connected to API yet)
'use client';

import { useState } from 'react';

interface ChangePasswordFormProps {
  onSubmit?: (data: ChangePasswordData) => Promise<void>;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function ChangePasswordForm({ onSubmit }: ChangePasswordFormProps) {
  const [formData, setFormData] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Form validation logic here
    // Client-side validation must match server-side requirements
    // NOTE: This does not connect to API yet - UI only
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Change Password Form</h2>
      {/* Form fields will be implemented here */}
    </form>
  );
}
