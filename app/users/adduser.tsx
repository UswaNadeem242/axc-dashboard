"use client";

import { FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";

import ToggleSwitch from "./toggleswitch";

interface NewUserData {
  name: string;
  email: string;
  contactNo: string;
  role: string;
  userType: string;
  password: string;
  autoGeneratePassword: boolean;
  confirmPassword: string;
  assignedHub: string;
  awbServiceType: string;
  status: boolean;
  emailNotification: boolean;
  birthDate: string;
  joiningDate: string;
  kycType: string;
  kycDoc: File | null;
  profilePhoto: File | null;
  leaveUser: string;
  manageSubscription: boolean;
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: NewUserData) => void;
}

const initialForm: NewUserData = {
  name: "",
  email: "",
  contactNo: "",
  role: "",
  userType: "B2B",
  password: "",
  autoGeneratePassword: false,
  confirmPassword: "",
  assignedHub: "",
  awbServiceType: "",
  status: true,
  emailNotification: false,
  birthDate: "",
  joiningDate: "",
  kycType: "",
  kycDoc: null,
  profilePhoto: null,
  leaveUser: "",
  manageSubscription: false,
};

export default function AddUserModal({ isOpen, onClose, onSave }: AddUserModalProps) {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState<NewUserData>(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData(initialForm);
      setError("");
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setError("");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;
    if (files && files.length > 0) {
      setFormData((previous) => ({ ...previous, [name]: files[0] }));
    }
  };

  const handleToggle = (field: "status" | "emailNotification" | "autoGeneratePassword" | "manageSubscription") => {
    setFormData((previous) => ({ ...previous, [field]: !previous[field] }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return setError("Full name is required."), false;
    if (!formData.email.trim()) return setError("Email address is required."), false;
    if (!formData.contactNo.trim()) return setError("Phone number is required."), false;
    if (!formData.role) return setError("Please select a role assignment."), false;
    if (!formData.autoGeneratePassword && !formData.password) return setError("Password is required."), false;
    return true;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    onSave(formData);
  };

  return (
    <>
      <div className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`} onClick={handleClose} />

      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-5xl overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ${visible ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-axc-border bg-white px-6 py-4">
          <h2 className="text-[18px] font-semibold text-axc-dark-gray">Add New User</h2>
          <button type="button" onClick={handleClose} className="rounded-md p-1 transition-colors hover:bg-axc-light-bg">
            <X className="h-5 w-5 text-axc-gray" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-600">{error}</div>}

          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            <FormField label="Full Name" required>
              <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter full name" className="form-input" />
            </FormField>

            <FormField label="Email Address" required>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter email address" className="form-input" />
            </FormField>

            <FormField label="Contact No" required>
              <input name="contactNo" value={formData.contactNo} onChange={handleInputChange} placeholder="Enter contact no" className="form-input" />
            </FormField>

            <FormField label="User Type">
              <select name="userType" value={formData.userType} onChange={handleInputChange} className="form-input">
                <option value="B2B">B2B</option>
                <option value="B2C">B2C</option>
              </select>
            </FormField>

            <FormField label="Role" required>
              <select name="role" value={formData.role} onChange={handleInputChange} className="form-input">
                <option value="">Select role</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Staff">Staff</option>
                <option value="Sales">Sales</option>
              </select>
            </FormField>

            <FormField label="Birth Date">
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="form-input" />
            </FormField>

            <FormField label="Joining Date">
              <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} className="form-input" />
            </FormField>

            <FormField label="KYC Type">
              <select name="kycType" value={formData.kycType} onChange={handleInputChange} className="form-input">
                <option value="">Select KYC Type</option>
                <option value="ID Card">ID Card</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
              </select>
            </FormField>

            <FormField label="KYC Document">
              <input type="file" name="kycDoc" onChange={handleFileChange} className="form-input pt-1.5" />
            </FormField>

            <FormField label="Profile Photo">
              <input type="file" name="profilePhoto" onChange={handleFileChange} accept="image/*" className="form-input pt-1.5" />
            </FormField>

            <FormField label="Leave User">
              <select name="leaveUser" value={formData.leaveUser} onChange={handleInputChange} className="form-input">
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </FormField>

            <FormField label="User Assigned Hub">
              <select name="assignedHub" value={formData.assignedHub} onChange={handleInputChange} className="form-input">
                <option value="">Select...</option>
                <option value="Lahore">Lahore</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Karachi">Karachi</option>
                <option value="Peshawar">Peshawar</option>
                <option value="Multan">Multan</option>
                <option value="Faisalabad">Faisalabad</option>
              </select>
            </FormField>

            <FormField label="AWB Service Type">
              <select name="awbServiceType" value={formData.awbServiceType} onChange={handleInputChange} className="form-input">
                <option value="">SELECT AWB SERVICE TYPE..</option>
                <option value="Standard">Standard</option>
                <option value="Express">Express</option>
                <option value="Overnight">Overnight</option>
              </select>
            </FormField>

            <div className="col-span-2">
              <FormField label="Password" required>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  disabled={formData.autoGeneratePassword}
                  className="form-input disabled:bg-axc-light-bg disabled:text-axc-gray"
                />
              </FormField>
            </div>
            <div className="col-span-2">
              <FormField label="Confirm Password" required>
                <input
                  type="password"
                  name="Cpassword"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  disabled={formData.autoGeneratePassword}
                  className="form-input disabled:bg-axc-light-bg disabled:text-axc-gray"
                />
              </FormField>
            </div>
          </div>

          <ToggleRow
            title="Auto-generated password"
            description="Send password via email to user."
            checked={formData.autoGeneratePassword}
            onChange={() => handleToggle("autoGeneratePassword")}
          />
          <div className="border-t border-axc-border pt-4">
            <h3 className="mb-4 text-[14px] font-semibold text-axc-dark-gray">Access Settings</h3>

            <div className="space-y-4">
              <ToggleRow
                title="Status"
                description="Active or inactive account."
                checked={formData.status}
                onChange={() => handleToggle("status")}
              />
              <ToggleRow
                title="Manage Subscription"
                description="Enable or disable subscription management."
                checked={formData.manageSubscription}
                onChange={() => handleToggle("manageSubscription")}
              />
              <ToggleRow
                title="Email Notification"
                description="Receive account activity emails."
                checked={formData.emailNotification}
                onChange={() => handleToggle("emailNotification")}
              />
            </div>
          </div>

          <div className="flex gap-3 border-t border-axc-border pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="p-3 cursor-pointer flex-1 rounded-md border border-axc-border bg-white px-4 text-[12px] font-semibold text-axc-dark-gray hover:bg-axc-light-bg"
            >
              Cancel
            </button>
            <button type="submit" className="p-3 cursor-pointer flex-1 rounded-md bg-axc-blue px-4 text-[12px] font-semibold text-white hover:bg-axc-blue-dark">
              Create User
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        .form-input {
          width: 100%;
          height: 40px;
          border: 1px solid #e5e7eb;
          border-radius: 5px;
          background: #ffffff;
          padding: 0 12px;
          font-size: 12px;
          color: #374151;
          outline: none;
        }
        .form-input:focus {
          border-color: #232a76;
          box-shadow: 0 0 0 1px #232a76;
        }
      `}</style>
    </>
  );
}

function FormField({ label, required = false, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-axc-dark-gray">
        {label}
        {required && <span className="ml-1 text-axc-red">*</span>}
      </label>
      {children}
    </div>
  );
}

function ToggleRow({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md bg-axc-light-bg p-3">
      <div>
        <p className="text-[13px] font-medium text-axc-dark-gray">{title}</p>
        <p className="mt-0.5 text-[11px] text-axc-gray">{description}</p>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  );
}