import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Plus, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/apiService';
import citiesData from '../../data/cities.json';
import styles from './user-form.module.css';

const UserForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    location: '',
    profile: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchUser = async () => {
        try {
          const { data } = await api.getUserById(id);
          setFormData(data.data);
        } catch (error) {
          toast.error('Failed to load user details');
          navigate('/');
        } finally {
          setFetching(false);
        }
      };
      fetchUser();
    }
  }, [id, isEdit, navigate]);

  const validate = () => {
    const newErrors = {};
    
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^\d{10}$/;
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
    }
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.location) {
      newErrors.location = 'Location is required';
    }

    if (!formData.profile) {
      newErrors.profile = 'Profile selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      if (isEdit) {
        await api.updateUser(id, formData);
        toast.success('User updated successfully');
      } else {
        await api.createUser(formData);
        toast.success('User created successfully');
      }
      navigate('/');
    } catch (error) {
      const msg = error.response?.data?.message || 'Something went wrong';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profile') {
      const file = files[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error('Image size should be less than 10MB');
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, profile: reader.result }));
        };
      }
    } else if (name === 'phoneNumber') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      if (onlyNums.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: onlyNums }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (fetching) return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/" className={styles.backBtn}>
          <ArrowLeft size={16} />
          Back to list
        </Link>
        <div className={styles.title}>
          <h1>{isEdit ? 'Edit User' : 'Add New User'}</h1>
        </div>
      </div>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div className={styles.avatarUploadContainer}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatarPreview}>
              {formData.profile ? (
                <img src={formData.profile} alt="Profile" className={styles.profileImg} />
              ) : (
                <UserIcon size={40} color="#cbd5e1" />
              )}
            </div>
            <label className={styles.uploadLabel}>
              <Plus size={16} />
              <input 
                type="file" 
                name="profile" 
                accept="image/*" 
                onChange={handleChange} 
                className={styles.hiddenInput}
              />
            </label>
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.label}>First Name</label>
            <input 
              type="text" 
              name="firstName"
              className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
              value={formData.firstName}
              onChange={handleChange}
              placeholder="e.g. John"
            />
            {errors.firstName && <span className={styles.errorMsg}>{errors.firstName}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Last Name</label>
            <input 
              type="text" 
              name="lastName"
              className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
              value={formData.lastName}
              onChange={handleChange}
              placeholder="e.g. Doe"
            />
            {errors.lastName && <span className={styles.errorMsg}>{errors.lastName}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <input 
              type="email" 
              name="email"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="john.doe@example.com"
            />
            {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Mobile (Phone Number)</label>
            <input 
              type="text" 
              name="phoneNumber"
              maxLength={10}
              className={`${styles.input} ${errors.phoneNumber ? styles.inputError : ''}`}
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="10 digit number"
            />
            {errors.phoneNumber && <span className={styles.errorMsg}>{errors.phoneNumber}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Select Gender</label>
            <select 
              name="gender"
              className={`${styles.select} ${errors.gender ? styles.inputError : ''}`}
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <span className={styles.errorMsg}>{errors.gender}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Select Status</label>
            <select 
              name="status"
              className={styles.select}
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Enter Your Location</label>
            <select 
              name="location"
              className={`${styles.select} ${errors.location ? styles.inputError : ''}`}
              value={formData.location}
              onChange={handleChange}
            >
              <option value="">Select City</option>
              {citiesData.map(city => (
                <option key={city.id} value={city.city}>
                  {city.city} ({city.state})
                </option>
              ))}
            </select>
            {errors.location && <span className={styles.errorMsg}>{errors.location}</span>}
          </div>
        </div>

        <div className={styles.footer}>
          <Link to="/" className={`${styles.btn} ${styles.btnSecondary}`}>
            Cancel
          </Link>
          <button 
            type="submit" 
            className={`${styles.btn} ${styles.btnPrimary}`}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isEdit ? 'Update User' : 'Save User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
